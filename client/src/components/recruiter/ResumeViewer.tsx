"use client";

interface Props {
  url?: string;
}

export default function ResumeViewer({
  url,
}: Props) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">

      <h2 className="mb-6 text-2xl font-bold dark:text-white">
        Resume Preview
      </h2>

      {!url ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-16 text-center text-slate-500 dark:border-slate-600 dark:text-slate-400">
          Resume not uploaded.
        </div>
      ) : (
        <iframe
          src={url}
          className="h-[900px] w-full rounded-xl border border-slate-200 dark:border-slate-700"
        />
      )}

    </div>
  );
}
