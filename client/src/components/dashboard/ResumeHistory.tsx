"use client";

import { useResumeHistory } from "@/hooks/useResumeHistory";
import { useResumeStore } from "@/store/resume.store";

export default function ResumeHistory() {
  const { data, isLoading } = useResumeHistory();

  const { setAnalysis } = useResumeStore();

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow dark:border-slate-700 dark:bg-slate-900">
        <p className="dark:text-white">Loading history...</p>
      </div>
    );
  }

  const resumes = data?.data ?? [];

  if (!resumes.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow dark:border-slate-700 dark:bg-slate-900">
        <p className="dark:text-white">No previous resumes.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow dark:border-slate-700 dark:bg-slate-900">
      <h2 className="mb-6 text-2xl font-bold dark:text-white">
        Previous Analyses
      </h2>

      <div className="space-y-4">
        {resumes.map((resume: any) => (
          <div
            key={resume._id}
            className="flex items-center justify-between rounded-xl border border-slate-200 p-5 transition hover:border-blue-500 hover:shadow-md dark:border-slate-700 dark:hover:border-blue-500"
          >
            <div>
              <h3 className="font-bold dark:text-white">
                {resume.filename}
              </h3>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                {new Date(
                  resume.createdAt
                ).toLocaleDateString()}
              </p>
            </div>

            <div className="flex items-center gap-5">
              <span className="rounded-full bg-blue-100 px-4 py-2 font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                ATS {resume.atsScore}
              </span>

              <button
                onClick={() => setAnalysis(resume)}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
