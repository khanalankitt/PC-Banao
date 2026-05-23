'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import TechBackground from '@/components/auth/TechBackground';
import BootSequence from '@/components/auth/BootSequence';
import OAuthButton from '@/components/auth/OAuthButton';
import GoogleIcon from '@/components/auth/GoogleIcon';
import FacebookIcon from '@/components/auth/FacebookIcon';
import FeatureHighlights from '@/components/auth/FeatureHighlights';

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();
  const [booted, setBooted] = useState(false);
  const [panelVisible, setPanelVisible] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') router.replace('/');
  }, [status, router]);

  const handleBootComplete = useCallback(() => {
    setBooted(true);
    // Stagger panel entrance slightly after boot fade-out
    setTimeout(() => setPanelVisible(true), 80);
  }, []);

  if (status === 'authenticated') return null;

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden scanline-overlay">
      <TechBackground />

      {/* Boot sequence overlay */}
      {!booted && <BootSequence onComplete={handleBootComplete} />}

      {/* Main UI — fades in after boot */}
      <div
        className="relative z-10 w-full max-w-lg mx-auto px-4 py-8 transition-all duration-700"
        style={{
          opacity: panelVisible ? 1 : 0,
          transform: panelVisible ? 'translateY(0)' : 'translateY(16px)',
        }}
        aria-hidden={!panelVisible}
      >
        {/* System status bar */}
        <div
          className="flex items-center justify-between mb-6 px-3 py-1.5 rounded font-mono text-[10px] tracking-widest uppercase"
          style={{
            background: 'rgba(0,212,255,0.04)',
            border: '1px solid rgba(0,212,255,0.1)',
            color: 'var(--text-muted)',
          }}
          role="status"
          aria-label="System status"
        >
          <span className="flex items-center gap-2">
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse-glow"
              style={{ background: 'var(--neon-green)', boxShadow: '0 0 6px var(--neon-green)' }}
              aria-hidden="true"
            />
            System Online
          </span>
          <span style={{ color: 'var(--text-muted)' }}>AUTH_GATEWAY v3.1</span>
        </div>

        {/* Glass panel */}
        <div
          className="relative glass-panel rounded-2xl p-8 bracket-tl bracket-br"
          style={{ boxShadow: '0 0 60px rgba(0,212,255,0.05), 0 24px 80px rgba(0,0,0,0.6)' }}
        >
          {/* Corner accent line */}
          <div
            className="absolute top-0 left-8 right-8 h-[1px]"
            style={{ background: 'linear-gradient(90deg, transparent, var(--cyan), transparent)' }}
            aria-hidden="true"
          />

          {/* Brand */}
          <header className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-5" aria-label="BuildForge logo">
              <div
                className="relative w-10 h-10 rounded-lg flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(124,58,237,0.15))',
                  border: '1px solid rgba(0,212,255,0.3)',
                  boxShadow: '0 0 20px rgba(0,212,255,0.2)',
                }}
                aria-hidden="true"
              >
                <LogoMark />
              </div>
              <h1
                className="text-2xl font-bold tracking-tight animate-glitch"
                style={{
                  background: 'linear-gradient(135deg, #e8f4f8 0%, var(--cyan) 60%, var(--violet) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                BuildForge
              </h1>
            </div>

            <p
              className="text-sm font-mono tracking-wide animate-boot-fade"
              style={{ color: 'var(--text-secondary)' }}
            >
              Design. Optimize.{' '}
              <span style={{ color: 'var(--cyan)' }}>Build smarter PCs.</span>
            </p>
          </header>

          {/* Divider with label */}
          <div className="flex items-center gap-3 mb-6" aria-hidden="true">
            <div className="flex-1 h-px" style={{ background: 'var(--border-subtle)' }} />
            <span
              className="font-mono text-[10px] tracking-[0.2em] uppercase px-2"
              style={{ color: 'var(--text-muted)' }}
            >
              Authenticate
            </span>
            <div className="flex-1 h-px" style={{ background: 'var(--border-subtle)' }} />
          </div>

          {/* OAuth buttons */}
          <div
            className="space-y-3"
            role="group"
            aria-label="Sign in options"
          >
            <div className="animate-slide-up delay-100">
              <OAuthButton
                provider="google"
                label="Continue with Google"
                icon={<GoogleIcon />}
                callbackUrl="/"
              />
            </div>

            <div className="animate-slide-up delay-200">
              <OAuthButton
                provider="facebook"
                label="Continue with Facebook"
                icon={<FacebookIcon />}
                callbackUrl="/"
              />
            </div>
          </div>

          {/* Trust note */}
          <p
            className="mt-5 text-center text-[11px] leading-relaxed animate-slide-up delay-300"
            style={{ color: 'var(--text-muted)' }}
          >
            New to BuildForge? Your account is created automatically
            on first sign-in. No password required.
          </p>

          {/* Feature highlights */}
          <div className="animate-slide-up delay-400">
            <FeatureHighlights />
          </div>

          {/* Bottom accent */}
          <div
            className="absolute bottom-0 left-8 right-8 h-[1px]"
            style={{ background: 'linear-gradient(90deg, transparent, var(--violet), transparent)' }}
            aria-hidden="true"
          />
        </div>

        {/* Footer */}
        <footer
          className="mt-5 text-center font-mono text-[10px] tracking-widest uppercase animate-slide-up delay-500"
          style={{ color: 'var(--text-muted)' }}
        >
          <p>
            By continuing you agree to our{' '}
            <a
              href="#"
              className="underline decoration-dotted transition-colors hover:text-cyan-400 focus-visible:text-cyan-400"
              style={{ color: 'var(--text-secondary)' }}
            >
              Terms
            </a>{' '}
            &amp;{' '}
            <a
              href="#"
              className="underline decoration-dotted transition-colors hover:text-cyan-400 focus-visible:text-cyan-400"
              style={{ color: 'var(--text-secondary)' }}
            >
              Privacy
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

function LogoMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      {/* CPU chip shape */}
      <rect x="5" y="5" width="12" height="12" rx="2" stroke="var(--cyan)" strokeWidth="1.5" />
      <rect x="8" y="8" width="6" height="6" rx="1" fill="var(--cyan)" opacity="0.6" />
      {/* Pins */}
      <line x1="8" y1="1" x2="8" y2="5"  stroke="var(--cyan)" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="14" y1="1" x2="14" y2="5" stroke="var(--cyan)" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="8" y1="17" x2="8" y2="21"  stroke="var(--violet)" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="14" y1="17" x2="14" y2="21" stroke="var(--violet)" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="1" y1="8"  x2="5" y2="8"  stroke="var(--cyan)" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="1" y1="14" x2="5" y2="14" stroke="var(--cyan)" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="17" y1="8"  x2="21" y2="8"  stroke="var(--violet)" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="17" y1="14" x2="21" y2="14" stroke="var(--violet)" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
