import Resume from "../models/Resume";
import { extractTextFromPDF } from "./pdf.service";
import { analyzeResume } from "./ai.service";
import { deleteFile, storeFile } from "./storage.service";

export const processResume = async (
  userId: string,
  file: Express.Multer.File
) => {
  const extractedText =
    await extractTextFromPDF(file.buffer);

  const analysis =
    await analyzeResume(extractedText);

  const fileUrl = await storeFile(
    file.buffer,
    "resumes",
    "raw",
    file.originalname
  );

  try {
    return await Resume.create({
      user: userId,
      filename: file.originalname,
      fileUrl,
      atsScore: analysis.atsScore,
      summary: analysis.summary,
      skills: analysis.skills,
      missingSkills: analysis.missingSkills,
      strengths: analysis.strengths,
      suggestions: analysis.suggestions,
    });
  } catch (error) {
    await deleteFile(fileUrl);
    throw error;
  }
};

export const deleteResumeFile = async (
  fileUrl: string
) => {
  await deleteFile(fileUrl);
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
    const total = scores.length - 1;

    if (total <= 0) {
      percentile = 100;
    } else {
      const below = scores.filter(
        (s) => s < yourScore
      ).length;
      const equal = Math.max(
        0,
        scores.filter((s) => s === yourScore)
          .length - 1
      );
      percentile = Math.round(
        ((below + equal * 0.5) / total) * 100
      );
    }
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
