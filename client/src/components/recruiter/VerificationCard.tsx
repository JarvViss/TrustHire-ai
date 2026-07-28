"use client";

import { useState } from "react";
import {
  ShieldCheck,
  ShieldX,
  Copy,
  Fingerprint,
  Hash,
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";

interface Props {
  user: any;
  onVerified?: () => void;
}

export default function VerificationCard({
  user,
  onVerified,
}: Props) {
  const [verifying, setVerifying] = useState(false);

  const verified = user?.isVerified;
  const txHash = user?.verificationHash || "";

  const copy = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success("Copied");
  };

  const handleVerify = async () => {
    try {
      setVerifying(true);
      const res = await api.post(
        `/recruiter/candidate/${user._id}/verify`
      );
      if (res.data.success) {
        toast.success("Candidate verified");
        onVerified?.();
      } else {
        toast.error(
          res.data.message || "Verification failed"
        );
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        "Verification failed";
      toast.error(msg);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold dark:text-white">
            Credential Verification
          </h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Cryptographic hash of candidate
            credentials
          </p>
        </div>

        {verified ? (
          <div className="flex items-center gap-2 rounded-full bg-green-100 px-5 py-2 font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
            <ShieldCheck size={20} />
            Verified
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-full bg-red-100 px-5 py-2 font-semibold text-red-600 dark:bg-red-900/30 dark:text-red-400">
            <ShieldX size={20} />
            Not Verified
          </div>
        )}
      </div>

      {verified && txHash && (
        <div className="mt-8 rounded-2xl bg-slate-50 p-5 dark:bg-slate-800">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Hash size={14} />
            Verification Hash (SHA-256)
          </div>
          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="truncate font-mono text-sm dark:text-slate-200">
              {txHash}
            </p>
            <button
              onClick={() => copy(txHash)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <Copy size={18} />
            </button>
          </div>
          <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
            This hash is computed from the
            candidate's name, email, resume ID, and
            interview score. It can be independently
            verified to confirm credential integrity.
          </p>
        </div>
      )}

      {!verified && (
        <button
          disabled={verifying}
          onClick={handleVerify}
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          <Fingerprint size={18} />
          {verifying
            ? "Verifying..."
            : "Verify Candidate"}
        </button>
      )}
    </div>
  );
}
