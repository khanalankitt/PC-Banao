'use client';

import { useEffect, useState } from 'react';

const BOOT_LINES = [
  { text: 'BUILDFORGE OS v3.1.0 — INITIALIZING...', delay: 0 },
  { text: 'Loading hardware profile engine......... OK', delay: 180 },
  { text: 'Mounting compatibility matrix............. OK', delay: 360 },
  { text: 'Connecting to component database.......... OK', delay: 540 },
  { text: 'AI inference module..................... READY', delay: 720 },
  { text: 'Authentication gateway................. ONLINE', delay: 900 },
];

interface Props {
  onComplete: () => void;
}

export default function BootSequence({ onComplete }: Props) {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    BOOT_LINES.forEach((line, i) => {
      const t = setTimeout(() => {
        setVisibleLines(i + 1);
      }, line.delay + 200);
      timers.push(t);
    });

    const finalTimer = setTimeout(() => {
      setDone(true);
      setTimeout(onComplete, 600);
    }, BOOT_LINES[BOOT_LINES.length - 1].delay + 800);
    timers.push(finalTimer);

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: 'var(--bg-void)' }}
      role="status"
      aria-label="System initializing"
    >
      <div
        className="w-full max-w-xl px-8 transition-opacity duration-500"
        style={{ opacity: done ? 0 : 1 }}
      >
        {/* Logo mark */}
        <div className="mb-8 flex items-center gap-3">
          <div
            className="w-8 h-8 rounded animate-pulse-glow"
            style={{
              background: 'linear-gradient(135deg, var(--cyan), var(--violet))',
              boxShadow: '0 0 20px var(--cyan-glow)',
            }}
          />
          <span
            className="font-mono text-sm tracking-[0.3em] uppercase"
            style={{ color: 'var(--cyan)' }}
          >
            BuildForge
          </span>
        </div>

        {/* Boot lines */}
        <div className="font-mono text-xs space-y-1" style={{ color: 'var(--text-secondary)' }}>
          {BOOT_LINES.map((line, i) => (
            <div
              key={i}
              className="flex items-center gap-2 transition-all duration-300"
              style={{
                opacity: i < visibleLines ? 1 : 0,
                transform: i < visibleLines ? 'translateX(0)' : 'translateX(-8px)',
              }}
              aria-hidden={i >= visibleLines}
            >
              <span style={{ color: 'var(--cyan)', opacity: 0.6 }}>{'>'}</span>
              <span>{line.text}</span>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div
          className="mt-8 h-[2px] rounded-full overflow-hidden"
          style={{ background: 'rgba(0,212,255,0.1)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${(visibleLines / BOOT_LINES.length) * 100}%`,
              background: 'linear-gradient(90deg, var(--cyan), var(--violet))',
              boxShadow: '0 0 8px var(--cyan)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
