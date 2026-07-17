import { create } from "zustand";
import { User } from "@/types/user";

interface AuthState {
  token: string | null;
  user: User | null;

  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;

  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,

  user: null,

  setToken: (token) => {
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("token", token);
      } else {
        localStorage.removeItem("token");
      }
    }

    set({ token });
  },

  setUser: (user) => set({ user }),

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }

    set({
      token: null,
      user: null,
    });
  },
}));