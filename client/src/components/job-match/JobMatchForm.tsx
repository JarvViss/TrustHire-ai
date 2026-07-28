"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { Textarea } from "@/components/ui/textarea";

import { useJobMatch } from "@/hooks/useJobMatch";

import { useJobStore } from "@/store/job.store";

export default function JobMatchForm() {

  const [jobDescription, setJobDescription] =
    useState("");

  const router = useRouter();

  const mutation = useJobMatch();

  const { setResult } = useJobStore();

  const handleAnalyze = async () => {

    if (!jobDescription.trim()) {
      toast.error(
        "Please paste a Job Description"
      );
      return;
    }

    try {

      const result =
        await mutation.mutateAsync(
          jobDescription
        );

      setResult(result.data);

      toast.success(
        "Job Match Completed!"
      );

      router.push("/job-result");

    } catch (error: any) {

      toast.error(
        error?.response?.data?.message ||
        "Analysis Failed"
      );

    }

  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow dark:border-slate-700 dark:bg-slate-900">

      <h2 className="mb-5 text-2xl font-bold dark:text-white">
        Job Description
      </h2>

      <Textarea
        rows={16}
        placeholder="Paste Job Description..."
        value={jobDescription}
        onChange={(e) =>
          setJobDescription(
            e.target.value
          )
        }
      />

      <Button
        className="mt-8 w-full"
        onClick={handleAnalyze}
        disabled={mutation.isPending}
      >
        {mutation.isPending
          ? "Analyzing..."
          : "Analyze Match"}
      </Button>

    </div>
  );
}
