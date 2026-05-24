import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PC Parts Catalog — CPUs, GPUs, RAM, Storage & More',
  description:
    'Browse the PC Banao parts catalog. Find CPUs, GPUs, motherboards, RAM, SSDs, PSUs, cases, and coolers with specs, prices, and wattage — then add them directly to your build.',
  keywords: [
    'pc parts catalog india',
    'buy cpu gpu india',
    'pc components price list',
    'best gaming parts india',
    'pc banao catalog',
    'motherboard ram ssd price',
  ],
  alternates: { canonical: 'https://pcbanao.khanalankit.com/catalog' },
  openGraph: {
    url: 'https://pcbanao.khanalankit.com/catalog',
    title: 'PC Parts Catalog | PC Banao',
    description:
      'Curated catalog of CPUs, GPUs, RAM, SSDs, PSUs, and more. Compare specs and prices, then add parts directly to your PC Banao build.',
  },
};

export default function CatalogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
