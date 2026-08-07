"use client";

import { useEffect, useState } from "react";

import api from "@/lib/axios";
import { useAuthStore } from "@/store/auth.store";

export function useAuthBootstrap(): boolean {
  const logout = useAuthStore((state) => state.logout);
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    if (!useAuthStore.persist.hasHydrated()) return;

    let cancelled = false;

    (async () => {
      try {
        if (useAuthStore.getState().user) {
          await api.get("/user/me");
        }
      } catch (err: any) {
        if (err?.response?.status === 401) {
          logout();
        }
      } finally {
        if (!cancelled) setValidated(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [logout]);

  return validated;
}
