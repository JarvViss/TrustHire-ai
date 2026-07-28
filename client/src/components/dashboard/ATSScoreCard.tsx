"use client";

import DashboardCard from "./DashboardCard";

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

  const getColor = () => {
    if (score >= 85) return "#22c55e";

    if (score >= 70) return "#f59e0b";

    return "#ef4444";
  };

  const getMessage = () => {
    if (score >= 85)
      return "Excellent Resume";

    if (score >= 70)
      return "Good Resume";

    return "Needs Improvement";
  };

  return (
    <DashboardCard title="ATS Score">

      <div className="flex flex-col items-center">

        <div className="h-56 w-56">

          <CircularProgressbar
            value={score}
            text={`${score}%`}
            styles={buildStyles({
              textSize: "16px",
              pathColor: getColor(),
              textColor: "#111827",
              trailColor: "#E5E7EB",
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