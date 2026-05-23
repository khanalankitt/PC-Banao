"use client";

import { useState, useEffect, useMemo } from "react";
import Navbar from "@/components/landing/Navbar";
import api from "@/lib/api/axios";

// ─── Types ────────────────────────────────────────────────────────────────────

type Category =
  | "cpu"
  | "gpu"
  | "motherboard"
  | "ram"
  | "storage"
  | "psu"
  | "case"
  | "cooler";

interface IPart {
  _id: string;
  name: string;
  brand: string;
  category: Category;
  price: number;
  stock: number;
  images: string[];
  specs: Record<string, unknown>;
  wattage?: number;
}

type SortKey = "price-asc" | "price-desc" | "name-asc";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_PRODUCTS: IPart[] = [
  {
    _id: "m1",
    name: "Ryzen 9 7950X",
    brand: "AMD",
    category: "cpu",
    price: 699,
    stock: 14,
    images: [],
    specs: {
      cores: 16,
      threads: 32,
      baseClock: "4.5 GHz",
      boostClock: "5.7 GHz",
      tdp: "170W",
      socket: "AM5",
    },
    wattage: 170,
  },
  {
    _id: "m2",
    name: "Core i9-13900K",
    brand: "Intel",
    category: "cpu",
    price: 589,
    stock: 9,
    images: [],
    specs: {
      cores: 24,
      threads: 32,
      baseClock: "3.0 GHz",
      boostClock: "5.8 GHz",
      tdp: "125W",
      socket: "LGA1700",
    },
    wattage: 125,
  },
  {
    _id: "m3",
    name: "Ryzen 5 7600X",
    brand: "AMD",
    category: "cpu",
    price: 249,
    stock: 22,
    images: [],
    specs: {
      cores: 6,
      threads: 12,
      baseClock: "4.7 GHz",
      boostClock: "5.3 GHz",
      tdp: "105W",
      socket: "AM5",
    },
    wattage: 105,
  },
  {
    _id: "m4",
    name: "GeForce RTX 4090",
    brand: "NVIDIA",
    category: "gpu",
    price: 1599,
    stock: 4,
    images: [],
    specs: {
      vram: "24 GB GDDR6X",
      coreClock: "2230 MHz",
      boostClock: "2520 MHz",
      tdp: "450W",
      slot: "PCIe 4.0 x16",
    },
    wattage: 450,
  },
  {
    _id: "m5",
    name: "Radeon RX 7900 XTX",
    brand: "AMD",
    category: "gpu",
    price: 999,
    stock: 7,
    images: [],
    specs: {
      vram: "24 GB GDDR6",
      coreClock: "1900 MHz",
      boostClock: "2500 MHz",
      tdp: "355W",
      slot: "PCIe 4.0 x16",
    },
    wattage: 355,
  },
  {
    _id: "m6",
    name: "GeForce RTX 4070 Ti",
    brand: "NVIDIA",
    category: "gpu",
    price: 799,
    stock: 11,
    images: [],
    specs: {
      vram: "12 GB GDDR6X",
      coreClock: "2310 MHz",
      boostClock: "2610 MHz",
      tdp: "285W",
      slot: "PCIe 4.0 x16",
    },
    wattage: 285,
  },
  {
    _id: "m7",
    name: "ROG Crosshair X670E Hero",
    brand: "ASUS",
    category: "motherboard",
    price: 629,
    stock: 6,
    images: [],
    specs: {
      socket: "AM5",
      formFactor: "ATX",
      chipset: "X670E",
      memSlots: 4,
      maxMem: "128 GB",
      m2Slots: 5,
    },
  },
  {
    _id: "m8",
    name: "MPG Z790 Carbon WiFi",
    brand: "MSI",
    category: "motherboard",
    price: 469,
    stock: 8,
    images: [],
    specs: {
      socket: "LGA1700",
      formFactor: "ATX",
      chipset: "Z790",
      memSlots: 4,
      maxMem: "192 GB",
      m2Slots: 4,
    },
  },
  {
    _id: "m9",
    name: "Trident Z5 RGB 64 GB DDR5-6000",
    brand: "G.Skill",
    category: "ram",
    price: 219,
    stock: 18,
    images: [],
    specs: {
      capacity: "64 GB",
      type: "DDR5",
      speed: "6000 MHz",
      cas: "CL30",
      kit: "2×32 GB",
    },
  },
  {
    _id: "m10",
    name: "Vengeance DDR5-6200 32 GB",
    brand: "Corsair",
    category: "ram",
    price: 129,
    stock: 31,
    images: [],
    specs: {
      capacity: "32 GB",
      type: "DDR5",
      speed: "6200 MHz",
      cas: "CL36",
      kit: "2×16 GB",
    },
  },
  {
    _id: "m11",
    name: "990 Pro 2 TB NVMe SSD",
    brand: "Samsung",
    category: "storage",
    price: 179,
    stock: 25,
    images: [],
    specs: {
      capacity: "2 TB",
      interface: "PCIe 4.0 NVMe M.2",
      readSpeed: "7450 MB/s",
      writeSpeed: "6900 MB/s",
      formFactor: "M.2 2280",
    },
  },
  {
    _id: "m12",
    name: "FireCuda 530 4 TB NVMe",
    brand: "Seagate",
    category: "storage",
    price: 329,
    stock: 12,
    images: [],
    specs: {
      capacity: "4 TB",
      interface: "PCIe 4.0 NVMe M.2",
      readSpeed: "7300 MB/s",
      writeSpeed: "6900 MB/s",
      formFactor: "M.2 2280",
    },
  },
  {
    _id: "m13",
    name: "HX1200 Platinum 1200W",
    brand: "Corsair",
    category: "psu",
    price: 229,
    stock: 9,
    images: [],
    specs: {
      wattage: "1200W",
      efficiency: "80+ Platinum",
      modular: "Fully Modular",
      formFactor: "ATX",
    },
    wattage: 1200,
  },
  {
    _id: "m14",
    name: "Lian Li O11D EVO RGB",
    brand: "Lian Li",
    category: "case",
    price: 179,
    stock: 5,
    images: [],
    specs: {
      formFactor: "Mid Tower",
      motherboardSupport: "E-ATX/ATX/mATX/ITX",
      maxCoolerHeight: "167 mm",
      maxGPULength: "420 mm",
    },
  },
  {
    _id: "m15",
    name: "Kraken Elite 360 AIO",
    brand: "NZXT",
    category: "cooler",
    price: 269,
    stock: 0,
    images: [],
    specs: {
      type: "Liquid AIO",
      radiator: "360 mm",
      fans: "3×120 mm",
      socketSupport: "AM5/AM4/LGA1700",
      tdp: "400W+",
    },
    wattage: 25,
  },
];

// ─── Category config ──────────────────────────────────────────────────────────

const ALL_CATEGORIES: {
  key: "all" | Category;
  label: string;
  emoji: string;
}[] = [
  { key: "all", label: "All", emoji: "🖥️" },
  { key: "cpu", label: "CPU", emoji: "🧠" },
  { key: "gpu", label: "GPU", emoji: "🎮" },
  { key: "motherboard", label: "Motherboard", emoji: "🔌" },
  { key: "ram", label: "RAM", emoji: "💾" },
  { key: "storage", label: "Storage", emoji: "💿" },
  { key: "psu", label: "PSU", emoji: "⚡" },
  { key: "case", label: "Case", emoji: "📦" },
  { key: "cooler", label: "Cooler", emoji: "❄️" },
];

const CATEGORY_ACCENT: Record<string, string> = {
  cpu: "#00d4ff",
  gpu: "#7c3aed",
  motherboard: "#f59e0b",
  ram: "#10b981",
  storage: "#3b82f6",
  psu: "#f97316",
  case: "#ec4899",
  cooler: "#06b6d4",
};

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({ part }: { part: IPart }) {
  const [hovered, setHovered] = useState(false);
  const accent = CATEGORY_ACCENT[part.category] ?? "var(--cyan)";
  const inStock = part.stock > 0;

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "var(--bg-card-hover)" : "var(--bg-card)",
        border: `1px solid ${hovered ? accent + "55" : "var(--border-subtle)"}`,
        boxShadow: hovered
          ? `0 0 24px ${accent}22, 0 12px 40px rgba(0,0,0,0.5)`
          : "0 4px 16px rgba(0,0,0,0.3)",
        borderRadius: "12px",
        transform: hovered ? "translateY(-4px)" : "none",
        transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
        backdropFilter: "blur(16px)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Card top accent bar */}
      <div
        style={{
          height: "2px",
          background: `linear-gradient(90deg, ${accent}, transparent)`,
          opacity: hovered ? 1 : 0.4,
          transition: "opacity 0.25s",
        }}
      />

      {/* Image placeholder / icon area */}
      <div
        style={{
          height: "130px",
          background: `radial-gradient(ellipse at 50% 60%, ${accent}18 0%, transparent 70%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "52px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <span
          style={{
            filter: hovered ? "drop-shadow(0 0 12px " + accent + ")" : "none",
            transition: "filter 0.25s",
          }}
        >
          {ALL_CATEGORIES.find((c) => c.key === part.category)?.emoji ?? "🖥️"}
        </span>
        {/* Stock indicator top-right */}
        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            background: inStock ? "rgba(0,255,136,0.1)" : "rgba(239,68,68,0.1)",
            border: `1px solid ${inStock ? "rgba(0,255,136,0.3)" : "rgba(239,68,68,0.3)"}`,
            borderRadius: "20px",
            padding: "3px 8px",
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: inStock ? "var(--neon-green)" : "#ef4444",
              boxShadow: inStock
                ? "0 0 6px var(--neon-green)"
                : "0 0 6px #ef4444",
              display: "block",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: "10px",
              fontWeight: 600,
              color: inStock ? "var(--neon-green)" : "#ef4444",
              letterSpacing: "0.05em",
            }}
          >
            {inStock ? `${part.stock} left` : "Out of stock"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          padding: "16px 18px 18px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {/* Badges row */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          <span
            style={{
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "2px 8px",
              borderRadius: "4px",
              background: `${accent}18`,
              border: `1px solid ${accent}44`,
              color: accent,
            }}
          >
            {part.category}
          </span>
          <span
            style={{
              fontSize: "10px",
              fontWeight: 600,
              letterSpacing: "0.05em",
              padding: "2px 8px",
              borderRadius: "4px",
              background: "var(--bg-badge)",
              border: "1px solid var(--border-badge)",
              color: "var(--text-secondary)",
            }}
          >
            {part.brand}
          </span>
        </div>

        {/* Name */}
        <h3
          style={{
            fontSize: "14px",
            fontWeight: 700,
            color: "var(--text-primary)",
            lineHeight: 1.3,
            margin: 0,
          }}
        >
          {part.name}
        </h3>

        {/* Specs snippet */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {Object.entries(part.specs)
            .slice(0, 3)
            .map(([k, v]) => (
              <span
                key={k}
                style={{
                  fontSize: "10px",
                  color: "var(--text-muted)",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "4px",
                  padding: "2px 6px",
                }}
              >
                {String(v)}
              </span>
            ))}
        </div>

        {/* Price + wattage row */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginTop: "auto",
          }}
        >
          <div>
            <span
              style={{
                fontSize: "22px",
                fontWeight: 800,
                color: "var(--cyan)",
                textShadow: hovered ? "0 0 20px var(--cyan-glow)" : "none",
                transition: "text-shadow 0.25s",
                letterSpacing: "-0.02em",
              }}
            >
              ${part.price.toLocaleString()}
            </span>
          </div>
          {part.wattage && (
            <span
              style={{
                fontSize: "11px",
                color: "#f97316",
                background: "rgba(249,115,22,0.1)",
                border: "1px solid rgba(249,115,22,0.25)",
                borderRadius: "6px",
                padding: "2px 7px",
                fontWeight: 600,
              }}
            >
              ⚡ {part.wattage}W
            </span>
          )}
        </div>

        {/* CTA */}
        <button
          style={{
            width: "100%",
            padding: "9px 0",
            borderRadius: "8px",
            background: inStock
              ? hovered
                ? `linear-gradient(135deg, ${accent}cc, ${accent}88)`
                : `${accent}22`
              : "rgba(255,255,255,0.04)",
            border: `1px solid ${inStock ? accent + "55" : "rgba(255,255,255,0.08)"}`,
            color: inStock
              ? hovered
                ? "#020408"
                : accent
              : "var(--text-muted)",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            cursor: inStock ? "pointer" : "not-allowed",
            transition: "all 0.2s",
          }}
          disabled={!inStock}
        >
          {inStock ? "+ Add to Builder" : "Unavailable"}
        </button>
      </div>
    </article>
  );
}

// ─── Filter Sidebar content ───────────────────────────────────────────────────

function FilterContent({
  selectedCategory,
  setSelectedCategory,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  inStockOnly,
  setInStockOnly,
  categoryCounts,
}: {
  selectedCategory: "all" | Category;
  setSelectedCategory: (c: "all" | Category) => void;
  minPrice: string;
  setMinPrice: (v: string) => void;
  maxPrice: string;
  setMaxPrice: (v: string) => void;
  inStockOnly: boolean;
  setInStockOnly: (v: boolean) => void;
  categoryCounts: Record<string, number>;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* Category pills */}
      <div>
        <p
          style={{
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
            marginBottom: "12px",
          }}
        >
          Category
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {ALL_CATEGORIES.map(({ key, label, emoji }) => {
            const isActive = selectedCategory === key;
            const count =
              key === "all"
                ? (categoryCounts["_total"] ?? 0)
                : (categoryCounts[key] ?? 0);
            return (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  background: isActive ? "rgba(0,212,255,0.12)" : "transparent",
                  border: `1px solid ${isActive ? "var(--border-bright)" : "transparent"}`,
                  color: isActive ? "var(--cyan)" : "var(--text-secondary)",
                  fontSize: "13px",
                  fontWeight: isActive ? 700 : 500,
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.15s",
                  width: "100%",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                    e.currentTarget.style.color = "var(--text-primary)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "var(--text-secondary)";
                  }
                }}
              >
                <span style={{ fontSize: "16px", lineHeight: 1 }}>{emoji}</span>
                <span style={{ flex: 1 }}>{label}</span>
                <span
                  style={{
                    fontSize: "11px",
                    padding: "1px 7px",
                    borderRadius: "20px",
                    background: isActive
                      ? "rgba(0,212,255,0.2)"
                      : "rgba(255,255,255,0.06)",
                    color: isActive ? "var(--cyan)" : "var(--text-muted)",
                    fontWeight: 600,
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price range */}
      <div>
        <p
          style={{
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
            marginBottom: "12px",
          }}
        >
          Price Range
        </p>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            style={{
              flex: 1,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "8px",
              padding: "7px 10px",
              color: "var(--text-primary)",
              fontSize: "13px",
              outline: "none",
              width: "100%",
            }}
          />
          <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>
            –
          </span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            style={{
              flex: 1,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "8px",
              padding: "7px 10px",
              color: "var(--text-primary)",
              fontSize: "13px",
              outline: "none",
              width: "100%",
            }}
          />
        </div>
      </div>

      {/* In-stock toggle */}
      <div>
        <button
          onClick={() => setInStockOnly(!inStockOnly)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 0,
            width: "100%",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "20px",
              borderRadius: "10px",
              background: inStockOnly
                ? "var(--neon-green)"
                : "rgba(255,255,255,0.1)",
              border: `1px solid ${inStockOnly ? "var(--neon-green)" : "rgba(255,255,255,0.15)"}`,
              position: "relative",
              transition: "all 0.2s",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: "14px",
                height: "14px",
                borderRadius: "50%",
                background: "#fff",
                position: "absolute",
                top: "2px",
                left: inStockOnly ? "18px" : "2px",
                transition: "left 0.2s",
                boxShadow: "0 1px 4px rgba(0,0,0,0.4)",
              }}
            />
          </div>
          <span
            style={{
              fontSize: "13px",
              fontWeight: 500,
              color: "var(--text-secondary)",
            }}
          >
            In Stock Only
          </span>
        </button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CatalogPage() {
  const [products, setProducts] = useState<IPart[]>(MOCK_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"all" | Category>(
    "all",
  );
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("price-asc");
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const ITEMS_PER_PAGE = 9;

  // Try real API, fall back to mocks
  useEffect(() => {
    setLoading(true);
    const params: Record<string, string> = { page: "1", limit: "100" };
    if (selectedCategory !== "all") params.category = selectedCategory;
    if (search) params.search = search;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (inStockOnly) params.inStock = "true";

    api
      .get("/api/products", { params })
      .then((res) => {
        if (res.data?.success && Array.isArray(res.data?.data?.products)) {
          setProducts(res.data.data.products);
        }
      })
      .catch(() => {
        // Backend unavailable — mock data stays
      })
      .finally(() => setLoading(false));
  }, [selectedCategory, search, minPrice, maxPrice, inStockOnly]);

  // Client-side filtering (used for mock data)
  const filtered = useMemo(() => {
    let list = [...products];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      );
    }
    if (selectedCategory !== "all")
      list = list.filter((p) => p.category === selectedCategory);
    if (minPrice) list = list.filter((p) => p.price >= Number(minPrice));
    if (maxPrice) list = list.filter((p) => p.price <= Number(maxPrice));
    if (inStockOnly) list = list.filter((p) => p.stock > 0);

    if (sortKey === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sortKey === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sortKey === "name-asc")
      list.sort((a, b) => a.name.localeCompare(b.name));

    return list;
  }, [
    products,
    search,
    selectedCategory,
    minPrice,
    maxPrice,
    inStockOnly,
    sortKey,
  ]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  // Reset to page 1 on filter change
  useEffect(() => {
    setPage(1);
  }, [search, selectedCategory, minPrice, maxPrice, inStockOnly, sortKey]);

  const categoryCounts: Record<string, number> = useMemo(() => {
    const counts: Record<string, number> = { _total: products.length };
    for (const p of products) {
      counts[p.category] = (counts[p.category] ?? 0) + 1;
    }
    return counts;
  }, [products]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-void)",
        color: "var(--text-primary)",
      }}
    >
      <Navbar />

      {/* ── Hero Banner ──────────────────────────────────────────────────────── */}
      <div
        style={{
          position: "relative",
          height: "280px",
          overflow: "hidden",
          marginTop: "56px", // navbar height
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&q=80&fit=crop"
          alt="PC components circuit board"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            opacity: 60,
          }}
        />
        {/* Dark overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, rgba(2,4,8,0.85) 0%, rgba(2,4,8,0.6) 50%, rgba(8,13,20,0.9) 100%)",
          }}
        />
        {/* Cyan tint overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 30% 50%, rgba(0,212,255,0.08) 0%, transparent 60%)",
          }}
        />
        {/* Bottom fade */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "80px",
            background:
              "linear-gradient(to bottom, transparent, var(--bg-void))",
          }}
        />

        {/* Hero text */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 32px",
            maxWidth: "960px",
            margin: "0 auto",
            left: 0,
            right: 0,
          }}
        >
          <div
            className="animate-boot-fade"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "4px 12px",
              borderRadius: "20px",
              background: "var(--bg-badge)",
              border: "1px solid var(--border-badge)",
              color: "var(--cyan)",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginBottom: "16px",
              width: "fit-content",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "var(--neon-green)",
                boxShadow: "0 0 6px var(--neon-green)",
              }}
            />
            {filtered.length} Components Available
          </div>
          <h1
            className="animate-slide-up"
            style={{
              fontSize: "clamp(28px, 5vw, 48px)",
              fontWeight: 900,
              margin: 0,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            <span style={{ color: "var(--text-primary)" }}>Browse </span>
            <span
              style={{
                background:
                  "linear-gradient(135deg, var(--cyan) 0%, var(--violet) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Components
            </span>
          </h1>
          <p
            className="animate-slide-up delay-100"
            style={{
              color: "var(--text-secondary)",
              fontSize: "15px",
              marginTop: "10px",
              maxWidth: "480px",
            }}
          >
            Curated parts for every build type — gaming, workstation, content
            creation, and beyond.
          </p>
        </div>
      </div>

      {/* ── Main layout ──────────────────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "32px 20px 80px",
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr)",
          gap: "28px",
        }}
        className="lg-layout"
      >
        {/* Search + Sort bar */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {/* Search */}
          <div
            style={{
              position: "relative",
              flex: "1 1 280px",
              minWidth: "200px",
            }}
          >
            <svg
              style={{
                position: "absolute",
                left: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)",
              }}
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <circle
                cx="7"
                cy="7"
                r="5"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M11 11l3 3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <input
              type="text"
              placeholder="Search components, brands..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                background: "var(--bg-card)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "10px",
                padding: "11px 14px 11px 40px",
                color: "var(--text-primary)",
                fontSize: "14px",
                outline: "none",
                backdropFilter: "blur(16px)",
              }}
            />
          </div>

          {/* Sort */}
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "10px",
              padding: "11px 14px",
              color: "var(--text-secondary)",
              fontSize: "13px",
              outline: "none",
              cursor: "pointer",
              minWidth: "180px",
            }}
          >
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="name-asc">Name: A → Z</option>
          </select>

          {/* Mobile filter toggle */}
          <button
            onClick={() => setFilterOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "10px",
              padding: "11px 16px",
              color: "var(--text-secondary)",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
            className="lg-hide"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M2 4h12M4 8h8M6 12h4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            Filters
          </button>

          {/* Count */}
          <p
            style={{
              fontSize: "13px",
              color: "var(--text-muted)",
              marginLeft: "auto",
              whiteSpace: "nowrap",
            }}
          >
            Showing{" "}
            <span style={{ color: "var(--cyan)", fontWeight: 700 }}>
              {Math.min(paginated.length, filtered.length)}
            </span>{" "}
            of{" "}
            <span style={{ color: "var(--text-secondary)", fontWeight: 600 }}>
              {filtered.length}
            </span>{" "}
            components
          </p>
        </div>

        {/* Sidebar + Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "220px 1fr",
            gap: "28px",
            alignItems: "start",
          }}
        >
          {/* ── Desktop Sidebar ─────────────────────────────────────────────── */}
          <aside
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "14px",
              padding: "24px 18px",
              backdropFilter: "blur(16px)",
              position: "sticky",
              top: "76px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "24px",
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--text-secondary)",
                }}
              >
                Filters
              </span>
              {(selectedCategory !== "all" ||
                minPrice ||
                maxPrice ||
                inStockOnly) && (
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setMinPrice("");
                    setMaxPrice("");
                    setInStockOnly(false);
                  }}
                  style={{
                    fontSize: "11px",
                    color: "var(--cyan)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  Reset
                </button>
              )}
            </div>
            <FilterContent
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              minPrice={minPrice}
              setMinPrice={setMinPrice}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              inStockOnly={inStockOnly}
              setInStockOnly={setInStockOnly}
              categoryCounts={categoryCounts}
            />
          </aside>

          {/* ── Product Grid ─────────────────────────────────────────────────── */}
          <div>
            {loading ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                  gap: "20px",
                }}
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      height: "340px",
                      borderRadius: "12px",
                      background: "var(--bg-card)",
                      border: "1px solid var(--border-subtle)",
                      animation: "pulseGlow 1.5s ease-in-out infinite",
                    }}
                  />
                ))}
              </div>
            ) : paginated.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "80px 0",
                  color: "var(--text-muted)",
                }}
              >
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
                <p
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "var(--text-secondary)",
                  }}
                >
                  No components match your filters
                </p>
                <p style={{ fontSize: "13px", marginTop: "8px" }}>
                  Try adjusting your search or category filters
                </p>
              </div>
            ) : (
              <>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(240px, 1fr))",
                    gap: "20px",
                  }}
                >
                  {paginated.map((part) => (
                    <ProductCard key={part._id} part={part} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      justifyContent: "center",
                      marginTop: "40px",
                      flexWrap: "wrap",
                    }}
                  >
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      style={{
                        padding: "8px 16px",
                        borderRadius: "8px",
                        background: "var(--bg-card)",
                        border: "1px solid var(--border-subtle)",
                        color:
                          page === 1
                            ? "var(--text-muted)"
                            : "var(--text-secondary)",
                        cursor: page === 1 ? "not-allowed" : "pointer",
                        fontSize: "13px",
                      }}
                    >
                      ← Prev
                    </button>
                    {Array.from({ length: totalPages }).map((_, i) => {
                      const p = i + 1;
                      const isActive = p === page;
                      return (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "8px",
                            background: isActive
                              ? "rgba(0,212,255,0.15)"
                              : "var(--bg-card)",
                            border: `1px solid ${isActive ? "var(--border-bright)" : "var(--border-subtle)"}`,
                            color: isActive
                              ? "var(--cyan)"
                              : "var(--text-secondary)",
                            cursor: "pointer",
                            fontSize: "13px",
                            fontWeight: isActive ? 700 : 400,
                          }}
                        >
                          {p}
                        </button>
                      );
                    })}
                    <button
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page === totalPages}
                      style={{
                        padding: "8px 16px",
                        borderRadius: "8px",
                        background: "var(--bg-card)",
                        border: "1px solid var(--border-subtle)",
                        color:
                          page === totalPages
                            ? "var(--text-muted)"
                            : "var(--text-secondary)",
                        cursor: page === totalPages ? "not-allowed" : "pointer",
                        fontSize: "13px",
                      }}
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile Filter Drawer ──────────────────────────────────────────────── */}
      {filterOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setFilterOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(2,4,8,0.75)",
              backdropFilter: "blur(4px)",
              zIndex: 50,
            }}
          />
          {/* Drawer */}
          <div
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              background: "var(--bg-surface)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "20px 20px 0 0",
              padding: "24px 20px 40px",
              zIndex: 60,
              maxHeight: "85vh",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700 }}>
                Filters
              </h3>
              <button
                onClick={() => setFilterOpen(false)}
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  padding: "6px 12px",
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                  fontSize: "13px",
                }}
              >
                Done
              </button>
            </div>
            <FilterContent
              selectedCategory={selectedCategory}
              setSelectedCategory={(c) => {
                setSelectedCategory(c);
                setFilterOpen(false);
              }}
              minPrice={minPrice}
              setMinPrice={setMinPrice}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              inStockOnly={inStockOnly}
              setInStockOnly={setInStockOnly}
              categoryCounts={categoryCounts}
            />
          </div>
        </>
      )}

      {/* Inline responsive styles */}
      <style>{`
        @media (max-width: 900px) {
          .lg-layout {
            grid-template-columns: minmax(0,1fr) !important;
          }
          .lg-layout > div:nth-child(2) {
            grid-template-columns: minmax(0,1fr) !important;
          }
          .lg-layout > div:nth-child(2) > aside {
            display: none !important;
          }
        }
        @media (min-width: 901px) {
          .lg-hide { display: none !important; }
        }
      `}</style>
    </div>
  );
}
