'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
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

// ─── Normalise backend build shape ───────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normaliseApiBuild(raw: any): IBuild {
  const comps = raw.components ?? {};
  const componentList: { category: string; part: IPart }[] = [];
  for (const key of ['cpu', 'gpu', 'motherboard', 'psu', 'case', 'cooler'] as const) {
    if (comps[key] && typeof comps[key] === 'object') {
      componentList.push({ category: key, part: comps[key] as IPart });
    }
  }
  for (const part of (comps.ram ?? []) as IPart[]) {
    if (part && typeof part === 'object') componentList.push({ category: 'ram', part });
  }
  for (const part of (comps.storage ?? []) as IPart[]) {
    if (part && typeof part === 'object') componentList.push({ category: 'storage', part });
  }
  return {
    _id: raw._id,
    name: raw.name ?? 'Untitled',
    user: typeof raw.user === 'object' && raw.user !== null
      ? { _id: String(raw.user._id ?? raw.user), name: raw.user.name ?? 'Unknown', image: raw.user.image }
      : { _id: String(raw.user), name: 'Unknown' },
    components: componentList,
    totalPrice: raw.totalPrice ?? 0,
    totalWattage: raw.totalWattage ?? 0,
    isPublic: raw.isPublic ?? false,
    compatibility: { isCompatible: raw.isCompatible ?? true, issues: raw.compatibilityIssues ?? [] },
    createdAt: raw.createdAt ?? new Date().toISOString(),
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ViewBuildPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session } = useSession();
  const { setPart, setBuildName, setBuildId, setIsPublic, resetBuild } = useBuilderStore();

  const [build, setBuild] = useState<IBuild | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Delete state
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/api/builds/${id}`)
      .then((res) => {
        if (res.data?.success && res.data?.data) {
          setBuild(normaliseApiBuild(res.data.data));
        } else {
          throw new Error('not found');
        }
      })
      .catch(() => {
        setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Only show edit/delete to the user whose _id matches the build owner.
  // Re-login is required after the _id field was added to the session.
  const isOwner = !!session?.user?._id && !!build && session.user._id === build.user._id;

  function loadBuildIntoStore(targetBuild: IBuild, keepId: boolean) {
    resetBuild();
    setBuildName(targetBuild.name);
    setIsPublic(targetBuild.isPublic);
    if (keepId) setBuildId(targetBuild._id);
    for (const { category, part } of targetBuild.components) {
      setPart(category as SlotKey, { ...part, category: category as SlotKey });
    }
  }

  function handleClone() {
    if (!build) return;
    loadBuildIntoStore({ ...build, name: `${build.name} (Clone)` }, false);
    router.push('/builder');
  }

  function handleEdit() {
    if (!build) return;
    loadBuildIntoStore(build, true);
    router.push('/builder');
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await api.delete(`/api/builds/${id}`);
      router.push('/builds');
    } catch {
      setDeleting(false);
      setConfirmDelete(false);
    }
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
                <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '6px', background: build.isPublic ? 'rgba(0,212,255,0.1)' : 'rgba(255,255,255,0.06)', border: `1px solid ${build.isPublic ? 'rgba(0,212,255,0.2)' : 'rgba(255,255,255,0.1)'}`, color: build.isPublic ? 'var(--cyan)' : 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  {build.isPublic ? 'Public' : 'Private'}
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

          {/* Action buttons */}
          <div style={{ marginTop: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={handleClone}
              style={{ padding: '11px 28px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--cyan), var(--cyan-dim))', border: 'none', color: '#020408', fontSize: '13px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', boxShadow: '0 0 20px var(--cyan-glow)', transition: 'opacity 0.2s' }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              Clone Build
            </button>

            {isOwner && (
              <>
                <button
                  onClick={handleEdit}
                  style={{ padding: '11px 22px', borderRadius: '10px', background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.3)', color: '#a78bfa', fontSize: '13px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', transition: 'opacity 0.2s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.75')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                >
                  Edit Build
                </button>
                <button
                  onClick={() => setConfirmDelete(true)}
                  style={{ padding: '11px 22px', borderRadius: '10px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', fontSize: '13px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', transition: 'opacity 0.2s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.75')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                >
                  Delete
                </button>
              </>
            )}

            <Link
              href="/builds"
              style={{ padding: '11px 20px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
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
                  style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 24px', borderBottom: i < build.components.length - 1 ? '1px solid var(--border-divider)' : 'none' }}
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

      {/* ── Delete confirmation modal ─────────────────────────────────────── */}
      {confirmDelete && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(2,4,8,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}
          onClick={(e) => { if (e.target === e.currentTarget && !deleting) setConfirmDelete(false); }}
        >
          <div style={{ background: 'var(--bg-card)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '16px', padding: '28px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🗑️</div>
            <h2 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 800 }}>Delete Build?</h2>
            <p style={{ margin: '0 0 24px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              <strong style={{ color: 'var(--text-primary)' }}>{build.name}</strong> will be permanently deleted. This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => !deleting && setConfirmDelete(false)}
                style={{ flex: 1, padding: '11px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 700, cursor: deleting ? 'not-allowed' : 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                style={{ flex: 1, padding: '11px', borderRadius: '10px', background: deleting ? 'rgba(239,68,68,0.4)' : '#ef4444', border: 'none', color: '#fff', fontSize: '13px', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: deleting ? 'not-allowed' : 'pointer' }}
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
