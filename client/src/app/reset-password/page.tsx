"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const tokenParam = searchParams.get("token") ?? "";

  const [token, setToken] = useState(tokenParam);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error(
        "Password must be at least 6 characters"
      );
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/reset-password", {
        token,
        password,
      });
      setSuccess(true);
      toast.success("Password reset successful!");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          "Invalid or expired token"
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 dark:bg-slate-950">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div className="mb-4 text-5xl">✅</div>
          <h1 className="mb-2 text-3xl font-black dark:text-white">
            Password Reset!
          </h1>
          <p className="mb-8 text-slate-500 dark:text-slate-400">
            Your password has been updated.
          </p>
          <Link href="/login">
            <Button className="w-full">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 dark:bg-slate-950">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <h1 className="mb-2 text-3xl font-black dark:text-white">
          Reset Password
        </h1>
        <p className="mb-8 text-sm text-slate-500 dark:text-slate-400">
          Paste your reset token and choose a new
          password.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Reset Token
            </label>
            <Input
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Paste token from email"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
              New Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Min 6 characters"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Confirm Password
            </label>
            <Input
              type="password"
              value={confirm}
              onChange={(e) =>
                setConfirm(e.target.value)
              }
              placeholder="Re-enter password"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading
              ? "Resetting..."
              : "Reset Password"}
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-lg text-slate-500">Loading...</div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
