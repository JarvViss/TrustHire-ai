"use client";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import AuthGuard from "@/components/auth/AuthGuard";
import Navbar from "@/components/layout/Navbar";

import ResumeCard from "@/components/history/ResumeCard";

import { useResumeHistory } from "@/hooks/useResumeHistory";

import {
  getResumeById,
  deleteResume,
} from "@/services/resume.service";

import { useResumeStore } from "@/store/resume.store";

export default function HistoryPage() {
  const router = useRouter();

  const { data, isLoading, refetch } =
    useResumeHistory();

  const { setAnalysis } = useResumeStore();

  const handleView = async (id: string) => {
    try {
      const result = await getResumeById(id);

      setAnalysis(result.data);

      router.push("/dashboard");
    } catch {
      toast.error("Failed to load resume");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteResume(id);

      toast.success("Resume Deleted");

      refetch();
    } catch {
      toast.error("Delete Failed");
    }
  };

  const resumes = data?.data ?? [];

  return (
    <AuthGuard>
      <Navbar />

      <main className="mx-auto max-w-6xl p-10">
        <h1 className="mb-10 text-5xl font-black dark:text-white">
          Resume History
        </h1>

        {isLoading ? (
          <p className="dark:text-white">Loading...</p>
        ) : (
          <div className="space-y-6">
            {resumes.length === 0 && (
              <div className="text-center text-xl dark:text-white">
                No Resume Found
              </div>
            )}

            {resumes.map((resume: any) => (
              <ResumeCard
                key={resume._id}
                resume={resume}
                onView={() => handleView(resume._id)}
                onDelete={() =>
                  handleDelete(resume._id)
                }
              />
            ))}
          </div>
        )}
      </main>
    </AuthGuard>
  );
}
