import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Community PC Builds — Browse & Clone Custom Configurations',
  description:
    'Browse hundreds of custom PC builds shared by the PC Banao community. Filter by budget, clone any build into the builder, and make it your own.',
  keywords: [
    'community pc builds',
    'pc build ideas india',
    'gaming pc configurations',
    'custom pc builds online',
    'clone pc build',
    'pc banao community',
  ],
  alternates: { canonical: 'https://pcbanao.khanalankit.com/builds' },
  openGraph: {
    url: 'https://pcbanao.khanalankit.com/builds',
    title: 'Community PC Builds | PC Banao',
    description:
      'Discover real custom PC builds from the PC Banao community. Clone any build directly into the builder and personalise it.',
  },
};

export default function BuildsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
