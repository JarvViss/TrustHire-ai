import { AlertTriangle } from "lucide-react";

import DashboardCard from "./DashboardCard";

interface Props {
  skills: string[];
}

export default function MissingSkillsCard({
  skills,
}: Props) {
  return (
    <DashboardCard title="Missing Skills">

      <div className="flex flex-wrap gap-3">

        {skills?.length ? (
          skills.map((skill) => (
            <div
              key={skill}
              className="flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            >
              <AlertTriangle size={18} />
              {skill}
            </div>
          ))
        ) : (
          <p>No missing skills 🎉</p>
        )}

      </div>

    </DashboardCard>
  );
}