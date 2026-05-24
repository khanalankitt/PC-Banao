import type { Metadata } from 'next';
import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import StatsBar from '@/components/landing/StatsBar';
import FeaturesSection from '@/components/landing/FeaturesSection';
import CtaSection from '@/components/landing/CtaSection';
import Footer from '@/components/landing/Footer';

const SITE_URL = 'https://pcbanao.khanalankit.com';

export const metadata: Metadata = {
  title: 'PC Banao — Free AI-Powered PC Builder & Compatibility Checker',
  description:
    'Build your perfect custom PC online with PC Banao. AI-driven part compatibility, live wattage tracking, curated component catalog, and community builds — 100% free.',
  alternates: { canonical: SITE_URL },
  openGraph: {
    url: SITE_URL,
    title: 'PC Banao — Free AI-Powered PC Builder',
    description:
      'PC Banao helps you design the perfect custom PC. Pick your parts, check compatibility instantly, and share your build with the community.',
  },
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'PC Banao',
  url: SITE_URL,
  description:
    'Free AI-powered PC builder with instant compatibility checking, live wattage tracking, and a curated component catalog.',
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/catalog?q={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
};

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'PC Banao',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  sameAs: [],
};

export default function LandingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <div className="relative min-h-screen flex flex-col" style={{ background: 'var(--bg-void)' }}>
        <Navbar />
        <main id="main-content" className="flex-1">
          <HeroSection />
          <StatsBar />
          <FeaturesSection />
          <CtaSection />
        </main>
        <Footer />
      </div>
    </>
  );
}
