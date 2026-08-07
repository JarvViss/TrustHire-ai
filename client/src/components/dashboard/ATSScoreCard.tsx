"use client";

import DashboardCard from "./DashboardCard";
import { useTheme } from "@/components/common/ThemeProvider";

import {
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";

import "react-circular-progressbar/dist/styles.css";

interface Props {
  score: number;
}

export default function ATSScoreCard({
  score,
}: Props) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const displayScore = Math.round(score);

  const getColor = () => {
    if (displayScore >= 85) return "#22c55e";

    if (displayScore >= 70) return "#f59e0b";

    return "#ef4444";
  };

  const getMessage = () => {
    if (displayScore >= 85)
      return "Excellent Resume";

    if (displayScore >= 70)
      return "Good Resume";

    return "Needs Improvement";
  };

  return (
    <DashboardCard title="ATS Score">

      <div className="flex flex-col items-center">

        <div className="h-56 w-56">

          <CircularProgressbar
            value={displayScore}
            text={`${displayScore}%`}
            styles={buildStyles({
              textSize: "16px",
              pathColor: getColor(),
              textColor: isDark ? "#f8fafc" : "#111827",
              trailColor: isDark ? "#1e293b" : "#E5E7EB",
            })}
          />

        </div>

        <p
          className="mt-6 text-2xl font-bold"
          style={{
            color: getColor(),
          }}
        >
          {getMessage()}
        </p>

      </div>

    </DashboardCard>
  );
}