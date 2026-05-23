import { create } from 'zustand';
import { BackendUser } from '@/lib/auth/authApi';

interface AuthState {
  user: BackendUser | null;
  token: string | null;
  setAuth: (user: BackendUser, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user:  null,
  token: null,
  setAuth:   (user, token) => set({ user, token }),
  clearAuth: () => set({ user: null, token: null }),
}));
