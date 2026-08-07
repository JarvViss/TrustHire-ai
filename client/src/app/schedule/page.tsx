"use client";

import { useState, useEffect, Suspense } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import api from "@/lib/api";
import RecruiterGuard from "@/components/auth/RecruiterGuard";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import LiveInterviewPanel from "@/components/recruiter/LiveInterviewPanel";
import { Calendar, Clock, Video, Phone, MapPin, User, Mic, RefreshCw, Link2 } from "lucide-react";

export default function SchedulePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
          <div className="text-lg text-slate-500">Loading...</div>
        </div>
      }
    >
      <ScheduleContent />
    </Suspense>
  );
}

function ScheduleContent() {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [activeInterview, setActiveInterview] =
    useState<string>("");
  const [candidateName, setCandidateName] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [form, setForm] = useState({
    candidateId: "",
    scheduledAt: "",
    duration: "30",
    type: "ONLINE",
    role: "",
    notes: "",
    meetingLink: "",
  });

  const candidateId = searchParams.get("candidateId") ?? "";

  const now = new Date();
  now.setMinutes(
    now.getMinutes() - now.getTimezoneOffset()
  );
  const nowStr = now.toISOString().slice(0, 16);

  useEffect(() => {
    if (candidateId) {
      setForm((prev) => ({ ...prev, candidateId }));
      setShowForm(true);

      api
        .get(`/recruiter/candidate/${candidateId}`)
        .then((res) => {
          const user = res.data.candidate?.user;
          setCandidateName(user?.name ?? "");
          setCandidateEmail(user?.email ?? "");
        })
        .catch(() => {});
    }
  }, [candidateId]);

  const { data: schedule, isLoading, isError, refetch } = useQuery({
    queryKey: ["schedule"],
    queryFn: async () => {
      const { data } = await api.get("/schedule");
      return data.data;
    },
  });

  const { data: candidates } = useQuery({
    queryKey: ["recruiter-candidates"],
    queryFn: async () => {
      const { data } = await api.get("/recruiter/candidates");
      return data.candidates;
    },
  });

  const selectCandidate = (id: string) => {
    const c = candidates?.find(
      (x: any) => x.id === id
    );
    setForm((prev) => ({ ...prev, candidateId: id }));
    setCandidateName(c?.name ?? "");
    setCandidateEmail(c?.email ?? "");
  };

  const createSchedule = useMutation({
    mutationFn: async (formData: typeof form) => {
      await api.post("/schedule", {
        ...formData,
        duration: Number(formData.duration) || 30,
      });
    },
    onSuccess: () => {
      toast.success("Interview scheduled!");
      setShowForm(false);
      queryClient.invalidateQueries({
        queryKey: ["schedule"],
      });
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message ||
          "Failed to schedule interview"
      );
    },
  });

  const cancelSchedule = useMutation({
    mutationFn: async (id: string) => {
      await api.patch(`/schedule/${id}/cancel`);
    },
    onSuccess: () => {
      toast.success("Interview cancelled");
      queryClient.invalidateQueries({
        queryKey: ["schedule"],
      });
    },
  });

  const updateMeetingLink = useMutation({
    mutationFn: async ({
      id,
      meetingLink,
    }: {
      id: string;
      meetingLink: string;
    }) => {
      await api.patch(`/schedule/${id}/link`, {
        meetingLink,
      });
    },
    onSuccess: () => {
      toast.success("Meeting link updated");
      setEditingLink("");
      setLinkDraft("");
      queryClient.invalidateQueries({
        queryKey: ["schedule"],
      });
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message ||
          "Failed to update meeting link"
      );
    },
  });

  const [editingLink, setEditingLink] = useState("");
  const [linkDraft, setLinkDraft] = useState("");

  const TYPE_ICONS: Record<string, any> = {
    ONLINE: Video,
    PHONE: Phone,
    ONSITE: MapPin,
  };

  return (
    <RecruiterGuard>
      <Navbar />

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-black dark:text-white">
            Interview Schedule
          </h1>

          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "New Interview"}
          </Button>
        </div>

        {showForm && (
          <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <h2 className="mb-4 text-xl font-bold dark:text-white">
              New Interview
            </h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!form.candidateId) {
                  toast.error("Please select a candidate");
                  return;
                }
                createSchedule.mutate(form);
              }}
              className="space-y-4"
            >
              {form.candidateId ? (
                <div className="flex items-center justify-between rounded-2xl border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="font-semibold text-green-800 dark:text-green-200">
                        {candidateName || "Loading..."}
                      </p>
                      {candidateEmail && (
                        <p className="text-sm text-green-600 dark:text-green-400">
                          {candidateEmail}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setForm((prev) => ({
                        ...prev,
                        candidateId: "",
                      }));
                      setCandidateName("");
                      setCandidateEmail("");
                    }}
                  >
                    Change
                  </Button>
                </div>
              ) : (
                <div>
                  <label className="mb-2 block text-sm font-semibold dark:text-slate-300">
                    Candidate
                  </label>
                  <select
                    value={form.candidateId}
                    onChange={(e) =>
                      selectCandidate(e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
                  >
                    <option value="">
                      Select a candidate...
                    </option>
                    {candidates?.map((c: any) => (
                      <option
                        key={c.id}
                        value={c.id}
                      >
                        {c.name} ({c.email})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-semibold dark:text-slate-300">
                    Job Role
                  </label>
                  <Input
                    type="text"
                    value={form.role}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        role: e.target.value,
                      })
                    }
                    placeholder="e.g. React Developer"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold dark:text-slate-300">
                    Date & Time
                  </label>
                  <Input
                    type="datetime-local"
                    value={form.scheduledAt}
                    min={nowStr}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        scheduledAt: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold dark:text-slate-300">
                    Duration (min)
                  </label>
                  <Input
                    type="number"
                    value={form.duration}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        duration: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold dark:text-slate-300">
                    Type
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        type: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
                  >
                    <option value="ONLINE">
                      Online
                    </option>
                    <option value="PHONE">
                      Phone
                    </option>
                    <option value="ONSITE">
                      On-site
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold dark:text-slate-300">
                  Meeting Link{" "}
                  <span className="font-normal text-slate-400">
                    (optional)
                  </span>
                </label>
                <Input
                  type="url"
                  value={form.meetingLink}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      meetingLink: e.target.value,
                    })
                  }
                  placeholder="Paste Google Meet / Zoom / MS Teams link"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold dark:text-slate-300">
                  Notes
                </label>
                <Textarea
                  value={form.notes}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      notes: e.target.value,
                    })
                  }
                  placeholder="Interview notes..."
                  rows={3}
                />
              </div>

              <Button
                type="submit"
                disabled={createSchedule.isPending}
              >
                {createSchedule.isPending
                  ? "Scheduling..."
                  : "Schedule"}
              </Button>
            </form>
          </div>
        )}

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
              <Calendar className="mx-auto mb-4 h-12 w-12 text-slate-300 dark:text-slate-600" />
              <h2 className="text-2xl font-bold dark:text-white">
                No Scheduled Interviews
              </h2>
              <p className="mt-3 text-slate-500 dark:text-slate-400">
                Schedule your first interview.
              </p>
            </div>
          ) : (
            schedule.map((s: any) => {
              const Icon =
                TYPE_ICONS[s.type] ?? Video;
              const isPast =
                new Date(s.scheduledAt) < new Date();

              return (
                <div
                  key={s._id}
                  className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-900/30">
                        <Icon className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                      </div>

                      <div>
                        <h3 className="text-lg font-bold dark:text-white">
                          {s.candidate?.name ??
                            "Candidate"}
                        </h3>
                        <div className="mt-1 flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
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
                          <span>
                            {s.duration} min
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          s.status === "SCHEDULED"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : s.status === "CANCELLED"
                            ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                        }`}
                      >
                        {s.status}
                      </span>

                      {s.status === "SCHEDULED" &&
                        !isPast && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              cancelSchedule.mutate(
                                s._id
                              )
                            }
                          >
                            Cancel
                          </Button>
                        )}

                      {s.status !== "CANCELLED" && (
                        <Button
                          variant={
                            activeInterview === s._id
                              ? "ghost"
                              : "default"
                          }
                          size="sm"
                          className="gap-2"
                          onClick={() =>
                            setActiveInterview(
                              activeInterview === s._id
                                ? ""
                                : s._id
                            )
                          }
                        >
                          <Mic size={14} />
                          {s.status === "COMPLETED"
                            ? "View Interview"
                            : s.status === "IN_PROGRESS"
                            ? "Continue Interview"
                            : "Conduct Interview"}
                        </Button>
                      )}
                    </div>
                  </div>

                  {activeInterview === s._id && (
                    <LiveInterviewPanel
                      schedule={s}
                    />
                  )}

                  {(s.status === "SCHEDULED" ||
                    s.status === "IN_PROGRESS") &&
                    (editingLink === s._id ? (
                    <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4 dark:border-slate-800 sm:flex-row">
                      <Input
                        type="url"
                        value={linkDraft}
                        onChange={(e) =>
                          setLinkDraft(e.target.value)
                        }
                        placeholder="Paste Google Meet / Zoom / MS Teams link"
                      />
                      <div className="flex shrink-0 gap-2">
                        <Button
                          size="sm"
                          disabled={
                            updateMeetingLink.isPending
                          }
                          onClick={() =>
                            updateMeetingLink.mutate({
                              id: s._id,
                              meetingLink: linkDraft,
                            })
                          }
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingLink("");
                            setLinkDraft("");
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 dark:border-slate-800 md:flex-row md:items-center md:justify-between">
                      <div className="flex min-w-0 items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                        <Link2 className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
                        {s.meetingLink ? (
                          <a
                            href={s.meetingLink}
                            target="_blank"
                            rel="noreferrer"
                            className="truncate text-blue-600 hover:underline dark:text-blue-400"
                          >
                            {s.meetingLink}
                          </a>
                        ) : (
                          <span>
                            No meeting link yet
                          </span>
                        )}
                      </div>
                      <div className="flex shrink-0 gap-2">
                        {s.meetingLink && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              navigator.clipboard?.writeText(
                                s.meetingLink
                              );
                              toast.success(
                                "Link copied"
                              );
                            }}
                          >
                            Copy
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingLink(s._id);
                            setLinkDraft(
                              s.meetingLink ?? ""
                            );
                          }}
                        >
                          {s.meetingLink
                            ? "Edit"
                            : "Add link"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })
          )}
        </div>
      </main>
    </RecruiterGuard>
  );
}
