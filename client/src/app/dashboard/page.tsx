"use client";

import { useEffect } from "react";

import { useQuery } from "@tanstack/react-query";

import AuthGuard from "@/components/auth/AuthGuard";
import Navbar from "@/components/layout/Navbar";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ATSScoreCard from "@/components/dashboard/ATSScoreCard";
import SummaryCard from "@/components/dashboard/SummaryCard";
import SkillsCard from "@/components/dashboard/SkillsCard";
import StrengthsCard from "@/components/dashboard/StrengthsCard";
import MissingSkillsCard from "@/components/dashboard/MissingSkillsCard";
import SuggestionsCard from "@/components/dashboard/SuggestionsCard";
import ATSBarChart from "@/components/dashboard/charts/ATSBarChart";
import SkillsChart from "@/components/dashboard/charts/SkillsChart";

import { useResumeStore } from "@/store/resume.store";
import { useMyResumes } from "@/hooks/useMyResumes";
import { getResumeStats } from "@/services/resume.service";
import { RESUME_KEYS } from "@/constants/queryKeys";

export default function DashboardPage() {
  const { analysis, setAnalysis } =
    useResumeStore();

  const { data, isLoading } = useMyResumes();

  const { data: statsData, isError } = useQuery({
    queryKey: RESUME_KEYS.stats,
    queryFn: getResumeStats,
    enabled: !!analysis,
  });

  useEffect(() => {
    if (!analysis && data?.data?.length) {
      setAnalysis(data.data[0]);
    }
  }, [analysis, data, setAnalysis]);

  if (isLoading && !analysis) {
    return (
      <AuthGuard>
        <Navbar />

        <div className="flex min-h-[80vh] items-center justify-center text-2xl font-semibold dark:text-white">
          Loading...
        </div>
      </AuthGuard>
    );
  }

  if (!analysis) {
    return (
      <AuthGuard>
        <Navbar />

        <div className="flex min-h-[80vh] items-center justify-center text-2xl font-semibold dark:text-white">
          No Resume Analysis Found
        </div>
      </AuthGuard>
    );
  }

  const stats = statsData?.data;

  return (
    <AuthGuard>
      <Navbar />

      <main className="mx-auto max-w-7xl space-y-8 px-6 py-10">
        <DashboardHeader />

        <div className="grid gap-8 lg:grid-cols-2">
          <ATSScoreCard score={analysis.atsScore} />

          <SummaryCard summary={analysis.summary} />
        </div>

        <SkillsCard skills={analysis.skills} />

        <div className="grid gap-8 lg:grid-cols-2">
          <StrengthsCard strengths={analysis.strengths} />

          <MissingSkillsCard skills={analysis.missingSkills} />
        </div>

        <SuggestionsCard suggestions={analysis.suggestions} />

        <div className="grid gap-8 lg:grid-cols-2">
          {stats ? (
            <ATSBarChart
              yourScore={stats.ats.yourScore}
              platformAverage={stats.ats.platformAverage}
              percentile={stats.ats.percentile}
            />
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <h2 className="mb-6 text-2xl font-bold dark:text-white">
                ATS Score Comparison
              </h2>

              <div className="flex h-64 items-center justify-center text-slate-400">
                {isError
                  ? "Could not load stats."
                  : "Loading stats..."}
              </div>
            </div>
          )}

          {stats ? (
            <SkillsChart
              skillsFrequency={stats.skillsFrequency}
              userSkills={analysis.skills}
            />
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <h2 className="mb-6 text-2xl font-bold dark:text-white">
                Skills Distribution
              </h2>

              <div className="flex h-96 items-center justify-center text-slate-400">
                {isError
                  ? "Could not load stats."
                  : "Loading stats..."}
              </div>
            </div>
          )}
        </div>
      </main>
    </AuthGuard>
  );
}
