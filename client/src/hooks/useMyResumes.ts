"use client";

import { useQuery } from "@tanstack/react-query";

import { getResumeHistory } from "@/services/resume.service";

export function useMyResumes() {
  return useQuery({
    queryKey: ["my-resumes"],
    queryFn: getResumeHistory,
  });
}
