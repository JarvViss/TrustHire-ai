"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";

interface SkillFreq {
  skill: string;
  count: number;
}

interface Props {
  skillsFrequency: SkillFreq[];
  userSkills: string[];
}

const BAR_HEIGHT = 40;
const MIN_HEIGHT = 300;
const MAX_HEIGHT = 520;

export default function SkillsChart({
  skillsFrequency,
  userSkills,
}: Props) {
  const userSkillSet = new Set(
    userSkills.map((s) => s.toLowerCase())
  );

  const data = skillsFrequency.map((item) => ({
    ...item,
    isUserSkill: userSkillSet.has(
      item.skill.toLowerCase()
    ),
  }));

  const chartHeight = Math.min(
    Math.max(data.length * BAR_HEIGHT, MIN_HEIGHT),
    MAX_HEIGHT
  );

  const needsScroll =
    data.length * BAR_HEIGHT > MAX_HEIGHT;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <h2 className="mb-2 text-2xl font-bold dark:text-white">
        Skills Distribution
      </h2>

      <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">
        Most common skills across all resumes on the
        platform
      </p>

      <div className="mb-4 flex items-center gap-5 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm bg-blue-600" />
          <span className="text-slate-600 dark:text-slate-400">
            Your skill
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm bg-slate-300" />
          <span className="text-slate-600 dark:text-slate-400">
            Other users
          </span>
        </div>
      </div>

      <div
        className={`${needsScroll ? "overflow-y-auto" : ""}`}
        style={{ maxHeight: MAX_HEIGHT }}
      >
        <ResponsiveContainer
          width="100%"
          height={chartHeight}
        >
          <BarChart
            data={data}
            layout="vertical"
            margin={{
              left: 0,
              right: 40,
              top: 0,
              bottom: 0,
            }}
          >
            <XAxis
              type="number"
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              type="category"
              dataKey="skill"
              width={110}
              tick={{
                fontSize: 12,
                fontWeight: 500,
                fill: "#e2e8f0",
              }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              formatter={(value: number) => [
                `${value} resumes`,
                "Found in",
              ]}
              cursor={false}
            />

            <Bar
              dataKey="count"
              radius={[0, 6, 6, 0]}
              barSize={24}
              barGap={0}
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={
                    entry.isUserSkill
                      ? "#2563eb"
                      : "#cbd5e1"
                  }
                />
              ))}

              <LabelList
                dataKey="count"
                position="right"
                formatter={(v: number) => `${v}`}
                style={{
                  fontWeight: 600,
                  fontSize: 11,
                  fill: "#64748b",
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
