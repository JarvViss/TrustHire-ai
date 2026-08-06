interface Props {
  title: string;
  value: string;
}

export default function StatCard({
  title,
  value,
}: Props) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow dark:border-slate-700 dark:bg-slate-900">

      <h3 className="text-lg font-semibold text-slate-500 dark:text-slate-400">
        {title}
      </h3>

      <div className="mt-6 text-center text-6xl font-black text-blue-600 dark:text-blue-400">
        {value}
      </div>

    </div>
  );
}
