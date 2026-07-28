"use client";

import AuthGuard from "@/components/auth/AuthGuard";
import Navbar from "@/components/layout/Navbar";
import JobMatchForm from "@/components/job-match/JobMatchForm";

export default function JobMatchPage() {
  return (
    <AuthGuard>
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-5xl font-black dark:text-white">
          Resume vs Job Description
        </h1>

        <p className="mt-3 text-slate-500 dark:text-slate-400">
          Paste a job description and AI will compare it against your resume to show your match score, missing skills, and fit.
        </p>

        <div className="mt-10">
          <JobMatchForm />
        </div>
      </main>
    </AuthGuard>
  );
}