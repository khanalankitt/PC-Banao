"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import Navbar from "@/components/landing/Navbar";
import api from "@/lib/api/axios";
import { useBuilderStore } from "@/store/builderStore";
import type { SlotKey } from "@/store/builderStore";

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

// ─── Category config ──────────────────────────────────────────────────────────

const CAT_ACCENT: Record<string, string> = {
  cpu: "#22d3ee", gpu: "#a78bfa", motherboard: "#fbbf24",
  ram: "#34d399", storage: "#60a5fa", psu: "#fb923c",
  case: "#f472b6", cooler: "#67e8f9",
};

const CAT_LABEL: Record<string, string> = {
  cpu: "CPU", gpu: "GPU", motherboard: "Motherboard",
  ram: "RAM", storage: "Storage", psu: "PSU",
  case: "Case", cooler: "Cooler",
};

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_PARTS: IPart[] = [
  { _id: "p1",  name: "Ryzen 9 7950X",         brand: "AMD",     category: "cpu",         price: 699,  stock: 14, images: [], specs: {}, wattage: 170 },
  { _id: "p2",  name: "RTX 4090",              brand: "NVIDIA",  category: "gpu",         price: 1599, stock: 4,  images: [], specs: {}, wattage: 450 },
  { _id: "p3",  name: "ROG Crosshair X670E",   brand: "ASUS",    category: "motherboard", price: 629,  stock: 6,  images: [], specs: {} },
  { _id: "p4",  name: "Trident Z5 64 GB DDR5", brand: "G.Skill", category: "ram",         price: 219,  stock: 18, images: [], specs: {} },
  { _id: "p5",  name: "990 Pro 2 TB NVMe",     brand: "Samsung", category: "storage",     price: 179,  stock: 25, images: [], specs: {} },
  { _id: "p6",  name: "HX1200 Platinum 1200W", brand: "Corsair", category: "psu",         price: 229,  stock: 9,  images: [], specs: {}, wattage: 1200 },
  { _id: "p7",  name: "O11D EVO RGB",          brand: "Lian Li", category: "case",        price: 179,  stock: 5,  images: [], specs: {} },
  { _id: "p8",  name: "Kraken Elite 360",      brand: "NZXT",    category: "cooler",      price: 269,  stock: 3,  images: [], specs: {}, wattage: 25 },
  { _id: "p9",  name: "Core i5-13600K",        brand: "Intel",   category: "cpu",         price: 299,  stock: 20, images: [], specs: {}, wattage: 125 },
  { _id: "p10", name: "RTX 4070 Ti",           brand: "NVIDIA",  category: "gpu",         price: 799,  stock: 11, images: [], specs: {}, wattage: 285 },
  { _id: "p11", name: "Vengeance 32 GB DDR5",  brand: "Corsair", category: "ram",         price: 129,  stock: 31, images: [], specs: {} },
  { _id: "p12", name: "FireCuda 530 4 TB",     brand: "Seagate", category: "storage",     price: 329,  stock: 12, images: [], specs: {} },
  { _id: "p13", name: "FOCUS GX-850 850W",     brand: "Seasonic",category: "psu",         price: 149,  stock: 15, images: [], specs: {}, wattage: 850 },
  { _id: "p14", name: "H9 Flow Mid Tower",     brand: "NZXT",    category: "case",        price: 129,  stock: 8,  images: [], specs: {} },
  { _id: "p15", name: "RX 7900 XTX",           brand: "AMD",     category: "gpu",         price: 999,  stock: 7,  images: [], specs: {}, wattage: 355 },
];

const MOCK_BUILDS: IBuild[] = [
  {
    _id: "b1", name: "Ryzen Titan",
    user: { _id: "u1", name: "Alex Rivera", image: "https://i.pravatar.cc/40?img=11" },
    components: [
      { category: "cpu", part: MOCK_PARTS[0] }, { category: "gpu", part: MOCK_PARTS[1] },
      { category: "motherboard", part: MOCK_PARTS[2] }, { category: "ram", part: MOCK_PARTS[3] },
      { category: "storage", part: MOCK_PARTS[4] }, { category: "psu", part: MOCK_PARTS[5] },
      { category: "case", part: MOCK_PARTS[6] }, { category: "cooler", part: MOCK_PARTS[7] },
    ],
    totalPrice: 3802, totalWattage: 645, isPublic: true,
    compatibility: { isCompatible: true, issues: [] }, createdAt: "2025-05-10T12:00:00Z",
  },
  {
    _id: "b2", name: "Budget Beast",
    user: { _id: "u2", name: "Priya Sharma", image: "https://i.pravatar.cc/40?img=32" },
    components: [
      { category: "cpu", part: MOCK_PARTS[8] },
      { category: "gpu", part: { ...MOCK_PARTS[9], name: "RTX 4060 Ti", price: 399, wattage: 165 } },
      { category: "ram", part: MOCK_PARTS[10] }, { category: "storage", part: MOCK_PARTS[4] },
      { category: "psu", part: MOCK_PARTS[12] }, { category: "case", part: MOCK_PARTS[13] },
    ],
    totalPrice: 1134, totalWattage: 430, isPublic: true,
    compatibility: { isCompatible: true, issues: [] }, createdAt: "2025-05-08T09:30:00Z",
  },
  {
    _id: "b3", name: "4K Streaming Rig",
    user: { _id: "u3", name: "Jordan Lee", image: "https://i.pravatar.cc/40?img=45" },
    components: [
      { category: "cpu", part: { ...MOCK_PARTS[0], name: "Core i9-13900K", brand: "Intel", price: 589, wattage: 125 } },
      { category: "gpu", part: MOCK_PARTS[1] }, { category: "ram", part: MOCK_PARTS[3] },
      { category: "storage", part: MOCK_PARTS[11] }, { category: "psu", part: MOCK_PARTS[5] },
    ],
    totalPrice: 2715, totalWattage: 575, isPublic: true,
    compatibility: { isCompatible: true, issues: [] }, createdAt: "2025-05-07T16:45:00Z",
  },
  {
    _id: "b4", name: "Silent Workstation",
    user: { _id: "u4", name: "Marcus Chen", image: "https://i.pravatar.cc/40?img=60" },
    components: [
      { category: "cpu", part: MOCK_PARTS[0] }, { category: "gpu", part: MOCK_PARTS[9] },
      { category: "motherboard", part: MOCK_PARTS[2] }, { category: "ram", part: MOCK_PARTS[3] },
      { category: "storage", part: MOCK_PARTS[4] }, { category: "cooler", part: MOCK_PARTS[7] },
    ],
    totalPrice: 2574, totalWattage: 480, isPublic: true,
    compatibility: { isCompatible: true, issues: [] }, createdAt: "2025-05-06T11:00:00Z",
  },
  {
    _id: "b5", name: "RGB Everything",
    user: { _id: "u5", name: "Kai Nakamura", image: "https://i.pravatar.cc/40?img=15" },
    components: [
      { category: "cpu", part: MOCK_PARTS[8] }, { category: "gpu", part: MOCK_PARTS[14] },
      { category: "ram", part: MOCK_PARTS[3] }, { category: "storage", part: MOCK_PARTS[4] },
      { category: "psu", part: MOCK_PARTS[5] }, { category: "case", part: MOCK_PARTS[6] },
    ],
    totalPrice: 2354, totalWattage: 550, isPublic: true,
    compatibility: { isCompatible: false, issues: ["PSU wattage may be insufficient at peak load"] },
    createdAt: "2025-05-05T14:20:00Z",
  },
  {
    _id: "b6", name: "Mini ITX Sleeper",
    user: { _id: "u6", name: "Sofia Reyes", image: "https://i.pravatar.cc/40?img=27" },
    components: [
      { category: "cpu", part: MOCK_PARTS[8] },
      { category: "gpu", part: { ...MOCK_PARTS[9], name: "RTX 4070 Super", price: 599, wattage: 220 } },
      { category: "ram", part: MOCK_PARTS[10] }, { category: "psu", part: MOCK_PARTS[12] },
    ],
    totalPrice: 1176, totalWattage: 345, isPublic: true,
    compatibility: { isCompatible: true, issues: [] }, createdAt: "2025-05-04T08:10:00Z",
  },
  {
    _id: "b7", name: "AMD Powerhouse",
    user: { _id: "u7", name: "Dmitri Volkov", image: "https://i.pravatar.cc/40?img=52" },
    components: [
      { category: "cpu", part: MOCK_PARTS[0] }, { category: "gpu", part: MOCK_PARTS[14] },
      { category: "motherboard", part: MOCK_PARTS[2] }, { category: "ram", part: MOCK_PARTS[3] },
      { category: "storage", part: MOCK_PARTS[11] }, { category: "psu", part: MOCK_PARTS[5] },
      { category: "cooler", part: MOCK_PARTS[7] },
    ],
    totalPrice: 3223, totalWattage: 525, isPublic: true,
    compatibility: { isCompatible: true, issues: [] }, createdAt: "2025-05-03T19:00:00Z",
  },
  {
    _id: "b8", name: "Content Creator Pro",
    user: { _id: "u8", name: "Amara Osei", image: "https://i.pravatar.cc/40?img=38" },
    components: [
      { category: "cpu", part: { ...MOCK_PARTS[0], name: "Core i9-13900K", brand: "Intel", price: 589, wattage: 125 } },
      { category: "gpu", part: MOCK_PARTS[1] },
      { category: "ram", part: { ...MOCK_PARTS[3], name: "128 GB DDR5-5600", price: 399 } },
      { category: "storage", part: MOCK_PARTS[11] }, { category: "storage", part: MOCK_PARTS[4] },
      { category: "psu", part: MOCK_PARTS[5] }, { category: "cooler", part: MOCK_PARTS[7] },
    ],
    totalPrice: 3289, totalWattage: 600, isPublic: true,
    compatibility: { isCompatible: true, issues: [] }, createdAt: "2025-05-02T13:30:00Z",
  },
];

// ─── Normalise API response ───────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normaliseApiBuild(raw: any): IBuild {
  const comps = raw.components ?? {};
  const componentList: { category: string; part: IPart }[] = [];
  for (const key of ["cpu", "gpu", "motherboard", "psu", "case", "cooler"] as const) {
    if (comps[key] && typeof comps[key] === "object") componentList.push({ category: key, part: comps[key] as IPart });
  }
  for (const part of (comps.ram ?? []) as IPart[]) {
    if (part && typeof part === "object") componentList.push({ category: "ram", part });
  }
  for (const part of (comps.storage ?? []) as IPart[]) {
    if (part && typeof part === "object") componentList.push({ category: "storage", part });
  }
  return {
    _id: raw._id, name: raw.name ?? "Untitled",
    user: typeof raw.user === "object" && raw.user !== null
      ? raw.user : { _id: String(raw.user), name: "Unknown" },
    components: componentList,
    totalPrice: raw.totalPrice ?? 0, totalWattage: raw.totalWattage ?? 0,
    isPublic: raw.isPublic ?? false,
    compatibility: { isCompatible: raw.isCompatible ?? true, issues: raw.compatibilityIssues ?? [] },
    createdAt: raw.createdAt ?? new Date().toISOString(),
  };
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({ user, size = 28 }: { user: IBuild["user"]; size?: number }) {
  const initials = user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  if (user.image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={user.image} alt={user.name}
        style={{ width: size, height: size, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.1)", flexShrink: 0, objectFit: "cover" }}
      />
    );
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: "linear-gradient(135deg, #22d3ee, #7c3aed)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: Math.round(size * 0.38), fontWeight: 700, color: "#fff",
    }}>
      {initials}
    </div>
  );
}

// ─── Build Card ───────────────────────────────────────────────────────────────

function BuildCard({ build }: { build: IBuild }) {
  const [hovered, setHovered] = useState(false);
  const router = useRouter();
  const { setPart, setBuildName, resetBuild } = useBuilderStore();
  const compatible = build.compatibility.isCompatible;

  // Get unique categories in order
  const seen = new Set<string>();
  const uniqueCats = build.components
    .filter((c) => { if (seen.has(c.category)) return false; seen.add(c.category); return true; });

  // Key specs to surface: CPU name, GPU name
  const cpuPart = build.components.find((c) => c.category === "cpu")?.part;
  const gpuPart = build.components.find((c) => c.category === "gpu")?.part;

  function handleClone() {
    resetBuild();
    setBuildName(`${build.name} (Clone)`);
    const cloneSeen = new Set<string>();
    for (const { category, part } of build.components) {
      if (!cloneSeen.has(category)) { setPart(category as SlotKey, { ...part, category: category as SlotKey }); cloneSeen.add(category); }
      else setPart(category as SlotKey, { ...part, category: category as SlotKey });
    }
    router.push("/builder");
  }

  const formattedDate = new Date(build.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#090e18",
        border: `1px solid ${hovered ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.07)"}`,
        borderRadius: "14px",
        overflow: "hidden",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)"
          : "0 2px 16px rgba(0,0,0,0.4)",
        transition: "all 0.22s cubic-bezier(0.4,0,0.2,1)",
        display: "flex", flexDirection: "column",
      }}
    >
      {/* ── Coloured accent bar ── */}
      <div style={{
        height: "3px", flexShrink: 0,
        background: compatible
          ? "linear-gradient(90deg, #34d399 0%, #34d39940 60%, transparent 100%)"
          : "linear-gradient(90deg, #f87171 0%, #f8717140 60%, transparent 100%)",
      }} />

      {/* ── Card body ── */}
      <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column", gap: "16px" }}>

        {/* Title row */}
        <div>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", marginBottom: "10px" }}>
            <h2 style={{
              margin: 0, fontSize: "17px", fontWeight: 800,
              color: "#f0f8ff", letterSpacing: "-0.025em", lineHeight: 1.25,
            }}>
              {build.name}
            </h2>
            <span style={{
              flexShrink: 0, marginTop: "2px",
              fontSize: "10px", fontWeight: 700, letterSpacing: "0.07em",
              padding: "3px 8px", borderRadius: "5px", textTransform: "uppercase",
              background: compatible ? "rgba(52,211,153,0.1)" : "rgba(248,113,113,0.1)",
              border: `1px solid ${compatible ? "rgba(52,211,153,0.22)" : "rgba(248,113,113,0.22)"}`,
              color: compatible ? "#34d399" : "#f87171",
            }}>
              {compatible ? "✓ OK" : "⚠ Issues"}
            </span>
          </div>

          {/* Author + date */}
          <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
            <Avatar user={build.user} size={22} />
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", fontWeight: 500 }}>
              {build.user.name}
            </span>
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.18)", marginLeft: "auto" }}>
              {formattedDate}
            </span>
          </div>
        </div>

        {/* Key specs: CPU + GPU names */}
        {(cpuPart || gpuPart) && (
          <div style={{
            padding: "12px 14px", borderRadius: "9px",
            background: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(255,255,255,0.06)",
            display: "flex", flexDirection: "column", gap: "7px",
          }}>
            {cpuPart && (
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#22d3ee", width: "28px", flexShrink: 0 }}>CPU</span>
                <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.75)", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{cpuPart.name}</span>
              </div>
            )}
            {cpuPart && gpuPart && <div style={{ height: "1px", background: "rgba(255,255,255,0.05)" }} />}
            {gpuPart && (
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#a78bfa", width: "28px", flexShrink: 0 }}>GPU</span>
                <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.75)", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{gpuPart.name}</span>
              </div>
            )}
          </div>
        )}

        {/* Component category dots */}
        <div style={{ display: "flex", alignItems: "center", gap: "5px", flexWrap: "wrap" }}>
          {uniqueCats.map((c) => (
            <div key={c.category} title={CAT_LABEL[c.category] ?? c.category} style={{
              display: "flex", alignItems: "center", gap: "4px",
              padding: "3px 8px", borderRadius: "20px",
              background: `${CAT_ACCENT[c.category] ?? "#fff"}0d`,
              border: `1px solid ${CAT_ACCENT[c.category] ?? "#fff"}20`,
            }}>
              <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: CAT_ACCENT[c.category] ?? "#fff", flexShrink: 0, display: "block" }} />
              <span style={{ fontSize: "10px", fontWeight: 600, color: CAT_ACCENT[c.category] ?? "var(--text-muted)", letterSpacing: "0.03em" }}>
                {CAT_LABEL[c.category] ?? c.category}
              </span>
            </div>
          ))}
        </div>

        {/* Compat issue inline */}
        {!compatible && build.compatibility.issues.length > 0 && (
          <div style={{
            padding: "8px 11px", borderRadius: "7px",
            background: "rgba(248,113,113,0.06)",
            border: "1px solid rgba(248,113,113,0.15)",
            fontSize: "11px", color: "#fca5a5", lineHeight: 1.55,
          }}>
            {build.compatibility.issues[0]}
          </div>
        )}

        {/* ── Footer: price + actions ── */}
        <div style={{ marginTop: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
            <div>
              <span style={{ fontSize: "24px", fontWeight: 900, color: "#f0f8ff", letterSpacing: "-0.035em" }}>
                ${build.totalPrice.toLocaleString()}
              </span>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#fb923c" }}>{build.totalWattage}W</div>
              <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)", marginTop: "1px" }}>{build.components.length} parts</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => router.push(`/builds/${build._id}`)}
              style={{
                flex: 1, padding: "10px 0", borderRadius: "8px",
                background: hovered ? "rgba(0,212,255,0.1)" : "rgba(255,255,255,0.05)",
                border: `1px solid ${hovered ? "rgba(0,212,255,0.35)" : "rgba(255,255,255,0.09)"}`,
                color: hovered ? "#22d3ee" : "rgba(255,255,255,0.6)",
                fontSize: "12px", fontWeight: 700, letterSpacing: "0.05em",
                cursor: "pointer", transition: "all 0.15s",
              }}
            >
              View details
            </button>
            <button
              onClick={handleClone}
              style={{
                padding: "10px 16px", borderRadius: "8px",
                background: "rgba(167,139,250,0.09)",
                border: "1px solid rgba(167,139,250,0.22)",
                color: "#a78bfa", fontSize: "12px", fontWeight: 700,
                letterSpacing: "0.05em", cursor: "pointer", transition: "all 0.15s",
                flexShrink: 0,
              }}
            >
              Clone
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

// ─── Sign-in prompt ───────────────────────────────────────────────────────────

function SignInPrompt() {
  return (
    <div style={{
      gridColumn: "1 / -1",
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "80px 24px", textAlign: "center",
      border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px",
      background: "rgba(255,255,255,0.01)",
    }}>
      <div style={{
        width: "48px", height: "48px", borderRadius: "12px",
        background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
        display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "18px",
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </div>
      <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#f0f8ff", margin: "0 0 8px" }}>
        Sign in to see your builds
      </h3>
      <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", maxWidth: "300px", lineHeight: 1.65, margin: "0 0 24px" }}>
        Save, share, and clone your custom PC configurations. Free forever.
      </p>
      <button
        onClick={() => signIn(undefined, { callbackUrl: "/builds" })}
        style={{
          padding: "10px 26px", borderRadius: "8px",
          background: "linear-gradient(135deg, #22d3ee, #38bdf8)",
          border: "none", color: "#020408", fontSize: "12px", fontWeight: 800,
          letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer",
          boxShadow: "0 4px 18px rgba(0,212,255,0.2)",
        }}
      >
        Sign in free
      </button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BuildsPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<"community" | "mine">("community");
  const [communityBuilds, setCommunityBuilds] = useState<IBuild[]>([]);
  const [myBuilds, setMyBuilds] = useState<IBuild[]>([]);
  const [loadingCommunity, setLoadingCommunity] = useState(true);
  const [loadingMine, setLoadingMine] = useState(false);
  const [mineError, setMineError] = useState<"auth" | "network" | null>(null);
  const [mineRetryKey, setMineRetryKey] = useState(0);

  const totalBuilds = communityBuilds.length;
  const compatCount = communityBuilds.filter((b) => b.compatibility.isCompatible).length;
  const compatPct = totalBuilds > 0 ? Math.round((compatCount / totalBuilds) * 100) : 0;
  const avgPrice = totalBuilds > 0
    ? Math.round(communityBuilds.reduce((s, b) => s + b.totalPrice, 0) / totalBuilds)
    : 0;

  useEffect(() => {
    setLoadingCommunity(true);
    api.get("/api/builds/public", { params: { page: 1, limit: 20 } })
      .then((res) => {
        if (res.data?.success && Array.isArray(res.data?.data?.builds))
          setCommunityBuilds(res.data.data.builds.map(normaliseApiBuild));
      })
      .catch(() => {})
      .finally(() => setLoadingCommunity(false));
  }, []);

  const fetchMyBuilds = useCallback(() => {
    if (!session || activeTab !== "mine") return;
    setMineError(null);
    setLoadingMine(true);
    api.get("/api/builds/mine")
      .then((res) => {
        if (res.data?.success && Array.isArray(res.data?.data))
          setMyBuilds(res.data.data.map(normaliseApiBuild));
        else
          setMineError("network");
      })
      .catch((err: { response?: { status?: number } }) => {
        if (err?.response?.status === 401) {
          setMineError("auth");
        } else {
          setMineError("network");
        }
      })
      .finally(() => setLoadingMine(false));
  }, [session, activeTab]);

  useEffect(() => {
    fetchMyBuilds();
  }, [fetchMyBuilds, mineRetryKey]);

  const displayedBuilds = activeTab === "community" ? communityBuilds : myBuilds;
  const isLoading = activeTab === "community" ? loadingCommunity : loadingMine;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-void)", color: "var(--text-primary)" }}>
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <div style={{ marginTop: "56px", position: "relative", padding: "52px 24px 36px", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(0,212,255,0.2) 30%, rgba(124,58,237,0.2) 70%, transparent)",
          }} />
        </div>

        <div style={{ position: "relative", maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "24px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                <div style={{ width: "3px", height: "22px", borderRadius: "2px", background: "linear-gradient(180deg, #22d3ee, #7c3aed)" }} />
                <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>
                  Community
                </span>
              </div>
              <h1 style={{ fontSize: "clamp(24px, 4vw, 38px)", fontWeight: 900, margin: "0 0 10px", letterSpacing: "-0.03em", lineHeight: 1.1, color: "#f0f8ff" }}>
                Browse{" "}
                <span style={{ background: "linear-gradient(135deg, #22d3ee, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  builds
                </span>
              </h1>
              <p style={{ margin: 0, fontSize: "14px", color: "rgba(255,255,255,0.35)", lineHeight: 1.65, maxWidth: "380px" }}>
                Real configurations from the community. Clone any build and make it yours in the builder.
              </p>
            </div>

            {/* Stats */}
            <div style={{ display: "flex", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", overflow: "hidden", flexShrink: 0 }}>
              {[
                { label: "Builds", value: String(totalBuilds), color: "#22d3ee" },
                { label: "Compatible", value: `${compatPct}%`, color: "#34d399" },
                { label: "Avg cost", value: `$${avgPrice.toLocaleString()}`, color: "#a78bfa" },
              ].map((s, i) => (
                <div key={i} style={{
                  padding: "12px 22px", textAlign: "center",
                  borderRight: i < 2 ? "1px solid rgba(255,255,255,0.07)" : "none",
                  background: "rgba(255,255,255,0.02)",
                }}>
                  <div style={{ fontSize: "18px", fontWeight: 800, color: s.color, letterSpacing: "-0.02em" }}>{s.value}</div>
                  <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "3px" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Tab bar ──────────────────────────────────────────────────────────── */}
      <div style={{
        position: "sticky", top: "56px", zIndex: 30,
        background: "rgba(2,4,8,0.94)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", display: "flex" }}>
          {(["community", "mine"] as const).map((key) => {
            const label = key === "community" ? "Community" : "My Builds";
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                style={{
                  padding: "14px 20px", background: "transparent", border: "none",
                  borderBottom: `2px solid ${isActive ? "#22d3ee" : "transparent"}`,
                  color: isActive ? "#f0f8ff" : "rgba(255,255,255,0.35)",
                  fontSize: "13px", fontWeight: isActive ? 700 : 400,
                  cursor: "pointer", transition: "all 0.15s", marginBottom: "-1px",
                  display: "flex", alignItems: "center", gap: "8px",
                }}
              >
                {label}
                {key === "mine" && status !== "loading" && !session && (
                  <span style={{
                    fontSize: "9px", padding: "1px 6px", borderRadius: "4px",
                    background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.2)",
                    color: "#a78bfa", fontWeight: 700, letterSpacing: "0.07em",
                  }}>
                    Sign in
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Grid ─────────────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px 80px" }}>

        {activeTab === "mine" && status !== "loading" && !session ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
            <SignInPrompt />
          </div>

        ) : isLoading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ height: "320px", borderRadius: "14px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", animation: "pulseGlow 1.5s ease-in-out infinite", animationDelay: `${i * 100}ms` }} />
            ))}
          </div>

        ) : activeTab === "mine" && mineError === "auth" ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "80px 24px", textAlign: "center" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", marginBottom: "18px", background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#f0f8ff", margin: "0 0 8px" }}>Session expired</h3>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", maxWidth: "300px", lineHeight: 1.65, margin: "0 0 24px" }}>
              Your login session expired. Sign in again to see your builds.
            </p>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              style={{ padding: "10px 26px", borderRadius: "8px", background: "linear-gradient(135deg, #22d3ee, #38bdf8)", border: "none", color: "#020408", fontSize: "12px", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer" }}
            >
              Sign in again
            </button>
          </div>

        ) : activeTab === "mine" && mineError === "network" ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "80px 24px", textAlign: "center" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", marginBottom: "18px", background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
              </svg>
            </div>
            <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#f0f8ff", margin: "0 0 8px" }}>Couldn&apos;t load your builds</h3>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", maxWidth: "280px", lineHeight: 1.65, margin: "0 0 24px" }}>
              There was a problem reaching the server.
            </p>
            <button
              onClick={() => setMineRetryKey((k) => k + 1)}
              style={{ padding: "10px 26px", borderRadius: "8px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#f0f8ff", fontSize: "12px", fontWeight: 700, letterSpacing: "0.06em", cursor: "pointer" }}
            >
              Retry
            </button>
          </div>

        ) : activeTab === "mine" && displayedBuilds.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "80px 24px", textAlign: "center" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", marginBottom: "18px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinecap="round">
                <rect x="6" y="6" width="12" height="12" rx="2" /><path d="M9 6V3M12 6V3M15 6V3M9 21v-3M12 21v-3M15 21v-3M6 9H3M6 12H3M6 15H3M21 9h-3M21 12h-3M21 15h-3" />
              </svg>
            </div>
            <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#f0f8ff", margin: "0 0 8px" }}>No builds yet</h3>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", maxWidth: "280px", lineHeight: 1.65, margin: "0 0 22px" }}>
              Head to the builder and put together your first configuration.
            </p>
            <a href="/builder" style={{ padding: "10px 22px", borderRadius: "8px", background: "linear-gradient(135deg, #22d3ee, #38bdf8)", color: "#020408", fontSize: "12px", fontWeight: 800, letterSpacing: "0.08em", textDecoration: "none", textTransform: "uppercase" }}>
              Start building
            </a>
          </div>

        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.04em" }}>
                {displayedBuilds.length} {displayedBuilds.length === 1 ? "build" : "builds"}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", fontWeight: 600, color: "#34d399", padding: "4px 10px", borderRadius: "6px", background: "rgba(52,211,153,0.07)", border: "1px solid rgba(52,211,153,0.15)" }}>
                <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#34d399", display: "inline-block" }} />
                {compatCount} compatible
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
              {displayedBuilds.map((build) => (
                <BuildCard key={build._id} build={build} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
