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

  return JSON.parse(cleaned);
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

  return parseJSON(content);
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

  return parseJSON(content);
};