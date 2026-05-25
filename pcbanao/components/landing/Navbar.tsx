"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40"
      style={{
        background: "var(--bg-navbar)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border-divider)",
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
          aria-label="PC Banao home"
        >
          <div
            className="w-7 h-7 rounded flex items-center justify-center transition-shadow duration-200 group-hover:shadow-[0_0_14px_var(--cyan-glow)]"
            style={{
              background: "var(--bg-logo)",
              border: "1px solid var(--border-logo)",
            }}
            aria-hidden="true"
          >
            <NavLogoMark />
          </div>
          <span
            className="text-sm font-bold tracking-wider"
            style={{
              background: "linear-gradient(135deg, #e8f4f8, var(--cyan))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            PC Banao
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden sm:flex items-center gap-6" role="list">
          {[
            { href: "/catalog", label: "Catalog" },
            { href: "/builder", label: "Builder" },
            { href: "/builds", label: "Builds" },
          ].map(({ href, label }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                role="listitem"
                className="text-xs font-medium tracking-widest uppercase transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded px-1"
                style={{
                  color: isActive ? "var(--cyan)" : "var(--text-secondary)",
                  textShadow: isActive ? "0 0 12px var(--cyan-glow)" : "none",
                  borderBottom: isActive ? "1px solid var(--cyan)" : "1px solid transparent",
                  paddingBottom: "2px",
                }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLElement).style.color = "var(--cyan)")
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLElement).style.color = isActive ? "var(--cyan)" : "var(--text-secondary)")
                }
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* Auth */}
        <div className="hidden sm:flex items-center gap-3">
          {status === "loading" ? (
            <div
              className="w-20 h-7 rounded animate-pulse"
              style={{ background: "var(--bg-badge)" }}
              aria-hidden="true"
            />
          ) : session ? (
            <div className="flex items-center gap-3">
              {/* Avatar or initials */}
              {session.user?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={session.user.image}
                  alt={session.user.name ?? 'User avatar'}
                  className="w-7 h-7 rounded-full object-cover"
                  style={{ border: '1px solid var(--border-logo)' }}
                />
              ) : (
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: 'var(--bg-logo)', border: '1px solid var(--border-logo)', color: 'var(--cyan)' }}
                >
                  {session.user?.name?.charAt(0).toUpperCase() ?? 'U'}
                </div>
              )}
              {/* Name */}
              {session.user?.name && (
                <span className="text-xs font-medium hidden md:inline" style={{ color: 'var(--text-secondary)' }}>
                  {session.user.name.split(' ')[0]}
                </span>
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
              onClick={() => signIn(undefined, { callbackUrl: '/builds' })}
              className="px-4 py-1.5 rounded cursor-pointer text-xs font-semibold tracking-wider uppercase transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              style={{
                background: "var(--bg-badge)",
                border: "1px solid var(--border-badge)",
                color: "var(--cyan)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.background = "var(--bg-badge)";
                el.style.boxShadow = "0 0 16px var(--cyan-glow)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.background = "var(--bg-badge)";
                el.style.boxShadow = "none";
              }}
            >
              Sign in
            </button>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="sm:hidden flex flex-col gap-1 p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded"
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block w-5 h-px transition-all duration-200"
              style={{ background: "var(--cyan)" }}
            />
          ))}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="sm:hidden px-6 pb-4 pt-2 flex flex-col gap-4"
          style={{ borderTop: "1px solid var(--border-divider)" }}
          role="navigation"
          aria-label="Mobile navigation"
        >
          {[
            { href: "/catalog", label: "Catalog" },
            { href: "/builder", label: "Builder" },
            { href: "/builds", label: "Builds" },
          ].map(({ href, label }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className="text-sm font-medium tracking-wider uppercase"
                style={{ color: isActive ? "var(--cyan)" : "var(--text-secondary)" }}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            );
          })}
          {session ? (
            <>
              <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                {session.user?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={session.user.image} alt={session.user.name ?? 'User'} className="w-6 h-6 rounded-full object-cover" style={{ border: '1px solid var(--border-logo)' }} />
                ) : (
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'var(--bg-logo)', color: 'var(--cyan)' }}>
                    {session.user?.name?.charAt(0).toUpperCase() ?? 'U'}
                  </div>
                )}
                <span className="text-sm font-medium">{session.user?.name?.split(' ')[0]}</span>
              </div>
              <button
                onClick={() => { setMenuOpen(false); signOut({ callbackUrl: '/' }); }}
                className="text-left text-sm cursor-pointer font-medium tracking-wider uppercase"
                style={{ color: 'var(--text-muted)' }}
              >
                Sign out
              </button>
            </>
          ) : (
            <button
              onClick={() => { setMenuOpen(false); signIn(undefined, { callbackUrl: '/builds' }); }}
              className="text-left text-sm cursor-pointer font-medium tracking-wider uppercase"
              style={{ color: "var(--cyan)" }}
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
    <svg
      width="16"
      height="16"
      viewBox="0 0 22 22"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="5"
        y="5"
        width="12"
        height="12"
        rx="2"
        stroke="var(--cyan)"
        strokeWidth="1.5"
      />
      <rect
        x="8"
        y="8"
        width="6"
        height="6"
        rx="1"
        fill="var(--cyan)"
        opacity="0.6"
      />
      <line
        x1="8"
        y1="1"
        x2="8"
        y2="5"
        stroke="var(--cyan)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <line
        x1="14"
        y1="1"
        x2="14"
        y2="5"
        stroke="var(--cyan)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <line
        x1="8"
        y1="17"
        x2="8"
        y2="21"
        stroke="var(--violet)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <line
        x1="14"
        y1="17"
        x2="14"
        y2="21"
        stroke="var(--violet)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <line
        x1="1"
        y1="8"
        x2="5"
        y2="8"
        stroke="var(--cyan)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <line
        x1="1"
        y1="14"
        x2="5"
        y2="14"
        stroke="var(--cyan)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <line
        x1="17"
        y1="8"
        x2="21"
        y2="8"
        stroke="var(--violet)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <line
        x1="17"
        y1="14"
        x2="21"
        y2="14"
        stroke="var(--violet)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
