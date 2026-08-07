"use client";

import { useState, useCallback } from "react";
import CandidateHeader from "./CandidateHeader";
import CandidateScores from "./CandidateScores";
import ResumeSummaryCard from "./ResumeSummaryCard";
import ResumeViewer from "./ResumeViewer";
import SkillsCard from "./SkillsCard";
import VerificationCard from "./VerificationCard";
import RecruiterActions from "./RecruiterActions";

interface Props {
  candidate: any;
}

export default function CandidateProfile({
  candidate: initialCandidate,
}: Props) {
  const [candidate, setCandidate] = useState(initialCandidate);

  if (!candidate) {
    return null;
  }

  const resumeMissingSkills = candidate.resume?.missingSkills ?? [];
  const analysisMissingSkills = candidate.analysis?.missingSkills ?? [];
  const allMissingSkills = [
    ...new Set([...resumeMissingSkills, ...analysisMissingSkills]),
  ];

  const handleStatusChange = (newStatus: string) => {
    setCandidate((prev: any) => ({
      ...prev,
      recruitmentStatus: newStatus,
    }));
  };

  const handleVerified = useCallback(() => {
    setCandidate((prev: any) => ({
      ...prev,
      user: { ...prev.user, isVerified: true },
    }));
  }, []);

  return (
    <div className="space-y-8">

      <CandidateHeader
        user={candidate.user}
        resume={candidate.resume}
      />

      <CandidateScores
        resume={candidate.resume}
        interview={candidate.interview}
        analysis={candidate.analysis}
      />

      <div className="grid gap-8 xl:grid-cols-3">

        <div className="space-y-8 xl:col-span-2">

          <ResumeSummaryCard
            summary={candidate.resume?.summary}
          />

          <SkillsCard
            skills={candidate.resume?.skills ?? []}
            missingSkills={allMissingSkills}
          />

        </div>

        <div className="space-y-8">

          <VerificationCard
            user={candidate.user}
            onVerified={handleVerified}
          />

          <RecruiterActions
            candidate={candidate}
            onStatusChange={handleStatusChange}
          />

        </div>

      </div>

    </div>
  );
}
