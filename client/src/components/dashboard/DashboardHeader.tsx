"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { useResumeStore } from "@/store/resume.store";

export default function DashboardHeader() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const clear = useResumeStore((state) => state.clear);

  const handleLogout = () => {
    logout();
    clear();
    router.push("/login");
  };

  return (
    <div className="mb-10 flex items-center justify-between">
      <div>
        <h1 className="text-5xl font-black dark:text-white">
          Resume Dashboard
        </h1>

        <p className="mt-2 text-slate-500 dark:text-slate-400">
          AI Resume Analysis Report
        </p>
      </div>

      <Button
        variant="outline"
        onClick={handleLogout}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </Button>
    </div>
  );
}