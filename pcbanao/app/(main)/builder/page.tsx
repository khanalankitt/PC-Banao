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
          padding: '52px 24px 40px',
          overflow: 'hidden',
        }}
      >
        {/* Ambient background layers */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{
            position: 'absolute', top: '-80px', left: '50%', transform: 'translateX(-50%)',
            width: '600px', height: '300px',
            background: 'radial-gradient(ellipse, rgba(0,212,255,0.06) 0%, transparent 70%)',
          }} />
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(0,212,255,0.2) 30%, rgba(124,58,237,0.2) 70%, transparent 100%)',
          }} />
        </div>

        <div style={{ position: 'relative', maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <div style={{
                  width: '3px', height: '24px', borderRadius: '2px',
                  background: 'linear-gradient(180deg, var(--cyan) 0%, var(--violet) 100%)',
                }} />
                <span style={{
                  fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em',
                  textTransform: 'uppercase', color: 'var(--text-muted)',
                }}>
                  PC Builder
                </span>
              </div>
              <h1 style={{
                fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 900,
                margin: '0 0 10px', letterSpacing: '-0.03em', lineHeight: 1.1,
              }}>
                Configure your{' '}
                <span style={{
                  background: 'linear-gradient(135deg, var(--cyan) 0%, #a78bfa 100%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>
                  build
                </span>
              </h1>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '440px' }}>
                Pick parts slot by slot. Price and power draw update as you go.
              </p>
            </div>

            {/* Quick stats strip */}
            <div style={{ display: 'flex', gap: '1px', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
              {[
                { label: 'Parts', value: '100+' },
                { label: 'Brands', value: '30+' },
                { label: 'Builds', value: '2.4k' },
              ].map((stat, i) => (
                <div key={i} style={{
                  padding: '10px 20px', background: 'rgba(255,255,255,0.02)',
                  textAlign: 'center', minWidth: '72px',
                  borderRight: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                }}>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{stat.value}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '2px' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Builder layout ─────────────────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: '1100px', margin: '0 auto', padding: '0 20px 80px',
          display: 'grid',
          gridTemplateColumns: '1fr 300px',
          gap: '20px',
          alignItems: 'start',
        }}
        className="builder-layout"
      >
        {/* Left — slot selector */}
        <section>
          <PartSelector />
        </section>

        {/* Right — summary + save */}
        <aside style={{ position: 'sticky', top: '76px' }}>
          <BuildSummary />
        </aside>
      </div>

      {/* Responsive grid collapse */}
      <style>{`
        @media (max-width: 720px) {
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
