'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useAuthStore } from '@/store/authStore';

export default function AuthSync() {
  const { data: session, status } = useSession();
  const { setAuth, clearAuth } = useAuthStore();

  useEffect(() => {
    if (status === 'authenticated' && session?.backendToken && session?.user) {
      setAuth(session.user, session.backendToken);
    } else if (status === 'unauthenticated') {
      clearAuth();
    }
  }, [status, session, setAuth, clearAuth]);

  return null;
}
