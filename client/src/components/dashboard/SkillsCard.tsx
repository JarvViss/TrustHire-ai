"use client";

import { BadgeCheck } from "lucide-react";

import DashboardCard from "./DashboardCard";

interface Props {
  skills: string[];
}

export default function SkillsCard({
  skills,
}: Props) {
  return (
    <DashboardCard title="Technical Skills">

      <div className="mb-5 flex items-center gap-2 text-blue-600 dark:text-blue-400">
        <BadgeCheck size={22} />
        <span className="font-semibold dark:text-slate-200">
          Skills detected from your resume
        </span>
      </div>

      <div className="flex flex-wrap gap-3">

        {skills?.map((skill) => (
          <span
            key={skill}
            className="rounded-full bg-blue-100 px-4 py-2 font-medium text-blue-700 transition hover:scale-105 dark:bg-blue-900/30 dark:text-blue-400"
          >
            {skill}
          </span>
        ))}

      </div>

    </DashboardCard>
  );
}