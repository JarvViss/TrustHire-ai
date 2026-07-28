"use client";

import { Button } from "@/components/ui/button";

interface Props {
  resume: any;

  onView: () => void;

  onDelete: () => void;
}

export default function ResumeCard({
  resume,
  onView,
  onDelete,
}: Props) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow dark:border-slate-700 dark:bg-slate-900">

      <h2 className="text-xl font-bold dark:text-white">
        {resume.filename}
      </h2>

      <p className="mt-2 dark:text-slate-200">
        ATS Score:
        <span className="font-bold text-blue-600 dark:text-blue-400">
          {" "}
          {resume.atsScore}
        </span>
      </p>

      <p className="mt-2 text-slate-500 dark:text-slate-400">
        {new Date(
          resume.createdAt
        ).toLocaleString()}
      </p>

      <div className="mt-6 flex gap-4">

        <Button
          variant="outline"
          onClick={onView}
        >
          View
        </Button>

        <Button
          variant="destructive"
          onClick={onDelete}
        >
          Delete
        </Button>

      </div>

    </div>
  );
}
