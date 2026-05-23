"use client";

const FEATURES = [
  {
    accent: "var(--cyan)",
    emoji: "🧠",
    title: "AI Part Recommendations",
    desc: "Describe your workload — gaming, editing, streaming — and get the best parts at your budget, ranked by performance-per-dollar.",
    tag: "Intelligence",
  },
  {
    accent: "var(--violet)",
    emoji: "⚡",
    title: "Real-time Compatibility",
    desc: "CPU socket, RAM type, PSU headroom, case form factor, GPU clearance, cooler TDP — all validated under 50ms as you pick.",
    tag: "Compatibility",
  },
  {
    accent: "var(--cyan)",
    emoji: "🗂️",
    title: "Curated Part Catalog",
    desc: "CPUs, GPUs, motherboards, RAM, storage, PSUs, cases and coolers with detailed specs, live pricing, and stock availability.",
    tag: "Catalog",
  },
  {
    accent: "var(--violet)",
    emoji: "🔌",
    title: "Power & Wattage Tracking",
    desc: "Your build's total draw is computed live as you add parts. Know your PSU headroom before you checkout — no surprises.",
    tag: "Power",
  },
  {
    accent: "var(--cyan)",
    emoji: "👥",
    title: "Community Builds",
    desc: "Share your finished builds publicly and explore what others created. Save any public build as a starting point.",
    tag: "Community",
  },
  {
    accent: "var(--violet)",
    emoji: "🛒",
    title: "One-Click Checkout",
    desc: "Add your entire saved build to cart and checkout in a single flow. Price snapshots lock in at order time.",
    tag: "Commerce",
  },
];

export default function FeaturesSection() {
  return (
    <section className="relative" aria-labelledby="features-heading">
      {/* Photo banner */}
      <div className="relative h-64 sm:h-72 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=1600&q=80&fit=crop"
          alt="PC components spread out — motherboard, GPU, CPU"
          className="w-full h-full object-cover opacity-50"
          style={{ objectPosition: "center 40%" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(2,4,8,0.4) 0%, rgba(2,4,8,0.6) 50%, var(--bg-void) 100%)",
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <p
            className="font-mono text-sm font-semibold tracking-[0.3em] uppercase mb-3"
            style={{ color: "var(--cyan)" }}
          >
            Platform Capabilities
          </p>
          <h2
            id="features-heading"
            className="text-3xl sm:text-5xl font-extrabold"
            style={{
              color: "#ffffff",
              textShadow: "0 2px 20px rgba(0,0,0,0.9)",
            }}
          >
            Everything your build needs
          </h2>
          <p
            className="mt-4 max-w-xl text-base sm:text-lg leading-relaxed"
            style={{
              color: "rgba(255,255,255,0.75)",
              textShadow: "0 1px 8px rgba(0,0,0,0.7)",
            }}
          >
            From first component to checkout — compatibility, pricing, power,
            and community in one place.
          </p>
        </div>
      </div>

      {/* Feature cards */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          role="list"
          aria-label="Feature list"
        >
          {FEATURES.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  accent,
  emoji,
  title,
  desc,
  tag,
}: {
  accent: string;
  emoji: string;
  title: string;
  desc: string;
  tag: string;
}) {
  return (
    <article
      role="listitem"
      className="group relative flex flex-col gap-4 p-6 rounded-2xl transition-all duration-200 cursor-default"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-subtle)",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = accent;
        el.style.background = "var(--bg-card-hover)";
        el.style.transform = "translateY(-3px)";
        el.style.boxShadow = `0 12px 40px rgba(0,0,0,0.35)`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = "var(--border-subtle)";
        el.style.background = "var(--bg-card)";
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "none";
      }}
    >
      {/* Emoji icon */}
      <div className="text-3xl leading-none select-none" aria-hidden="true">
        {emoji}
      </div>

      {/* Tag pill */}
      <span
        className="absolute top-5 right-5 font-mono text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-full"
        style={{
          background: `${accent}18`,
          border: `1px solid ${accent}30`,
          color: accent,
        }}
      >
        {tag}
      </span>

      <div>
        <h3
          className="text-base font-bold mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          {title}
        </h3>
        <p
          className="text-sm leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          {desc}
        </p>
      </div>
    </article>
  );
}
