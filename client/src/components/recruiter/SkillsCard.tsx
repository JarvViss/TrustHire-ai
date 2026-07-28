"use client";

interface Props {
  skills: string[];
  missingSkills: string[];
}

export default function SkillsCard({
  skills,
  missingSkills,
}: Props) {
  return (
    <div className="grid gap-8 lg:grid-cols-2">

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">

        <h2 className="mb-6 text-2xl font-bold dark:text-white">
          Skills
        </h2>

        <div className="flex flex-wrap gap-3">

          {skills.length ? (
            skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-blue-100 px-4 py-2 font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
              >
                {skill}
              </span>
            ))
          ) : (
            <p className="dark:text-slate-400">No skills available</p>
          )}

        </div>

      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">

        <h2 className="mb-6 text-2xl font-bold dark:text-white">
          Missing Skills
        </h2>

        <div className="flex flex-wrap gap-3">

          {missingSkills.length ? (
            missingSkills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-red-100 px-4 py-2 font-medium text-red-600 dark:bg-red-900/30 dark:text-red-400"
              >
                {skill}
              </span>
            ))
          ) : (
            <p className="dark:text-slate-400">No missing skills</p>
          )}

        </div>

      </div>

    </div>
  );
}
