import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In — PC Banao',
  description: 'Sign in to PC Banao — the AI-powered PC builder platform.',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
