'use client';

import Link from 'next/link';
import { useSession, signIn } from 'next-auth/react';

export default function CtaSection() {
  const { data: session } = useSession();

  return (
    <section
      className="relative py-24 px-4 sm:px-6 overflow-hidden"
      aria-labelledby="cta-heading"
    >
      {/* Background accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,212,255,0.04) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.15), transparent)' }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <p
          className="font-mono text-[11px] tracking-[0.3em] uppercase mb-4"
          style={{ color: 'var(--cyan)' }}
        >
          Ready to build?
        </p>

        <h2
          id="cta-heading"
          className="text-3xl sm:text-5xl font-bold tracking-tight mb-5"
          style={{
            background: 'linear-gradient(160deg, var(--text-primary) 40%, var(--cyan) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Your perfect PC starts here.
        </h2>

        <p
          className="text-sm leading-relaxed mb-10 max-w-md mx-auto"
          style={{ color: 'var(--text-secondary)' }}
        >
          Sign in once with Google or Facebook. No passwords, no forms.
          Your account is created automatically on first sign-in.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {session ? (
            <Link
              href="/builder"
              className="group relative flex items-center gap-2 px-8 py-4 rounded-lg font-semibold text-sm tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              style={{
                background: 'linear-gradient(135deg, rgba(0,212,255,0.18), rgba(124,58,237,0.14))',
                border: '1px solid rgba(0,212,255,0.45)',
                color: 'var(--cyan)',
                boxShadow: '0 0 32px rgba(0,212,255,0.14)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = '0 0 48px rgba(0,212,255,0.28), 0 8px 32px rgba(0,0,0,0.4)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = '0 0 32px rgba(0,212,255,0.14)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Open Builder
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5">
                <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          ) : (
            <button
              onClick={() => signIn(undefined, { callbackUrl: '/builder' })}
              className="group relative flex items-center gap-2 px-8 py-4 rounded-lg font-semibold text-sm tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              style={{
                background: 'linear-gradient(135deg, rgba(0,212,255,0.18), rgba(124,58,237,0.14))',
                border: '1px solid rgba(0,212,255,0.45)',
                color: 'var(--cyan)',
                boxShadow: '0 0 32px rgba(0,212,255,0.14)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = '0 0 48px rgba(0,212,255,0.28), 0 8px 32px rgba(0,0,0,0.4)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = '0 0 32px rgba(0,212,255,0.14)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Get Started Free
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5">
                <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}

          <Link
            href="/catalog"
            className="flex items-center gap-2 px-8 py-4 rounded-lg font-medium text-sm tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
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
            Browse Parts
          </Link>
        </div>
      </div>
    </section>
  );
}
