import Resume from "../models/Resume";
import { extractTextFromPDF } from "./pdf.service";
import { analyzeResume } from "./ai.service";

export const processResume = async (
  userId: string,
  file: Express.Multer.File
) => {
  const extractedText = await extractTextFromPDF(file.path);

  const analysis = await analyzeResume(extractedText);

  const resume = await Resume.create({
    user: userId,
    originalName: file.originalname,
    filePath: file.path,
    extractedText,

    atsScore: analysis.atsScore,
    summary: analysis.summary,
    skills: analysis.skills,
    missingSkills: analysis.missingSkills,
    strengths: analysis.strengths,
    suggestions: analysis.suggestions,
  });

  return resume;
};