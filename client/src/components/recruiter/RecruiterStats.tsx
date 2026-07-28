"use client";

import {
  Users,
  FileText,
  Brain,
  ShieldCheck,
} from "lucide-react";

interface Props {
  stats: any;
}

const cards = [
  {
    title: "Candidates",
    key: "totalCandidates",
    icon: Users,
    color: "bg-blue-600",
  },
  {
    title: "Resumes",
    key: "totalResumes",
    icon: FileText,
    color: "bg-violet-600",
  },
  {
    title: "Interviews",
    key: "completedInterviews",
    icon: Brain,
    color: "bg-green-600",
  },
  {
    title: "Verified",
    key: "verifiedCandidates",
    icon: ShieldCheck,
    color: "bg-orange-500",
  },
];

export default function RecruiterStats({
  stats,
}: Props) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.key}
            className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-700 dark:bg-slate-900"
          >
            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {card.title}
                </p>

                <h2 className="mt-4 text-5xl font-black dark:text-white">
                  {stats?.[card.key] ?? 0}
                </h2>

              </div>

              <div
                className={`${card.color} rounded-2xl p-5`}
              >
                <Icon
                  size={30}
                  className="text-white"
                />
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
}
