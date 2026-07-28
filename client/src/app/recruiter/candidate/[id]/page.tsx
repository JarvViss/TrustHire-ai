"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import Navbar from "@/components/layout/Navbar";
import RecruiterGuard from "@/components/auth/RecruiterGuard";

import CandidateProfile from "@/components/recruiter/CandidateProfile";

import api from "@/lib/axios";
import { useHydrated } from "@/hooks/useHydrated";
import { useAuthStore } from "@/store/auth.store";

export default function CandidatePage() {
  const { id } = useParams();
  const hydrated = useHydrated();
  const token = useAuthStore((state) => state.token);

  const [candidate, setCandidate] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hydrated || !token || !id) {
      setLoading(true);
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        const res = await api.get(
          `/recruiter/candidate/${id}`
        );

        if (!cancelled) {
          setCandidate(res.data.candidate);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [id, hydrated, token]);

  return (
    <RecruiterGuard>
      <Navbar />

      <main className="mx-auto max-w-7xl p-8">
        {loading ? (
          <div className="flex h-[60vh] items-center justify-center text-xl dark:text-white">
            Loading Candidate...
          </div>
        ) : candidate ? (
          <CandidateProfile candidate={candidate} />
        ) : (
          <div className="flex h-[60vh] items-center justify-center text-xl dark:text-white">
            Candidate not found.
          </div>
        )}
      </main>
    </RecruiterGuard>
  );
}
