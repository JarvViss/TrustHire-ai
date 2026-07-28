"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import AuthGuard from "@/components/auth/AuthGuard";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Trophy,
  MessageSquare,
  ArrowRight,
} from "lucide-react";

async function fetchInterviewHistory() {
  const { data } = await api.get(
    "/interview/history"
  );
  return data.data;
}

export default function InterviewHistoryPage() {
  const { data: interviews, isLoading } = useQuery({
    queryKey: ["interviewHistory"],
    queryFn: fetchInterviewHistory,
  });

  if (isLoading) {
    return (
      <AuthGuard>
        <Navbar />
        <div className="flex min-h-screen items-center justify-center text-xl dark:text-white">
          Loading interview history...
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <Navbar />

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-black dark:text-white">
            Interview History
          </h1>

          <Link href="/interview">
            <Button>New Interview</Button>
          </Link>
        </div>

        {!interviews?.length ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-16 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <MessageSquare className="mx-auto mb-4 h-12 w-12 text-slate-300 dark:text-slate-600" />
            <h2 className="text-2xl font-bold dark:text-white">
              No Interviews Yet
            </h2>
            <p className="mt-3 text-slate-500 dark:text-slate-400">
              Start your first mock interview to
              see results here.
            </p>
            <Link href="/interview">
              <Button className="mt-6">
                Start Interview
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {interviews.map(
              (interview: any) => (
                <Link
                  key={interview._id}
                  href={`/interview/result/${interview._id}`}
                >
                  <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-900/30">
                          <Trophy className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                        </div>

                        <div>
                          <h3 className="text-xl font-bold dark:text-white">
                            {interview.role}
                          </h3>

                          <div className="mt-1 flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              {new Date(
                                interview.createdAt
                              ).toLocaleDateString()}
                            </span>
                            <span
                              className={`rounded-full px-3 py-0.5 text-xs font-semibold ${
                                interview.status ===
                                "COMPLETED"
                                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                  : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                              }`}
                            >
                              {interview.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-8">
                        {interview.status ===
                          "COMPLETED" &&
                          interview.result && (
                            <>
                              <div className="text-center">
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                  Overall
                                </p>
                                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                  {
                                    interview.result
                                      .overall
                                  }
                                  /10
                                </p>
                              </div>

                              <div className="text-center">
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                  Technical
                                </p>
                                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                  {
                                    interview.result
                                      .technical
                                  }
                                  /10
                                </p>
                              </div>

                              <div className="text-center">
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                  Communication
                                </p>
                                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                  {
                                    interview.result
                                      .communication
                                  }
                                  /10
                                </p>
                              </div>
                            </>
                          )}

                        <ArrowRight className="h-5 w-5 text-slate-400" />
                      </div>
                    </div>
                  </div>
                </Link>
              )
            )}
          </div>
        )}
      </main>
    </AuthGuard>
  );
}
