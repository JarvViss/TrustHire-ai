"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { verifyEmail, resendVerificationCode } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, RefreshCw } from "lucide-react";

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") ?? "";

  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await verifyEmail({ email, code });
      toast.success(res.message ?? "Email verified!");
      router.push("/login");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ??
          "Verification failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error("Enter your email first");
      return;
    }

    setResending(true);

    try {
      const res = await resendVerificationCode(email);
      toast.success(res.message ?? "Code sent!");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ??
          "Could not resend code"
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 dark:bg-slate-950">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-700 dark:bg-slate-900">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-900/30">
            <Mail className="h-7 w-7 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold dark:text-white">
            Verify Your Email
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            We sent a 6-digit code to your email. Enter it
            below to activate your account.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <Input
            placeholder="Email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            placeholder="6-digit code"
            name="code"
            value={code}
            onChange={(e) =>
              setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            inputMode="numeric"
            maxLength={6}
            className="text-center text-2xl tracking-[0.5em]"
            required
          />

          <Button
            type="submit"
            className="w-full"
            disabled={loading || code.length !== 6}
          >
            {loading ? "Verifying..." : "Verify Email"}
          </Button>
        </form>

        <button
          onClick={handleResend}
          disabled={resending}
          className="mt-5 flex w-full items-center justify-center gap-2 text-sm text-blue-600 hover:underline disabled:opacity-50 dark:text-blue-400"
        >
          <RefreshCw size={14} />
          {resending ? "Sending..." : "Resend code"}
        </button>

        <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          Already verified?{" "}
          <Link
            href="/login"
            className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
          >
            Login
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
          <div className="text-lg text-slate-500">Loading...</div>
        </div>
      }
    >
      <VerifyEmailForm />
    </Suspense>
  );
}
