import type { Metadata } from 'next';

const SITE_URL = 'https://pcbanao.khanalankit.com';

export const metadata: Metadata = {
  alternates: { canonical: SITE_URL },
};

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
