'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// OAuth signup is automatic on first login — no separate register flow needed.
export default function RegisterPage() {
  const router = useRouter();
  useEffect(() => { router.replace('/login'); }, [router]);
  return null;
}
