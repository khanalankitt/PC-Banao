const FEATURES = [
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="2" y="2" width="12" height="12" rx="2" stroke="var(--cyan)" strokeWidth="1.2" />
        <path d="M5 8h6M8 5v6" stroke="var(--cyan)" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
    title: 'AI-Powered Builds',
    desc: 'Get intelligent part recommendations tuned to your budget and use case.',
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="6" stroke="var(--cyan)" strokeWidth="1.2" />
        <path d="M5.5 8l2 2 3-3" stroke="var(--cyan)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Compatibility Engine',
    desc: 'Real-time checks across socket, TDP, power, form factor, and clearance.',
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M3 13L8 3l5 10H3z" stroke="var(--cyan)" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M6 10h4" stroke="var(--cyan)" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
    title: 'Part Catalog',
    desc: 'Thousands of CPUs, GPUs, and components with live pricing.',
  },
];

export default function FeatureHighlights() {
  return (
    <div className="grid grid-cols-3 gap-3 mt-8" role="list" aria-label="Platform features">
      {FEATURES.map((f) => (
        <div
          key={f.title}
          role="listitem"
          className="group flex flex-col gap-2 p-3 rounded-lg transition-all duration-200 cursor-default"
          style={{
            background: 'rgba(0,212,255,0.025)',
            border: '1px solid rgba(0,212,255,0.07)',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLDivElement).style.background = 'rgba(0,212,255,0.05)';
            (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(0,212,255,0.2)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLDivElement).style.background = 'rgba(0,212,255,0.025)';
            (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(0,212,255,0.07)';
          }}
        >
          <div className="w-7 h-7 flex items-center justify-center rounded"
            style={{ background: 'rgba(0,212,255,0.08)' }}>
            {f.icon}
          </div>
          <p className="text-[11px] font-semibold tracking-wide" style={{ color: 'var(--text-primary)' }}>
            {f.title}
          </p>
          <p className="text-[10px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            {f.desc}
          </p>
        </div>
      ))}
    </div>
  );
}
