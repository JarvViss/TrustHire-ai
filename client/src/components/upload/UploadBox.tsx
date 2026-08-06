"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useUploadResume } from "@/hooks/useUploadResume";
import { useResumeStore } from "@/store/resume.store";
import { RESUME_KEYS } from "@/constants/queryKeys";

export default function UploadBox() {
  const [file, setFile] = useState<File | null>(null);

  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useUploadResume();

  const { setAnalysis } = useResumeStore();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
    },
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
      }
    },
  });

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please choose a PDF");
      return;
    }

    try {
      const result = await mutation.mutateAsync(file);

      setAnalysis(result.data);

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: RESUME_KEYS.history,
        }),
        queryClient.invalidateQueries({
          queryKey: RESUME_KEYS.stats,
        }),
      ]);

      toast.success("Resume analyzed successfully!");

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-10 shadow-xl dark:border-slate-700 dark:bg-slate-900">

      <div
        {...getRootProps()}
        className={`cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-all ${
          isDragActive
            ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
            : "border-slate-300 dark:border-slate-600"
        }`}
      >
        <input {...getInputProps()} />

        <UploadCloud className="mx-auto mb-5 h-16 w-16 text-blue-600 dark:text-blue-400" />

        <h2 className="text-2xl font-bold dark:text-white">
          Upload Resume
        </h2>

        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Drag & Drop PDF here
        </p>

        <p className="text-sm text-slate-400 dark:text-slate-500">
          or click to browse
        </p>

        {file && (
          <div className="mt-6 rounded-xl bg-green-50 p-4 dark:bg-green-900/20">

            <p className="font-semibold text-green-700 dark:text-green-400">
              {file.name}
            </p>

            <p className="text-sm text-green-600 dark:text-green-500">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>

          </div>
        )}

      </div>

      <Button
        className="mt-8 w-full"
        disabled={!file || mutation.isPending}
        onClick={handleUpload}
      >
        {mutation.isPending
          ? "Analyzing Resume..."
          : "Analyze Resume"}
      </Button>

    </div>
  );
}
