"use client";

import { useState, useMemo, ReactElement } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/landing/Navbar";
import { useProducts } from "@/lib/queries/productQueries";
import { useBuilderStore } from "@/store/builderStore";
import type { SlotKey } from "@/store/builderStore";
import type { RawProduct } from "@/lib/api/serverFetch";

// ─── Types ────────────────────────────────────────────────────────────────────

type Category = "cpu" | "gpu" | "motherboard" | "ram" | "storage" | "psu" | "case" | "cooler";

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

// ─── SVG Icons ────────────────────────────────────────────────────────────────

function IconCPU({ size = 18, color = "currentColor" }: { size?: number; color?: string }): ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="6" width="12" height="12" rx="2" />
      <path d="M9 6V3M12 6V3M15 6V3M9 21v-3M12 21v-3M15 21v-3M6 9H3M6 12H3M6 15H3M21 9h-3M21 12h-3M21 15h-3" />
    </svg>
  );
}
function IconGPU({ size = 18, color = "currentColor" }: { size?: number; color?: string }): ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="12" rx="2" />
      <path d="M6 7V5M10 7V5M14 7V5M18 7V5" />
      <circle cx="8" cy="13" r="2" /><circle cx="14" cy="13" r="2" />
      <path d="M18 13h1M4 13h1" />
    </svg>
  );
}
function IconMotherboard({ size = 18, color = "currentColor" }: { size?: number; color?: string }): ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="2" />
      <rect x="5" y="5" width="6" height="6" rx="1" />
      <rect x="13" y="5" width="6" height="3" rx="0.5" />
      <rect x="13" y="10" width="6" height="3" rx="0.5" />
      <path d="M5 14h4M5 17h4M5 20h14" strokeWidth="1" />
    </svg>
  );
}
function IconRAM({ size = 18, color = "currentColor" }: { size?: number; color?: string }): ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      <path d="M7 5V3M10 5V3M14 5V3M17 5V3" />
      <path d="M7 9h2M11 9h2M15 9h2" strokeWidth="1.2" />
      <path d="M7 13h2M11 13h2M15 13h2" strokeWidth="1.2" />
    </svg>
  );
}
function IconStorage({ size = 18, color = "currentColor" }: { size?: number; color?: string }): ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="8" width="20" height="8" rx="2" />
      <circle cx="18" cy="12" r="1.5" />
      <path d="M5 10h8M5 14h5" strokeWidth="1.2" />
    </svg>
  );
}
function IconPSU({ size = 18, color = "currentColor" }: { size?: number; color?: string }): ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L4 14h7l-1 8 9-12h-7l2-8z" />
    </svg>
  );
}
function IconCase({ size = 18, color = "currentColor" }: { size?: number; color?: string }): ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <path d="M9 6h6M9 10h6M9 14h6" strokeWidth="1.2" />
      <circle cx="12" cy="18" r="1" />
    </svg>
  );
}
function IconCooler({ size = 18, color = "currentColor" }: { size?: number; color?: string }): ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" />
    </svg>
  );
}
function IconAll({ size = 18, color = "currentColor" }: { size?: number; color?: string }): ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}
function IconSearch({ color = "currentColor" }: { color?: string }): ReactElement {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <circle cx="7" cy="7" r="5" stroke={color} strokeWidth="1.5" />
      <path d="M11 11l3 3" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ─── Category config ──────────────────────────────────────────────────────────

type CatConfig = {
  key: "all" | Category;
  label: string;
  accent: string;
  Icon: (p: { size?: number; color?: string }) => ReactElement;
};

const ALL_CATEGORIES: CatConfig[] = [
  { key: "all",         label: "All Parts",   accent: "#94a3b8", Icon: IconAll         },
  { key: "cpu",         label: "CPU",          accent: "#22d3ee", Icon: IconCPU         },
  { key: "gpu",         label: "GPU",          accent: "#a78bfa", Icon: IconGPU         },
  { key: "motherboard", label: "Motherboard",  accent: "#fbbf24", Icon: IconMotherboard },
  { key: "ram",         label: "RAM",          accent: "#34d399", Icon: IconRAM         },
  { key: "storage",     label: "Storage",      accent: "#60a5fa", Icon: IconStorage     },
  { key: "psu",         label: "PSU",          accent: "#fb923c", Icon: IconPSU         },
  { key: "case",        label: "Case",         accent: "#f472b6", Icon: IconCase        },
  { key: "cooler",      label: "Cooler",       accent: "#67e8f9", Icon: IconCooler      },
];

const CAT_MAP: Record<string, CatConfig> = Object.fromEntries(
  ALL_CATEGORIES.map((c) => [c.key, c])
);


// ─── Spec highlight: pick the 2-3 most useful specs per category ──────────────

function keySpecs(part: IPart): { label: string; value: string }[] {
  const e = part.specs;
  const pick = (...keys: string[]): { label: string; value: string }[] =>
    keys.flatMap((k) => (e[k] !== undefined ? [{ label: k, value: String(e[k]) }] : []));

  switch (part.category) {
    case "cpu":         return pick("Cores", "Boost Clock", "Socket");
    case "gpu":         return pick("VRAM", "Boost Clock", "TDP");
    case "motherboard": return pick("Socket", "Chipset", "Form");
    case "ram":         return pick("Capacity", "Speed", "Type");
    case "storage":     return pick("Capacity", "Read", "Interface");
    case "psu":         return pick("Wattage", "Efficiency", "Modular");
    case "case":        return pick("Form", "MB Support", "Max GPU");
    case "cooler":      return pick("Type", "Radiator", "Sockets");
    default:            return Object.entries(e).slice(0, 3).map(([k, v]) => ({ label: k, value: String(v) }));
  }
}

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({ part }: { part: IPart }) {
  const [hovered, setHovered] = useState(false);
  const cat = CAT_MAP[part.category];
  const accent = cat?.accent ?? "#22d3ee";
  const inStock = part.stock > 0;
  const setPart = useBuilderStore((s) => s.setPart);
  const router = useRouter();

  function handleAddToBuilder() {
    setPart(part.category as SlotKey, part);
    router.push("/builder");
  }

  const specs = keySpecs(part);

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#090e18",
        border: `1px solid ${hovered ? "rgba(255,255,255,0.13)" : "rgba(255,255,255,0.07)"}`,
        borderRadius: "14px",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 20px 52px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.05)"
          : "0 2px 14px rgba(0,0,0,0.35)",
        transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Accent bar */}
      <div style={{ height: "2px", background: `linear-gradient(90deg, ${accent} 0%, ${accent}30 60%, transparent 100%)`, flexShrink: 0 }} />

      {/* Icon area */}
      <div style={{
        height: "110px", flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: `radial-gradient(ellipse 60% 80% at 50% 100%, ${accent}0e 0%, transparent 100%)`,
        position: "relative",
      }}>
        <div style={{
          width: "52px", height: "52px", borderRadius: "14px",
          background: `${accent}12`, border: `1px solid ${accent}22`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: hovered ? accent : `${accent}99`,
          transition: "color 0.2s",
        }}>
          {cat && <cat.Icon size={24} />}
        </div>

        {/* Stock badge */}
        <div style={{
          position: "absolute", top: "10px", right: "10px",
          display: "flex", alignItems: "center", gap: "5px",
          padding: "3px 8px", borderRadius: "20px",
          background: inStock ? "rgba(52,211,153,0.1)" : "rgba(248,113,113,0.1)",
          border: `1px solid ${inStock ? "rgba(52,211,153,0.22)" : "rgba(248,113,113,0.22)"}`,
        }}>
          <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: inStock ? "#34d399" : "#f87171", display: "block", flexShrink: 0 }} />
          <span style={{ fontSize: "10px", fontWeight: 600, color: inStock ? "#34d399" : "#f87171" }}>
            {inStock ? `${part.stock} left` : "Out of stock"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "16px 18px 18px", flex: 1, display: "flex", flexDirection: "column", gap: "11px" }}>

        {/* Brand + category */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{
            fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
            padding: "2px 7px", borderRadius: "4px",
            background: `${accent}12`, border: `1px solid ${accent}28`, color: accent,
          }}>
            {part.category}
          </span>
          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>{part.brand}</span>
        </div>

        {/* Name */}
        <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#f0f8ff", lineHeight: 1.35, margin: 0 }}>
          {part.name}
        </h3>

        {/* Spec table */}
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          {specs.map(({ label, value }) => (
            <div key={label} style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
              <span style={{ fontSize: "10px", fontWeight: 600, color: "rgba(255,255,255,0.28)", letterSpacing: "0.06em", textTransform: "uppercase", minWidth: "52px", flexShrink: 0 }}>
                {label}
              </span>
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.65)", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* Price + wattage */}
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginTop: "auto", paddingTop: "4px" }}>
          <span style={{ fontSize: "22px", fontWeight: 900, color: "#f0f8ff", letterSpacing: "-0.03em" }}>
            ${part.price.toLocaleString()}
          </span>
          {part.wattage && (
            <span style={{ fontSize: "11px", fontWeight: 600, color: "#fb923c", padding: "2px 7px", borderRadius: "5px", background: "rgba(251,146,60,0.1)", border: "1px solid rgba(251,146,60,0.2)" }}>
              {part.wattage}W
            </span>
          )}
        </div>

        {/* CTA */}
        <button
          onClick={inStock ? handleAddToBuilder : undefined}
          disabled={!inStock}
          style={{
            width: "100%", padding: "9px 0", borderRadius: "8px",
            background: inStock
              ? hovered ? `linear-gradient(135deg, ${accent}cc, ${accent}99)` : `${accent}15`
              : "rgba(255,255,255,0.03)",
            border: `1px solid ${inStock ? (hovered ? accent + "99" : accent + "30") : "rgba(255,255,255,0.07)"}`,
            color: inStock ? (hovered ? "#020408" : accent) : "rgba(255,255,255,0.2)",
            fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em",
            textTransform: "uppercase", cursor: inStock ? "pointer" : "not-allowed",
            transition: "all 0.18s",
          }}
        >
          {inStock ? "Add to builder" : "Unavailable"}
        </button>
      </div>
    </article>
  );
}

// ─── Filter sidebar ───────────────────────────────────────────────────────────

interface FilterProps {
  selectedCategory: "all" | Category;
  setSelectedCategory: (c: "all" | Category) => void;
  minPrice: string; setMinPrice: (v: string) => void;
  maxPrice: string; setMaxPrice: (v: string) => void;
  inStockOnly: boolean; setInStockOnly: (v: boolean) => void;
  categoryCounts: Record<string, number>;
}

function FilterPanel(props: FilterProps) {
  const { selectedCategory, setSelectedCategory, minPrice, setMinPrice, maxPrice, setMaxPrice, inStockOnly, setInStockOnly, categoryCounts } = props;
  const hasFilters = selectedCategory !== "all" || minPrice || maxPrice || inStockOnly;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* Category list */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
          <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)" }}>
            Category
          </span>
          {hasFilters && (
            <button
              onClick={() => { setSelectedCategory("all"); setMinPrice(""); setMaxPrice(""); setInStockOnly(false); }}
              style={{ fontSize: "11px", color: "#22d3ee", background: "none", border: "none", cursor: "pointer", padding: 0, fontWeight: 600 }}
            >
              Reset
            </button>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {ALL_CATEGORIES.map(({ key, label, accent, Icon }) => {
            const isActive = selectedCategory === key;
            const count = key === "all" ? (categoryCounts["_total"] ?? 0) : (categoryCounts[key] ?? 0);
            return (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  padding: "8px 10px", borderRadius: "8px",
                  background: isActive ? `${accent}12` : "transparent",
                  border: `1px solid ${isActive ? accent + "30" : "transparent"}`,
                  color: isActive ? accent : "rgba(255,255,255,0.45)",
                  fontSize: "13px", fontWeight: isActive ? 700 : 400,
                  cursor: "pointer", textAlign: "left", transition: "all 0.12s", width: "100%",
                }}
                onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; } }}
                onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.45)"; } }}
              >
                <span style={{ color: isActive ? accent : "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", flexShrink: 0 }}>
                  <Icon size={14} />
                </span>
                <span style={{ flex: 1 }}>{label}</span>
                <span style={{
                  fontSize: "11px", padding: "1px 7px", borderRadius: "20px", fontWeight: 600,
                  background: isActive ? `${accent}18` : "rgba(255,255,255,0.05)",
                  color: isActive ? accent : "rgba(255,255,255,0.25)",
                }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: "1px", background: "rgba(255,255,255,0.05)" }} />

      {/* Price range */}
      <div>
        <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", display: "block", marginBottom: "10px" }}>
          Price Range
        </span>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <input
            type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)}
            style={{ flex: 1, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "7px", padding: "7px 10px", color: "#f0f8ff", fontSize: "12px", outline: "none", width: "100%" }}
          />
          <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "12px", flexShrink: 0 }}>–</span>
          <input
            type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}
            style={{ flex: 1, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "7px", padding: "7px 10px", color: "#f0f8ff", fontSize: "12px", outline: "none", width: "100%" }}
          />
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: "1px", background: "rgba(255,255,255,0.05)" }} />

      {/* In-stock toggle */}
      <button
        onClick={() => setInStockOnly(!inStockOnly)}
        style={{ display: "flex", alignItems: "center", gap: "12px", background: "transparent", border: "none", cursor: "pointer", padding: 0, width: "100%" }}
      >
        <div style={{
          width: "36px", height: "20px", borderRadius: "10px", position: "relative", transition: "background 0.2s", flexShrink: 0,
          background: inStockOnly ? "#34d399" : "rgba(255,255,255,0.08)",
        }}>
          <div style={{
            width: "14px", height: "14px", borderRadius: "50%", background: "#fff",
            position: "absolute", top: "3px", left: inStockOnly ? "19px" : "3px",
            transition: "left 0.18s", boxShadow: "0 1px 4px rgba(0,0,0,0.4)",
          }} />
        </div>
        <span style={{ fontSize: "13px", fontWeight: 500, color: inStockOnly ? "#f0f8ff" : "rgba(255,255,255,0.45)" }}>
          In stock only
        </span>
      </button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function toIPart(raw: RawProduct): IPart {
  return {
    _id: raw._id,
    name: raw.name,
    brand: raw.brand,
    category: raw.category as Category,
    price: raw.price,
    stock: raw.stock,
    images: raw.image ? [raw.image] : [],
    wattage: raw.wattage,
    specs: raw.specs as Record<string, unknown>,
  };
}

export default function CatalogClient({ initialProducts }: { initialProducts: RawProduct[] }) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"all" | Category>("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("price-asc");
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const ITEMS_PER_PAGE = 9;

  const hasFilters = !!(search || selectedCategory !== "all" || minPrice || maxPrice || inStockOnly);

  const queryParams = useMemo(() => ({
    ...(selectedCategory !== "all" && { category: selectedCategory as Category }),
    ...(search && { search }),
    ...(minPrice && { minPrice: Number(minPrice) }),
    ...(maxPrice && { maxPrice: Number(maxPrice) }),
    ...(inStockOnly && { inStock: true }),
    limit: 100,
  }), [selectedCategory, search, minPrice, maxPrice, inStockOnly]);

  const { data: queryData, isFetching: loading } = useProducts(queryParams);

  const products: IPart[] = useMemo(() => {
    if (hasFilters && queryData) return queryData.products;
    return initialProducts.map(toIPart);
  }, [hasFilters, queryData, initialProducts]);

  const filtered = useMemo(() => {
    const list = [...products];
    if (sortKey === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sortKey === "price-desc") list.sort((a, b) => b.price - a.price);
    else list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [products, sortKey]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // Reset to page 1 when filters/sort change
  const [prevFilters, setPrevFilters] = useState({ search, selectedCategory, minPrice, maxPrice, inStockOnly, sortKey });
  if (prevFilters.search !== search || prevFilters.selectedCategory !== selectedCategory ||
      prevFilters.minPrice !== minPrice || prevFilters.maxPrice !== maxPrice ||
      prevFilters.inStockOnly !== inStockOnly || prevFilters.sortKey !== sortKey) {
    setPrevFilters({ search, selectedCategory, minPrice, maxPrice, inStockOnly, sortKey });
    if (page !== 1) setPage(1);
  }

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { _total: products.length };
    for (const p of products) counts[p.category] = (counts[p.category] ?? 0) + 1;
    return counts;
  }, [products]);

  const filterProps: FilterProps = { selectedCategory, setSelectedCategory, minPrice, setMinPrice, maxPrice, setMaxPrice, inStockOnly, setInStockOnly, categoryCounts };

  const activeCat = CAT_MAP[selectedCategory];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-void)", color: "#f0f8ff" }}>
      <Navbar />

      {/* ── Page header ──────────────────────────────────────────────────────── */}
      <div style={{ marginTop: "56px", position: "relative", padding: "44px 24px 32px", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, rgba(0,212,255,0.2) 30%, rgba(124,58,237,0.2) 70%, transparent)" }} />
        </div>
        <div style={{ position: "relative", maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "20px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <div style={{ width: "3px", height: "22px", borderRadius: "2px", background: "linear-gradient(180deg, #22d3ee, #7c3aed)" }} />
                <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)" }}>
                  Parts Catalog
                </span>
              </div>
              <h1 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 900, margin: "0 0 8px", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
                {selectedCategory === "all" ? (
                  <>Browse <span style={{ background: "linear-gradient(135deg, #22d3ee, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>components</span></>
                ) : (
                  <span style={{ color: activeCat?.accent ?? "#22d3ee" }}>{activeCat?.label}</span>
                )}
              </h1>
              <p style={{ margin: 0, fontSize: "13px", color: "rgba(255,255,255,0.35)", lineHeight: 1.6 }}>
                {filtered.length} part{filtered.length !== 1 ? "s" : ""} available
                {selectedCategory !== "all" && " in this category"}
              </p>
            </div>

            {/* Build CTA */}
            <a href="/builder" style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "10px 20px", borderRadius: "8px", textDecoration: "none",
              background: "rgba(34,211,238,0.09)", border: "1px solid rgba(34,211,238,0.22)",
              color: "#22d3ee", fontSize: "12px", fontWeight: 700, letterSpacing: "0.06em",
              flexShrink: 0,
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Open Builder
            </a>
          </div>
        </div>
      </div>

      {/* ── Main layout ──────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px 80px", display: "grid", gridTemplateColumns: "minmax(0,1fr)", gap: "24px" }} className="cat-outer">

        {/* Search + sort bar */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
          {/* Search */}
          <div style={{ position: "relative", flex: "1 1 260px", minWidth: "180px" }}>
            <span style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.25)", pointerEvents: "none", display: "flex" }}>
              <IconSearch />
            </span>
            <input
              type="text" placeholder="Search by name or brand…" value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%", background: "#090e18", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "9px", padding: "10px 14px 10px 36px", color: "#f0f8ff", fontSize: "13px", outline: "none" }}
            />
          </div>

          {/* Sort */}
          <select
            value={sortKey} onChange={(e) => setSortKey(e.target.value as SortKey)}
            style={{ background: "#090e18", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "9px", padding: "10px 14px", color: "rgba(255,255,255,0.55)", fontSize: "13px", outline: "none", cursor: "pointer", minWidth: "170px" }}
          >
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
          </select>

          {/* Mobile filter button */}
          <button
            onClick={() => setFilterOpen(true)}
            className="cat-filter-btn"
            style={{ display: "flex", alignItems: "center", gap: "7px", background: "#090e18", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "9px", padding: "10px 14px", color: "rgba(255,255,255,0.5)", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            Filters
          </button>

          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)", marginLeft: "auto", whiteSpace: "nowrap" }}>
            {Math.min(paginated.length + (page - 1) * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
          </span>
        </div>

        {/* Sidebar + grid */}
        <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "24px", alignItems: "start" }} className="cat-inner">

          {/* Desktop sidebar */}
          <aside style={{ background: "#090e18", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "20px 14px", position: "sticky", top: "76px" }} className="cat-sidebar">
            <FilterPanel {...filterProps} />
          </aside>

          {/* Product grid */}
          <div>
            {loading ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: "16px" }}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} style={{ height: "320px", borderRadius: "14px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", animation: `pulseGlow 1.5s ease-in-out ${i * 80}ms infinite` }} />
                ))}
              </div>
            ) : paginated.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 0" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "rgba(255,255,255,0.2)" }}>
                  <IconSearch />
                </div>
                <p style={{ fontSize: "15px", fontWeight: 600, color: "rgba(255,255,255,0.5)", margin: "0 0 6px" }}>No components match your filters</p>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.25)", margin: 0 }}>Try adjusting your search or category</p>
              </div>
            ) : (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: "16px" }}>
                  {paginated.map((part) => <ProductCard key={part._id} part={part} />)}
                </div>

                {totalPages > 1 && (
                  <div style={{ display: "flex", gap: "6px", justifyContent: "center", marginTop: "36px", flexWrap: "wrap", alignItems: "center" }}>
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                      style={{ padding: "7px 14px", borderRadius: "7px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", color: page === 1 ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.55)", cursor: page === 1 ? "not-allowed" : "pointer", fontSize: "12px" }}
                    >
                      ← Prev
                    </button>
                    {Array.from({ length: totalPages }).map((_, i) => {
                      const p = i + 1;
                      const isA = p === page;
                      return (
                        <button key={p} onClick={() => setPage(p)}
                          style={{ width: "34px", height: "34px", borderRadius: "7px", background: isA ? "rgba(34,211,238,0.13)" : "rgba(255,255,255,0.03)", border: `1px solid ${isA ? "rgba(34,211,238,0.35)" : "rgba(255,255,255,0.07)"}`, color: isA ? "#22d3ee" : "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: "12px", fontWeight: isA ? 700 : 400 }}
                        >
                          {p}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                      style={{ padding: "7px 14px", borderRadius: "7px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", color: page === totalPages ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.55)", cursor: page === totalPages ? "not-allowed" : "pointer", fontSize: "12px" }}
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

      {/* ── Mobile filter drawer ──────────────────────────────────────────────── */}
      {filterOpen && (
        <>
          <div onClick={() => setFilterOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(2,4,8,0.8)", backdropFilter: "blur(6px)", zIndex: 50 }} />
          <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#0a1018", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px 16px 0 0", padding: "20px 20px 40px", zIndex: 60, maxHeight: "85vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "#f0f8ff" }}>Filters</h3>
              <button onClick={() => setFilterOpen(false)} style={{ padding: "6px 14px", borderRadius: "7px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: "12px", fontWeight: 600 }}>Done</button>
            </div>
            <FilterPanel {...filterProps} setSelectedCategory={(c) => { filterProps.setSelectedCategory(c); setFilterOpen(false); }} />
          </div>
        </>
      )}

      <style>{`
        @media (max-width: 860px) {
          .cat-inner { grid-template-columns: minmax(0,1fr) !important; }
          .cat-sidebar { display: none !important; }
          .cat-filter-btn { display: flex !important; }
        }
        @media (min-width: 861px) {
          .cat-filter-btn { display: none !important; }
        }
      `}</style>
    </div>
  );
}
