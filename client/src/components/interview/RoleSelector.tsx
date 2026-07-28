"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

interface Props {
  onStart: (role: string) => void;
  loading: boolean;
}

const roles = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "React Developer",
  "Node.js Developer",
  "Software Engineer",
];

export default function RoleSelector({
  onStart,
  loading,
}: Props) {
  const [role, setRole] = useState(
    roles[0]
  );

  return (
    <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-10 shadow-lg dark:border-slate-700 dark:bg-slate-900">

      <h1 className="mb-6 text-3xl font-bold dark:text-white">

        AI Mock Interview

      </h1>

      <p className="mb-8 text-slate-500 dark:text-slate-400">

        Select your target role.

      </p>

      <select
        value={role}
        onChange={(e) =>
          setRole(e.target.value)
        }
        className="mb-8 w-full rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
      >
        {roles.map((r) => (
          <option
            key={r}
            value={r}
          >
            {r}
          </option>
        ))}
      </select>

      <Button
        className="w-full"
        disabled={loading}
        onClick={() =>
          onStart(role)
        }
      >
        {loading
          ? "Generating..."
          : "Start Interview"}
      </Button>

    </div>
  );
}
