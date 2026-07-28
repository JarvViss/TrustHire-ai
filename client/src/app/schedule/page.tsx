"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/api";
import RecruiterGuard from "@/components/auth/RecruiterGuard";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, Video, Phone, MapPin } from "lucide-react";

export default function SchedulePage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    candidateId: "",
    scheduledAt: "",
    duration: "30",
    type: "ONLINE",
    notes: "",
  });

  const { data: schedule } = useQuery({
    queryKey: ["schedule"],
    queryFn: async () => {
      const { data } = await api.get("/schedule");
      return data.data;
    },
  });

  const createSchedule = useMutation({
    mutationFn: async (formData: typeof form) => {
      await api.post("/schedule", {
        ...formData,
        duration: Number(formData.duration),
      });
    },
    onSuccess: () => {
      toast.success("Interview scheduled!");
      setShowForm(false);
      queryClient.invalidateQueries({
        queryKey: ["schedule"],
      });
    },
    onError: () => {
      toast.error("Failed to schedule interview");
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
            {showForm ? "Cancel" : "Schedule Interview"}
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
                createSchedule.mutate(form);
              }}
              className="space-y-4"
            >
              <div>
                <label className="mb-2 block text-sm font-semibold dark:text-slate-300">
                  Candidate ID
                </label>
                <Input
                  placeholder="Candidate user ID"
                  value={form.candidateId}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      candidateId: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-semibold dark:text-slate-300">
                    Date & Time
                  </label>
                  <Input
                    type="datetime-local"
                    value={form.scheduledAt}
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
          {!schedule?.length ? (
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
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </RecruiterGuard>
  );
}
