"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/api";
import AuthGuard from "@/components/auth/AuthGuard";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  Video,
  Phone,
  MapPin,
  User,
  RefreshCw,
  CalendarX2,
  LogIn,
  ExternalLink,
  Copy,
  X,
  Hourglass,
  Check,
} from "lucide-react";

const TYPE_ICONS: Record<string, any> = {
  ONLINE: Video,
  PHONE: Phone,
  ONSITE: MapPin,
};

const TYPE_LABELS: Record<string, string> = {
  ONLINE: "Online (video call)",
  PHONE: "Phone call",
  ONSITE: "On-site",
};

export default function MyInterviewsPage() {
  const queryClient = useQueryClient();
  const [activeId, setActiveId] = useState("");
  const [copied, setCopied] = useState(false);

  const { data: schedule, isLoading, isError, refetch } = useQuery({
    queryKey: ["my-interviews"],
    queryFn: async () => {
      const { data } = await api.get("/schedule");
      return data.data;
    },
  });

  const cancelSchedule = useMutation({
    mutationFn: async (id: string) => {
      await api.patch(`/schedule/${id}/cancel`);
    },
    onSuccess: () => {
      toast.success("Interview cancelled");
      queryClient.invalidateQueries({
        queryKey: ["my-interviews"],
      });
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message ||
          "Failed to cancel interview"
      );
    },
  });

  const active = schedule?.find(
    (s: any) => s._id === activeId
  );

  const copyLink = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Could not copy link");
    }
  };

  return (
    <AuthGuard>
      <Navbar />

      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="mb-8 text-4xl font-black dark:text-white">
          My Interviews
        </h1>

        <div className="space-y-4">
          {isLoading ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-16 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <Calendar className="mx-auto mb-4 h-12 w-12 animate-pulse text-slate-300 dark:text-slate-600" />
              <h2 className="text-2xl font-bold dark:text-white">
                Loading interviews...
              </h2>
            </div>
          ) : isError ? (
            <div className="rounded-3xl border border-red-200 bg-white p-16 text-center shadow-sm dark:border-red-800 dark:bg-slate-900">
              <h2 className="text-2xl font-bold dark:text-white">
                Failed to load interviews
              </h2>
              <button
                onClick={() => refetch()}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 font-semibold text-white transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                <RefreshCw size={16} />
                Retry
              </button>
            </div>
          ) : !schedule?.length ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-16 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <CalendarX2 className="mx-auto mb-4 h-12 w-12 text-slate-300 dark:text-slate-600" />
              <h2 className="text-2xl font-bold dark:text-white">
                No Interviews Scheduled
              </h2>
              <p className="mt-3 text-slate-500 dark:text-slate-400">
                When a recruiter schedules an interview, it will appear
                here and in your notifications.
              </p>
            </div>
          ) : (
            schedule.map((s: any) => {
              const Icon = TYPE_ICONS[s.type] ?? Video;
              const isPast = new Date(s.scheduledAt) < new Date();
              const canJoin =
                s.status === "SCHEDULED" ||
                s.status === "IN_PROGRESS";

              return (
                <div
                  key={s._id}
                  className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900"
                >
                  <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                    <div className="flex items-center gap-5">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-900/30">
                        <Icon className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                      </div>

                      <div>
                        <h3 className="text-lg font-bold dark:text-white">
                          {s.role
                            ? `${s.role} Interview`
                            : "Interview"}
                        </h3>
                        <div className="mt-1 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                          <User className="h-3.5 w-3.5" />
                          {s.recruiter?.name ?? "Recruiter"}
                          {s.recruiter?.email && (
                            <span className="text-slate-400">
                              ({s.recruiter.email})
                            </span>
                          )}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {new Date(
                              s.scheduledAt
                            ).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {new Date(
                              s.scheduledAt
                            ).toLocaleTimeString()}
                          </span>
                          <span>{s.duration} min</span>
                        </div>
                        {s.notes && (
                          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            {s.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          s.status === "SCHEDULED"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : s.status === "IN_PROGRESS"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                            : s.status === "COMPLETED"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                            : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {s.status === "IN_PROGRESS"
                          ? "IN PROGRESS"
                          : s.status}
                      </span>

                      {canJoin && (
                        <Button
                          size="sm"
                          className="gap-2"
                          onClick={() => setActiveId(s._id)}
                        >
                          <LogIn size={14} />
                          {s.status === "IN_PROGRESS"
                            ? "Join Now"
                            : "Join Interview"}
                        </Button>
                      )}

                      {s.status === "SCHEDULED" &&
                        !isPast && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              cancelSchedule.mutate(s._id)
                            }
                          >
                            Cancel
                          </Button>
                        )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      {active && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setActiveId("")}
          />

          <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
            <button
              onClick={() => setActiveId("")}
              className="absolute right-4 top-4 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-900/30">
                <Calendar className="h-7 w-7 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold dark:text-white">
                  {active.role
                    ? `${active.role} Interview`
                    : "Interview"}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  with {active.recruiter?.name ?? "Recruiter"}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-5 text-sm dark:border-slate-800 dark:bg-slate-800/50">
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                {new Date(active.scheduledAt).toLocaleString()}
              </div>
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                {active.duration} minutes ·{" "}
                {TYPE_LABELS[active.type] ?? active.type}
              </div>
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                {active.recruiter?.name ?? "Recruiter"}
                {active.recruiter?.email && (
                  <span className="text-slate-400">
                    ({active.recruiter.email})
                  </span>
                )}
              </div>
              {active.notes && (
                <div className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                  <span className="mt-1 text-blue-600 dark:text-blue-400">
                    •
                  </span>
                  {active.notes}
                </div>
              )}
            </div>

            {active.status === "SCHEDULED" && (
              <div className="mt-5 flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
                <Hourglass className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  Waiting for the recruiter to start the interview.
                  Open the meeting link below at the scheduled time.
                </p>
              </div>
            )}

            {active.status === "IN_PROGRESS" && (
              <div className="mt-5 flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
                <span className="relative flex h-3 w-3 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500" />
                </span>
                <p className="text-sm text-green-800 dark:text-green-200">
                  The interview is in progress — join now!
                </p>
              </div>
            )}

            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold dark:text-slate-300">
                Meeting Link
              </label>

              {active.meetingLink ? (
                <div className="flex flex-col gap-3 sm:flex-row">
                  <a
                    href={active.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                  >
                    <ExternalLink size={16} />
                    Open Meeting Link
                  </a>
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() =>
                      copyLink(active.meetingLink)
                    }
                  >
                    {copied ? (
                      <Check size={16} />
                    ) : (
                      <Copy size={16} />
                    )}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-500 dark:border-slate-600 dark:text-slate-400">
                  {active.type === "ONLINE" ? (
                    <p>
                      No meeting link shared yet. Your recruiter will
                      add one before the interview — check back near
                      the scheduled time.
                    </p>
                  ) : active.type === "PHONE" ? (
                    <p>
                      This is a phone interview. Join the call at the
                      scheduled time — no meeting link needed.
                    </p>
                  ) : (
                    <p>
                      This is an on-site interview. Arrive at the
                      scheduled time — no meeting link needed.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AuthGuard>
  );
}
