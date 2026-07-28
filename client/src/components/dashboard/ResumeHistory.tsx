"use client";

import { useResumeHistory } from "@/hooks/useResumeHistory";
import { useResumeStore } from "@/store/resume.store";

export default function ResumeHistory() {
  const { data, isLoading } = useResumeHistory();

  const { setAnalysis } = useResumeStore();

  if (isLoading) {
    return (
      <div className="rounded-2xl border bg-white p-6 shadow">
        Loading history...
      </div>
    );
  }

  const resumes = data?.data ?? [];

  if (!resumes.length) {
    return (
      <div className="rounded-2xl border bg-white p-6 shadow">
        No previous resumes.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-white p-6 shadow">
      <h2 className="mb-6 text-2xl font-bold">
        Previous Analyses
      </h2>

      <div className="space-y-4">
        {resumes.map((resume: any) => (
          <div
            key={resume._id}
            className="flex items-center justify-between rounded-xl border p-5 transition hover:border-blue-500 hover:shadow-md"
          >
            <div>
              <h3 className="font-bold">
                {resume.filename}
              </h3>

              <p className="text-sm text-slate-500">
                {new Date(
                  resume.createdAt
                ).toLocaleDateString()}
              </p>
            </div>

            <div className="flex items-center gap-5">
              <span className="rounded-full bg-blue-100 px-4 py-2 font-semibold text-blue-700">
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
