'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer
      className="py-12 px-4 sm:px-6"
      style={{ borderTop: '1px solid var(--border-divider)', background: 'var(--bg-surface)' }}
      role="contentinfo"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2.5">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: 'var(--bg-logo)', border: '1px solid var(--border-logo)' }}
                aria-hidden="true"
              >
                <svg width="13" height="13" viewBox="0 0 22 22" fill="none">
                  <rect x="5" y="5" width="12" height="12" rx="2" stroke="var(--cyan)" strokeWidth="2" />
                  <rect x="8" y="8" width="6" height="6" rx="1" fill="var(--cyan)" opacity="0.6" />
                </svg>
              </div>
              <span className="text-sm font-bold tracking-wide" style={{ color: 'var(--text-primary)' }}>
                PC Banao
              </span>
            </div>
            <p className="text-xs max-w-xs" style={{ color: 'var(--text-muted)' }}>
              Build smarter PCs with AI-driven compatibility and real-time price tracking.
            </p>
          </div>

          {/* Links */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-3 list-none p-0 m-0">
              {[
                { href: '/catalog',  label: 'Catalog' },
                { href: '/builder',  label: 'Builder' },
                { href: '/builds',   label: 'Community' },
                { href: '#',         label: 'Terms' },
                { href: '#',         label: 'Privacy' },
              ].map(({ href, label }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-xs font-medium tracking-wide transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded"
                    style={{ color: 'var(--text-muted)' }}
                    onMouseEnter={e => ((e.target as HTMLElement).style.color = 'var(--text-primary)')}
                    onMouseLeave={e => ((e.target as HTMLElement).style.color = 'var(--text-muted)')}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} PC Banao
          </p>
        </div>
      </div>
    </footer>
  );
}
