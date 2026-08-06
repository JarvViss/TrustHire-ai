"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { escapeHtml } from "@/lib/sanitize";

interface Props {
  resume: any;
}

export default function ResumePDFExport({
  resume,
}: Props) {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);

    try {
      const html = `
<!DOCTYPE html>
<html>
<head>
<title>Resume - ${escapeHtml(resume.filename)}</title>
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
<p class="ats">ATS Score: <span class="score">${escapeHtml(String(resume.atsScore))}%</span></p>

<h2>Summary</h2>
<p>${escapeHtml(resume.summary)}</p>

<h2>Skills</h2>
<p>${resume.skills?.map((s: string) => `<span class="skill">${escapeHtml(s)}</span>`).join(" ")}</p>

<h2>Strengths</h2>
<ul>${resume.strengths?.map((s: string) => `<li>${escapeHtml(s)}</li>`).join("")}</ul>

<h2>Suggestions</h2>
<ul>${resume.suggestions?.map((s: string) => `<li>${escapeHtml(s)}</li>`).join("")}</ul>

${
  resume.missingSkills?.length
    ? `<h2>Missing Skills</h2><ul>${resume.missingSkills.map((s: string) => `<li>${escapeHtml(s)}</li>`).join("")}</ul>`
    : ""
}

</body>
</html>`;

      const blob = new Blob([html], {
        type: "text/html",
      });

      const url = URL.createObjectURL(blob);
      const win = window.open(url, "_blank");

      if (win) {
        win.onload = () => {
          win.print();
        };
      }

      toast.success(
        "PDF export opened in new tab"
      );
    } catch {
      toast.error("Export failed");
    } finally {
      setExporting(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleExport}
      disabled={exporting}
    >
      <Download className="mr-2 h-4 w-4" />
      Export PDF
    </Button>
  );
}
