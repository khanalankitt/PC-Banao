import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PC Banao — AI-Powered PC Builder',
  description: 'Design, optimize, and build your perfect PC with AI-powered compatibility checking and a curated part catalog.',
};

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
