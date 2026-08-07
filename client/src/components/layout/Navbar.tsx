"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, User as UserIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useAuthStore } from "@/store/auth.store";
import { useResumeStore } from "@/store/resume.store";
import NotificationBell from "@/components/common/NotificationBell";
import ThemeToggle from "@/components/common/ThemeToggle";
import { avatarFallback, resolveMediaUrl } from "@/lib/utils";
import api from "@/lib/axios";

export default function Navbar() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const clear = useResumeStore((state) => state.clear);

  const role = user?.role;

  const handleLogout = () => {
    logout();
    clear();
    api.post("/auth/logout").catch(() => {});
    router.push("/login");
    setMobileOpen(false);
  };

  const homeHref =
    role === "admin"
      ? "/admin/dashboard"
      : role === "recruiter"
      ? "/recruiter/dashboard"
      : "/dashboard";

  const candidateLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/upload", label: "Upload" },
    { href: "/history", label: "History" },
    { href: "/compare", label: "Compare" },
    { href: "/job-match", label: "Job Match" },
    { href: "/job-history", label: "Job History" },
    {
      href: "/applications",
      label: "Applications",
    },
    {
      href: "/my-interviews",
      label: "My Interviews",
    },
    { href: "/interview", label: "Mock Interview" },
    {
      href: "/interview/history",
      label: "Interview History",
    },
    { href: "/profile", label: "Profile" },
  ];

  const recruiterLinks = [
    {
      href: "/recruiter/dashboard",
      label: "Dashboard",
    },
    { href: "/schedule", label: "Schedule" },
  ];

  const adminLinks = [
    {
      href: "/admin/dashboard",
      label: "Dashboard",
    },
    { href: "/admin/users", label: "Users" },
  ];

  const links =
    role === "admin"
      ? adminLinks
      : role === "recruiter"
      ? recruiterLinks
      : role === "candidate"
      ? candidateLinks
      : [];

  const profileImage = (user as any)?.profileImage;

  return (
    <nav className="border-b border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <Link
          href={homeHref}
          className="text-xl font-black text-blue-600 dark:text-blue-400"
        >
          TrustHire AI
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-2 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              <Button
                variant="ghost"
                size="sm"
              >
                {link.label}
              </Button>
            </Link>
          ))}

          <div className="mx-1 h-5 w-px bg-slate-200 dark:bg-slate-700" />

          <ThemeToggle />
          <NotificationBell />

          <Link href={homeHref}>
            {profileImage ? (
              <img
                src={resolveMediaUrl(profileImage)}
                alt="Profile"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.dataset.fallback) {
                    target.dataset.fallback = "1";
                    target.src = avatarFallback(user?.name);
                  }
                }}
                className="h-8 w-8 rounded-full border border-slate-200 object-cover dark:border-slate-700"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                {user?.name?.charAt(0)?.toUpperCase() || <UserIcon size={14} />}
              </div>
            )}
          </Link>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            Logout
          </Button>
        </div>

        {/* Mobile hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <NotificationBell />

          <Link href={homeHref}>
            {profileImage ? (
              <img
                src={resolveMediaUrl(profileImage)}
                alt="Profile"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.dataset.fallback) {
                    target.dataset.fallback = "1";
                    target.src = avatarFallback(user?.name);
                  }
                }}
                className="h-8 w-8 rounded-full border border-slate-200 object-cover dark:border-slate-700"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                {user?.name?.charAt(0)?.toUpperCase() || <UserIcon size={14} />}
              </div>
            )}
          </Link>

          <button
            onClick={() =>
              setMobileOpen(!mobileOpen)
            }
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-white shadow-sm transition-colors hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            {mobileOpen ? (
              <X className="h-4 w-4 text-slate-600 dark:text-slate-300" />
            ) : (
              <Menu className="h-4 w-4 text-slate-600 dark:text-slate-300" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() =>
                  setMobileOpen(false)
                }
                className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {link.label}
              </Link>
            ))}

            <div className="my-2 h-px bg-slate-200 dark:bg-slate-700" />

            <button
              onClick={handleLogout}
              className="rounded-lg px-4 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
