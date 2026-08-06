"use client";

import { useState } from "react";
import AuthGuard from "@/components/auth/AuthGuard";
import Navbar from "@/components/layout/Navbar";
import { CardSkeleton } from "@/components/common/Skeleton";
import { useResumeHistory } from "@/hooks/useResumeHistory";
import {
  BarChart3,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export default function ComparePage() {
  const [selected, setSelected] = useState<
    string[]
  >([]);

  const { data, isLoading } = useResumeHistory();

  const resumes = data?.data ?? [];

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : prev.length < 3
        ? [...prev, id]
        : prev
    );
  };

  const compared = resumes.filter((r: any) =>
    selected.includes(r._id)
  );

  if (isLoading) {
    return (
      <AuthGuard>
        <Navbar />
        <div className="mx-auto max-w-6xl px-6 py-10">
          <CardSkeleton />
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="mb-2 text-4xl font-black dark:text-white">
          Compare Resumes
        </h1>
        <p className="mb-8 text-slate-500 dark:text-slate-400">
          Select up to 3 resumes to compare side by
          side.
        </p>

        {/* Resume selector */}
        <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {resumes.map((resume: any) => (
            <button
              key={resume._id}
              onClick={() => toggle(resume._id)}
              className={`rounded-3xl border-2 p-6 text-left transition ${
                selected.includes(resume._id)
                  ? "border-blue-500 bg-blue-50 shadow-lg dark:bg-blue-900/20"
                  : "border-slate-200 bg-white hover:border-blue-300 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-blue-600"
              }`}
            >
              <h3 className="font-bold dark:text-white">
                {resume.filename}
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {new Date(
                  resume.createdAt
                ).toLocaleDateString()}
              </p>
              <p className="mt-2 text-2xl font-bold text-blue-600 dark:text-blue-400">
                {resume.atsScore}%
                <span className="text-sm font-normal text-slate-500 dark:text-slate-400">
                  {" "}
                  ATS
                </span>
              </p>
            </button>
          ))}
        </div>

        {/* Comparison table */}
        {compared.length >= 2 && (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold dark:text-white">
              <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              Comparison
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="pb-4 pr-8 font-semibold text-slate-500 dark:text-slate-400">
                      Metric
                    </th>
                    {compared.map((r: any) => (
                      <th
                        key={r._id}
                        className="pb-4 text-center font-bold dark:text-white"
                      >
                        {r.filename}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <td className="py-4 pr-8 font-medium dark:text-slate-200">
                      ATS Score
                    </td>
                    {compared.map((r: any) => (
                      <td
                        key={r._id}
                        className="py-4 text-center text-2xl font-bold text-blue-600 dark:text-blue-400"
                      >
                        {r.atsScore}%
                      </td>
                    ))}
                  </tr>

                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <td className="py-4 pr-8 font-medium dark:text-slate-200">
                      Skills Count
                    </td>
                    {compared.map((r: any) => (
                      <td
                        key={r._id}
                        className="py-4 text-center text-lg font-bold"
                      >
                        {r.skills?.length ?? 0}
                      </td>
                    ))}
                  </tr>

                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <td className="py-4 pr-8 font-medium dark:text-slate-200">
                      Strengths
                    </td>
                    {compared.map((r: any) => (
                      <td
                        key={r._id}
                        className="py-4"
                      >
                        <ul className="space-y-1">
                          {r.strengths
                            ?.slice(0, 3)
                            .map(
                              (
                                s: string,
                                i: number
                              ) => (
                                <li
                                  key={i}
                                  className="flex items-center gap-1 text-xs"
                                >
                                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                                  {s}
                                </li>
                              )
                            )}
                        </ul>
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="py-4 pr-8 font-medium dark:text-slate-200">
                      Missing Skills
                    </td>
                    {compared.map((r: any) => (
                      <td
                        key={r._id}
                        className="py-4"
                      >
                        <ul className="space-y-1">
                          {r.missingSkills
                            ?.slice(0, 3)
                            .map(
                              (
                                s: string,
                                i: number
                              ) => (
                                <li
                                  key={i}
                                  className="flex items-center gap-1 text-xs"
                                >
                                  <XCircle className="h-3 w-3 text-red-500" />
                                  {s}
                                </li>
                              )
                            )}
                        </ul>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {compared.length < 2 && resumes.length >= 2 && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center dark:border-slate-700 dark:bg-slate-900">
            <p className="text-lg text-slate-500 dark:text-slate-400">
              Select at least 2 resumes to compare.
            </p>
          </div>
        )}

        {resumes.length < 2 && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center dark:border-slate-700 dark:bg-slate-900">
            <p className="text-lg text-slate-500 dark:text-slate-400">
              Upload at least 2 resumes to compare
              them.
            </p>
          </div>
        )}
      </main>
    </AuthGuard>
  );
}
