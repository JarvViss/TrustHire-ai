"use client";

import { useQuery } from "@tanstack/react-query";

import { getResumeHistory } from "@/services/resume.service";
import { RESUME_KEYS } from "@/constants/queryKeys";

export function useResumeHistory() {
  return useQuery({
    queryKey: RESUME_KEYS.history,
    queryFn: getResumeHistory,
  });
}
