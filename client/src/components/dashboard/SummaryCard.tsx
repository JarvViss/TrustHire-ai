import DashboardCard from "./DashboardCard";

interface Props {
  summary: string;
}

export default function SummaryCard({
  summary,
}: Props) {
  return (
    <DashboardCard title="Professional Summary">
      <p className="leading-8 text-slate-700 dark:text-slate-300">
        {summary}
      </p>
    </DashboardCard>
  );
}