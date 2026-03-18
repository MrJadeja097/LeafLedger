import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getMe } from '../lib/api';

export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  walletAddress?: string;
  tokenBalance: string;
  treesPlanted: number;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  fetchMe: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,

      setToken: (token) => {
        localStorage.setItem('eco_token', token);
        set({ token });
      },

      setUser: (user) => set({ user }),

      fetchMe: async () => {
        set({ isLoading: true });
        try {
          const user = await getMe();
          set({ user, isLoading: false });
        } catch {
          set({ user: null, token: null, isLoading: false });
          localStorage.removeItem('eco_token');
        }
      },

      logout: () => {
        localStorage.removeItem('eco_token');
        set({ user: null, token: null });
      },
    }),
    { name: 'eco-auth', partialize: (s) => ({ token: s.token }) }
  )
);
