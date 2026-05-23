'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer
      className="relative py-10 px-4 sm:px-6"
      style={{ borderTop: '1px solid rgba(0,212,255,0.06)' }}
      role="contentinfo"
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div
            className="w-5 h-5 rounded flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(124,58,237,0.2))',
              border: '1px solid rgba(0,212,255,0.2)',
            }}
            aria-hidden="true"
          >
            <svg width="10" height="10" viewBox="0 0 22 22" fill="none">
              <rect x="5" y="5" width="12" height="12" rx="2" stroke="var(--cyan)" strokeWidth="2" />
              <rect x="8" y="8" width="6" height="6" rx="1" fill="var(--cyan)" opacity="0.5" />
            </svg>
          </div>
          <span
            className="text-xs font-bold tracking-wider"
            style={{ color: 'var(--text-muted)' }}
          >
            BuildForge
          </span>
        </div>

        {/* Links */}
        <nav aria-label="Footer navigation">
          <ul className="flex items-center gap-6 list-none p-0 m-0">
            {[
              { href: '/catalog', label: 'Catalog' },
              { href: '/builder', label: 'Builder' },
              { href: '/builds',  label: 'Community' },
              { href: '#',        label: 'Terms' },
              { href: '#',        label: 'Privacy' },
            ].map(({ href, label }) => (
              <li key={label}>
                <Link
                  href={href}
                  className="font-mono text-[10px] tracking-widest uppercase transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded"
                  style={{ color: 'var(--text-muted)' }}
                  onMouseEnter={e => ((e.target as HTMLElement).style.color = 'var(--text-secondary)')}
                  onMouseLeave={e => ((e.target as HTMLElement).style.color = 'var(--text-muted)')}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <p
          className="font-mono text-[10px] tracking-widest uppercase"
          style={{ color: 'var(--text-muted)' }}
        >
          © {new Date().getFullYear()} BuildForge
        </p>
      </div>
    </footer>
  );
}
