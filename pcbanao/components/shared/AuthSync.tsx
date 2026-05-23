'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useAuthStore } from '@/store/authStore';

export default function AuthSync() {
  const { data: session, status } = useSession();
  const { setAuth, clearAuth } = useAuthStore();

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      // backendToken may be undefined if the backend was unreachable at sign-in;
      // still sync the user so the UI shows name/avatar correctly.
      setAuth(session.user, session.backendToken ?? '');
    } else if (status === 'unauthenticated') {
      clearAuth();
    }
  }, [status, session, setAuth, clearAuth]);

  return null;
}
