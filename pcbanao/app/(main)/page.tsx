import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import StatsBar from '@/components/landing/StatsBar';
import FeaturesSection from '@/components/landing/FeaturesSection';
import CtaSection from '@/components/landing/CtaSection';
import Footer from '@/components/landing/Footer';

export default function LandingPage() {
  return (
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
  );
}
