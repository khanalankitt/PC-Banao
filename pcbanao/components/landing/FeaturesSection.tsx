'use client';

const FEATURES = [
  {
    accent: 'var(--cyan)',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
    title: 'AI Part Recommendations',
    desc: 'Describe your workload — gaming, editing, streaming — and the AI engine surfaces the best parts at your budget, ranked by performance-per-dollar.',
    tag: 'Intelligence',
  },
  {
    accent: 'var(--violet)',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Real-time Compatibility',
    desc: 'Every selection is validated instantly — CPU socket, RAM type, PSU headroom, case form factor, GPU clearance, and cooler TDP all checked in under 50ms.',
    tag: 'Compatibility',
  },
  {
    accent: 'var(--cyan)',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 6h16M4 12h16M4 18h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: 'Curated Part Catalog',
    desc: 'Browse CPUs, GPUs, motherboards, RAM, storage, PSUs, cases, and coolers with detailed specs, live pricing, and stock availability.',
    tag: 'Catalog',
  },
  {
    accent: 'var(--violet)',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Power & Wattage Tracking',
    desc: 'Your build\'s total power draw is computed live as you add components. Know your PSU headroom before you check out — no more under-speced power supplies.',
    tag: 'Power',
  },
  {
    accent: 'var(--cyan)',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: 'Community Builds',
    desc: 'Share your finished builds publicly and explore what others have created. Save any public build to your profile as a starting point.',
    tag: 'Community',
  },
  {
    accent: 'var(--violet)',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 21h8M12 17v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: 'One-Click Checkout',
    desc: 'Add an entire saved build to cart and check out in a single flow. Price snapshots lock in at order time so you never get a surprise at the end.',
    tag: 'Commerce',
  },
];

export default function FeaturesSection() {
  return (
    <section
      className="py-24 px-4 sm:px-6 max-w-6xl mx-auto"
      aria-labelledby="features-heading"
    >
      {/* Section header */}
      <div className="text-center mb-16">
        <p
          className="font-mono text-[11px] tracking-[0.3em] uppercase mb-3"
          style={{ color: 'var(--cyan)' }}
        >
          Platform Capabilities
        </p>
        <h2
          id="features-heading"
          className="text-3xl sm:text-4xl font-bold tracking-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          Everything your build needs
        </h2>
        <p
          className="mt-4 max-w-lg mx-auto text-sm leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          From first component to checkout — BuildForge handles compatibility,
          pricing, power, and community in one unified platform.
        </p>
      </div>

      {/* Feature grid */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        role="list"
        aria-label="Feature list"
      >
        {FEATURES.map((f) => (
          <FeatureCard key={f.title} {...f} />
        ))}
      </div>
    </section>
  );
}

function FeatureCard({
  accent,
  icon,
  title,
  desc,
  tag,
}: {
  accent: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  tag: string;
}) {
  return (
    <article
      role="listitem"
      className="group relative flex flex-col gap-4 p-6 rounded-xl transition-all duration-200"
      style={{
        background: 'rgba(8,18,32,0.6)',
        border: '1px solid rgba(0,212,255,0.07)',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget;
        el.style.borderColor = `${accent}30`;
        el.style.background = 'rgba(8,18,32,0.9)';
        el.style.transform = 'translateY(-2px)';
        el.style.boxShadow = `0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px ${accent}18`;
      }}
      onMouseLeave={e => {
        const el = e.currentTarget;
        el.style.borderColor = 'rgba(0,212,255,0.07)';
        el.style.background = 'rgba(8,18,32,0.6)';
        el.style.transform = 'translateY(0)';
        el.style.boxShadow = 'none';
      }}
    >
      {/* Icon */}
      <div
        className="w-11 h-11 flex items-center justify-center rounded-lg transition-colors duration-200"
        style={{
          background: `${accent}12`,
          border: `1px solid ${accent}22`,
          color: accent,
        }}
        aria-hidden="true"
      >
        {icon}
      </div>

      {/* Tag */}
      <span
        className="absolute top-5 right-5 font-mono text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-full"
        style={{
          background: `${accent}10`,
          border: `1px solid ${accent}20`,
          color: accent,
          opacity: 0.7,
        }}
      >
        {tag}
      </span>

      <div className="flex flex-col gap-2">
        <h3
          className="text-sm font-semibold tracking-wide"
          style={{ color: 'var(--text-primary)' }}
        >
          {title}
        </h3>
        <p
          className="text-xs leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          {desc}
        </p>
      </div>
    </article>
  );
}
