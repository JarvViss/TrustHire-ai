"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import AuthGuard from "@/components/auth/AuthGuard";
import Navbar from "@/components/layout/Navbar";
import InterviewResult from "@/components/interview/InterviewResult";
import InterviewChat from "@/components/interview/InterviewChat";

import { getInterview } from "@/services/interview.service";

export default function InterviewResultPage() {
  const { id } = useParams();
  const router = useRouter();

  const [interview, setInterview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    async function load() {
      try {
        const res = await getInterview(id as string);
        if (!cancelled) {
          setInterview(res.data);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(
            err?.response?.data?.message ||
              "Failed to load interview"
          );
        }
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
  }, [id]);

  return (
    <AuthGuard>
      <Navbar />

      <main className="mx-auto max-w-4xl px-6 py-10">
        <button
          onClick={() => router.push("/interview/history")}
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
        >
          <ArrowLeft size={16} />
          Back to History
        </button>

        {loading ? (
          <div className="flex h-[40vh] items-center justify-center text-xl dark:text-white">
            Loading interview...
          </div>
        ) : error ? (
          <div className="flex h-[40vh] items-center justify-center text-xl text-red-500">
            {error}
          </div>
        ) : interview?.status === "COMPLETED" ? (
          <InterviewResult result={interview.result} />
        ) : interview?.status === "ACTIVE" ? (
          <InterviewChat
            interview={interview}
            setInterview={setInterview}
          />
        ) : (
          <div className="flex h-[40vh] items-center justify-center text-xl dark:text-white">
            Interview not available
          </div>
        )}
      </main>
    </AuthGuard>
  );
}
