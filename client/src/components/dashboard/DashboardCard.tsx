interface Props {
  title: string;
  children: React.ReactNode;
}

export default function DashboardCard({
  title,
  children,
}: Props) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:shadow-lg dark:border-slate-700 dark:bg-slate-900">

      <h2 className="mb-6 text-2xl font-bold text-slate-800 dark:text-white">
        {title}
      </h2>

      {children}

    </div>
  );
}