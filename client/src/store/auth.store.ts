import { create } from "zustand";
import { persist } from "zustand/middleware";

import { User } from "@/types/auth";
interface AuthState {
  user: User | null;
  token: string | null;

  login: (user: User, token: string) => void;
  logout: () => void;
  syncProfile: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,

      login: (user, token) =>
        set({
          user,
          token,
        }),

      logout: () =>
        set({
          user: null,
          token: null,
        }),

      syncProfile: (updates) =>
        set((state) => ({
          user: state.user
            ? { ...state.user, ...updates }
            : null,
        })),
    }),
    {
      name: "trusthire-auth",
    }
  )
);
