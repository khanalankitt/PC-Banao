"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
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

// ─── PC Build Photos (cycling set) ───────────────────────────────────────────

const BUILD_PHOTOS = [
  "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80&fit=crop",
  "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&q=80&fit=crop",
  "https://images.unsplash.com/photo-1593640495253-23196b27a87f?w=800&q=80&fit=crop",
  "https://images.unsplash.com/photo-1591238372337-e11d6e6e0a63?w=800&q=80&fit=crop",
];

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_PARTS: IPart[] = [
  {
    _id: "p1",
    name: "Ryzen 9 7950X",
    brand: "AMD",
    category: "cpu",
    price: 699,
    stock: 14,
    images: [],
    specs: {},
    wattage: 170,
  },
  {
    _id: "p2",
    name: "RTX 4090",
    brand: "NVIDIA",
    category: "gpu",
    price: 1599,
    stock: 4,
    images: [],
    specs: {},
    wattage: 450,
  },
  {
    _id: "p3",
    name: "ROG Crosshair X670E",
    brand: "ASUS",
    category: "motherboard",
    price: 629,
    stock: 6,
    images: [],
    specs: {},
  },
  {
    _id: "p4",
    name: "Trident Z5 64 GB DDR5",
    brand: "G.Skill",
    category: "ram",
    price: 219,
    stock: 18,
    images: [],
    specs: {},
  },
  {
    _id: "p5",
    name: "990 Pro 2 TB NVMe",
    brand: "Samsung",
    category: "storage",
    price: 179,
    stock: 25,
    images: [],
    specs: {},
  },
  {
    _id: "p6",
    name: "HX1200 Platinum 1200W",
    brand: "Corsair",
    category: "psu",
    price: 229,
    stock: 9,
    images: [],
    specs: {},
    wattage: 1200,
  },
  {
    _id: "p7",
    name: "O11D EVO RGB",
    brand: "Lian Li",
    category: "case",
    price: 179,
    stock: 5,
    images: [],
    specs: {},
  },
  {
    _id: "p8",
    name: "Kraken Elite 360",
    brand: "NZXT",
    category: "cooler",
    price: 269,
    stock: 3,
    images: [],
    specs: {},
    wattage: 25,
  },
  {
    _id: "p9",
    name: "Core i5-13600K",
    brand: "Intel",
    category: "cpu",
    price: 299,
    stock: 20,
    images: [],
    specs: {},
    wattage: 125,
  },
  {
    _id: "p10",
    name: "RTX 4070 Ti",
    brand: "NVIDIA",
    category: "gpu",
    price: 799,
    stock: 11,
    images: [],
    specs: {},
    wattage: 285,
  },
  {
    _id: "p11",
    name: "Vengeance 32 GB DDR5",
    brand: "Corsair",
    category: "ram",
    price: 129,
    stock: 31,
    images: [],
    specs: {},
  },
  {
    _id: "p12",
    name: "FireCuda 530 4 TB",
    brand: "Seagate",
    category: "storage",
    price: 329,
    stock: 12,
    images: [],
    specs: {},
  },
  {
    _id: "p13",
    name: "FOCUS GX-850 850W",
    brand: "Seasonic",
    category: "psu",
    price: 149,
    stock: 15,
    images: [],
    specs: {},
    wattage: 850,
  },
  {
    _id: "p14",
    name: "H9 Flow Mid Tower",
    brand: "NZXT",
    category: "case",
    price: 129,
    stock: 8,
    images: [],
    specs: {},
  },
  {
    _id: "p15",
    name: "RX 7900 XTX",
    brand: "AMD",
    category: "gpu",
    price: 999,
    stock: 7,
    images: [],
    specs: {},
    wattage: 355,
  },
];

const MOCK_BUILDS: IBuild[] = [
  {
    _id: "b1",
    name: "Ryzen Titan",
    user: {
      _id: "u1",
      name: "Alex Rivera",
      image: "https://i.pravatar.cc/40?img=11",
    },
    components: [
      { category: "cpu", part: MOCK_PARTS[0] },
      { category: "gpu", part: MOCK_PARTS[1] },
      { category: "motherboard", part: MOCK_PARTS[2] },
      { category: "ram", part: MOCK_PARTS[3] },
      { category: "storage", part: MOCK_PARTS[4] },
      { category: "psu", part: MOCK_PARTS[5] },
      { category: "case", part: MOCK_PARTS[6] },
      { category: "cooler", part: MOCK_PARTS[7] },
    ],
    totalPrice: 3802,
    totalWattage: 645,
    isPublic: true,
    compatibility: { isCompatible: true, issues: [] },
    createdAt: "2025-05-10T12:00:00Z",
  },
  {
    _id: "b2",
    name: "Budget Beast",
    user: {
      _id: "u2",
      name: "Priya Sharma",
      image: "https://i.pravatar.cc/40?img=32",
    },
    components: [
      { category: "cpu", part: MOCK_PARTS[8] },
      {
        category: "gpu",
        part: {
          ...MOCK_PARTS[9],
          name: "RTX 4060 Ti",
          price: 399,
          wattage: 165,
        },
      },
      { category: "ram", part: MOCK_PARTS[10] },
      { category: "storage", part: MOCK_PARTS[4] },
      { category: "psu", part: MOCK_PARTS[12] },
      { category: "case", part: MOCK_PARTS[13] },
    ],
    totalPrice: 1134,
    totalWattage: 430,
    isPublic: true,
    compatibility: { isCompatible: true, issues: [] },
    createdAt: "2025-05-08T09:30:00Z",
  },
  {
    _id: "b3",
    name: "4K Streaming Rig",
    user: {
      _id: "u3",
      name: "Jordan Lee",
      image: "https://i.pravatar.cc/40?img=45",
    },
    components: [
      {
        category: "cpu",
        part: {
          ...MOCK_PARTS[0],
          name: "Core i9-13900K",
          brand: "Intel",
          price: 589,
          wattage: 125,
        },
      },
      { category: "gpu", part: MOCK_PARTS[1] },
      { category: "ram", part: MOCK_PARTS[3] },
      { category: "storage", part: MOCK_PARTS[11] },
      { category: "psu", part: MOCK_PARTS[5] },
    ],
    totalPrice: 2715,
    totalWattage: 575,
    isPublic: true,
    compatibility: { isCompatible: true, issues: [] },
    createdAt: "2025-05-07T16:45:00Z",
  },
  {
    _id: "b4",
    name: "Silent Workstation",
    user: {
      _id: "u4",
      name: "Marcus Chen",
      image: "https://i.pravatar.cc/40?img=60",
    },
    components: [
      { category: "cpu", part: MOCK_PARTS[0] },
      { category: "gpu", part: MOCK_PARTS[9] },
      { category: "motherboard", part: MOCK_PARTS[2] },
      { category: "ram", part: MOCK_PARTS[3] },
      { category: "storage", part: MOCK_PARTS[4] },
      { category: "cooler", part: MOCK_PARTS[7] },
    ],
    totalPrice: 2574,
    totalWattage: 480,
    isPublic: true,
    compatibility: { isCompatible: true, issues: [] },
    createdAt: "2025-05-06T11:00:00Z",
  },
  {
    _id: "b5",
    name: "RGB Everything",
    user: {
      _id: "u5",
      name: "Kai Nakamura",
      image: "https://i.pravatar.cc/40?img=15",
    },
    components: [
      { category: "cpu", part: MOCK_PARTS[8] },
      { category: "gpu", part: MOCK_PARTS[14] },
      { category: "ram", part: MOCK_PARTS[3] },
      { category: "storage", part: MOCK_PARTS[4] },
      { category: "psu", part: MOCK_PARTS[5] },
      { category: "case", part: MOCK_PARTS[6] },
    ],
    totalPrice: 2354,
    totalWattage: 550,
    isPublic: true,
    compatibility: {
      isCompatible: false,
      issues: ["PSU wattage may be insufficient at peak load"],
    },
    createdAt: "2025-05-05T14:20:00Z",
  },
  {
    _id: "b6",
    name: "Mini ITX Sleeper",
    user: {
      _id: "u6",
      name: "Sofia Reyes",
      image: "https://i.pravatar.cc/40?img=27",
    },
    components: [
      { category: "cpu", part: MOCK_PARTS[8] },
      {
        category: "gpu",
        part: {
          ...MOCK_PARTS[9],
          name: "RTX 4070 Super",
          price: 599,
          wattage: 220,
        },
      },
      { category: "ram", part: MOCK_PARTS[10] },
      { category: "psu", part: MOCK_PARTS[12] },
    ],
    totalPrice: 1176,
    totalWattage: 345,
    isPublic: true,
    compatibility: { isCompatible: true, issues: [] },
    createdAt: "2025-05-04T08:10:00Z",
  },
  {
    _id: "b7",
    name: "AMD Powerhouse",
    user: {
      _id: "u7",
      name: "Dmitri Volkov",
      image: "https://i.pravatar.cc/40?img=52",
    },
    components: [
      { category: "cpu", part: MOCK_PARTS[0] },
      { category: "gpu", part: MOCK_PARTS[14] },
      { category: "motherboard", part: MOCK_PARTS[2] },
      { category: "ram", part: MOCK_PARTS[3] },
      { category: "storage", part: MOCK_PARTS[11] },
      { category: "psu", part: MOCK_PARTS[5] },
      { category: "cooler", part: MOCK_PARTS[7] },
    ],
    totalPrice: 3223,
    totalWattage: 525,
    isPublic: true,
    compatibility: { isCompatible: true, issues: [] },
    createdAt: "2025-05-03T19:00:00Z",
  },
  {
    _id: "b8",
    name: "Content Creator Pro",
    user: {
      _id: "u8",
      name: "Amara Osei",
      image: "https://i.pravatar.cc/40?img=38",
    },
    components: [
      {
        category: "cpu",
        part: {
          ...MOCK_PARTS[0],
          name: "Core i9-13900K",
          brand: "Intel",
          price: 589,
          wattage: 125,
        },
      },
      { category: "gpu", part: MOCK_PARTS[1] },
      {
        category: "ram",
        part: { ...MOCK_PARTS[3], name: "128 GB DDR5-5600", price: 399 },
      },
      { category: "storage", part: MOCK_PARTS[11] },
      { category: "storage", part: MOCK_PARTS[4] },
      { category: "psu", part: MOCK_PARTS[5] },
      { category: "cooler", part: MOCK_PARTS[7] },
    ],
    totalPrice: 3289,
    totalWattage: 600,
    isPublic: true,
    compatibility: { isCompatible: true, issues: [] },
    createdAt: "2025-05-02T13:30:00Z",
  },
];

// ─── Build Card ───────────────────────────────────────────────────────────────

function BuildCard({ build, index }: { build: IBuild; index: number }) {
  const [hovered, setHovered] = useState(false);
  const router = useRouter();
  const { setPart, setBuildName, resetBuild } = useBuilderStore();

  function handleClone() {
    resetBuild();
    setBuildName(`${build.name} (Clone)`);
    const seen = new Set<string>();
    for (const { category, part } of build.components) {
      if (!seen.has(category)) {
        setPart(category as SlotKey, { ...part, category: category as SlotKey });
        seen.add(category);
      } else {
        setPart(category as SlotKey, { ...part, category: category as SlotKey });
      }
    }
    router.push('/builder');
  }
  const photo = BUILD_PHOTOS[index % BUILD_PHOTOS.length];
  const compatible = build.compatibility.isCompatible;
  const componentCount = build.components.length;

  const initials = build.user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "var(--bg-card)",
        border: `1px solid ${hovered ? "rgba(0,212,255,0.35)" : "var(--border-subtle)"}`,
        borderRadius: "16px",
        overflow: "hidden",
        transform: hovered
          ? "translateY(-6px) scale(1.01)"
          : "translateY(0) scale(1)",
        boxShadow: hovered
          ? "0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(0,212,255,0.1)"
          : "0 4px 20px rgba(0,0,0,0.4)",
        transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
        display: "flex",
        flexDirection: "column",
        cursor: "default",
      }}
    >
      {/* ── Photo top half ──────────────────────────────────────────────────── */}
      <div
        style={{
          position: "relative",
          height: "200px",
          overflow: "hidden",
        }}
      >
        <img
          src={photo}
          alt={`${build.name} build`}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: hovered ? "scale(1.06)" : "scale(1)",
            transition: "transform 0.4s cubic-bezier(0.4,0,0.2,1)",
            filter: hovered ? "brightness(0.9)" : "brightness(0.75)",
          }}
        />
        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(2,4,8,0.1) 0%, rgba(2,4,8,0.4) 60%, rgba(8,13,20,0.95) 100%)",
          }}
        />
        {/* Cyan accent top bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "2px",
            background: compatible
              ? "linear-gradient(90deg, var(--neon-green), transparent)"
              : "linear-gradient(90deg, #ef4444, transparent)",
            opacity: hovered ? 1 : 0.6,
          }}
        />

        {/* Compatibility badge — top right */}
        <div
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            padding: "4px 10px",
            borderRadius: "20px",
            background: compatible
              ? "rgba(0,255,136,0.15)"
              : "rgba(239,68,68,0.15)",
            border: `1px solid ${compatible ? "rgba(0,255,136,0.4)" : "rgba(239,68,68,0.4)"}`,
            backdropFilter: "blur(8px)",
          }}
        >
          <span style={{ fontSize: "11px" }}>{compatible ? "✓" : "⚠"}</span>
          <span
            style={{
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.06em",
              color: compatible ? "var(--neon-green)" : "#ef4444",
            }}
          >
            {compatible ? "Compatible" : "Issues"}
          </span>
        </div>

        {/* Component count — top left */}
        <div
          style={{
            position: "absolute",
            top: "12px",
            left: "12px",
            padding: "4px 10px",
            borderRadius: "20px",
            background: "rgba(0,212,255,0.12)",
            border: "1px solid rgba(0,212,255,0.25)",
            backdropFilter: "blur(8px)",
            fontSize: "10px",
            fontWeight: 700,
            color: "var(--cyan)",
            letterSpacing: "0.05em",
          }}
        >
          {componentCount} parts
        </div>

        {/* Build name overlay on photo */}
        <div
          style={{
            position: "absolute",
            bottom: "14px",
            left: "16px",
            right: "16px",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "20px",
              fontWeight: 900,
              color: "#ffffff",
              textShadow: "0 2px 12px rgba(0,0,0,0.9)",
              letterSpacing: "-0.01em",
              lineHeight: 1.2,
            }}
          >
            {build.name}
          </h2>
        </div>
      </div>

      {/* ── Info bottom half ─────────────────────────────────────────────────── */}
      <div
        style={{
          padding: "16px 18px 18px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        {/* Author row */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {build.user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={build.user.image}
              alt={build.user.name}
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                border: "2px solid var(--border-badge)",
                flexShrink: 0,
              }}
            />
          ) : (
            <div
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, var(--cyan), var(--violet))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "11px",
                fontWeight: 700,
                color: "#020408",
                flexShrink: 0,
              }}
            >
              {initials}
            </div>
          )}
          <div>
            <p
              style={{
                margin: 0,
                fontSize: "13px",
                fontWeight: 600,
                color: "var(--text-primary)",
                lineHeight: 1,
              }}
            >
              {build.user.name}
            </p>
            <p
              style={{
                margin: "3px 0 0",
                fontSize: "11px",
                color: "var(--text-muted)",
                lineHeight: 1,
              }}
            >
              {new Date(build.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Component category strip */}
        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
          {build.components.slice(0, 6).map((c, i) => (
            <span
              key={i}
              style={{
                fontSize: "10px",
                padding: "2px 6px",
                borderRadius: "4px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
                color: "var(--text-muted)",
                textTransform: "capitalize",
              }}
            >
              {c.category}
            </span>
          ))}
          {build.components.length > 6 && (
            <span
              style={{
                fontSize: "10px",
                padding: "2px 6px",
                borderRadius: "4px",
                background: "rgba(0,212,255,0.08)",
                border: "1px solid rgba(0,212,255,0.15)",
                color: "var(--cyan)",
              }}
            >
              +{build.components.length - 6}
            </span>
          )}
        </div>

        {/* Price + Wattage row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <span
              style={{
                fontSize: "24px",
                fontWeight: 800,
                color: "var(--cyan)",
                letterSpacing: "-0.02em",
                textShadow: hovered ? "0 0 20px var(--cyan-glow)" : "none",
                transition: "text-shadow 0.3s",
              }}
            >
              ${build.totalPrice.toLocaleString()}
            </span>
            <span
              style={{
                fontSize: "11px",
                color: "var(--text-muted)",
                marginLeft: "6px",
              }}
            >
              total
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: "4px 10px",
              borderRadius: "8px",
              background: "rgba(249,115,22,0.1)",
              border: "1px solid rgba(249,115,22,0.25)",
            }}
          >
            <span style={{ fontSize: "12px" }}>⚡</span>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "#f97316",
              }}
            >
              {build.totalWattage}W
            </span>
          </div>
        </div>

        {/* Compatibility issues */}
        {!compatible && build.compatibility.issues.length > 0 && (
          <div
            style={{
              padding: "8px 10px",
              borderRadius: "8px",
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.2)",
              fontSize: "11px",
              color: "#fca5a5",
              lineHeight: 1.4,
            }}
          >
            ⚠ {build.compatibility.issues[0]}
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: "flex", gap: "8px", marginTop: "auto" }}>
          <button
            onClick={() => router.push(`/builds/${build._id}`)}
            style={{
              flex: 2,
              padding: "10px 0",
              borderRadius: "9px",
              background: hovered
                ? "linear-gradient(135deg, rgba(0,212,255,0.2), rgba(0,212,255,0.1))"
                : "rgba(0,212,255,0.1)",
              border: "1px solid rgba(0,212,255,0.3)",
              color: "var(--cyan)",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.06em",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            View Build
          </button>
          <button
            onClick={handleClone}
            style={{
              flex: 1,
              padding: "10px 0",
              borderRadius: "9px",
              background: "rgba(124,58,237,0.12)",
              border: "1px solid rgba(124,58,237,0.3)",
              color: "#a78bfa",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.06em",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            Clone
          </button>
        </div>
      </div>
    </article>
  );
}

// ─── My Builds empty / sign-in prompt ────────────────────────────────────────

function SignInPrompt() {
  return (
    <div
      style={{
        gridColumn: "1 / -1",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 24px",
        textAlign: "center",
        background: "var(--bg-card)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "20px",
        backdropFilter: "blur(16px)",
      }}
    >
      <div
        style={{
          width: "64px",
          height: "64px",
          borderRadius: "50%",
          background:
            "linear-gradient(135deg, rgba(0,212,255,0.15), rgba(124,58,237,0.15))",
          border: "1px solid var(--border-badge)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "24px",
          fontSize: "28px",
        }}
      >
        🔒
      </div>
      <h3
        style={{
          fontSize: "20px",
          fontWeight: 800,
          color: "var(--text-primary)",
          margin: "0 0 10px",
        }}
      >
        Sign in to see your builds
      </h3>
      <p
        style={{
          fontSize: "14px",
          color: "var(--text-secondary)",
          maxWidth: "360px",
          lineHeight: 1.6,
          margin: "0 0 32px",
        }}
      >
        Create an account to save, share, and clone your custom PC
        configurations. It&apos;s free.
      </p>
      <button
        onClick={() => signIn(undefined, { callbackUrl: "/builds" })}
        style={{
          padding: "12px 32px",
          borderRadius: "10px",
          background: "var(--cyan)",
          border: "none",
          color: "#020408",
          fontSize: "13px",
          fontWeight: 800,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          cursor: "pointer",
          transition: "all 0.2s",
          boxShadow: "0 0 24px var(--cyan-glow)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = "0.85";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = "1";
        }}
      >
        Sign in Free
      </button>
    </div>
  );
}

// ─── Normalise backend build → IBuild ────────────────────────────────────────
// Backend shape:  { components: { cpu: ObjectId, ram: ObjectId[], ... }, isCompatible, compatibilityIssues, user: ObjectId }
// Frontend shape: { components: { category, part }[], compatibility: { isCompatible, issues } }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normaliseApiBuild(raw: any): IBuild {
  const comps = raw.components ?? {};
  const componentList: { category: string; part: IPart }[] = [];

  const singles = ["cpu", "gpu", "motherboard", "psu", "case", "cooler"] as const;
  for (const key of singles) {
    if (comps[key] && typeof comps[key] === "object") {
      componentList.push({ category: key, part: comps[key] as IPart });
    }
  }
  for (const part of (comps.ram ?? []) as IPart[]) {
    if (part && typeof part === "object") componentList.push({ category: "ram", part });
  }
  for (const part of (comps.storage ?? []) as IPart[]) {
    if (part && typeof part === "object") componentList.push({ category: "storage", part });
  }

  return {
    _id:         raw._id,
    name:        raw.name ?? "Untitled",
    user:        typeof raw.user === "object" && raw.user !== null
                   ? raw.user
                   : { _id: String(raw.user), name: "Unknown" },
    components:  componentList,
    totalPrice:  raw.totalPrice ?? 0,
    totalWattage: raw.totalWattage ?? 0,
    isPublic:    raw.isPublic ?? false,
    compatibility: {
      isCompatible: raw.isCompatible ?? true,
      issues:       raw.compatibilityIssues ?? [],
    },
    createdAt:   raw.createdAt ?? new Date().toISOString(),
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BuildsPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<"community" | "mine">("community");
  const [communityBuilds, setCommunityBuilds] = useState<IBuild[]>(MOCK_BUILDS);
  const [myBuilds, setMyBuilds] = useState<IBuild[]>([]);
  const [loadingCommunity, setLoadingCommunity] = useState(false);
  const [loadingMine, setLoadingMine] = useState(false);

  // Total stats
  const totalBuilds = communityBuilds.length;
  const compatCount = communityBuilds.filter(
    (b) => b.compatibility.isCompatible,
  ).length;
  const compatPct =
    totalBuilds > 0 ? Math.round((compatCount / totalBuilds) * 100) : 0;
  const avgPrice =
    totalBuilds > 0
      ? Math.round(
          communityBuilds.reduce((s, b) => s + b.totalPrice, 0) / totalBuilds,
        )
      : 0;

  // Fetch community builds
  useEffect(() => {
    setLoadingCommunity(true);
    api
      .get("/api/builds/public", { params: { page: 1, limit: 20 } })
      .then((res) => {
        if (res.data?.success && Array.isArray(res.data?.data?.builds) && res.data.data.builds.length > 0) {
          setCommunityBuilds(res.data.data.builds.map(normaliseApiBuild));
        }
        // If API returns empty, keep mock builds so the page isn't blank
      })
      .catch(() => {
        // Backend unavailable — mock data stays
      })
      .finally(() => setLoadingCommunity(false));
  }, []);

  // Fetch my builds when logged in and tab is active
  useEffect(() => {
    if (!session || activeTab !== "mine") return;
    setLoadingMine(true);
    api
      .get("/api/builds/mine")
      .then((res) => {
        if (res.data?.success && Array.isArray(res.data?.data)) {
          setMyBuilds(res.data.data.map(normaliseApiBuild));
        }
      })
      .catch(() => {
        // Backend unavailable — show empty state
      })
      .finally(() => setLoadingMine(false));
  }, [session, activeTab]);

  const displayedBuilds =
    activeTab === "community" ? communityBuilds : myBuilds;
  const isLoading = activeTab === "community" ? loadingCommunity : loadingMine;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-void)",
        color: "var(--text-primary)",
      }}
    >
      <Navbar />

      {/* ── Hero Section ─────────────────────────────────────────────────────── */}
      <div
        style={{
          position: "relative",
          paddingTop: "56px", // navbar offset
          background: "var(--bg-void)",
          overflow: "hidden",
        }}
      >
        {/* Background photo collage */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            opacity: 0.12,
          }}
        >
          {BUILD_PHOTOS.map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ))}
        </div>
        {/* Gradient over collage */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(2,4,8,0.6) 0%, var(--bg-void) 100%)",
          }}
        />
        {/* Cyan radial */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,212,255,0.07) 0%, transparent 70%)",
          }}
        />

        <div
          style={{
            position: "relative",
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "60px 20px 48px",
            textAlign: "center",
          }}
        >
          {/* Badge */}
          <div
            className="animate-boot-fade"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "4px 14px",
              borderRadius: "20px",
              background: "var(--bg-badge)",
              border: "1px solid var(--border-badge)",
              color: "var(--cyan)",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginBottom: "20px",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "var(--neon-green)",
                boxShadow: "0 0 6px var(--neon-green)",
                display: "block",
              }}
            />
            Community Showcase
          </div>

          <h1
            className="animate-slide-up"
            style={{
              fontSize: "clamp(32px, 6vw, 56px)",
              fontWeight: 900,
              margin: "0 0 16px",
              letterSpacing: "-0.025em",
              lineHeight: 1.05,
            }}
          >
            <span style={{ color: "var(--text-primary)" }}>Community </span>
            <span
              style={{
                background:
                  "linear-gradient(135deg, var(--cyan) 0%, var(--violet) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Builds
            </span>
          </h1>

          <p
            className="animate-slide-up delay-100"
            style={{
              fontSize: "16px",
              color: "var(--text-secondary)",
              maxWidth: "520px",
              margin: "0 auto 40px",
              lineHeight: 1.6,
            }}
          >
            Explore builds from the PC Banao community. Clone any config and
            make it your own in seconds.
          </p>

          {/* Stats row */}
          <div
            className="animate-slide-up delay-200"
            style={{
              display: "inline-flex",
              gap: "0",
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "14px",
              overflow: "hidden",
              backdropFilter: "blur(16px)",
            }}
          >
            {[
              {
                value: totalBuilds.toString(),
                label: "Total Builds",
                color: "var(--cyan)",
              },
              {
                value: `${compatPct}%`,
                label: "Compatible",
                color: "var(--neon-green)",
              },
              {
                value: `$${avgPrice.toLocaleString()}`,
                label: "Avg Price",
                color: "#a78bfa",
              },
            ].map(({ value, label, color }, i) => (
              <div
                key={label}
                style={{
                  padding: "16px 28px",
                  borderRight:
                    i < 2 ? "1px solid var(--border-divider)" : "none",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: 800,
                    color,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {value}
                </div>
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: 600,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--text-muted)",
                    marginTop: "4px",
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tab Bar ──────────────────────────────────────────────────────────── */}
      <div
        style={{
          position: "sticky",
          top: "56px",
          zIndex: 30,
          background: "rgba(2,4,8,0.9)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--border-divider)",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 20px",
            display: "flex",
            gap: "0",
          }}
        >
          {[
            { key: "community" as const, label: "Community", emoji: "🌐" },
            { key: "mine" as const, label: "My Builds", emoji: "🛠" },
          ].map(({ key, label, emoji }) => {
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "16px 20px",
                  background: "transparent",
                  border: "none",
                  borderBottom: `2px solid ${isActive ? "var(--cyan)" : "transparent"}`,
                  color: isActive ? "var(--cyan)" : "var(--text-secondary)",
                  fontSize: "13px",
                  fontWeight: isActive ? 700 : 500,
                  letterSpacing: "0.05em",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  marginBottom: "-1px",
                }}
              >
                <span>{emoji}</span>
                {label}
                {key === "mine" && status !== "loading" && !session && (
                  <span
                    style={{
                      fontSize: "9px",
                      padding: "1px 6px",
                      borderRadius: "10px",
                      background: "rgba(124,58,237,0.2)",
                      border: "1px solid rgba(124,58,237,0.35)",
                      color: "#a78bfa",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                    }}
                  >
                    Sign in
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Build Grid ───────────────────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "40px 20px 80px",
        }}
      >
        {/* My Builds — not signed in */}
        {activeTab === "mine" && status !== "loading" && !session ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
              gap: "24px",
            }}
          >
            <SignInPrompt />
          </div>
        ) : isLoading ? (
          /* Loading skeletons */
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
              gap: "24px",
            }}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                style={{
                  height: "460px",
                  borderRadius: "16px",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-subtle)",
                  animation: "pulseGlow 1.5s ease-in-out infinite",
                }}
              />
            ))}
          </div>
        ) : activeTab === "mine" && displayedBuilds.length === 0 ? (
          /* My Builds — signed in but no builds yet */
          <div
            style={{
              textAlign: "center",
              padding: "80px 24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "20px" }}>🛠</div>
            <h3
              style={{
                fontSize: "20px",
                fontWeight: 700,
                color: "var(--text-primary)",
                margin: "0 0 10px",
              }}
            >
              No builds yet
            </h3>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "14px",
                maxWidth: "340px",
                lineHeight: 1.6,
              }}
            >
              Head to the Builder to create your first custom PC configuration.
            </p>
            <a
              href="/builder"
              style={{
                marginTop: "28px",
                padding: "12px 28px",
                borderRadius: "10px",
                background: "var(--cyan)",
                color: "#020408",
                fontSize: "13px",
                fontWeight: 800,
                letterSpacing: "0.08em",
                textDecoration: "none",
                textTransform: "uppercase",
              }}
            >
              Start Building
            </a>
          </div>
        ) : (
          <>
            {/* Section header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "28px",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                  }}
                >
                  {activeTab === "community"
                    ? "Featured Builds"
                    : "Your Configurations"}
                </h2>
                <p
                  style={{
                    margin: "4px 0 0",
                    fontSize: "13px",
                    color: "var(--text-muted)",
                  }}
                >
                  {displayedBuilds.length} build
                  {displayedBuilds.length !== 1 ? "s" : ""} shown
                </p>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 12px",
                    borderRadius: "8px",
                    background: "rgba(0,255,136,0.08)",
                    border: "1px solid rgba(0,255,136,0.2)",
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "var(--neon-green)",
                  }}
                >
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "var(--neon-green)",
                      boxShadow: "0 0 6px var(--neon-green)",
                      display: "block",
                    }}
                  />
                  {compatCount} Compatible
                </span>
              </div>
            </div>

            {/* Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
                gap: "24px",
              }}
            >
              {displayedBuilds.map((build, i) => (
                <BuildCard key={build._id} build={build} index={i} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
