"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [resetToken, setResetToken] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post(
        "/auth/forgot-password",
        { email }
      );
      setSent(true);
      if (data.resetToken) {
        setResetToken(data.resetToken);
      }
      toast.success("Reset link sent to your email");
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
          reset link.
        </p>

        {sent ? (
          <div className="space-y-4">
            <div className="rounded-xl bg-green-50 p-4 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
              If an account exists with that email,
              a reset link has been sent.
            </div>

            {resetToken && (
              <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                <p className="font-semibold">
                  Dev Mode — Reset Token:
                </p>
                <code className="mt-1 block break-all font-mono text-xs">
                  {resetToken}
                </code>
              </div>
            )}

            <Link href="/reset-password">
              <Button className="w-full">
                Reset Password
              </Button>
            </Link>

            <Link
              href="/login"
              className="block text-center text-sm text-blue-600 hover:underline dark:text-blue-400"
            >
              Back to Login
            </Link>
          </div>
        ) : (
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
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>

            <Link
              href="/login"
              className="block text-center text-sm text-blue-600 hover:underline dark:text-blue-400"
            >
              Back to Login
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
