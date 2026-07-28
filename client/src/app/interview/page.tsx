"use client";

import { useState } from "react";

import { toast } from "sonner";

import Navbar from "@/components/layout/Navbar";
import AuthGuard from "@/components/auth/AuthGuard";

import RoleSelector from "@/components/interview/RoleSelector";
import InterviewChat from "@/components/interview/InterviewChat";
import InterviewResult from "@/components/interview/InterviewResult";

import { useStartInterview } from "@/hooks/useInterview";

export default function InterviewPage() {
  const mutation = useStartInterview();

  const [interview, setInterview] =
    useState<any>(null);

  const handleStart = async (
    role: string
  ) => {
    try {
      const result =
        await mutation.mutateAsync(role);

      setInterview(result.data);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to start interview"
      );
    }
  };

  return (
    <AuthGuard>
      <Navbar />

      <main className="mx-auto max-w-5xl px-6 py-10">
        {!interview && (
          <RoleSelector
            loading={mutation.isPending}
            onStart={handleStart}
          />
        )}

        {interview &&
          interview.status !== "COMPLETED" && (
            <InterviewChat
              interview={interview}
              setInterview={setInterview}
            />
          )}

        {interview?.status === "COMPLETED" && (
          <InterviewResult
            result={interview.result}
          />
        )}
      </main>
    </AuthGuard>
  );
}
