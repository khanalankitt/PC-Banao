'use client';

import Link from 'next/link';
import { useSession, signIn } from 'next-auth/react';

export default function CtaSection() {
  const { data: session } = useSession();

  return (
    <section className="relative overflow-hidden" aria-labelledby="cta-heading">
      {/* Background photo */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=1600&q=80&fit=crop"
          alt="Illuminated gaming PC with vibrant RGB lighting"
          className="w-full h-full object-cover"
          style={{ objectPosition: 'center 30%' }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(2,4,8,0.88) 0%, rgba(2,4,8,0.7) 50%, rgba(2,4,8,0.88) 100%)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-28 text-center">
        <p
          className="font-mono text-sm font-semibold tracking-[0.3em] uppercase mb-5"
          style={{ color: 'var(--cyan)' }}
        >
          Ready to build?
        </p>

        <h2
          id="cta-heading"
          className="text-4xl sm:text-6xl font-extrabold leading-tight mb-6"
          style={{ color: '#ffffff', textShadow: '0 2px 24px rgba(0,0,0,0.8)' }}
        >
          Your perfect PC
          <br />
          <span
            style={{
              background: 'linear-gradient(135deg, var(--cyan), var(--violet))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            starts here.
          </span>
        </h2>

        <p
          className="text-base sm:text-lg leading-relaxed mb-12 max-w-md mx-auto"
          style={{ color: 'rgba(255,255,255,0.72)', textShadow: '0 1px 8px rgba(0,0,0,0.6)' }}
        >
          Sign in once with Google or Facebook. No passwords, no forms.
          Your account is created automatically on first sign-in.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {session ? (
            <Link
              href="/builder"
              className="group flex items-center gap-2.5 px-9 py-4 rounded-xl font-bold text-base tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              style={{ background: 'var(--cyan)', color: '#020408' }}
              onMouseEnter={e => {
                e.currentTarget.style.opacity = '0.88';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 40px var(--cyan-glow)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Open Builder
              <svg width="16" height="16" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5">
                <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          ) : (
            <button
              onClick={() => signIn(undefined, { callbackUrl: '/builder' })}
              className="group flex items-center cursor-pointer gap-2.5 px-9 py-4 rounded-xl font-bold text-base tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              style={{ background: 'var(--cyan)', color: '#020408' }}
              onMouseEnter={e => {
                e.currentTarget.style.opacity = '0.88';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 40px var(--cyan-glow)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Get Started Free
              <svg width="16" height="16" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5">
                <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}

          <Link
            href="/catalog"
            className="flex items-center gap-2 px-9 py-4 rounded-xl font-semibold text-base tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.18)',
              color: '#ffffff',
              backdropFilter: 'blur(8px)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.14)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)';
            }}
          >
            Browse Parts
          </Link>
        </div>
      </div>
    </section>
  );
}
