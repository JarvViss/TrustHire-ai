"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ChevronRight,
  ShieldCheck,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { API_BASE_URL } from "@/lib/utils";

interface Props {
  candidates: any[];
}

type SortKey =
  | "name"
  | "atsScore"
  | "interviewScore"
  | "jobMatch";

export default function CandidateList({
  candidates,
}: Props) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("name");
  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const filtered = useMemo(() => {
    let list = [...candidates];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name?.toLowerCase().includes(q) ||
          c.email?.toLowerCase().includes(q) ||
          c.headline?.toLowerCase().includes(q) ||
          c.skills?.some((s: string) =>
            s.toLowerCase().includes(q)
          )
      );
    }

    if (statusFilter !== "ALL") {
      list = list.filter(
        (c) => c.recommendation === statusFilter
      );
    }

    list.sort((a, b) => {
      if (sortBy === "name")
        return (a.name ?? "").localeCompare(
          b.name ?? ""
        );
      return (
        (b[sortBy] ?? 0) - (a[sortBy] ?? 0)
      );
    });

    return list;
  }, [
    candidates,
    search,
    sortBy,
    statusFilter,
  ]);

  if (!candidates.length) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-16 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-3xl font-bold dark:text-white">
          No Candidates
        </h2>
        <p className="mt-3 text-slate-500 dark:text-slate-400">
          Candidates will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search by name, email, skill..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-3">
          <SlidersHorizontal className="h-4 w-4 text-slate-500 dark:text-slate-400" />

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="ALL">All Status</option>
            <option value="Not Interviewed">
              Not Interviewed
            </option>
            <option value="Hire">Hire</option>
            <option value="Strong Hire">
              Strong Hire
            </option>
            <option value="Maybe">Maybe</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as SortKey)
            }
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="name">Name</option>
            <option value="atsScore">
              ATS Score
            </option>
            <option value="interviewScore">
              Interview Score
            </option>
            <option value="jobMatch">
              Job Match
            </option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <p className="text-lg text-slate-500 dark:text-slate-400">
            No candidates match your filters.
          </p>
        </div>
      ) : (
        filtered.map((candidate, index) => (
          <Link
            href={`/recruiter/candidate/${candidate.id}`}
            key={`${candidate.id}-${index}`}
          >
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600">
              <div className="flex flex-col justify-between gap-8 lg:flex-row">
                <div className="flex gap-5">
                  <img
                    src={
                      candidate.profileImage
                        ? `${API_BASE_URL}${candidate.profileImage}`
                        : `https://ui-avatars.com/api/?background=2563eb&color=fff&name=${encodeURIComponent(candidate.name || "User")}`
                    }
                    className="h-20 w-20 rounded-full object-cover"
                  />

                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-bold dark:text-white">
                        {candidate.name}
                      </h2>
                      {candidate.verified && (
                        <ShieldCheck className="text-green-600 dark:text-green-400" />
                      )}
                    </div>

                    <p className="mt-2 text-slate-500 dark:text-slate-400">
                      {candidate.email}
                    </p>

                    <p className="mt-3 font-medium text-blue-600 dark:text-blue-400">
                      {candidate.headline}
                    </p>

                    {candidate.skills?.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {candidate.skills
                          .slice(0, 5)
                          .map(
                            (
                              skill: string,
                              i: number
                            ) => (
                              <span
                                key={i}
                                className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                              >
                                {skill}
                              </span>
                            )
                          )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
                  <Score
                    title="ATS"
                    value={`${candidate.atsScore}%`}
                  />
                  <Score
                    title="Interview"
                    value={candidate.interviewScore}
                  />
                  <Score
                    title="Match"
                    value={`${candidate.jobMatch}%`}
                  />
                  <Score
                    title="Status"
                    value={candidate.recommendation}
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <div className="flex items-center gap-2 font-semibold text-blue-600 dark:text-blue-400">
                  View Profile
                  <ChevronRight size={20} />
                </div>
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}

function Score({
  title,
  value,
}: any) {
  return (
    <div>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        {title}
      </p>
      <h3 className="mt-2 text-2xl font-bold text-blue-600 dark:text-blue-400">
        {value}
      </h3>
    </div>
  );
}
