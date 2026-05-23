'use client';

import Navbar from '@/components/landing/Navbar';
import PartSelector from '@/components/builder/PartSelector';
import BuildSummary from '@/components/builder/BuildSummary';

export default function BuilderPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-void)', color: 'var(--text-primary)' }}>
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <div
        style={{
          marginTop: '56px',
          position: 'relative',
          padding: '48px 24px 36px',
          textAlign: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(0,212,255,0.07) 0%, transparent 70%)',
          }}
        />
        <div style={{ position: 'relative' }}>
          <div
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '4px 14px', borderRadius: '20px',
              background: 'var(--bg-badge)', border: '1px solid var(--border-badge)',
              color: 'var(--cyan)', fontSize: '11px', fontWeight: 700,
              letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px',
            }}
          >
            <span
              style={{
                width: '6px', height: '6px', borderRadius: '50%',
                background: 'var(--neon-green)', boxShadow: '0 0 6px var(--neon-green)',
                display: 'block',
              }}
            />
            PC Builder
          </div>

          <h1
            style={{
              fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 900,
              margin: '0 0 12px', letterSpacing: '-0.025em', lineHeight: 1.1,
            }}
          >
            <span style={{ color: 'var(--text-primary)' }}>Build Your </span>
            <span
              style={{
                background: 'linear-gradient(135deg, var(--cyan) 0%, var(--violet) 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Dream PC
            </span>
          </h1>

          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto', lineHeight: 1.6 }}>
            Select parts for each slot. Totals and PSU headroom are calculated live.
          </p>
        </div>
      </div>

      {/* ── Builder layout ─────────────────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: '1100px', margin: '0 auto', padding: '0 20px 80px',
          display: 'grid',
          gridTemplateColumns: '1fr 320px',
          gap: '24px',
          alignItems: 'start',
        }}
        className="builder-layout"
      >
        {/* Left — slot selector */}
        <section>
          <div
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: '16px',
            }}
          >
            <h2 style={{ margin: 0, fontSize: '13px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Components
            </h2>
          </div>
          <PartSelector />
        </section>

        {/* Right — summary + save */}
        <aside style={{ position: 'sticky', top: '76px' }}>
          <BuildSummary />
        </aside>
      </div>

      {/* Responsive grid collapse */}
      <style>{`
        @media (max-width: 700px) {
          .builder-layout {
            grid-template-columns: 1fr !important;
          }
          .builder-layout aside {
            position: static !important;
          }
        }
      `}</style>
    </div>
  );
}
