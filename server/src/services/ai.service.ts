import OpenAI from "openai";
import "../config/env";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY!,
  baseURL: "https://api.groq.com/openai/v1",
  timeout: 30000,
});

const MODEL = "openai/gpt-oss-120b";

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

const parseJSON = (content: string): any => {
  const cleaned = content
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  if (!cleaned) return {};

  let parsed: any;

  try {
    parsed = JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");

    if (start !== -1 && end !== -1 && end > start) {
      parsed = JSON.parse(cleaned.slice(start, end + 1));
    } else {
      return {};
    }
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return {};
  }

  return parsed;
};

const clamp = (
  value: any,
  fallback = 0,
  max = 100
): number => {
  let num: number;

  if (typeof value === "string") {
    const trimmed = value.trim();

    const ratio = trimmed.match(
      /^(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)/
    );

    if (ratio) {
      const numerator = Number(ratio[1]);
      const denominator = Number(ratio[2]);

      if (denominator > 0) {
        num =
          max <= 10
            ? numerator
            : (numerator / denominator) * max;
        return Math.round(
          Math.min(max, Math.max(0, num))
        );
      }
    }

    num = Number(trimmed.replace(/[^\d.-]/g, ""));
  } else {
    num = Number(value);
  }

  if (!Number.isFinite(num)) return fallback;

  return Math.round(Math.min(max, Math.max(0, num)));
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

Scoring Rubric for atsScore (0-100):

- 90-100: Exceptional. Strong keywords, measurable achievements, clear formatting, and a complete profile.
- 75-89: Good. Solid skills and experience with minor keyword or formatting gaps.
- 50-74: Average. Missing important keywords, weak summaries, or poor formatting.
- Below 50: Poor. Sparse content, no keywords, or unreadable formatting.

Be CRITICAL and realistic. Never inflate the score.

Return ONLY valid JSON.

{
  "atsScore": number,
  "summary": string,
  "skills": ["string"],
  "missingSkills": ["string"],
  "strengths": ["string"],
  "suggestions": ["string"]
}

Resume:

${resumeText}
`;

  const completion = await client.chat.completions.create({
    model: MODEL,
    temperature: 0.2,
    response_format: { type: "json_object" },
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
  "matchedSkills": ["string"],
  "missingSkills": ["string"],
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
    model: MODEL,
    temperature: 0.2,
    response_format: { type: "json_object" },
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

export interface LiveInterviewSummary {
  overall: number;
  recommendation: string;
  strengths: string[];
  improvements: string[];
  feedback: string;
}

export const generateInterviewQuestions = async ({
  role,
  resumeSummary,
  resumeSkills,
}: {
  role: string;
  resumeSummary: string;
  resumeSkills: string[];
}): Promise<string[]> => {
  const prompt = `
You are a Senior Staff Engineer and Hiring Manager conducting a REAL job interview.

Candidate Role:

${role}

Candidate Resume Summary:

${resumeSummary}

Candidate Skills:

${resumeSkills.join(", ")}

Rules:

• Generate exactly 6 interview questions.

• Every question MUST be directly about a skill from the candidate's resume that is relevant to the Candidate Role.

• The questions must be answerable by the candidate out loud during a live interview.

• Do NOT ask HR, behavioral, or "Tell me about yourself" questions.

• Do NOT ask generic opinion questions.

• Vary difficulty from Easy to Hard.

• Make them sound exactly like a real interviewer would ask.

• Keep each question under 40 words.

Return ONLY valid JSON.

{
  "questions": ["...", "..."]
}
`;

  const completion = await client.chat.completions.create({
    model: MODEL,
    temperature: 0.5,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "You are an expert technical interviewer. Always respond ONLY with valid JSON.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const content = completion.choices?.[0]?.message?.content ?? "";

  const parsed = parseJSON(content);

  const questions = asStringArray(parsed.questions).map((q) =>
    q.trim().replace(/\s+/g, " ")
  );

  return questions.filter(Boolean).slice(0, 6);
};

export const generateInterviewSummary = async ({
  role,
  resumeSummary,
  questionsAndAnswers,
}: {
  role: string;
  resumeSummary: string;
  questionsAndAnswers: {
    question: string;
    answer: string;
    rating: number;
    notes: string;
  }[];
}): Promise<LiveInterviewSummary> => {
  const transcript = questionsAndAnswers
    .map(
      (item, index) => `
Question ${index + 1}
${item.question}

Candidate's Answer
${item.answer}

Recruiter's Rating (1-5)
${item.rating}

Recruiter's Notes
${item.notes}
`
    )
    .join("\n");

  const prompt = `
You are a Senior Hiring Manager.

A recruiter has just completed a REAL live interview.

Candidate Role:

${role}

Resume Summary:

${resumeSummary}

Interview Transcript (includes the recruiter's 1-5 rating for each answer):

${transcript}

====================
STRICT EVALUATION RULES
====================

Be objective.

Never invent strengths.

Never praise weak answers.

Base your judgment on the recruiter's ratings and the substance of the answers.

Ignore grammar mistakes.

Scoring:

0-2 Poor
3-4 Weak
5-6 Average
7-8 Good
9-10 Excellent

If the candidate skipped questions, gave one-sentence answers, or gave vague or incorrect answers, overall MUST be below 5.

The recruiter's average rating should be a strong signal for the overall score (rating of 5 ≈ overall 8-9, rating of 4 ≈ 6-7, rating of 3 ≈ 5, rating of 2 or below ≈ below 4).

Hiring Recommendation Rules:

overall >= 8: Recommended
overall >= 6: Borderline
otherwise: Not Recommended

Return ONLY valid JSON.

{
  "overall":0,
  "recommendation":"",
  "strengths":["...", "..."],
  "improvements":["...", "..."],
  "feedback":"..."
}
`;

  const completion = await client.chat.completions.create({
    model: MODEL,
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "You are a strict hiring manager. Return only valid JSON.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const content = completion.choices?.[0]?.message?.content ?? "";

  const parsed = parseJSON(content);

  return {
    overall: clamp(parsed.overall, 0, 10),
    recommendation:
      typeof parsed.recommendation === "string"
        ? parsed.recommendation
        : "Not Recommended",
    strengths: asStringArray(parsed.strengths),
    improvements: asStringArray(parsed.improvements),
    feedback:
      typeof parsed.feedback === "string" ? parsed.feedback : "",
  };
};
