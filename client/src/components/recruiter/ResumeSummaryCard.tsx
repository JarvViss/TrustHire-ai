"use client";

interface Props {
  summary?: string;
}

export default function ResumeSummaryCard({
  summary,
}: Props) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">

      <h2 className="mb-6 text-2xl font-bold dark:text-white">
        Resume Summary
      </h2>

      <p className="leading-8 text-slate-600 dark:text-slate-400">
        {summary ||
          "No resume summary available."}
      </p>

    </div>
  );
}
