"use client";

import {
  Mail,
  Download,
  MapPin,
  Briefcase,
  ShieldCheck,
  Phone,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";
import { API_BASE_URL } from "@/lib/utils";
import { escapeHtml } from "@/lib/sanitize";

const API_BASE = API_BASE_URL;

interface Props {
  user: any;
  resume?: any;
}

export default function CandidateHeader({
  user,
  resume,
}: Props) {
  const handleDownload = async () => {
    if (resume?.fileUrl) {
      const url = `${API_BASE}${resume.fileUrl}`;
      const a = document.createElement("a");
      a.href = url;
      a.download = resume.filename || "resume.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success("Resume download started");
      return;
    }

    if (resume) {
      const html = `
<!DOCTYPE html>
<html>
<head>
<title>Resume - ${escapeHtml(resume.filename || "")}</title>
<style>
  body { font-family: 'Segoe UI', sans-serif; padding: 40px; color: #1a1a1a; }
  h1 { font-size: 24px; margin-bottom: 8px; }
  h2 { font-size: 18px; color: #2563eb; margin-top: 24px; border-bottom: 2px solid #2563eb; padding-bottom: 4px; }
  .ats { font-size: 14px; color: #666; margin-bottom: 16px; }
  .score { font-size: 32px; font-weight: bold; color: #16a34a; }
  ul { padding-left: 20px; }
  li { margin: 4px 0; line-height: 1.6; }
  .skill { display: inline-block; background: #eff6ff; color: #2563eb; padding: 4px 12px; border-radius: 20px; margin: 4px; font-size: 13px; }
</style>
</head>
<body>
<h1>Resume Analysis</h1>
<p class="ats">ATS Score: <span class="score">${escapeHtml(String(resume.atsScore ?? 0))}%</span></p>
<h2>Summary</h2>
<p>${escapeHtml(resume.summary || "")}</p>
<h2>Skills</h2>
<p>${resume.skills?.map((s: string) => `<span class="skill">${escapeHtml(s)}</span>`).join(" ")}</p>
<h2>Strengths</h2>
<ul>${resume.strengths?.map((s: string) => `<li>${escapeHtml(s)}</li>`).join("")}</ul>
<h2>Suggestions</h2>
<ul>${resume.suggestions?.map((s: string) => `<li>${escapeHtml(s)}</li>`).join("")}</ul>
${resume.missingSkills?.length ? `<h2>Missing Skills</h2><ul>${resume.missingSkills.map((s: string) => `<li>${escapeHtml(s)}</li>`).join("")}</ul>` : ""}
</body>
</html>`;
      const blob = new Blob([html], {
        type: "text/html",
      });
      const url = URL.createObjectURL(blob);
      const win = window.open(url, "_blank");
      if (win) {
        win.onload = () => win.print();
      }
      toast.success(
        "PDF export opened in new tab"
      );
      return;
    }

    toast.error("No resume available to download");
  };

  const profileSrc =
    user?.profileImage
      ? `${API_BASE}${user.profileImage}`
      : `https://ui-avatars.com/api/?background=2563eb&color=fff&name=${encodeURIComponent(
          user?.name || "User"
        )}`;

  const links = [
    {
      href: user?.github,
      label: "GitHub",
      display: user?.github,
    },
    {
      href: user?.linkedin,
      label: "LinkedIn",
      display: user?.linkedin,
    },
    {
      href: user?.portfolio,
      label: "Portfolio",
      display: user?.portfolio,
    },
  ].filter((l) => l.href);

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div
        className="h-40"
        style={
          user?.coverImage
            ? {
                backgroundImage: `url(${API_BASE}${user.coverImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
      >
        {!user?.coverImage && (
          <div className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500" />
        )}
      </div>

      <div className="px-10 pb-10">
        <div className="-mt-16 flex flex-col justify-between gap-8 lg:flex-row">
          <div className="flex gap-6">
            <img
              src={profileSrc}
              className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-lg dark:border-slate-900"
            />
            <div className="pt-16">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-4xl font-black dark:text-white">
                  {user?.name}
                </h1>
                {user?.isVerified && (
                  <span className="flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    <ShieldCheck size={16} />
                    Verified
                  </span>
                )}
              </div>

              {user?.headline && (
                <p className="mt-2 text-lg font-medium text-blue-600 dark:text-blue-400">
                  {user.headline}
                </p>
              )}

              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <Mail size={16} />
                  {user?.email}
                </div>

                {user?.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={16} />
                    {user.phone}
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Briefcase size={16} />
                  Candidate
                </div>

                {user?.location && (
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    {user.location}
                  </div>
                )}
              </div>

              {links.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-3">
                  {links.map((link) => (
                    <a
                      key={link.label}
                      href={
                        link.href.startsWith("http")
                          ? link.href
                          : `https://${link.href}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3.5 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                      <ExternalLink size={13} />
                      {link.label}
                    </a>
                  ))}
                </div>
              )}

              {user?.bio && (
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  {user.bio}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              <Download size={20} />
              Download Resume
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
