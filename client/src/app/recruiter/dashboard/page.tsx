"use client";

import { useEffect, useState } from "react";

import Navbar from "@/components/layout/Navbar";
import RecruiterGuard from "@/components/auth/RecruiterGuard";

import RecruiterStats from "@/components/recruiter/RecruiterStats";
import CandidateList from "@/components/recruiter/CandidateList";

import api from "@/lib/axios";

export default function RecruiterDashboard() {
  const [stats, setStats] = useState<any>(null);

  const [candidates, setCandidates] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [statsRes, candidateRes] =
          await Promise.all([
            api.get("/recruiter/dashboard"),
            api.get("/recruiter/candidates"),
          ]);

        setStats(statsRes.data.stats);

        setCandidates(
          candidateRes.data.candidates
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <RecruiterGuard>
      <Navbar />

      {loading ? (
        <div className="flex h-[60vh] items-center justify-center text-xl dark:text-white">
          Loading Recruiter Dashboard...
        </div>
      ) : (
        <main className="mx-auto max-w-7xl space-y-8 p-8">
          <h1 className="text-4xl font-black dark:text-white">
            Recruiter Dashboard
          </h1>

          <RecruiterStats stats={stats} />

          <CandidateList
            candidates={candidates}
          />
        </main>
      )}
    </RecruiterGuard>
  );
}
