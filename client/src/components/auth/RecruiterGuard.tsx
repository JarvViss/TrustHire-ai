"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { useHydrated } from "@/hooks/useHydrated";

export default function RecruiterGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const hydrated = useHydrated();

  useEffect(() => {
    if (!hydrated) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== "recruiter") {
      router.replace("/dashboard");
    }
  }, [hydrated, user, router]);

  if (!hydrated) return null;
  if (!user) return null;
  if (user.role !== "recruiter") return null;

  return <>{children}</>;
}
