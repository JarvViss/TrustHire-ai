"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import api from "@/lib/axios";
import {
  ClipboardCheck,
  X,
  Star,
  CalendarCheck,
  Handshake,
  XCircle,
} from "lucide-react";

interface Props {
  candidate: any;
  onStatusChange?: (newStatus: string) => void;
}

const ACTIONS = [
  {
    status: "SHORTLISTED" as const,
    label: "Shortlist",
    icon: Star,
    base: "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600",
    active: "bg-blue-400 dark:bg-blue-600",
  },
  {
    status: "INTERVIEW" as const,
    label: "Schedule Interview",
    icon: CalendarCheck,
    base: "bg-amber-500 hover:bg-amber-600 dark:bg-amber-500 dark:hover:bg-amber-600",
    active: "bg-amber-400 dark:bg-amber-600",
  },
  {
    status: "HIRED" as const,
    label: "Hire",
    icon: Handshake,
    base: "bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600",
    active: "bg-green-400 dark:bg-green-600",
  },
  {
    status: "REJECTED" as const,
    label: "Reject",
    icon: XCircle,
    base: "bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600",
    active: "bg-red-400 dark:bg-red-600",
  },
];

export default function RecruiterActions({
  candidate,
  onStatusChange,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [selectedStatus, setSelectedStatus] =
    useState<string>("");
  const [notes, setNotes] = useState("");

  const currentStatus =
    candidate?.recruitmentStatus || "PENDING";

  const updateStatus = (
    status:
      | "SHORTLISTED"
      | "REJECTED"
      | "HIRED"
      | "INTERVIEW"
      | "PENDING"
  ) => {
    if (status === "INTERVIEW") {
      router.push(
        `/schedule?candidateId=${candidate.user._id}`
      );
      return;
    }

    if (status === currentStatus) {
      toast.info(
        `Candidate is already ${status.toLowerCase()}`
      );
      return;
    }

    setSelectedStatus(status);
    setShowNotes(true);
  };

  const confirmStatus = async () => {
    try {
      setLoading(true);

      const res = await api.patch(
        `/recruiter/candidate/${candidate.user._id}/status`,
        {
          status: selectedStatus,
          notes,
        }
      );

      if (res.data.success) {
        toast.success(
          `Candidate ${selectedStatus.toLowerCase()} successfully`
        );
        setShowNotes(false);
        setNotes("");

        onStatusChange?.(selectedStatus);
      } else {
        toast.error(
          res.data.message || "Action failed"
        );
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        "Action failed. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const cancelNotes = () => {
    setShowNotes(false);
    setSelectedStatus("");
    setNotes("");
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <h2 className="mb-6 text-2xl font-bold dark:text-white">
        Recruiter Actions
      </h2>

      <div className="mb-6">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Current Status
        </p>
        <p className="mt-1 text-lg font-semibold dark:text-white">
          {currentStatus}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {ACTIONS.map(
          ({
            status,
            label,
            icon: Icon,
            base,
            active,
          }) => {
            const isActive = currentStatus === status;
            return (
              <button
                key={status}
                disabled={loading}
                onClick={() => updateStatus(status)}
                className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-semibold text-white transition ${
                  isActive
                    ? `${active} cursor-default opacity-80`
                    : base
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            );
          }
        )}
      </div>

      {showNotes && (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-600 dark:bg-slate-800">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ClipboardCheck
                size={18}
                className="text-blue-600 dark:text-blue-400"
              />
              <p className="font-semibold dark:text-white">
                Update to: {selectedStatus}
              </p>
            </div>
            <button
              onClick={cancelNotes}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <X size={18} />
            </button>
          </div>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes (optional)..."
            rows={3}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-white"
          />

          <div className="mt-4 flex gap-3">
            <button
              disabled={loading}
              onClick={confirmStatus}
              className="rounded-xl bg-blue-600 px-6 py-2 font-semibold text-white transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              {loading
                ? "Updating..."
                : "Confirm"}
            </button>
            <button
              disabled={loading}
              onClick={cancelNotes}
              className="rounded-xl border border-slate-200 bg-white px-6 py-2 font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
