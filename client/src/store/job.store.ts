import { create } from "zustand";

interface JobMatch {
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  recommendation: string;
  interviewReadiness: number;
}

interface JobStore {
  result: JobMatch | null;

  setResult: (result: JobMatch) => void;

  clear: () => void;
}

export const useJobStore =
create<JobStore>((set) => ({
  result: null,

  setResult: (result) =>
    set({
      result,
    }),

  clear: () =>
    set({
      result: null,
    }),
}));