// import { GoogleGenerativeAI } from "@google/generative-ai";

// const getModel = () => {
//   const apiKey = process.env.GEMINI_API_KEY;

//   if (!apiKey) {
//     throw new Error("Gemini API Key not found.");
//   }

//   const genAI = new GoogleGenerativeAI(apiKey);

//   return genAI.getGenerativeModel({
//     model: "gemini-2.0-flash",
//   });
// };

// export interface ResumeAnalysis {
//   atsScore: number;
//   summary: string;
//   skills: string[];
//   missingSkills: string[];
//   strengths: string[];
//   suggestions: string[];
// }

// export const analyzeResume = async (
//   resumeText: string
// ): Promise<ResumeAnalysis> => {
//   const prompt = `
// You are an ATS Resume Analyzer.

// Analyze the following resume.

// Return ONLY valid JSON.

// Schema:

// {
//   "atsScore": number,
//   "summary": string,
//   "skills": [],
//   "missingSkills": [],
//   "strengths": [],
//   "suggestions": []
// }

// Resume:

// ${resumeText}
// `;

//   const model = getModel();

// const result = await model.generateContent(prompt);
//   const response = result.response.text();

//   // Gemini sometimes wraps JSON in ```json ... ```
//   const cleaned = response
//     .replace(/```json/g, "")
//     .replace(/```/g, "")
//     .trim();

//   return JSON.parse(cleaned);
// };