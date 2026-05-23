'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';

interface Props {
  provider: 'google' | 'facebook';
  label: string;
  icon: React.ReactNode;
  callbackUrl?: string;
  className?: string;
}

export default function OAuthButton({
  provider,
  label,
  icon,
  callbackUrl = '/',
  className = '',
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await signIn(provider, { callbackUrl });
    } catch {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`oauth-btn cursor-pointer  w-full flex items-center gap-4 px-5 py-4 rounded-lg glass-panel
        transition-all duration-250 disabled:opacity-60 disabled:cursor-not-allowed
        focus-visible:ring-2 focus-visible:ring-cyan-400 ${className}`}
      aria-label={loading ? `Connecting via ${provider}…` : `${label}`}
      aria-busy={loading}
    >
      {/* Icon slot */}
      <span
        className="w-8 h-8 flex items-center justify-center rounded flex-shrink-0 transition-transform duration-200"
        style={{ background: 'var(--bg-icon-slot)' }}
        aria-hidden="true"
      >
        {loading ? <Spinner /> : icon}
      </span>

      {/* Label */}
      <span
        className="flex-1 text-sm font-medium text-left tracking-wide transition-colors"
        style={{ color: loading ? 'var(--text-secondary)' : 'var(--text-primary)' }}
      >
        {loading ? `Connecting via ${provider}…` : label}
      </span>

      {/* Chevron */}
      {!loading && (
        <svg
          width="14" height="14"
          viewBox="0 0 14 14"
          fill="none"
          className="opacity-30 group-hover:opacity-70 transition-opacity"
          aria-hidden="true"
        >
          <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}

function Spinner() {
  return (
    <svg
      width="16" height="16"
      viewBox="0 0 16 16"
      fill="none"
      className="animate-spin"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="6" stroke="var(--border-badge)" strokeWidth="2" />
      <path
        d="M8 2a6 6 0 0 1 6 6"
        stroke="var(--cyan)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
