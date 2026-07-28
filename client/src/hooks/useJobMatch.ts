"use client";

import { useMutation } from "@tanstack/react-query";

import { analyzeJob } from "@/services/job.service";

export function useJobMatch() {
  return useMutation({
    mutationFn: analyzeJob,
  });
}