import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export default function FeatureCard({
  icon: Icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl dark:border-slate-700 dark:bg-slate-900 dark:hover:border-blue-600">
      <div className="mb-6 inline-flex rounded-xl bg-blue-100 p-3 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white dark:bg-blue-900/30 dark:text-blue-400 dark:group-hover:bg-blue-600 dark:group-hover:text-white">
        <Icon size={28} />
      </div>

      <h3 className="mb-3 text-xl font-semibold dark:text-white">
        {title}
      </h3>

      <p className="leading-7 text-slate-600 dark:text-slate-400">
        {description}
      </p>
    </div>
  );
}
