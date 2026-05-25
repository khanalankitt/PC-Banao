"use client";

import { useState, ReactElement } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import { useDeleteBuild } from "@/lib/queries/buildQueries";
import { useBuilderStore } from "@/store/builderStore";
import type { SlotKey } from "@/store/builderStore";
import type { RawBuild } from "@/lib/api/serverFetch";

// ─── Types ────────────────────────────────────────────────────────────────────

interface IPart {
  _id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  stock: number;
  images: string[];
  specs: Record<string, unknown>;
  wattage?: number;
}

interface IBuild {
  _id: string;
  name: string;
  user: { _id: string; name: string; image?: string };
  components: { category: string; part: IPart }[];
  totalPrice: number;
  totalWattage: number;
  isPublic: boolean;
  compatibility: { isCompatible: boolean; issues: string[] };
  createdAt: string;
}

// ─── Category metadata ────────────────────────────────────────────────────────

type CatMeta = { accent: string; label: string; Icon: () => ReactElement };

const CAT_META: Record<string, CatMeta> = {
  cpu: { accent: "#22d3ee", label: "Processor", Icon: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="6" width="12" height="12" rx="2" /><path d="M9 6V3M12 6V3M15 6V3M9 21v-3M12 21v-3M15 21v-3M6 9H3M6 12H3M6 15H3M21 9h-3M21 12h-3M21 15h-3" /></svg> },
  gpu: { accent: "#a78bfa", label: "Graphics", Icon: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="12" rx="2" /><path d="M6 7V5M10 7V5M14 7V5M18 7V5" /><circle cx="8" cy="13" r="2" /><circle cx="14" cy="13" r="2" /></svg> },
  motherboard: { accent: "#fbbf24", label: "Motherboard", Icon: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2" /><rect x="5" y="5" width="6" height="6" rx="1" /><rect x="13" y="5" width="6" height="3" rx="0.5" /><rect x="13" y="10" width="6" height="3" rx="0.5" /><path d="M5 14h4M5 17h4" strokeWidth="1" /></svg> },
  ram: { accent: "#34d399", label: "Memory", Icon: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="1.5" /><path d="M7 5V3M10 5V3M14 5V3M17 5V3" /><path d="M7 9h2M11 9h2M15 9h2" strokeWidth="1.2" /></svg> },
  storage: { accent: "#60a5fa", label: "Storage", Icon: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="8" width="20" height="8" rx="2" /><circle cx="18" cy="12" r="1.5" /><path d="M5 10h8M5 14h5" strokeWidth="1.2" /></svg> },
  psu: { accent: "#fb923c", label: "Power Supply", Icon: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L4 14h7l-1 8 9-12h-7l2-8z" /></svg> },
  case: { accent: "#f472b6", label: "Chassis", Icon: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" /><path d="M9 6h6M9 10h6M9 14h6" strokeWidth="1.2" /><circle cx="12" cy="18" r="1" /></svg> },
  cooler: { accent: "#67e8f9", label: "Cooling", Icon: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M12 2v4M12 18v4M2 12h4M18 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" /></svg> },
};

function getDefaultMeta(category: string): CatMeta {
  return { accent: "#22d3ee", label: category.charAt(0).toUpperCase() + category.slice(1), Icon: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="3" /></svg> };
}

// ─── Normalise ────────────────────────────────────────────────────────────────

function normaliseBuild(raw: RawBuild): IBuild {
  const comps = raw.components ?? {};
  const componentList: { category: string; part: IPart }[] = [];
  for (const key of ["cpu", "gpu", "motherboard", "psu", "case", "cooler"] as const) {
    const v = (comps as Record<string, unknown>)[key];
    if (v && typeof v === "object") componentList.push({ category: key, part: v as IPart });
  }
  for (const part of ((comps as Record<string, unknown>).ram ?? []) as IPart[]) {
    if (part && typeof part === "object") componentList.push({ category: "ram", part });
  }
  for (const part of ((comps as Record<string, unknown>).storage ?? []) as IPart[]) {
    if (part && typeof part === "object") componentList.push({ category: "storage", part });
  }
  return {
    _id: raw._id, name: raw.name,
    user: raw.user,
    components: componentList,
    totalPrice: raw.totalPrice, totalWattage: raw.totalWattage,
    isPublic: raw.isPublic,
    compatibility: { isCompatible: raw.isCompatible, issues: raw.compatibilityIssues },
    createdAt: raw.createdAt,
  };
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({ user, size = 32 }: { user: IBuild["user"]; size?: number }) {
  const initials = user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  if (user.image) {
    return (
      <Image
        src={user.image}
        alt={user.name}
        width={size}
        height={size}
        style={{ borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.12)", flexShrink: 0, objectFit: "cover" }}
        unoptimized={user.image.includes("i.pravatar.cc")}
      />
    );
  }
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", flexShrink: 0, background: "linear-gradient(135deg, #22d3ee, #7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: Math.round(size * 0.38), fontWeight: 700, color: "#fff" }}>
      {initials}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BuildDetailClient({ rawBuild }: { rawBuild: RawBuild }) {
  const build = normaliseBuild(rawBuild);
  const router = useRouter();
  const { data: session } = useSession();
  const { setPart, setBuildName, setBuildId, setIsPublic, resetBuild } = useBuilderStore();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const deleteBuildMutation = useDeleteBuild();
  const isOwner = !!session?.user?._id && session.user._id === build.user._id;

  function loadIntoStore(target: IBuild, keepId: boolean) {
    resetBuild(); setBuildName(target.name); setIsPublic(target.isPublic);
    if (keepId) setBuildId(target._id);
    for (const { category, part } of target.components)
      setPart(category as SlotKey, { ...part, category: category as SlotKey });
  }

  function handleClone() { loadIntoStore({ ...build, name: `${build.name} (Clone)` }, false); router.push("/builder"); }
  function handleEdit() { loadIntoStore(build, true); router.push("/builder"); }

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteBuildMutation.mutateAsync(build._id);
      router.push("/builds");
    } catch {
      setDeleting(false);
      setConfirmDelete(false);
    }
  }

  const compatible = build.compatibility.isCompatible;
  const formattedDate = new Date(build.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const catGroups: Record<string, IPart[]> = {};
  for (const { category, part } of build.components) {
    if (!catGroups[category]) catGroups[category] = [];
    catGroups[category].push(part);
  }
  const totalW = build.totalWattage;
  const wPct = Math.min((totalW / 1200) * 100, 100);
  const wColor = totalW < 400 ? "#34d399" : totalW < 700 ? "#fbbf24" : "#f87171";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-void)", color: "#f0f8ff" }}>
      <Navbar />

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "88px 24px 100px" }}>

        <Link href="/builds" style={{ display: "inline-flex", alignItems: "center", gap: "5px", color: "rgba(255,255,255,0.3)", fontSize: "12px", textDecoration: "none", marginBottom: "28px", transition: "color 0.15s" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M10 13L5 8l5-5" /></svg>
          All builds
        </Link>

        {/* Build identity */}
        <div style={{ background: "#090e18", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", marginBottom: "12px", overflow: "hidden", boxShadow: "0 12px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)" }}>
          <div style={{ height: "3px", background: compatible ? "linear-gradient(90deg, #34d399, #34d39940 60%, transparent)" : "linear-gradient(90deg, #f87171, #f8717140 60%, transparent)" }} />
          <div style={{ padding: "28px 30px 24px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", marginBottom: "18px", flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h1 style={{ margin: "0 0 10px", fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.1, color: "#f0f8ff" }}>{build.name}</h1>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                  <Avatar user={build.user} size={24} />
                  <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>{build.user.name}</span>
                  <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)" }}>·</span>
                  <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.28)" }}>{formattedDate}</span>
                  <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "4px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", background: build.isPublic ? "rgba(34,211,238,0.08)" : "rgba(255,255,255,0.04)", border: `1px solid ${build.isPublic ? "rgba(34,211,238,0.2)" : "rgba(255,255,255,0.08)"}`, color: build.isPublic ? "#22d3ee" : "rgba(255,255,255,0.3)" }}>
                    {build.isPublic ? "Public" : "Private"}
                  </span>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "7px", padding: "8px 14px", borderRadius: "8px", flexShrink: 0, background: compatible ? "rgba(52,211,153,0.08)" : "rgba(248,113,113,0.08)", border: `1px solid ${compatible ? "rgba(52,211,153,0.2)" : "rgba(248,113,113,0.2)"}` }}>
                <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: compatible ? "#34d399" : "#f87171", display: "block", flexShrink: 0, boxShadow: `0 0 6px ${compatible ? "#34d399" : "#f87171"}` }} />
                <span style={{ fontSize: "12px", fontWeight: 700, color: compatible ? "#34d399" : "#f87171", letterSpacing: "0.04em" }}>{compatible ? "Compatible" : "Has issues"}</span>
              </div>
            </div>

            {!compatible && build.compatibility.issues.length > 0 && (
              <div style={{ padding: "10px 14px", borderRadius: "8px", background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.16)", fontSize: "12px", color: "#fca5a5", lineHeight: 1.6, marginBottom: "20px" }}>
                {build.compatibility.issues.join(" · ")}
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "22px" }}>
              <div style={{ padding: "14px 16px", borderRadius: "10px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)", marginBottom: "6px" }}>Total price</div>
                <div style={{ fontSize: "22px", fontWeight: 900, color: "#f0f8ff", letterSpacing: "-0.03em" }}>${build.totalPrice.toLocaleString()}</div>
              </div>
              <div style={{ padding: "14px 16px", borderRadius: "10px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)", marginBottom: "6px" }}>Power draw</div>
                <div style={{ fontSize: "22px", fontWeight: 900, color: wColor, letterSpacing: "-0.03em" }}>{build.totalWattage}W</div>
                <div style={{ marginTop: "6px", height: "2px", background: "rgba(255,255,255,0.06)", borderRadius: "1px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${wPct}%`, background: wColor, borderRadius: "1px" }} />
                </div>
              </div>
              <div style={{ padding: "14px 16px", borderRadius: "10px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)", marginBottom: "6px" }}>Components</div>
                <div style={{ fontSize: "22px", fontWeight: 900, color: "#f0f8ff", letterSpacing: "-0.03em" }}>{build.components.length}</div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.28)", marginTop: "4px" }}>{Object.keys(catGroups).length} categories</div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <button onClick={handleClone} style={{ padding: "10px 22px", borderRadius: "8px", background: "linear-gradient(135deg, #22d3ee, #38bdf8)", border: "none", color: "#020408", fontSize: "12px", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer", boxShadow: "0 4px 16px rgba(34,211,238,0.2)" }}>Clone build</button>
              {isOwner && (
                <>
                  <button onClick={handleEdit} style={{ padding: "10px 18px", borderRadius: "8px", background: "rgba(167,139,250,0.09)", border: "1px solid rgba(167,139,250,0.22)", color: "#a78bfa", fontSize: "12px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer" }}>Edit</button>
                  <button onClick={() => setConfirmDelete(true)} style={{ padding: "10px 18px", borderRadius: "8px", background: "rgba(248,113,113,0.07)", border: "1px solid rgba(248,113,113,0.18)", color: "#f87171", fontSize: "12px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer" }}>Delete</button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Parts list */}
        <div style={{ background: "#090e18", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)" }}>
          <div style={{ padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)" }}>Part List</span>
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)" }}>{build.components.length} items</span>
          </div>
          {build.components.map((c, i) => {
            const meta = CAT_META[c.category] ?? getDefaultMeta(c.category);
            const isLast = i === build.components.length - 1;
            return (
              <div key={`${c.category}-${c.part._id}-${i}`} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "15px 24px", borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.04)", transition: "background 0.12s" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                <div style={{ width: "36px", height: "36px", borderRadius: "9px", flexShrink: 0, background: `${meta.accent}10`, border: `1px solid ${meta.accent}1e`, display: "flex", alignItems: "center", justifyContent: "center", color: meta.accent }}>
                  <meta.Icon />
                </div>
                <div style={{ width: "90px", flexShrink: 0 }}>
                  <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: meta.accent, opacity: 0.75 }}>{meta.label}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#f0f8ff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: "2px" }}>{c.part.name}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>{c.part.brand}</span>
                    {c.part.wattage && <><span style={{ fontSize: "10px", color: "rgba(255,255,255,0.15)" }}>·</span><span style={{ fontSize: "11px", color: "#fb923c" }}>{c.part.wattage}W</span></>}
                  </div>
                </div>
                <div style={{ flexShrink: 0, textAlign: "right" }}>
                  <span style={{ fontSize: "15px", fontWeight: 800, color: "#f0f8ff", letterSpacing: "-0.02em" }}>${c.part.price.toLocaleString()}</span>
                </div>
              </div>
            );
          })}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderTop: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.015)" }}>
            <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)" }}>Build total</span>
            <span style={{ fontSize: "20px", fontWeight: 900, color: "#f0f8ff", letterSpacing: "-0.03em" }}>${build.totalPrice.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Delete modal */}
      {confirmDelete && (
        <div onClick={(e) => { if (e.target === e.currentTarget && !deleting) setConfirmDelete(false); }} style={{ position: "fixed", inset: 0, background: "rgba(2,4,8,0.9)", backdropFilter: "blur(14px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "24px" }}>
          <div style={{ background: "#090e18", border: "1px solid rgba(248,113,113,0.2)", borderRadius: "14px", padding: "28px", width: "100%", maxWidth: "370px", textAlign: "center", boxShadow: "0 32px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.04)" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "10px", margin: "0 auto 16px", background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></svg>
            </div>
            <h2 style={{ margin: "0 0 8px", fontSize: "16px", fontWeight: 800, color: "#f0f8ff" }}>Delete this build?</h2>
            <p style={{ margin: "0 0 24px", fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: 1.65 }}>
              <strong style={{ color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>{build.name}</strong> will be permanently removed.
            </p>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={() => !deleting && setConfirmDelete(false)} style={{ flex: 1, padding: "10px", borderRadius: "8px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)", fontSize: "12px", fontWeight: 700, letterSpacing: "0.06em", cursor: deleting ? "not-allowed" : "pointer", textTransform: "uppercase" }}>Cancel</button>
              <button onClick={handleDelete} disabled={deleting} style={{ flex: 1, padding: "10px", borderRadius: "8px", background: deleting ? "rgba(248,113,113,0.5)" : "#ef4444", border: "none", color: "#fff", fontSize: "12px", fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", cursor: deleting ? "not-allowed" : "pointer" }}>{deleting ? "Deleting…" : "Delete"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
