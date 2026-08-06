import Resume from "../models/Resume";
import JobAnalysis from "../models/JobAnalysis";
import { analyzeJobMatch } from "./ai.service";
import { ApiError } from "../utils/ApiError";

export const analyzeJob = async (
  userId: string,
  resumeId: string,
  jobDescription: string
) => {
  const resume = await Resume.findById(resumeId);

  if (!resume) {
    throw new ApiError(404, "Resume not found");
  }

  const analysis = await analyzeJobMatch(
    resume.summary,
    resume.skills,
    jobDescription
  );

  const savedAnalysis =
    await JobAnalysis.create({
      user: userId,

      resume: resumeId,

      jobDescription,

      ...analysis,
    });

  return savedAnalysis;
};

export const getLatestJobAnalysis =
  async (userId: string) => {
    return await JobAnalysis.findOne({
      user: userId,
    }).sort({
      createdAt: -1,
    });
  };

export const getJobAnalysisHistory =
  async (userId: string) => {
    return await JobAnalysis.find({
      user: userId,
    }).sort({
      createdAt: -1,
    });
  };