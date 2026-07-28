import { CheckCircle2 } from "lucide-react";

import DashboardCard from "./DashboardCard";

interface Props {
  strengths: string[];
}

export default function StrengthsCard({
  strengths,
}: Props) {
  return (
    <DashboardCard title="Strengths">

      <div className="space-y-4">

        {strengths?.length ? (
          strengths.map((strength) => (
            <div
              key={strength}
              className="flex items-center gap-3 rounded-2xl bg-green-50 p-4 dark:bg-green-900/20"
            >
              <CheckCircle2
                className="text-green-600 dark:text-green-400"
                size={22}
              />

              <span className="dark:text-slate-200">{strength}</span>

            </div>
          ))
        ) : (
          <p>No strengths found.</p>
        )}

      </div>

    </DashboardCard>
  );
}