"use client";

import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Trophy,
  Brain,
  MessageSquare,
  Flame,
} from "lucide-react";

interface Props {
  result: {
    overall: number;
    technical: number;
    communication: number;
    confidence: number;
    recommendation: string;
    strengths: string[];
    improvements: string[];
    finalFeedback: string;
  } | null;
}

export default function InterviewResult({
  result,
}: Props) {
  if (!result) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-xl dark:border-slate-700 dark:bg-slate-900">
        <p className="text-slate-500 dark:text-slate-400">
          No interview results available.
        </p>
      </div>
    );
  }

  const badgeColor =
    result.recommendation === "Recommended"
      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
      : result.recommendation === "Borderline"
      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";

  const BadgeIcon =
    result.recommendation === "Recommended"
      ? CheckCircle2
      : result.recommendation === "Borderline"
      ? AlertTriangle
      : XCircle;

  return (
    <div className="space-y-8 rounded-3xl border border-slate-200 bg-white p-10 shadow-xl dark:border-slate-700 dark:bg-slate-900">
      {/* Header */}

      <div className="text-center">
        <Trophy
          className="mx-auto mb-4 text-yellow-500"
          size={48}
        />

        <h1 className="text-4xl font-black text-slate-800 dark:text-white">
          Interview Report
        </h1>

        <p className="mt-3 text-slate-500 dark:text-slate-400">
          AI Generated Technical Interview Evaluation
        </p>
      </div>

      {/* Overall */}

      <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-10 text-center text-white">
        <h2 className="text-xl">
          Overall Score
        </h2>

        <div className="mt-4 text-6xl font-black">
          {result.overall}
          <span className="text-3xl">/10</span>
        </div>

        <div
          className={`mx-auto mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-lg font-semibold ${badgeColor}`}
        >
          <BadgeIcon size={22} />
          {result.recommendation}
        </div>
      </div>

      {/* Score Cards */}

      <div className="grid gap-6 md:grid-cols-3">
        <ScoreCard
          icon={<Brain size={22} />}
          title="Technical"
          value={result.technical}
        />

        <ScoreCard
          icon={<MessageSquare size={22} />}
          title="Communication"
          value={result.communication}
        />

        <ScoreCard
          icon={<Flame size={22} />}
          title="Confidence"
          value={result.confidence}
        />
      </div>

      {/* Strengths */}

      <Section
        title="Strengths"
        color="green"
        items={result.strengths}
      />

      {/* Improvements */}

      <Section
        title="Areas to Improve"
        color="red"
        items={result.improvements}
      />

      {/* Feedback */}

      <div className="rounded-3xl border border-slate-200 bg-blue-50 p-8 dark:border-slate-700 dark:bg-blue-900/20">
        <h2 className="mb-5 text-2xl font-bold dark:text-white">
          Recruiter's Final Notes
        </h2>

        <p className="leading-8 text-slate-700 dark:text-slate-300">
          {result.finalFeedback}
        </p>
      </div>
    </div>
  );
}

function ScoreCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
}) {
  const width = `${Math.min(value * 10, 100)}%`;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="mb-4 flex items-center gap-3 dark:text-white">
        {icon}

        <h3 className="text-lg font-bold">
          {title}
        </h3>
      </div>

      <div className="mb-4 text-4xl font-black text-blue-600 dark:text-blue-400">
        {value}
        <span className="text-xl">/10</span>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <div
          className="h-full rounded-full bg-blue-600 transition-all dark:bg-blue-500"
          style={{
            width,
          }}
        />
      </div>
    </div>
  );
}

function Section({
  title,
  items,
  color,
}: {
  title: string;
  items: string[];
  color: "green" | "red";
}) {
  const bg =
    color === "green"
      ? "bg-green-50 dark:bg-green-900/20"
      : "bg-red-50 dark:bg-red-900/20";

  const text =
    color === "green"
      ? "text-green-700 dark:text-green-400"
      : "text-red-700 dark:text-red-400";

  return (
    <div>
      <h2 className="mb-5 text-2xl font-bold dark:text-white">
        {title}
      </h2>

      <div className="space-y-4">
        {items?.map((item) => (
          <div
            key={item}
            className={`${bg} ${text} rounded-2xl p-5`}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
