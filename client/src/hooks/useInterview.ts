"use client";

import { useMutation } from "@tanstack/react-query";

import {
  startInterview,
  submitAnswer,
} from "@/services/interview.service";

export function useStartInterview() {
  return useMutation({
    mutationFn: startInterview,
  });
}

export function useSubmitAnswer() {
  return useMutation({
    mutationFn: ({
      interviewId,
      answer,
    }: {
      interviewId: string;
      answer: string;
    }) =>
      submitAnswer(
        interviewId,
        answer
      ),
  });
}