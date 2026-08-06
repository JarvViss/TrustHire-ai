"use client";

import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

import AuthGuard from "@/components/auth/AuthGuard";
import Navbar from "@/components/layout/Navbar";

import ResumeCard from "@/components/history/ResumeCard";

import { useResumeHistory } from "@/hooks/useResumeHistory";

import {
  getResumeById,
  deleteResume,
} from "@/services/resume.service";

import { RESUME_KEYS } from "@/constants/queryKeys";

import { useResumeStore } from "@/store/resume.store";

export default function HistoryPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading } =
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

  const invalidateResumeData = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: RESUME_KEYS.history,
      }),
      queryClient.invalidateQueries({
        queryKey: RESUME_KEYS.stats,
      }),
    ]);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteResume(id);

      toast.success("Resume Deleted");

      await invalidateResumeData();
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
