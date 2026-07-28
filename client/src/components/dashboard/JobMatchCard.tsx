interface Props {
  score: number;
}

export default function JobMatchCard({
  score,
}: Props) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow dark:border-slate-700 dark:bg-slate-900">
      <h2 className="mb-5 text-2xl font-bold dark:text-white">
        Job Match Score
      </h2>

      <div className="text-7xl font-black text-indigo-600 dark:text-indigo-400">
        {score}%
      </div>
    </div>
  );
}