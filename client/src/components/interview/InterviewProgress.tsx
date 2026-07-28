"use client";

interface Props {
  current: number;
  total: number;
}

export default function InterviewProgress({
  current,
  total,
}: Props) {
  const percentage = Math.min(
    (current / total) * 100,
    100
  );

  return (
    <div className="mb-8">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-semibold text-slate-700 dark:text-slate-300">
          Interview Progress
        </span>

        <span className="font-bold text-blue-600 dark:text-blue-400">
          Question {current} / {total}
        </span>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <div
          className="h-full rounded-full bg-blue-600 transition-all duration-500 dark:bg-blue-500"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}
