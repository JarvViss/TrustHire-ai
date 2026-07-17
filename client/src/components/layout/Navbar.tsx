"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-2xl font-bold text-blue-600"
        >
          TrustHire AI
        </Link>

        <div className="hidden gap-8 md:flex">
          <Link href="/">Home</Link>
          <Link href="#features">Features</Link>
          <Link href="#how-it-works">How it Works</Link>
        </div>

        <div className="flex gap-3">
          <Link
            href="/login"
            className="rounded-lg border px-4 py-2"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Get Started
          </Link>
        </div>
      </nav>
    </header>
  );
}