"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { toast } from "sonner";

import { registerUser } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import Link from "next/link";

export default function RegisterPage() {
    const router = useRouter();
    const login = useAuthStore((state) => state.login);

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "candidate",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
            const res = await registerUser(form);

            login(res.data.user, res.data.token);

            toast.success(
                res.message ??
                "Account created!"
            );

            router.push(
                res.data.user.role === "recruiter"
                    ? "/recruiter/dashboard"
                    : "/dashboard"
            );
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message ??
                "Registration failed"
            );
        }

        setLoading(false);
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 dark:bg-slate-950">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-700 dark:bg-slate-900">

                <h1 className="mb-6 text-center text-3xl font-bold dark:text-white">
                    Create Account
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >
                    <Input
                        placeholder="Full Name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />

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

                    <select
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                        className="w-full rounded-md border p-3 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
                    >
                        <option value="candidate">
                            Candidate
                        </option>

                        <option value="recruiter">
                            Recruiter
                        </option>
                    </select>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={loading}
                    >
                        {loading
                            ? "Registering..."
                            : "Register"}
                    </Button>
                </form>
                <div className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
                    Already have an account?{" "}
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