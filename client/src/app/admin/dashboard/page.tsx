"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import AdminGuard from "@/components/auth/AdminGuard";
import Navbar from "@/components/layout/Navbar";
import {
  Users,
  FileText,
  MessageSquare,
  Briefcase,
  UserCheck,
  BarChart3,
} from "lucide-react";

async function fetchAdminStats() {
  const { data } = await api.get("/admin/stats");
  return data.stats;
}

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["adminStats"],
    queryFn: fetchAdminStats,
  });

  if (isLoading) {
    return (
      <AdminGuard>
        <Navbar />
        <div className="flex min-h-screen items-center justify-center text-xl dark:text-white">
          Loading admin dashboard...
        </div>
      </AdminGuard>
    );
  }

  const cards = [
    {
      label: "Total Users",
      value: stats?.totalUsers ?? 0,
      icon: Users,
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    },
    {
      label: "Candidates",
      value: stats?.totalCandidates ?? 0,
      icon: UserCheck,
      color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
    },
    {
      label: "Recruiters",
      value: stats?.totalRecruiters ?? 0,
      icon: Users,
      color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    },
    {
      label: "Resumes",
      value: stats?.totalResumes ?? 0,
      icon: FileText,
      color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
    },
    {
      label: "Interviews",
      value: stats?.totalInterviews ?? 0,
      icon: MessageSquare,
      color: "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400",
    },
    {
      label: "Job Analyses",
      value: stats?.totalJobAnalyses ?? 0,
      icon: Briefcase,
      color: "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400",
    },
  ];

  return (
    <AdminGuard>
      <Navbar />

      <main className="mx-auto max-w-7xl space-y-8 p-8">
        <h1 className="text-4xl font-black dark:text-white">
          Admin Dashboard
        </h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.label}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {card.label}
                  </p>
                  <p className="mt-2 text-4xl font-black dark:text-white">
                    {card.value}
                  </p>
                </div>

                <div
                  className={`rounded-2xl p-4 ${card.color}`}
                >
                  <card.icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </AdminGuard>
  );
}
