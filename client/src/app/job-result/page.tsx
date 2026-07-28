"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import AuthGuard from "@/components/auth/AuthGuard";
import Navbar from "@/components/layout/Navbar";

import JobMatchCard from "@/components/dashboard/JobMatchCard";
import MissingSkillsCard from "@/components/dashboard/MissingSkillsCard";

import { useJobStore } from "@/store/job.store";
import { getLatestJobAnalysis } from "@/services/job.service";

export default function JobResultPage() {
  const { result, setResult } = useJobStore();
  const [ready, setReady] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["latestJobAnalysis"],
    queryFn: getLatestJobAnalysis,
    enabled: !result,
  });

  useEffect(() => {
    if (result) {
      setReady(true);
      return;
    }

    if (data?.data) {
      setResult(data.data);
      setReady(true);
    }
  }, [data, result, setResult]);

  if (isLoading || !ready) {
    return (
      <AuthGuard>
        <Navbar />
        <div className="flex min-h-screen items-center justify-center text-xl dark:text-white">
          Loading...
        </div>
      </AuthGuard>
    );
  }

  if (!result) {
    return (
      <AuthGuard>
        <Navbar />
        <div className="flex min-h-screen items-center justify-center text-2xl dark:text-white">
          No Job Analysis Found
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <Navbar />

      <main className="mx-auto max-w-6xl space-y-8 px-6 py-10">
        <h1 className="text-5xl font-black dark:text-white">
          AI Job Match Result
        </h1>

        <JobMatchCard score={result.matchScore} />

        <MissingSkillsCard
          skills={result.missingSkills}
        />

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow dark:border-slate-700 dark:bg-slate-900">
          <h2 className="mb-4 text-2xl font-bold dark:text-white">
            Recommendation
          </h2>
          <p className="dark:text-slate-200">{result.recommendation}</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow dark:border-slate-700 dark:bg-slate-900">
          <h2 className="mb-4 text-2xl font-bold dark:text-white">
            Interview Readiness
          </h2>
          <div className="text-7xl font-black text-green-600 dark:text-green-400">
            {result.interviewReadiness}/10
          </div>
        </div>
      </main>
    </AuthGuard>
  );
}
