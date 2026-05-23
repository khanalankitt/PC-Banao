'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import OAuthButton from '@/components/auth/OAuthButton';
import GoogleIcon from '@/components/auth/GoogleIcon';
import FacebookIcon from '@/components/auth/FacebookIcon';

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (status === 'authenticated') router.replace('/');
  }, [status, router]);

  if (status === 'authenticated') return null;

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-void)' }}>

      {/* ─── Left panel — photo + branding ─────────────────────────── */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden flex-col">
        {/* Photo */}
        <img
          src="https://images.unsplash.com/photo-1620368523635-df9d83338fc1?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Premium custom PC build glowing in the dark"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(2,4,8,0.72) 0%, rgba(2,4,8,0.35) 55%, rgba(2,4,8,0.8) 100%)',
          }}
        />
        {/* Right edge fade */}
        <div
          className="absolute inset-y-0 right-0 w-32"
          style={{ background: 'linear-gradient(to right, transparent, var(--bg-void))' }}
        />

        {/* Content over photo */}
        <div className="relative z-10 flex flex-col h-full p-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 w-fit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, var(--cyan), var(--violet))',
                boxShadow: '0 0 20px var(--cyan-glow)',
              }}
            >
              <LogoMark />
            </div>
            <span
              className="text-lg font-extrabold tracking-tight"
              style={{ color: '#ffffff' }}
            >
              PC Banao
            </span>
          </Link>

          {/* Hero text — bottom of panel */}
          <div className="mt-auto">
            <p
              className="font-mono font-semibold text-sm tracking-[0.25em] uppercase mb-4"
              style={{ color: 'rgba(0,212,255,0.85)' }}
            >
              Build. Optimize. Upgrade.
            </p>
            <h1
              className="text-4xl xl:text-5xl font-extrabold leading-tight mb-5"
              style={{ color: '#ffffff', textShadow: '0 2px 24px rgba(0,0,0,0.9)' }}
            >
              Build the PC
              <br />
              <span style={{ color: 'var(--cyan)' }}>you&apos;ve dreamed of.</span>
            </h1>
            <p
              className="text-base leading-relaxed max-w-sm"
              style={{ color: 'rgba(255,255,255,0.65)', textShadow: '0 1px 8px rgba(0,0,0,0.8)' }}
            >
              AI-powered compatibility, real-time wattage tracking, and a curated catalog of 10,000+ components.
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2 mt-8">
              {['AI Recommendations', 'Live Compatibility', 'Wattage Tracker', 'Community Builds'].map(t => (
                <span
                  key={t}
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    background: 'rgba(0,212,255,0.1)',
                    border: '1px solid rgba(0,212,255,0.25)',
                    color: 'rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Right panel — auth form ────────────────────────────────── */}
      <div
        className="flex-1 flex flex-col items-center justify-center px-6 sm:px-12 py-12"
        style={{ background: 'var(--bg-void)' }}
      >
        {/* Mobile logo */}
        <Link href="/" className="lg:hidden flex items-center gap-3 mb-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, var(--cyan), var(--violet))' }}
          >
            <LogoMark />
          </div>
          <span className="text-lg font-extrabold" style={{ color: 'var(--text-primary)' }}>
            PC Banao
          </span>
        </Link>

        <div
          className="w-full max-w-sm transition-all duration-500"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(20px)',
          }}
        >
          {/* Header */}
          <div className="mb-8">
            <h2
              className="text-3xl font-extrabold mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              Sign in
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              New here? Your account is created automatically on first sign-in.
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6" aria-hidden="true">
            <div className="flex-1 h-px" style={{ background: 'var(--border-subtle)' }} />
            <span
              className="text-xs font-mono tracking-widest uppercase"
              style={{ color: 'var(--text-muted)' }}
            >
              Continue with
            </span>
            <div className="flex-1 h-px" style={{ background: 'var(--border-subtle)' }} />
          </div>

          {/* OAuth buttons */}
          <div className="space-y-3" role="group" aria-label="Sign in options">
            <OAuthButton
              provider="google"
              label="Continue with Google"
              icon={<GoogleIcon />}
              callbackUrl="/"
            />
            <OAuthButton
              provider="facebook"
              label="Continue with Facebook"
              icon={<FacebookIcon />}
              callbackUrl="/"
            />
          </div>

          {/* What you get */}
          <div
            className="mt-8 p-5 rounded-2xl"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <p className="text-xs font-semibold tracking-wide uppercase mb-4" style={{ color: 'var(--text-muted)' }}>
              What you get
            </p>
            <ul className="space-y-3">
              {[
                { icon: '🧠', text: 'AI part recommendations for your budget' },
                { icon: '⚡', text: 'Instant compatibility checks across all specs' },
                { icon: '💾', text: 'Save and share your builds with the community' },
              ].map(({ icon, text }) => (
                <li key={text} className="flex items-start gap-3">
                  <span className="text-base leading-none mt-0.5">{icon}</span>
                  <span className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <p className="mt-6 text-center text-[11px]" style={{ color: 'var(--text-muted)' }}>
            By continuing you agree to our{' '}
            <a href="#" className="underline decoration-dotted hover:text-cyan-400 transition-colors" style={{ color: 'var(--text-secondary)' }}>
              Terms
            </a>{' '}
            &amp;{' '}
            <a href="#" className="underline decoration-dotted hover:text-cyan-400 transition-colors" style={{ color: 'var(--text-secondary)' }}>
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

function LogoMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <rect x="5" y="5" width="12" height="12" rx="2" stroke="white" strokeWidth="1.5" />
      <rect x="8" y="8" width="6" height="6" rx="1" fill="white" opacity="0.7" />
      <line x1="8" y1="1" x2="8" y2="5"   stroke="white" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="14" y1="1" x2="14" y2="5"  stroke="white" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="8" y1="17" x2="8" y2="21"  stroke="white" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="14" y1="17" x2="14" y2="21" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="1" y1="8"  x2="5" y2="8"   stroke="white" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="1" y1="14" x2="5" y2="14"  stroke="white" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="17" y1="8"  x2="21" y2="8"  stroke="white" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="17" y1="14" x2="21" y2="14" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
