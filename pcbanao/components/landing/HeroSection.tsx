'use client';

import Link from 'next/link';
import { useSession, signIn } from 'next-auth/react';

export default function HeroSection() {
  const { data: session } = useSession();

  return (
    <section className="relative min-h-screen flex" aria-labelledby="hero-heading">
      {/* Left — image panel */}
      <div className="hidden lg:block lg:w-[55%] relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1599792215800-042be231c6cd?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="High-end custom PC build with RGB lighting"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          style={{ objectPosition: 'center' }}
        />
        {/* Dark overlay so text is readable */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(120deg, rgba(2,4,8,0.55) 0%, rgba(2,4,8,0.3) 60%, rgba(2,4,8,0.7) 100%)',
          }}
        />
        {/* Right-edge fade into the content side */}
        <div
          className="absolute inset-y-0 right-0 w-40"
          style={{ background: 'linear-gradient(to right, transparent, var(--bg-void))' }}
        />

        {/* Overlay text on image */}
        <div className="absolute inset-0 flex flex-col justify-end p-14 pb-20">
          <p
            className="font-mono text-sm font-bold tracking-[0.25em] uppercase mb-4 animate-boot-fade"
            style={{ color: 'rgba(0,212,255,0.8)' }}
          >
            PC Banao — Build Smarter
          </p>
          <h2
            className="text-4xl xl:text-5xl font-extrabold leading-tight mb-5"
            style={{ color: '#ffffff', textShadow: '0 2px 24px rgba(0,0,0,0.8)' }}
          >
            Your dream build,<br />
            <span style={{ color: 'var(--cyan)' }}>engineered perfectly.</span>
          </h2>
          <p
            className="text-base max-w-sm leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.72)', textShadow: '0 1px 8px rgba(0,0,0,0.7)' }}
          >
            From budget gaming rigs to extreme workstations — we check every spec, every watt, every slot before you buy.
          </p>

          {/* Stats row */}
          <div className="flex items-center gap-8 mt-10">
            {[
              { val: '10K+', lbl: 'Components' },
              { val: '50ms', lbl: 'Compat. check' },
              { val: '99.9%', lbl: 'Uptime' },
            ].map(({ val, lbl }) => (
              <div key={lbl} className="flex flex-col">
                <span className="text-2xl font-bold" style={{ color: 'var(--cyan)' }}>{val}</span>
                <span className="font-mono text-[10px] tracking-widest uppercase mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>{lbl}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — content panel */}
      <div
        className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-16 xl:px-20 pt-24 pb-16"
        style={{ background: 'var(--bg-void)' }}
      >
        {/* Mobile-only image strip */}
        <div className="lg:hidden mb-8 -mx-8 sm:-mx-12 relative h-52 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=900&q=80&fit=crop"
            alt="Custom PC build"
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, transparent 40%, var(--bg-void))' }}
          />
        </div>

        <div className="max-w-lg">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-7 font-mono text-[11px] tracking-widest uppercase"
            style={{
              background: 'var(--bg-badge)',
              border: '1px solid var(--border-badge)',
              color: 'var(--cyan)',
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse-glow"
              style={{ background: 'var(--neon-green)', boxShadow: '0 0 6px var(--neon-green)' }}
              aria-hidden="true"
            />
            AI-Powered PC Builder
          </div>

          {/* Heading */}
          <h1
            id="hero-heading"
            className="text-4xl sm:text-5xl xl:text-6xl font-extrabold leading-[1.07] mb-6"
          >
            <span style={{ color: 'var(--text-primary)' }}>Build the PC</span>
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, var(--cyan) 0%, var(--violet) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              you deserve.
            </span>
          </h1>

          <p className="text-base sm:text-lg leading-relaxed mb-10" style={{ color: 'var(--text-secondary)' }}>
            Design your perfect PC with AI-driven compatibility checking, a curated component catalog, and real-time wattage and price tracking.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4" role="group" aria-label="Primary actions">
            <Link
              href="/builder"
              className="group flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              style={{
                background: 'var(--cyan)',
                color: '#020408',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.opacity = '0.88';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 8px 32px var(--cyan-glow)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" />
                <path d="M5 8h6M8 5v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              Start Building
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5">
                <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>

            {session ? (
              <Link
                href="/builds"
                className="flex items-center justify-center gap-2 px-7 py-4 rounded-xl font-semibold text-sm tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                style={{
                  background: 'var(--bg-ghost-btn)',
                  border: '1px solid var(--border-ghost-btn)',
                  color: 'var(--text-primary)',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-ghost-hover)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-ghost-btn)'; }}
              >
                My Builds
              </Link>
            ) : (
              <button
                onClick={() => signIn(undefined, { callbackUrl: '/builder' })}
                className="flex items-center cursor-pointer justify-center gap-2 px-7 py-4 rounded-xl font-semibold text-sm tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                style={{
                  background: 'var(--bg-ghost-btn)',
                  border: '1px solid var(--border-ghost-btn)',
                  color: 'var(--text-primary)',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-ghost-hover)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-ghost-btn)'; }}
              >
                Sign in Free
              </button>
            )}
          </div>

          {/* Trust line */}
          <p className="mt-8 text-xs" style={{ color: 'var(--text-muted)' }}>
            Sign in with Google or Facebook — no password, account created automatically.
          </p>
        </div>
      </div>
    </section>
  );
}
