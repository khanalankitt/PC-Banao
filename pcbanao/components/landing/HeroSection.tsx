'use client';

import Link from 'next/link';
import { useSession, signIn } from 'next-auth/react';

export default function HeroSection() {
  const { data: session } = useSession();

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-14 text-center"
      aria-labelledby="hero-heading"
    >
      {/* Central glow */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="w-[600px] h-[600px] rounded-full animate-pulse-glow"
          style={{
            background: 'radial-gradient(circle, rgba(0,212,255,0.05) 0%, rgba(124,58,237,0.04) 50%, transparent 75%)',
            filter: 'blur(2px)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-8 font-mono text-[11px] tracking-widest uppercase animate-boot-fade"
          style={{
            background: 'rgba(0,212,255,0.06)',
            border: '1px solid rgba(0,212,255,0.18)',
            color: 'var(--cyan)',
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse-glow"
            style={{ background: 'var(--neon-green)', boxShadow: '0 0 6px var(--neon-green)' }}
            aria-hidden="true"
          />
          AI-Powered PC Building Platform
        </div>

        {/* Heading */}
        <h1
          id="hero-heading"
          className="text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.08] tracking-tight mb-6 animate-boot-in"
          style={{ letterSpacing: '-0.02em' }}
        >
          <span
            style={{
              background: 'linear-gradient(160deg, #e8f4f8 0%, var(--cyan) 45%, var(--violet) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Build Smarter
          </span>
          <br />
          <span style={{ color: 'var(--text-primary)' }}>PCs.</span>
        </h1>

        {/* Subheading */}
        <p
          className="text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed animate-slide-up delay-200"
          style={{ color: 'var(--text-secondary)' }}
        >
          Design your perfect PC with AI-driven compatibility checking,
          a curated component catalog, and real-time wattage and price tracking.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up delay-300"
          role="group"
          aria-label="Primary actions"
        >
          <Link
            href="/builder"
            className="group relative flex items-center gap-2 px-7 py-3.5 rounded-lg font-semibold text-sm tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            style={{
              background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(124,58,237,0.12))',
              border: '1px solid rgba(0,212,255,0.4)',
              color: 'var(--cyan)',
              boxShadow: '0 0 24px rgba(0,212,255,0.12)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = '0 0 40px rgba(0,212,255,0.25), 0 8px 32px rgba(0,0,0,0.4)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = '0 0 24px rgba(0,212,255,0.12)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.4" />
              <path d="M5 8h6M8 5v6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            Start Building
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5">
              <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>

          {session ? (
            <Link
              href="/builds"
              className="flex items-center gap-2 px-7 py-3.5 rounded-lg font-medium text-sm tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'var(--text-secondary)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(0,212,255,0.2)';
                e.currentTarget.style.color = 'var(--text-primary)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              My Builds
            </Link>
          ) : (
            <button
              onClick={() => signIn(undefined, { callbackUrl: '/builder' })}
              className="flex items-center gap-2 px-7 py-3.5 rounded-lg font-medium text-sm tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'var(--text-secondary)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(0,212,255,0.2)';
                e.currentTarget.style.color = 'var(--text-primary)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              Sign in Free
            </button>
          )}
        </div>

        {/* Scroll indicator */}
        <div
          className="mt-20 flex flex-col items-center gap-2 animate-slide-up delay-600"
          aria-hidden="true"
        >
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase" style={{ color: 'var(--text-muted)' }}>
            Scroll
          </span>
          <div
            className="w-px h-8 animate-pulse-glow"
            style={{ background: 'linear-gradient(180deg, var(--cyan), transparent)' }}
          />
        </div>
      </div>
    </section>
  );
}
