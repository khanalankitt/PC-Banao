'use client';

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useState } from 'react';

export default function Navbar() {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40"
      style={{
        background: 'rgba(2,4,8,0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,212,255,0.08)',
      }}
      role="banner"
    >
      <nav
        className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded"
          aria-label="BuildForge home"
        >
          <div
            className="w-7 h-7 rounded flex items-center justify-center transition-shadow duration-200 group-hover:shadow-[0_0_14px_var(--cyan-glow)]"
            style={{
              background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(124,58,237,0.2))',
              border: '1px solid rgba(0,212,255,0.3)',
            }}
            aria-hidden="true"
          >
            <NavLogoMark />
          </div>
          <span
            className="text-sm font-bold tracking-wider"
            style={{
              background: 'linear-gradient(135deg, #e8f4f8, var(--cyan))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            BuildForge
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden sm:flex items-center gap-6" role="list">
          {[
            { href: '/catalog', label: 'Catalog' },
            { href: '/builder', label: 'Builder' },
            { href: '/builds', label: 'Builds' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              role="listitem"
              className="text-xs font-medium tracking-widest uppercase transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded px-1"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={e => ((e.target as HTMLElement).style.color = 'var(--cyan)')}
              onMouseLeave={e => ((e.target as HTMLElement).style.color = 'var(--text-secondary)')}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Auth */}
        <div className="hidden sm:flex items-center gap-3">
          {status === 'loading' ? (
            <div className="w-20 h-7 rounded animate-pulse" style={{ background: 'rgba(0,212,255,0.08)' }} aria-hidden="true" />
          ) : session ? (
            <div className="flex items-center gap-3">
              {session.user?.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={session.user.image}
                  alt={session.user.name ?? 'User avatar'}
                  className="w-7 h-7 rounded-full"
                  style={{ border: '1px solid rgba(0,212,255,0.3)' }}
                />
              )}
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-xs font-medium tracking-widest uppercase transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded px-1"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={e => ((e.target as HTMLElement).style.color = 'var(--text-secondary)')}
                onMouseLeave={e => ((e.target as HTMLElement).style.color = 'var(--text-muted)')}
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn(undefined, { callbackUrl: '/' })}
              className="px-4 py-1.5 rounded text-xs font-semibold tracking-wider uppercase transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              style={{
                background: 'rgba(0,212,255,0.08)',
                border: '1px solid rgba(0,212,255,0.25)',
                color: 'var(--cyan)',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget;
                el.style.background = 'rgba(0,212,255,0.14)';
                el.style.boxShadow = '0 0 16px var(--cyan-glow)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget;
                el.style.background = 'rgba(0,212,255,0.08)';
                el.style.boxShadow = 'none';
              }}
            >
              Sign in
            </button>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="sm:hidden flex flex-col gap-1 p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded"
          onClick={() => setMenuOpen(o => !o)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className="block w-5 h-px transition-all duration-200"
              style={{ background: 'var(--cyan)' }}
            />
          ))}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="sm:hidden px-6 pb-4 pt-2 flex flex-col gap-4"
          style={{ borderTop: '1px solid rgba(0,212,255,0.08)' }}
          role="navigation"
          aria-label="Mobile navigation"
        >
          {[
            { href: '/catalog', label: 'Catalog' },
            { href: '/builder', label: 'Builder' },
            { href: '/builds', label: 'Builds' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-medium tracking-wider uppercase"
              style={{ color: 'var(--text-secondary)' }}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
          {!session && (
            <button
              onClick={() => { setMenuOpen(false); signIn(undefined, { callbackUrl: '/' }); }}
              className="text-left text-sm font-medium tracking-wider uppercase"
              style={{ color: 'var(--cyan)' }}
            >
              Sign in
            </button>
          )}
        </div>
      )}
    </header>
  );
}

function NavLogoMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <rect x="5" y="5" width="12" height="12" rx="2" stroke="var(--cyan)" strokeWidth="1.5" />
      <rect x="8" y="8" width="6" height="6" rx="1" fill="var(--cyan)" opacity="0.6" />
      <line x1="8"  y1="1"  x2="8"  y2="5"  stroke="var(--cyan)"   strokeWidth="1.2" strokeLinecap="round" />
      <line x1="14" y1="1"  x2="14" y2="5"  stroke="var(--cyan)"   strokeWidth="1.2" strokeLinecap="round" />
      <line x1="8"  y1="17" x2="8"  y2="21" stroke="var(--violet)" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="14" y1="17" x2="14" y2="21" stroke="var(--violet)" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="1"  y1="8"  x2="5"  y2="8"  stroke="var(--cyan)"   strokeWidth="1.2" strokeLinecap="round" />
      <line x1="1"  y1="14" x2="5"  y2="14" stroke="var(--cyan)"   strokeWidth="1.2" strokeLinecap="round" />
      <line x1="17" y1="8"  x2="21" y2="8"  stroke="var(--violet)" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="17" y1="14" x2="21" y2="14" stroke="var(--violet)" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
