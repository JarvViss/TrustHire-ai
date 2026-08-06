import OpenAI from "openai";
import "../config/env";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY!,
  baseURL: "https://api.groq.com/openai/v1",
  timeout: 30000,
});

export interface ResumeAnalysis {
  atsScore: number;
  summary: string;
  skills: string[];
  missingSkills: string[];
  strengths: string[];
  suggestions: string[];
}

export interface JobAnalysis {
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  recommendation: string;
  interviewReadiness: number;
}

const parseJSON = (content: string) => {
  const cleaned = content
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");

    if (start !== -1 && end !== -1 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1));
    }

    throw new Error("Failed to parse AI response as JSON");
  }
};

const clamp = (value: any, fallback = 0, max = 100): number => {
  const num = Number(value);

  if (!Number.isFinite(num)) return fallback;

  return Math.min(max, Math.max(0, num));
};

const asStringArray = (value: any): string[] => {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item) => typeof item === "string")
    .slice(0, 50);
};

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
          "You are an ATS Resume Analyzer. Always respond ONLY with valid JSON.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const content =
    completion.choices[0].message.content ?? "";

  const parsed = parseJSON(content);

  return {
    atsScore: clamp(parsed.atsScore),
    summary:
      typeof parsed.summary === "string"
        ? parsed.summary
        : "",
    skills: asStringArray(parsed.skills),
    missingSkills: asStringArray(parsed.missingSkills),
    strengths: asStringArray(parsed.strengths),
    suggestions: asStringArray(parsed.suggestions),
  };
};

export const analyzeJobMatch = async (
  summary: string,
  skills: string[],
  jobDescription: string
): Promise<JobAnalysis> => {
 const prompt = `
You are a Senior Technical Recruiter and ATS Expert.

Your task is to compare the candidate profile against the given Job Description.

Evaluate ONLY based on the provided information.

Candidate Summary:
${summary}

Candidate Skills:
${skills.join(", ")}

Job Description:
${jobDescription}

Return ONLY valid JSON.

{
  "matchScore": number,
  "matchedSkills": [],
  "missingSkills": [],
  "recommendation": "",
  "interviewReadiness": number
}

Rules:

1. Match Score must be realistic.

90-100
Candidate satisfies almost every important requirement.

70-89
Candidate is a good fit but has a few missing skills.

50-69
Candidate partially matches.

Below 50
Candidate is not suitable.

2. Penalize every missing required skill.

3. Never inflate the score.

4. interviewReadiness must be from 0 to 10.

5. recommendation should be 2-3 professional sentences.

Return ONLY JSON.
`;

  const completion = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0.2,
    messages: [
      {
        role: "system",
        content:
          "You are an ATS recruiter. Always respond ONLY with valid JSON.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const content =
    completion.choices[0].message.content ?? "";

  const parsed = parseJSON(content);

  return {
    matchScore: clamp(parsed.matchScore),
    matchedSkills: asStringArray(parsed.matchedSkills),
    missingSkills: asStringArray(parsed.missingSkills),
    recommendation:
      typeof parsed.recommendation === "string"
        ? parsed.recommendation
        : "",
    interviewReadiness: clamp(parsed.interviewReadiness, 0, 10),
  };
};
