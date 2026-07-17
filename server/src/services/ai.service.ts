import OpenAI from "openai";
import "../config/env";
const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY!,
  baseURL: "https://api.groq.com/openai/v1",
});

export interface ResumeAnalysis {
  atsScore: number;
  summary: string;
  skills: string[];
  missingSkills: string[];
  strengths: string[];
  suggestions: string[];
}

export const analyzeResume = async (
  resumeText: string
): Promise<ResumeAnalysis> => {
  const prompt = `
You are an expert ATS Resume Analyzer.

Analyze the resume below.

Return ONLY valid JSON.

{
  "atsScore": number,
  "summary": string,
  "skills": [],
  "missingSkills": [],
  "strengths": [],
  "suggestions": []
}

Resume:

${resumeText}
`;

  const completion = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0.2,

    messages: [
      {
        role: "system",
        content:
          "You are an ATS resume analyzer. Always respond ONLY with valid JSON.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const content = completion.choices[0].message.content ?? "";

  const cleaned = content
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleaned);
};