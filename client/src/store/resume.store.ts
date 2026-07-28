import { create } from "zustand";
import { ResumeAnalysis } from "@/types/resume";

interface ResumeState {

  analysis: ResumeAnalysis | null;

  setAnalysis: (
    analysis: ResumeAnalysis
  ) => void;

  clear: () => void;

}

export const useResumeStore =
create<ResumeState>((set)=>({

  analysis:null,

  setAnalysis:(analysis)=>
    set({analysis}),

  clear:()=>
    set({
      analysis:null,
    }),

}));