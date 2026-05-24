import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PC Builder — Pick Parts & Check Compatibility',
  description:
    'Use the PC Banao builder to select your CPU, GPU, RAM, storage, PSU, and more. Get instant AI-driven compatibility checks and live wattage tracking as you build.',
  keywords: [
    'pc banao builder',
    'pc builder online',
    'custom pc builder india',
    'cpu gpu compatibility checker',
    'pc wattage calculator',
    'build gaming pc online',
  ],
  alternates: { canonical: 'https://pcbanao.khanalankit.com/builder' },
  openGraph: {
    url: 'https://pcbanao.khanalankit.com/builder',
    title: 'PC Banao Builder — Build Your Custom PC Online',
    description:
      'Pick your parts and PC Banao checks CPU-motherboard socket compatibility, PSU wattage, and RAM slots in real time.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'PC Banao Builder',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  url: 'https://pcbanao.khanalankit.com/builder',
  description:
    'Free online PC builder with AI-powered compatibility checking. Select CPU, GPU, RAM, storage, PSU, case, and cooler — get real-time wattage and compatibility results.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function BuilderLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
