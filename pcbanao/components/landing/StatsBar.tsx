'use client';

const STATS = [
  { value: '10,000+', label: 'Components in catalog', icon: '🗂️' },
  { value: '50ms',    label: 'Compatibility check',   icon: '⚡' },
  { value: '8',       label: 'Part categories',        icon: '📦' },
  { value: '99.9%',   label: 'Uptime SLA',             icon: '🛡️' },
];

export default function StatsBar() {
  return (
    <section
      aria-label="Platform statistics"
      className="relative py-14"
      style={{
        borderTop: '1px solid var(--border-divider)',
        borderBottom: '1px solid var(--border-divider)',
        background: 'var(--bg-surface)',
      }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          {STATS.map(({ value, label, icon }) => (
            <div key={label} className="flex flex-col items-center gap-2 text-center">
              <span className="text-2xl" aria-hidden="true">{icon}</span>
              <dt
                className="text-3xl sm:text-4xl font-extrabold tracking-tight"
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
                style={{ color: 'var(--text-secondary)' }}
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
