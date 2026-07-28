"use client";

import {
  FileText,
  Brain,
  Target,
  Trophy,
} from "lucide-react";

interface Props {
  resume: any;
  interview: any;
  analysis: any;
}

function Card({
  title,
  value,
  icon,
  color,
}: any) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            {title}
          </p>

          <h2 className="mt-3 text-4xl font-black dark:text-white">
            {value}
          </h2>

        </div>

        <div
          className={`rounded-2xl p-4 ${color}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}

export default function CandidateScores({
  resume,
  interview,
  analysis,
}: Props) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

      <Card
        title="ATS Score"
        value={`${resume?.atsScore ?? 0}%`}
        icon={<FileText className="text-white" />}
        color="bg-blue-600"
      />

      <Card
        title="Interview"
        value={
          interview?.result?.overall ??
          0
        }
        icon={<Brain className="text-white" />}
        color="bg-violet-600"
      />

      <Card
        title="Job Match"
        value={`${analysis?.matchScore ?? 0}%`}
        icon={<Target className="text-white" />}
        color="bg-green-600"
      />

      <Card
        title="Recommendation"
        value={
          interview?.result
            ?.recommendation ??
          "Pending"
        }
        icon={<Trophy className="text-white" />}
        color="bg-orange-500"
      />

    </div>
  );
}
