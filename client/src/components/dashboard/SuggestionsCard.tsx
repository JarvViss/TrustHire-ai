import { Sparkles } from "lucide-react";

import DashboardCard from "./DashboardCard";

interface Props {
  suggestions: string[];
}

export default function SuggestionsCard({
  suggestions,
}: Props) {
  return (
    <DashboardCard title="AI Suggestions">

      <div className="space-y-4">

        {suggestions?.length ? (
          suggestions.map((item, index) => (
            <div
              key={index}
              className="flex gap-3 rounded-2xl bg-blue-50 p-4 dark:bg-blue-900/20"
            >
              <Sparkles
                className="mt-1 text-blue-600 dark:text-blue-400"
                size={20}
              />

              <span className="dark:text-slate-200">{item}</span>

            </div>
          ))
        ) : (
          <p>No suggestions.</p>
        )}

      </div>

    </DashboardCard>
  );
}