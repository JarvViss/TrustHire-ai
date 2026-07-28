"use client";

import { useQuery } from "@tanstack/react-query";

import { getResumeHistory } from "@/services/resume.service";

export function useResumeHistory() {
  return useQuery({
    queryKey: ["resume-history"],
    queryFn: getResumeHistory,
  });
}