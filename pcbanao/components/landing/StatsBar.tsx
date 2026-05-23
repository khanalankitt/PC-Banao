'use client';

const STATS = [
  { value: '10,000+', label: 'Components in catalog' },
  { value: '50ms',    label: 'Compatibility check' },
  { value: '8',       label: 'Part categories' },
  { value: '99.9%',   label: 'Uptime SLA' },
];

export default function StatsBar() {
  return (
    <section
      aria-label="Platform statistics"
      className="relative py-12"
      style={{ borderTop: '1px solid rgba(0,212,255,0.06)', borderBottom: '1px solid rgba(0,212,255,0.06)' }}
    >
      {/* Top line glow */}
      <div
        className="absolute top-0 left-1/4 right-1/4 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, var(--cyan), transparent)' }}
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          {STATS.map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center gap-1 text-center">
              <dt
                className="text-3xl sm:text-4xl font-bold tracking-tight"
                style={{
                  background: 'linear-gradient(135deg, var(--cyan), var(--violet))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {value}
              </dt>
              <dd
                className="font-mono text-[11px] tracking-widest uppercase"
                style={{ color: 'var(--text-muted)' }}
              >
                {label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
