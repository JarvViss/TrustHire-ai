"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post(
        "/auth/forgot-password",
        { email }
      );
      toast.success(
        data.message ||
          "If an account exists, a reset code has been sent."
      );
      router.push(
        `/reset-password?email=${encodeURIComponent(email)}`
      );
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 dark:bg-slate-950">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <h1 className="mb-2 text-3xl font-black dark:text-white">
          Forgot Password
        </h1>
        <p className="mb-8 text-sm text-slate-500 dark:text-slate-400">
          Enter your email and we&apos;ll send you a
          6-digit reset code.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Code"}
          </Button>

          <Link
            href="/login"
            className="block text-center text-sm text-blue-600 hover:underline dark:text-blue-400"
          >
            Back to Login
          </Link>
        </form>
      </div>
    </div>
  );
}
