"use client";

import { toast } from "sonner";
import { Download, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { escapeHtml } from "@/lib/sanitize";

interface Props {
  result: any;
  role?: string;
}

export default function InterviewReportCard({
  result,
  role,
}: Props) {
  const router = useRouter();

  const handleDownloadReport = () => {
    if (!result) return;

    const html = `
<!DOCTYPE html>
<html>
<head>
<title>AI Interview Report</title>
<style>
  body { font-family: 'Segoe UI', sans-serif; padding: 40px; color: #1a1a1a; max-width: 800px; margin: 0 auto; }
  h1 { font-size: 24px; margin-bottom: 8px; }
  h2 { font-size: 18px; color: #2563eb; margin-top: 24px; border-bottom: 2px solid #2563eb; padding-bottom: 4px; }
  .rec { font-size: 20px; font-weight: bold; padding: 12px 20px; border-radius: 8px; display: inline-block; margin: 8px 0; }
  .recommended { background: #dcfce7; color: #166534; }
  .borderline { background: #fef3c7; color: #92400e; }
  .not-recommended { background: #fee2e2; color: #991b1b; }
  .scores { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin: 16px 0; }
  .score-card { text-align: center; padding: 16px; border-radius: 12px; background: #f8fafc; border: 1px solid #e2e8f0; }
  .score-card .value { font-size: 28px; font-weight: bold; color: #2563eb; }
  .score-card .label { font-size: 12px; color: #64748b; margin-top: 4px; }
  ul { padding-left: 20px; }
  li { margin: 4px 0; line-height: 1.6; }
</style>
</head>
<body>
<h1>AI Interview Report</h1>
<div class="rec ${result.recommendation?.includes('Recommended') && !result.recommendation?.includes('Not') ? (result.recommendation?.includes('Borderline') ? 'borderline' : 'recommended') : 'not-recommended'}">
  ${escapeHtml(result.recommendation || "")}
</div>
<div class="scores">
  <div class="score-card"><div class="value">${escapeHtml(String(result.technical ?? 0))}/10</div><div class="label">Technical</div></div>
  <div class="score-card"><div class="value">${escapeHtml(String(result.communication ?? 0))}/10</div><div class="label">Communication</div></div>
  <div class="score-card"><div class="value">${escapeHtml(String(result.confidence ?? 0))}/10</div><div class="label">Confidence</div></div>
  <div class="score-card"><div class="value">${escapeHtml(String(result.overall ?? 0))}/10</div><div class="label">Overall</div></div>
</div>
<h2>Feedback</h2>
<p>${escapeHtml(result.finalFeedback || "")}</p>
<h2>Strengths</h2>
<ul>${result.strengths?.map((s: string) => `<li>${escapeHtml(s)}</li>`).join("") || "<li>None identified</li>"}</ul>
<h2>Areas for Improvement</h2>
<ul>${result.improvements?.map((s: string) => `<li>${escapeHtml(s)}</li>`).join("") || "<li>None identified</li>"}</ul>
</body>
</html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, "_blank");
    if (win) {
      win.onload = () => win.print();
    }
    toast.success("Interview report opened in new tab");
  };

  const handleRetake = () => {
    router.push("/interview");
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">

      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold dark:text-white">
          AI Interview Report
        </h2>
        {result && (
          <div className="flex gap-3">
            <button
              onClick={handleDownloadReport}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <Download size={16} />
              Export
            </button>
            <button
              onClick={handleRetake}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <RotateCcw size={16} />
              Retake
            </button>
          </div>
        )}
      </div>

      {!result ? (
        <p className="dark:text-slate-400">No interview taken.</p>
      ) : (
        <div className="space-y-5">

          <div>
            <p className="text-slate-500 dark:text-slate-400">Recommendation</p>
            <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {result.recommendation}
            </h3>
          </div>

          {result.finalFeedback && (
            <div>
              <p className="text-slate-500 dark:text-slate-400">Feedback</p>
              <p className="leading-8 dark:text-slate-200">{result.finalFeedback}</p>
            </div>
          )}

          <div>
            <p className="text-slate-500 dark:text-slate-400">Strengths</p>
            <ul className="mt-2 list-disc pl-5 dark:text-slate-200">
              {result.strengths?.map((s: string) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-slate-500 dark:text-slate-400">Areas for Improvement</p>
            <ul className="mt-2 list-disc pl-5 dark:text-slate-200">
              {result.improvements?.map((s: string) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>

        </div>
      )}

    </div>
  );
}
