"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
  LabelList,
} from "recharts";

interface Props {
  yourScore: number;
  platformAverage: number;
  percentile: number;
}

export default function ATSBarChart({
  yourScore,
  platformAverage,
  percentile,
}: Props) {
  const topPercent = 100 - percentile;

  const data = [
    {
      name: "Your Score",
      value: yourScore,
    },
    {
      name: "Platform Avg",
      value: platformAverage,
    },
  ];

  const scoreColor =
    yourScore >= 85
      ? "#22c55e"
      : yourScore >= 70
      ? "#f59e0b"
      : "#ef4444";

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold dark:text-white">
          ATS Score Comparison
        </h2>

        <div className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
          Top {topPercent}%
        </div>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="rounded-xl bg-slate-50 p-4 text-center dark:bg-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Your Score
          </p>
          <p
            className="mt-1 text-3xl font-black"
            style={{ color: scoreColor }}
          >
            {yourScore}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4 text-center dark:bg-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Platform Average
          </p>
          <p className="mt-1 text-3xl font-black text-slate-700 dark:text-slate-200">
            {platformAverage}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4 text-center dark:bg-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Your Ranking
          </p>
          <p className="mt-1 text-3xl font-black text-blue-600 dark:text-blue-400">
            Top {topPercent}%
          </p>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ left: 20, right: 40 }}
          >
            <XAxis
              type="number"
              domain={[0, 100]}
              tick={{ fontSize: 12, fill: "#94a3b8" }}
            />

            <YAxis
              type="category"
              dataKey="name"
              width={110}
              tick={{ fontSize: 13, fontWeight: 600, fill: "#64748b" }}
            />

            <Tooltip
              formatter={(value) => [
                `${value}/100`,
                "Score",
              ]}
            />

            <ReferenceLine
              x={platformAverage}
              stroke="#94a3b8"
              strokeDasharray="6 4"
              label={{
                value: "Avg",
                position: "top",
                fontSize: 11,
                fill: "#94a3b8",
              }}
            />

            <Bar
              dataKey="value"
              radius={[0, 12, 12, 0]}
              barSize={40}
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={
                    index === 0
                      ? scoreColor
                      : "#cbd5e1"
                  }
                />
              ))}

              <LabelList
                dataKey="value"
                position="right"
                formatter={(v) => `${v}`}
                style={{
                  fontWeight: 700,
                  fontSize: 14,
                  fill: "#64748b",
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
        You scored higher than {percentile}% of all
        users on the platform
      </p>
    </div>
  );
}
