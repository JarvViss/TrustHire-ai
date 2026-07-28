import Application from "../models/Application";
import { analyzeJobMatch } from "./ai.service";
import Resume from "../models/Resume";

export async function createApplication(
  candidateId: string,
  jobTitle: string,
  company: string,
  jobDescription: string
) {
  let matchScore = 0;

  const resume = await Resume.findOne({
    user: candidateId,
  }).sort({ createdAt: -1 });

  if (resume) {
    try {
      const analysis = await analyzeJobMatch(
        resume.summary,
        resume.skills,
        jobDescription
      );
      matchScore = analysis.matchScore;
    } catch {
      // AI failed, continue without score
    }
  }

  return Application.create({
    candidate: candidateId,
    jobTitle,
    company,
    jobDescription,
    matchScore,
  });
}

export async function getCandidateApplications(
  candidateId: string
) {
  return Application.find({ candidate: candidateId })
    .sort({ createdAt: -1 });
}

export async function updateApplicationStatus(
  applicationId: string,
  status: string,
  notes?: string
) {
  const update: Record<string, string> = { status };
  if (notes !== undefined) update.notes = notes;

  return Application.findByIdAndUpdate(
    applicationId,
    update,
    { new: true }
  );
}
