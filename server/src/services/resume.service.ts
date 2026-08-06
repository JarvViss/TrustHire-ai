import fs from "fs";
import Resume from "../models/Resume";
import { extractTextFromPDF } from "./pdf.service";
import { analyzeResume } from "./ai.service";

export const processResume = async (
  userId: string,
  file: Express.Multer.File
) => {
  try {
    const extractedText =
      await extractTextFromPDF(file.path);

    const analysis =
      await analyzeResume(extractedText);

    return await Resume.create({
      user: userId,
      filename: file.originalname,
      fileUrl: `/uploads/resumes/${file.filename}`,
      atsScore: analysis.atsScore,
      summary: analysis.summary,
      skills: analysis.skills,
      missingSkills: analysis.missingSkills,
      strengths: analysis.strengths,
      suggestions: analysis.suggestions,
    });
  } catch (error) {
    fs.rm(file.path, { force: true }, () => {});
    throw error;
  }
};

export const deleteResumeFile = async (
  fileUrl: string
) => {
  const basename = fileUrl.split("/").pop();

  if (!basename) return;

  const filePath = `uploads/resumes/${basename}`;

  fs.rm(filePath, { force: true }, () => {});
};

export const getUserResumes = async (
  userId: string
) => {
  return Resume.find({
    user: userId,
  }).sort({
    createdAt: -1,
  });
};

export const getResumeStats = async (
  userId: string
) => {
  const userResume = await Resume.findOne({
    user: userId,
  }).sort({ createdAt: -1 });

  const yourScore = userResume?.atsScore ?? 0;

  const atsAgg = await Resume.aggregate([
    {
      $group: {
        _id: null,
        average: { $avg: "$atsScore" },
        allScores: { $push: "$atsScore" },
        count: { $sum: 1 },
      },
    },
  ]);

  const platformAverage =
    atsAgg.length > 0
      ? Math.round(atsAgg[0].average)
      : 0;

  let percentile = 0;

  if (atsAgg.length > 0) {
    const scores: number[] = atsAgg[0].allScores;
    const below = scores.filter(
      (s) => s < yourScore
    ).length;
    const denominator = Math.max(
      1,
      scores.length - 1
    );
    percentile = Math.round(
      (below / denominator) * 100
    );
  }

  const skillsAgg = await Resume.aggregate([
    { $unwind: "$skills" },
    {
      $group: {
        _id: "$skills",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 15 },
    {
      $project: {
        _id: 0,
        skill: "$_id",
        count: 1,
      },
    },
  ]);

  return {
    ats: {
      yourScore,
      platformAverage,
      percentile,
    },
    skillsFrequency: skillsAgg,
  };
};
