import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 py-12 dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 md:flex-row md:justify-between">
        <Link
          href="/"
          className="text-xl font-black text-blue-600 dark:text-blue-400"
        >
          TrustHire AI
        </Link>

        <p className="text-sm text-slate-500 dark:text-slate-400">
          &copy; {new Date().getFullYear()} TrustHire
          AI. All rights reserved.
        </p>

        <div className="flex gap-6 text-sm text-slate-500 dark:text-slate-400">
          <Link href="/login" className="hover:text-blue-600 dark:hover:text-blue-400">
            Sign In
          </Link>
          <Link
            href="/register"
            className="hover:text-blue-600 dark:hover:text-blue-400"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </footer>
  );
}
