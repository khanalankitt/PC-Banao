import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In — BuildForge',
  description: 'Sign in to BuildForge — the AI-powered PC builder platform.',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
