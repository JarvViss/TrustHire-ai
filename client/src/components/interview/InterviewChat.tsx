"use client";

import { useState } from "react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import InterviewProgress from "./InterviewProgress";
import Thinking from "./Thinking";

import { useSubmitAnswer } from "@/hooks/useInterview";

interface Props {
  interview: any;
  setInterview: (value: any) => void;
}

export default function InterviewChat({
  interview,
  setInterview,
}: Props) {
  const mutation = useSubmitAnswer();

  const [answer, setAnswer] = useState("");

  const handleSubmit = async () => {
    if (!answer.trim()) return;

    try {
      const result =
        await mutation.mutateAsync({
          interviewId: interview._id,
          answer,
        });

      setInterview(result.data);

      setAnswer("");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          "Failed to submit answer"
      );
    }
  };

  const isActive =
    interview.status !== "COMPLETED";

  return (
    <div>
      <InterviewProgress
        current={Math.min(
          interview.currentQuestion + 1,
          5
        )}
        total={5}
      />

      <div className="space-y-6">
        {interview.conversation.map(
          (item: any, index: number) => (
            <div key={index}>
              <div className="rounded-2xl bg-blue-600 p-5 text-white">
                <strong>
                  AI Interviewer
                </strong>

                <p className="mt-2">
                  {item.question}
                </p>
              </div>

              {item.answer && (
                <div className="mt-3 ml-auto max-w-3xl rounded-2xl bg-slate-100 p-5 dark:bg-slate-800">
                  <strong className="dark:text-white">You</strong>

                  <p className="mt-2 dark:text-slate-200">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          )
        )}

        {mutation.isPending && <Thinking />}

        {isActive && !mutation.isPending && (
          <>
            <textarea
              rows={6}
              value={answer}
              onChange={(e) =>
                setAnswer(e.target.value)
              }
              placeholder="Write your answer here..."
              className="w-full rounded-2xl border border-slate-200 p-5 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-400"
            />

            <Button
              className="w-full"
              disabled={
                mutation.isPending ||
                !answer.trim()
              }
              onClick={handleSubmit}
            >
              Submit Answer
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
