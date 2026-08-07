"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { loginUser } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";

import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();

  const login = useAuthStore((state) => state.login);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await loginUser(form);

      login(res.user, res.token);

      toast.success("Welcome back!");

      if (res.user.role === "recruiter") {
        router.push("/recruiter/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (error: any) {
      if (error?.response?.status === 403) {
        toast.error("Please verify your email first");
        router.push(
          `/verify-email?email=${encodeURIComponent(form.email)}`
        );
        setLoading(false);
        return;
      }

      toast.error(
        error?.response?.data?.message ||
          "Login failed"
      );
    }

    setLoading(false);
  };
 
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 dark:bg-slate-950">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-700 dark:bg-slate-900">

        <h1 className="mb-2 text-center text-3xl font-bold dark:text-white">
          Welcome Back
        </h1>

        <p className="mb-8 text-center text-slate-500 dark:text-slate-400">
          Login to your TrustHire-AI account
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <Input
            placeholder="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <Input
            placeholder="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-sm text-blue-600 hover:underline dark:text-blue-400"
            >
              Forgot Password?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading
              ? "Signing In..."
              : "Login"}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
          >
            Register
          </Link>
        </div>
      </div>
    </main>
  );
}