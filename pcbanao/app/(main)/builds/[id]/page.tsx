'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/landing/Navbar';
import api from '@/lib/api/axios';
import { useBuilderStore } from '@/store/builderStore';
import type { SlotKey } from '@/store/builderStore';

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

// ─── Mock builds (same as builds page) ───────────────────────────────────────

const MOCK_PARTS: IPart[] = [
  { _id: 'p1',  name: 'Ryzen 9 7950X',         brand: 'AMD',     category: 'cpu',         price: 699,  stock: 14, images: [], specs: { cores: 16, socket: 'AM5', tdp: '170W' },           wattage: 170 },
  { _id: 'p2',  name: 'RTX 4090',               brand: 'NVIDIA',  category: 'gpu',         price: 1599, stock: 4,  images: [], specs: { vram: '24 GB GDDR6X', tdp: '450W' },                wattage: 450 },
  { _id: 'p3',  name: 'ROG Crosshair X670E',    brand: 'ASUS',    category: 'motherboard', price: 629,  stock: 6,  images: [], specs: { socket: 'AM5', chipset: 'X670E' } },
  { _id: 'p4',  name: 'Trident Z5 64 GB DDR5',  brand: 'G.Skill', category: 'ram',         price: 219,  stock: 18, images: [], specs: { capacity: '64 GB', speed: '6000 MHz' } },
  { _id: 'p5',  name: '990 Pro 2 TB NVMe',       brand: 'Samsung', category: 'storage',     price: 179,  stock: 25, images: [], specs: { capacity: '2 TB', interface: 'PCIe 4.0' } },
  { _id: 'p6',  name: 'HX1200 Platinum 1200W',  brand: 'Corsair', category: 'psu',         price: 229,  stock: 9,  images: [], specs: { wattage: '1200W' },                               wattage: 1200 },
  { _id: 'p7',  name: 'O11D EVO RGB',            brand: 'Lian Li', category: 'case',        price: 179,  stock: 5,  images: [], specs: { formFactor: 'Mid Tower' } },
  { _id: 'p8',  name: 'Kraken Elite 360',        brand: 'NZXT',    category: 'cooler',      price: 269,  stock: 3,  images: [], specs: { type: 'Liquid AIO', radiator: '360 mm' },         wattage: 25 },
  { _id: 'p9',  name: 'Core i5-13600K',          brand: 'Intel',   category: 'cpu',         price: 299,  stock: 20, images: [], specs: { cores: 14, socket: 'LGA1700', tdp: '125W' },      wattage: 125 },
  { _id: 'p10', name: 'RTX 4070 Ti',             brand: 'NVIDIA',  category: 'gpu',         price: 799,  stock: 11, images: [], specs: { vram: '12 GB GDDR6X', tdp: '285W' },              wattage: 285 },
  { _id: 'p11', name: 'Vengeance 32 GB DDR5',   brand: 'Corsair', category: 'ram',         price: 129,  stock: 31, images: [], specs: { capacity: '32 GB', speed: '6200 MHz' } },
  { _id: 'p12', name: 'FireCuda 530 4 TB',       brand: 'Seagate', category: 'storage',     price: 329,  stock: 12, images: [], specs: { capacity: '4 TB', interface: 'PCIe 4.0' } },
  { _id: 'p13', name: 'FOCUS GX-850 850W',       brand: 'Seasonic',category: 'psu',         price: 149,  stock: 15, images: [], specs: { wattage: '850W' },                               wattage: 850 },
  { _id: 'p14', name: 'H9 Flow Mid Tower',       brand: 'NZXT',    category: 'case',        price: 129,  stock: 8,  images: [], specs: { formFactor: 'Mid Tower' } },
  { _id: 'p15', name: 'RX 7900 XTX',            brand: 'AMD',     category: 'gpu',         price: 999,  stock: 7,  images: [], specs: { vram: '24 GB GDDR6', tdp: '355W' },               wattage: 355 },
];

const MOCK_BUILDS: IBuild[] = [
  { _id: 'b1', name: 'Ryzen Titan',        user: { _id: 'u1', name: 'Alex Rivera',   image: 'https://i.pravatar.cc/40?img=11' }, components: [{ category: 'cpu', part: MOCK_PARTS[0] }, { category: 'gpu', part: MOCK_PARTS[1] }, { category: 'motherboard', part: MOCK_PARTS[2] }, { category: 'ram', part: MOCK_PARTS[3] }, { category: 'storage', part: MOCK_PARTS[4] }, { category: 'psu', part: MOCK_PARTS[5] }, { category: 'case', part: MOCK_PARTS[6] }, { category: 'cooler', part: MOCK_PARTS[7] }], totalPrice: 3802, totalWattage: 645, isPublic: true, compatibility: { isCompatible: true,  issues: [] }, createdAt: '2025-05-10T12:00:00Z' },
  { _id: 'b2', name: 'Budget Beast',       user: { _id: 'u2', name: 'Priya Sharma',  image: 'https://i.pravatar.cc/40?img=32' }, components: [{ category: 'cpu', part: MOCK_PARTS[8] }, { category: 'gpu', part: { ...MOCK_PARTS[9], name: 'RTX 4060 Ti', price: 399, wattage: 165 } }, { category: 'ram', part: MOCK_PARTS[10] }, { category: 'storage', part: MOCK_PARTS[4] }, { category: 'psu', part: MOCK_PARTS[12] }, { category: 'case', part: MOCK_PARTS[13] }], totalPrice: 1134, totalWattage: 430, isPublic: true, compatibility: { isCompatible: true,  issues: [] }, createdAt: '2025-05-08T09:30:00Z' },
  { _id: 'b3', name: '4K Streaming Rig',  user: { _id: 'u3', name: 'Jordan Lee',    image: 'https://i.pravatar.cc/40?img=45' }, components: [{ category: 'cpu', part: { ...MOCK_PARTS[0], name: 'Core i9-13900K', brand: 'Intel', price: 589, wattage: 125 } }, { category: 'gpu', part: MOCK_PARTS[1] }, { category: 'ram', part: MOCK_PARTS[3] }, { category: 'storage', part: MOCK_PARTS[11] }, { category: 'psu', part: MOCK_PARTS[5] }], totalPrice: 2715, totalWattage: 575, isPublic: true, compatibility: { isCompatible: true,  issues: [] }, createdAt: '2025-05-07T16:45:00Z' },
  { _id: 'b4', name: 'Silent Workstation', user: { _id: 'u4', name: 'Marcus Chen',   image: 'https://i.pravatar.cc/40?img=60' }, components: [{ category: 'cpu', part: MOCK_PARTS[0] }, { category: 'gpu', part: MOCK_PARTS[9] }, { category: 'motherboard', part: MOCK_PARTS[2] }, { category: 'ram', part: MOCK_PARTS[3] }, { category: 'storage', part: MOCK_PARTS[4] }, { category: 'cooler', part: MOCK_PARTS[7] }], totalPrice: 2574, totalWattage: 480, isPublic: true, compatibility: { isCompatible: true,  issues: [] }, createdAt: '2025-05-06T11:00:00Z' },
  { _id: 'b5', name: 'RGB Everything',    user: { _id: 'u5', name: 'Kai Nakamura',  image: 'https://i.pravatar.cc/40?img=15' }, components: [{ category: 'cpu', part: MOCK_PARTS[8] }, { category: 'gpu', part: MOCK_PARTS[14] }, { category: 'ram', part: MOCK_PARTS[3] }, { category: 'storage', part: MOCK_PARTS[4] }, { category: 'psu', part: MOCK_PARTS[5] }, { category: 'case', part: MOCK_PARTS[6] }], totalPrice: 2354, totalWattage: 550, isPublic: true, compatibility: { isCompatible: false, issues: ['PSU wattage may be insufficient at peak load'] }, createdAt: '2025-05-05T14:20:00Z' },
  { _id: 'b6', name: 'Mini ITX Sleeper', user: { _id: 'u6', name: 'Sofia Reyes',   image: 'https://i.pravatar.cc/40?img=27' }, components: [{ category: 'cpu', part: MOCK_PARTS[8] }, { category: 'gpu', part: { ...MOCK_PARTS[9], name: 'RTX 4070 Super', price: 599, wattage: 220 } }, { category: 'ram', part: MOCK_PARTS[10] }, { category: 'psu', part: MOCK_PARTS[12] }], totalPrice: 1176, totalWattage: 345, isPublic: true, compatibility: { isCompatible: true,  issues: [] }, createdAt: '2025-05-04T08:10:00Z' },
  { _id: 'b7', name: 'AMD Powerhouse',   user: { _id: 'u7', name: 'Dmitri Volkov', image: 'https://i.pravatar.cc/40?img=52' }, components: [{ category: 'cpu', part: MOCK_PARTS[0] }, { category: 'gpu', part: MOCK_PARTS[14] }, { category: 'motherboard', part: MOCK_PARTS[2] }, { category: 'ram', part: MOCK_PARTS[3] }, { category: 'storage', part: MOCK_PARTS[11] }, { category: 'psu', part: MOCK_PARTS[5] }, { category: 'cooler', part: MOCK_PARTS[7] }], totalPrice: 3223, totalWattage: 525, isPublic: true, compatibility: { isCompatible: true,  issues: [] }, createdAt: '2025-05-03T19:00:00Z' },
  { _id: 'b8', name: 'Content Creator Pro', user: { _id: 'u8', name: 'Amara Osei', image: 'https://i.pravatar.cc/40?img=38' }, components: [{ category: 'cpu', part: { ...MOCK_PARTS[0], name: 'Core i9-13900K', brand: 'Intel', price: 589, wattage: 125 } }, { category: 'gpu', part: MOCK_PARTS[1] }, { category: 'ram', part: { ...MOCK_PARTS[3], name: '128 GB DDR5-5600', price: 399 } }, { category: 'storage', part: MOCK_PARTS[11] }, { category: 'storage', part: MOCK_PARTS[4] }, { category: 'psu', part: MOCK_PARTS[5] }, { category: 'cooler', part: MOCK_PARTS[7] }], totalPrice: 3289, totalWattage: 600, isPublic: true, compatibility: { isCompatible: true, issues: [] }, createdAt: '2025-05-02T13:30:00Z' },
];

// ─── Category accent colours ──────────────────────────────────────────────────

const CAT_ACCENT: Record<string, string> = {
  cpu: '#00d4ff', gpu: '#7c3aed', motherboard: '#f59e0b',
  ram: '#10b981', storage: '#3b82f6', psu: '#f97316',
  case: '#ec4899', cooler: '#06b6d4',
};
const CAT_EMOJI: Record<string, string> = {
  cpu: '🧠', gpu: '🎮', motherboard: '🔌',
  ram: '💾', storage: '💿', psu: '⚡', case: '📦', cooler: '❄️',
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ViewBuildPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { setPart, setBuildName, resetBuild } = useBuilderStore();

  const [build, setBuild] = useState<IBuild | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/api/builds/${id}`)
      .then((res) => {
        if (res.data?.success && res.data?.data) {
          setBuild(res.data.data);
        } else {
          throw new Error('not found');
        }
      })
      .catch(() => {
        const mock = MOCK_BUILDS.find((b) => b._id === id);
        if (mock) setBuild(mock);
        else setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [id]);

  function handleClone() {
    if (!build) return;
    resetBuild();
    setBuildName(`${build.name} (Clone)`);
    // Load each unique-category part into the store
    const seen = new Set<string>();
    for (const { category, part } of build.components) {
      const typed = { ...part, category: category as SlotKey };
      if (!seen.has(category)) {
        setPart(category as SlotKey, typed);
        seen.add(category);
      } else {
        setPart(category as SlotKey, typed);
      }
    }
    router.push('/builder');
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-void)' }}>
        <Navbar />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 56px)', marginTop: '56px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '480px', maxWidth: '90vw' }}>
            {[...Array(5)].map((_, i) => (
              <div key={i} style={{ height: '60px', borderRadius: '10px', background: 'var(--bg-card)', animation: 'pulseGlow 1.5s ease-in-out infinite' }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !build) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-void)' }}>
        <Navbar />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 56px)', marginTop: '56px', textAlign: 'center', gap: '16px' }}>
          <div style={{ fontSize: '52px' }}>🔍</div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Build not found</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0 }}>This build may have been deleted or made private.</p>
          <Link href="/builds" style={{ marginTop: '8px', padding: '10px 24px', borderRadius: '10px', background: 'var(--cyan)', color: '#020408', fontWeight: 800, fontSize: '13px', textDecoration: 'none', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Back to Builds
          </Link>
        </div>
      </div>
    );
  }

  const compatible = build.compatibility.isCompatible;
  const initials = build.user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-void)', color: 'var(--text-primary)' }}>
      <Navbar />

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '80px 20px 80px' }}>

        {/* Back */}
        <Link
          href="/builds"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '13px', textDecoration: 'none', marginBottom: '28px' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--cyan)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          ← Back to Builds
        </Link>

        {/* Header card */}
        <div
          style={{
            background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
            borderRadius: '16px', padding: '24px 28px', marginBottom: '20px',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Top row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
            <div>
              <h1 style={{ margin: '0 0 8px', fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 900, letterSpacing: '-0.02em' }}>
                {build.name}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {build.user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={build.user.image} alt={build.user.name} style={{ width: '28px', height: '28px', borderRadius: '50%', border: '2px solid var(--border-badge)' }} />
                ) : (
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--cyan), var(--violet))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: '#020408' }}>{initials}</div>
                )}
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>{build.user.name}</span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {new Date(build.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ padding: '10px 16px', borderRadius: '10px', background: 'rgba(0,212,255,0.07)', border: '1px solid rgba(0,212,255,0.15)', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 900, color: 'var(--cyan)', letterSpacing: '-0.02em' }}>${build.totalPrice.toLocaleString()}</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '2px' }}>Total</div>
              </div>
              <div style={{ padding: '10px 16px', borderRadius: '10px', background: 'rgba(249,115,22,0.07)', border: '1px solid rgba(249,115,22,0.18)', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 900, color: '#f97316', letterSpacing: '-0.02em' }}>⚡ {build.totalWattage}W</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '2px' }}>Draw</div>
              </div>
              <div style={{ padding: '10px 16px', borderRadius: '10px', background: compatible ? 'rgba(0,255,136,0.07)' : 'rgba(239,68,68,0.07)', border: `1px solid ${compatible ? 'rgba(0,255,136,0.2)' : 'rgba(239,68,68,0.2)'}`, textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 900, color: compatible ? 'var(--neon-green)' : '#ef4444' }}>{compatible ? '✓' : '⚠'}</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '2px' }}>{compatible ? 'Compatible' : 'Issues'}</div>
              </div>
            </div>
          </div>

          {/* Compatibility issues */}
          {!compatible && build.compatibility.issues.length > 0 && (
            <div style={{ marginTop: '16px', padding: '10px 14px', borderRadius: '8px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', fontSize: '12px', color: '#fca5a5' }}>
              ⚠ {build.compatibility.issues.join(' • ')}
            </div>
          )}

          {/* Clone button */}
          <div style={{ marginTop: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={handleClone}
              style={{
                padding: '11px 28px', borderRadius: '10px',
                background: 'linear-gradient(135deg, var(--cyan), var(--cyan-dim))',
                border: 'none', color: '#020408',
                fontSize: '13px', fontWeight: 800, letterSpacing: '0.08em',
                textTransform: 'uppercase', cursor: 'pointer',
                boxShadow: '0 0 20px var(--cyan-glow)',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              Clone Build
            </button>
            <Link
              href="/builds"
              style={{
                padding: '11px 20px', borderRadius: '10px',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 700,
                letterSpacing: '0.06em', textTransform: 'uppercase', textDecoration: 'none',
                display: 'inline-flex', alignItems: 'center',
              }}
            >
              All Builds
            </Link>
          </div>
        </div>

        {/* Components list */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px', overflow: 'hidden', backdropFilter: 'blur(20px)' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-divider)' }}>
            <h2 style={{ margin: 0, fontSize: '13px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Components · {build.components.length} parts
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {build.components.map((c, i) => {
              const accent = CAT_ACCENT[c.category] ?? 'var(--cyan)';
              const emoji  = CAT_EMOJI[c.category]  ?? '🖥️';
              return (
                <div
                  key={i}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '14px',
                    padding: '14px 24px',
                    borderBottom: i < build.components.length - 1 ? '1px solid var(--border-divider)' : 'none',
                  }}
                >
                  <div style={{ width: '38px', height: '38px', borderRadius: '8px', flexShrink: 0, background: `${accent}15`, border: `1px solid ${accent}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                    {emoji}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: '11px', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{c.category}</p>
                    <p style={{ margin: '2px 0 0', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.part.name}</p>
                    <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>{c.part.brand}</p>
                  </div>
                  <div style={{ flexShrink: 0, textAlign: 'right' }}>
                    <span style={{ fontSize: '16px', fontWeight: 800, color: accent, letterSpacing: '-0.02em' }}>${c.part.price.toLocaleString()}</span>
                    {c.part.wattage && <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#f97316' }}>⚡ {c.part.wattage}W</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
