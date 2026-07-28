interface Props {
  title: string;
  value: string;
}

export default function StatCard({
  title,
  value,
}: Props) {
  return (
    <div className="rounded-3xl border bg-white p-8 shadow">

      <h3 className="text-lg font-semibold text-slate-500">
        {title}
      </h3>

      <div className="mt-6 text-center text-6xl font-black text-blue-600">
        {value}
      </div>

    </div>
  );
}