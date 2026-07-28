"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyApplications, applyToJob } from "@/services/application.service";
import AuthGuard from "@/components/auth/AuthGuard";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Briefcase,
  Calendar,
  BarChart3,
  Plus,
  X,
} from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  APPLIED: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  UNDER_REVIEW: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  SHORTLISTED: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  INTERVIEW: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  OFFERED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  REJECTED: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  WITHDRAWN: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
};

export default function ApplicationsPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ jobTitle: "", company: "", jobDescription: "" });

  const { data, isLoading } = useQuery({
    queryKey: ["applications"],
    queryFn: getMyApplications,
  });

  const mutation = useMutation({
    mutationFn: applyToJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      setShowForm(false);
      setForm({ jobTitle: "", company: "", jobDescription: "" });
      toast.success("Application added!");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to add application");
    },
  });

  const applications = data?.data ?? [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.jobTitle.trim() || !form.company.trim()) {
      toast.error("Job title and company are required");
      return;
    }
    mutation.mutate(form);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  if (isLoading) {
    return (
      <AuthGuard>
        <Navbar />
        <div className="flex min-h-screen items-center justify-center text-xl dark:text-white">
          Loading applications...
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <Navbar />

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black dark:text-white">
              My Applications
            </h1>
            <p className="mt-1 text-slate-500 dark:text-slate-400">
              Track jobs you have applied to and their statuses.
            </p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Application
          </Button>
        </div>

        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold dark:text-white">Add Application</h2>
                <button onClick={() => setShowForm(false)}>
                  <X className="h-5 w-5 text-slate-500" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input placeholder="Job Title" name="jobTitle" value={form.jobTitle} onChange={handleChange} required />
                <Input placeholder="Company" name="company" value={form.company} onChange={handleChange} required />
                <Textarea placeholder="Job Description (optional — AI will match against your resume)" name="jobDescription" value={form.jobDescription} onChange={handleChange} rows={5} />
                <Button type="submit" className="w-full" disabled={mutation.isPending}>
                  {mutation.isPending ? "Saving..." : "Add Application"}
                </Button>
              </form>
            </div>
          </div>
        )}

        {applications.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-16 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <Briefcase className="mx-auto mb-4 h-12 w-12 text-slate-300 dark:text-slate-600" />
            <h2 className="text-2xl font-bold dark:text-white">
              No Applications Yet
            </h2>
            <p className="mt-3 text-slate-500 dark:text-slate-400">
              Add jobs you have applied to and track their status.
            </p>
            <Button className="mt-6" onClick={() => setShowForm(true)}>
              Add Your First Application
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app: any) => (
              <div
                key={app._id}
                className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold dark:text-white">
                      {app.jobTitle}
                    </h3>
                    {app.company && (
                      <p className="mt-1 text-slate-500 dark:text-slate-400">
                        {app.company}
                      </p>
                    )}
                    <div className="mt-2 flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(app.createdAt).toLocaleDateString()}
                      </span>
                      {app.matchScore > 0 && (
                        <span className="flex items-center gap-1">
                          <BarChart3 className="h-3.5 w-3.5" />
                          {app.matchScore}% match
                        </span>
                      )}
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
                      STATUS_COLORS[app.status] ??
                      "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                    }`}
                  >
                    {app.status.replace("_", " ")}
                  </span>
                </div>

                {app.notes && (
                  <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                    {app.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </AuthGuard>
  );
}
