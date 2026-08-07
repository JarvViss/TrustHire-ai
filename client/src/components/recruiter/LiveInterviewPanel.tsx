"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Sparkles,
  Check,
  Star,
  Loader2,
  Mic,
  Trophy,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  schedule: any;
}

export default function LiveInterviewPanel({
  schedule,
}: Props) {
  const queryClient = useQueryClient();

  const questions: string[] = schedule.questions ?? [];
  const answers: any[] = schedule.answers ?? [];

  const answeredCount = answers.filter(
    (a) => a && a.answer && a.rating > 0
  ).length;

  const allAnswered =
    questions.length > 0 && answeredCount >= questions.length;

  const isCompleted = schedule.status === "COMPLETED";

  const [role, setRole] = useState(schedule.role ?? "");
  const [currentIndex, setCurrentIndex] = useState(() => {
    const idx = answers.findIndex(
      (a) => !a || !a.answer || a.rating < 1
    );
    return idx === -1 ? 0 : idx;
  });
  const [answer, setAnswer] = useState("");
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState("");

  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: ["schedule"],
    });
  };

  const generateQuestions = useMutation({
    mutationFn: async () => {
      const { data } = await api.post(
        `/schedule/${schedule._id}/generate-questions`,
        { role }
      );
      return data.data;
    },
    onSuccess: () => {
      toast.success("Interview questions generated");
      setCurrentIndex(0);
      invalidate();
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message ||
          "Failed to generate questions"
      );
    },
  });

  const saveAnswer = useMutation({
    mutationFn: async () => {
      const { data } = await api.post(
        `/schedule/${schedule._id}/answer`,
        {
          questionIndex: currentIndex,
          answer,
          rating,
          notes,
        }
      );
      return data.data;
    },
    onSuccess: () => {
      const next = questions.findIndex(
        (_, i) => {
          if (i === currentIndex) return false;
          const a = answers[i];
          return !a || !a.answer || a.rating < 1;
        }
      );
      setAnswer("");
      setRating(0);
      setNotes("");
      setCurrentIndex(next === -1 ? currentIndex : next);
      invalidate();
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message ||
          "Failed to save answer"
      );
    },
  });

  const completeInterview = useMutation({
    mutationFn: async () => {
      const { data } = await api.post(
        `/schedule/${schedule._id}/complete`
      );
      return data.data;
    },
    onSuccess: () => {
      toast.success(
        "Interview completed and summarized"
      );
      invalidate();
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message ||
          "Failed to complete interview"
      );
    },
  });

  const handleSaveAnswer = () => {
    if (!answer.trim()) {
      toast.error("Please enter the candidate's answer");
      return;
    }

    if (rating < 1 || rating > 5) {
      toast.error("Please rate the answer from 1 to 5");
      return;
    }

    saveAnswer.mutate();
  };

  const renderRatingButtons = () => {
    return (
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setRating(value)}
            className={`flex h-11 w-11 items-center justify-center rounded-xl border text-lg transition ${
              rating >= value
                ? "border-amber-400 bg-amber-50 text-amber-500 dark:bg-amber-900/30"
                : "border-slate-200 text-slate-300 hover:border-amber-300 dark:border-slate-600 dark:text-slate-500"
            }`}
          >
            <Star
              size={18}
              fill={rating >= value ? "currentColor" : "none"}
            />
          </button>
        ))}
      </div>
    );
  };

  if (isCompleted) {
    const summary = schedule.summary ?? {};

    return (
      <div className="mt-6 rounded-2xl border border-green-200 bg-green-50/50 p-6 dark:border-green-800 dark:bg-green-900/10">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-bold dark:text-white">
            <Trophy className="h-5 w-5 text-green-600 dark:text-green-400" />
            Interview Completed
          </h3>

          {summary.overall > 0 && (
            <span className="rounded-full bg-green-600 px-4 py-1.5 text-lg font-black text-white">
              {summary.overall}/10
            </span>
          )}
        </div>

        {summary.recommendation && (
          <p className="mb-4 text-xl font-bold text-green-700 dark:text-green-400">
            {summary.recommendation}
          </p>
        )}

        {summary.feedback && (
          <p className="mb-4 leading-7 text-slate-700 dark:text-slate-300">
            {summary.feedback}
          </p>
        )}

        {(summary.strengths?.length > 0 ||
          summary.improvements?.length > 0) && (
          <div className="mb-6 grid gap-4 md:grid-cols-2">
            {summary.strengths?.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-semibold text-green-700 dark:text-green-400">
                  Strengths
                </p>
                <ul className="list-disc pl-5 text-sm text-slate-700 dark:text-slate-300">
                  {summary.strengths.map((s: string) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
            {summary.improvements?.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-semibold text-amber-700 dark:text-amber-400">
                  Areas for Improvement
                </p>
                <ul className="list-disc pl-5 text-sm text-slate-700 dark:text-slate-300">
                  {summary.improvements.map((s: string) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="space-y-3">
          {questions.map((q: string, i: number) => {
            const a = answers[i];
            return (
              <div
                key={i}
                className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
              >
                <p className="font-semibold dark:text-white">
                  <span className="mr-2 text-blue-600 dark:text-blue-400">
                    Q{i + 1}.
                  </span>
                  {q}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {a?.answer || "No answer recorded"}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
                  <span className="font-semibold text-amber-600 dark:text-amber-400">
                    {a?.rating ? `${"★".repeat(a.rating)}${"☆".repeat(5 - a.rating)}` : "Unrated"}
                  </span>
                  {a?.notes && (
                    <span className="text-slate-500 dark:text-slate-400">
                      {a.notes}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-800">
        <h3 className="mb-1 flex items-center gap-2 text-lg font-bold dark:text-white">
          <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          Live Interview
        </h3>
        <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
          Generate AI interview questions tailored to this candidate's
          resume. You will ask them and rate each answer.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            placeholder="Job role (e.g. React Developer)"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="sm:max-w-sm"
          />
          <Button
            onClick={() => generateQuestions.mutate()}
            disabled={
              generateQuestions.isPending || !role.trim()
            }
            className="gap-2"
          >
            {generateQuestions.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles size={16} />
            )}
            {generateQuestions.isPending
              ? "Generating..."
              : "Generate Questions"}
          </Button>
        </div>
      </div>
    );
  }

  const current = answers[currentIndex];

  return (
    <div className="mt-6 space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-800">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-bold dark:text-white">
            <Mic className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Live Interview
          </h3>
          <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
            {answeredCount}/{questions.length} answered
          </span>
        </div>

        <div className="mb-4 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
          <div
            className="h-full rounded-full bg-green-500 transition-all"
            style={{
              width: `${
                questions.length
                  ? (answeredCount / questions.length) * 100
                  : 0
              }%`,
            }}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {questions.map((_: string, i: number) => {
            const a = answers[i];
            const done = a && a.answer && a.rating > 0;
            const isActive = i === currentIndex;
            return (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setCurrentIndex(i);
                  setAnswer(a?.answer ?? "");
                  setRating(a?.rating ?? 0);
                  setNotes(a?.notes ?? "");
                }}
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition ${
                  done
                    ? "bg-green-500 text-white"
                    : isActive
                    ? "bg-blue-600 text-white"
                    : "bg-white text-slate-500 ring-1 ring-slate-300 dark:bg-slate-900 dark:text-slate-400 dark:ring-slate-600"
                }`}
              >
                {done ? <Check size={15} /> : i + 1}
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
          Question {currentIndex + 1}
        </p>
        <p className="mb-4 text-lg font-semibold leading-7 dark:text-white">
          {questions[currentIndex]}
        </p>

        <label className="mb-1 block text-sm font-semibold dark:text-slate-300">
          Candidate's answer (as stated during the interview)
        </label>
        <Textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type what the candidate said..."
          rows={4}
          className="mb-4"
        />

        <label className="mb-1 block text-sm font-semibold dark:text-slate-300">
          Rating
        </label>
        <div className="mb-4">{renderRatingButtons()}</div>

        <label className="mb-1 block text-sm font-semibold dark:text-slate-300">
          Notes (optional)
        </label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Observations, follow-up thoughts..."
          rows={2}
          className="mb-5"
        />

        <div className="flex flex-wrap gap-3">
          <Button
            onClick={handleSaveAnswer}
            disabled={saveAnswer.isPending}
            className="gap-2"
          >
            {saveAnswer.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight size={16} />
            )}
            Save Answer
          </Button>

          {allAnswered && (
            <Button
              onClick={() => completeInterview.mutate()}
              disabled={completeInterview.isPending}
              className="gap-2 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
            >
              {completeInterview.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RotateCcw size={16} />
              )}
              {completeInterview.isPending
                ? "Generating summary..."
                : "Finish Interview"}
            </Button>
          )}
        </div>

        {current?.answer && (
          <p className="mt-4 text-xs text-slate-400">
            This question has already been answered. Edit and save to
            update it.
          </p>
        )}
      </div>
    </div>
  );
}
