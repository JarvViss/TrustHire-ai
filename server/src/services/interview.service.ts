import OpenAI from "openai";

import Interview from "../models/Interview";
import Resume from "../models/Resume";
import { createNotification } from "./notification.service";
import { ApiError } from "../utils/ApiError";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY!,
  baseURL: "https://api.groq.com/openai/v1",
  timeout: 30000,
});

const MODEL = "openai/gpt-oss-120b";

function safeParseJSON(text: string): any {
  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  if (!cleaned) {
    return {};
  }

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
}

function asStringArray(value: any): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item) => typeof item === "string");
}

function clampScore(value: any, fallback = 0): number {
  const num = Number(value);

  if (!Number.isFinite(num)) return fallback;

  return Math.min(10, Math.max(0, num));
}

const inFlightAnswers = new Set<string>();

function getDifficulty(question: number) {
  switch (question) {
    case 0:
      return "Easy";
    case 1:
      return "Easy-Medium";
    case 2:
      return "Medium";
    case 3:
      return "Medium-Hard";
    default:
      return "Hard";
  }
}

function buildHistory(conversation: any[]) {
  return conversation
    .map(
      (item, index) => `
Question ${index + 1}
${item.question}

Candidate Answer
${item.answer}
`
    )
    .join("\n");
}

function normalizeQuestion(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\s+/g, " ");
}

function isDuplicateQuestion(
  question: string,
  conversation: any[]
): boolean {
  const next = normalizeQuestion(question).toLowerCase();

  if (!next) return true;

  return conversation.some(
    (item) =>
      item.question?.trim().toLowerCase() === next
  );
}

function buildFallbackQuestions(
  role: string,
  skills: string[]
): string[] {
  const primarySkill = skills[0] ?? "your core tech stack";
  const safeRole = role.trim() || "software engineer";

  return [
    `For the ${safeRole} role, walk me through how you would debug a production issue that only shows up intermittently.`,
    `How do you keep the code you write for ${primarySkill} maintainable and easy for other developers to work on?`,
    `Walk me through your approach to designing a new feature end-to-end for a ${safeRole} project.`,
    `How would you test the most critical behavior in a ${safeRole} system, and what would you focus on first?`,
    `Describe a time you improved performance or reliability in a ${safeRole} codebase. How did you measure the result?`,
    `How do you decide which ${primarySkill} best practices to apply when building something for a ${safeRole} role?`,
    `What security or data-integrity concerns do you think about when building a ${safeRole} application?`,
    `How would you refactor a piece of legacy code in a ${safeRole} project without breaking existing behavior?`,
    `Explain how you would design an API used by a ${safeRole} app, including error handling and performance.`,
    `How do you handle a situation where a teammate disagrees with your technical approach for a ${safeRole} feature?`,
  ];
}

function pickFallbackQuestion(
  conversation: any[],
  role: string,
  skills: string[]
): string {
  const asked = new Set(
    conversation.map((item) =>
      item.question?.trim().toLowerCase()
    )
  );

  const unused = buildFallbackQuestions(
    role,
    skills
  ).find((q) => !asked.has(q.toLowerCase()));

  return (
    unused ??
    `For the ${role} role, describe the technical problem you are most proud of solving and the approach you used.`
  );
}

export async function startInterview(
  userId: string,
  role: string
) {
  const resume = await Resume.findOne({
    user: userId,
  }).sort({
    createdAt: -1,
  });

  if (!resume) {
    throw new ApiError(404, "Resume not found");
  }

  const prompt = `
You are a Senior Staff Software Engineer and Hiring Manager at Google.

You are conducting a REAL technical interview.

Candidate Role:

${role}

Candidate Resume Summary:

${resume.summary}

Candidate Skills:

${resume.skills.join(", ")}

Skills Missing:

${resume.missingSkills.join(", ")}

Rules:

• Ask ONE technical interview question.

• The question MUST be directly about a specific technology or skill from the candidate's resume that is relevant to the Candidate Role.

• Start with an EASY question.

• Do NOT ask HR questions.

• Do NOT ask "Tell me about yourself."

• Do NOT ask generic behavioral or opinion questions.

• Ask something that evaluates technical understanding.

• Keep the question under 35 words.

• Make it sound exactly like a real interviewer.

Return ONLY JSON.

{
   "question":"..."
}
`;

  const completion =
    await client.chat.completions.create({
      model: MODEL,
      temperature: 0.5,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are an expert technical interviewer. Return only valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

  const content =
    completion.choices?.[0]?.message?.content ?? "";

  const parsed = safeParseJSON(content);

  const firstQuestion = normalizeQuestion(parsed.question);

  return await Interview.create({
    user: userId,
    role,
    status: "ACTIVE",
    currentQuestion: 0,
    conversation: [
      {
        question:
          firstQuestion ||
          pickFallbackQuestion([], role, resume.skills),
        answer: "",
        score: 0,
        feedback: "",
      },
    ],
  });
}

export async function submitAnswer(
  interviewId: string,
  answer: string,
  userId: string
) {
  const interview = await Interview.findById(
    interviewId
  );

  if (!interview) {
    throw new ApiError(404, "Interview not found");
  }

  if (interview.user.toString() !== userId) {
    throw new ApiError(403, "Unauthorized");
  }

  if (interview.status !== "ACTIVE") {
    throw new ApiError(
      400,
      "Interview is no longer active"
    );
  }

  const resume = await Resume.findOne({
    user: interview.user,
  }).sort({
    createdAt: -1,
  });

  if (!resume) {
    throw new ApiError(404, "Resume not found");
  }

  const current = interview.currentQuestion;

  if (
    current < 0 ||
    current >= interview.conversation.length
  ) {
    throw new ApiError(
      400,
      "Interview state is corrupted"
    );
  }

  const lockKey = `${interviewId}:${current}`;

  if (inFlightAnswers.has(lockKey)) {
    throw new ApiError(
      409,
      "Your answer is still being processed. Please wait."
    );
  }

  inFlightAnswers.add(lockKey);

  interview.conversation[current].answer = answer;

  await interview.save();

  try {
  const history = buildHistory(
    interview.conversation
  );

  const lastQuestion = current >= 4;

  if (!lastQuestion) {
    const difficulty = getDifficulty(current + 1);

    const askedQuestions = interview.conversation
      .map((item, index) => `${index + 1}. ${item.question}`)
      .join("\n");

    const prompt = `
You are a Senior Staff Software Engineer and Hiring Manager at Google.

You are conducting a REAL software engineering interview.

Candidate Role:

${interview.role}

Resume Summary:

${resume.summary}

Candidate Skills:

${resume.skills.join(", ")}

Interview Conversation (score the LATEST answer, the last question-answer pair):

${history}

The NEXT question difficulty should be:

${difficulty}

Already Asked Questions (Do NOT ask any of these again):

${askedQuestions}

==========================
Evaluation Rules
==========================

Be STRICT.

Do NOT be encouraging.

Do NOT invent strengths.

Scoring Guide:

0-2
Very poor answer.

3-4
Weak understanding.

5-6
Average.

7-8
Good.

9-10
Excellent.

If the answer is:

- one word
- copied
- meaningless
- unrelated

score MUST be between 0 and 2.

Feedback Rules:

- Maximum 2 sentences.
- Mention ONE mistake.
- Mention ONE improvement.

Question Rules:

- Ask ONE NEW question that is different from ALL the already asked questions above.
- Do NOT repeat, rephrase, or echo any previous question.
- Do NOT repeat the candidate's own words.
- ONLY ask about technologies that are relevant to the Candidate Role and present in the resume skills.
- Do NOT ask generic or unrelated topics.
- Increase difficulty gradually.
- Prefer practical questions over theory.
- Maximum 35 words.

Return ONLY JSON.

{
  "score":0,
  "feedback":"",
  "nextQuestion":""
}
`;

    const completion =
      await client.chat.completions.create({
        model: MODEL,
        temperature: 0.4,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You are a strict FAANG interviewer. Return only valid JSON.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      });

    const content =
      completion.choices?.[0]?.message?.content ??
      "";

    const parsed = safeParseJSON(content);

    let nextQuestion = normalizeQuestion(
      parsed.nextQuestion
    );

    if (
      isDuplicateQuestion(
        nextQuestion,
        interview.conversation
      )
    ) {
      nextQuestion = pickFallbackQuestion(
        interview.conversation,
        interview.role,
        resume.skills
      );
    }

    interview.conversation[current].score =
      clampScore(parsed.score);

    interview.conversation[current].feedback =
      parsed.feedback ?? "";

    interview.currentQuestion++;

    interview.conversation.push({
      question: nextQuestion,
      answer: "",
      score: 0,
      feedback: "",
    });

    await interview.save();

    return interview;
  }

  // ----------------------------
  // FINAL INTERVIEW EVALUATION
  // ----------------------------

  const evalPrompt = `
You are a Senior Staff Software Engineer and Hiring Manager at Google.

You are conducting a REAL software engineering interview.

Candidate Role:

${interview.role}

Resume Summary:

${resume.summary}

Candidate Skills:

${resume.skills.join(", ")}

Interview Conversation (score the LATEST answer, the last question-answer pair):

${history}

==========================
Evaluation Rules
==========================

Be STRICT.

Do NOT be encouraging.

Do NOT invent strengths.

Scoring Guide:

0-2
Very poor answer.

3-4
Weak understanding.

5-6
Average.

7-8
Good.

9-10
Excellent.

If the answer is:

- one word
- copied
- meaningless
- unrelated

score MUST be between 0 and 2.

Feedback Rules:

- Maximum 2 sentences.
- Mention ONE mistake.
- Mention ONE improvement.

Return ONLY JSON.

{
  "score":0,
  "feedback":""
}
`;

  const evalCompletion =
    await client.chat.completions.create({
      model: MODEL,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are a strict FAANG interviewer. Return only valid JSON.",
        },
        {
          role: "user",
          content: evalPrompt,
        },
      ],
    });

  const evalContent =
    evalCompletion.choices?.[0]?.message?.content ??
    "";

  const evalParsed = safeParseJSON(evalContent);

  interview.conversation[current].score =
    clampScore(evalParsed.score);

  interview.conversation[current].feedback =
    evalParsed.feedback ?? "";

  const finalPrompt = `
You are a Senior Hiring Manager at Google.

You have completed a REAL software engineering interview.

Candidate Role:

${interview.role}

Resume Summary:

${resume.summary}

Candidate Skills:

${resume.skills.join(", ")}

Entire Interview:

${history}

========================
STRICT EVALUATION RULES
========================

You are NOT a chatbot.

You are deciding whether this candidate should move to the next hiring round.

Be objective.

Never invent strengths.

Never praise weak answers.

Ignore grammar mistakes.

Judge ONLY technical quality.

Scoring:

0-2
Poor

3-4
Weak

5-6
Average

7-8
Good

9-10
Excellent

If the candidate:

• skipped questions
• answered in one sentence
• gave vague answers
• gave incorrect answers

overall MUST be below 5.

Communication evaluates clarity.

Confidence evaluates certainty.

Technical evaluates correctness.

Hiring Recommendation Rules

overall >= 8
Recommended

overall >= 6
Borderline

otherwise
Not Recommended

Give detailed interviewer notes.

Return ONLY valid JSON.

{
  "technical":0,
  "communication":0,
  "confidence":0,
  "overall":0,
  "recommendation":"",
  "strengths":[
    "...",
    "..."
  ],
  "improvements":[
    "...",
    "..."
  ],
  "finalFeedback":"..."
}
`;

  const finalCompletion =
    await client.chat.completions.create({
      model: MODEL,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are a strict FAANG interviewer. Return only JSON.",
        },
        {
          role: "user",
          content: finalPrompt,
        },
      ],
    });

  const finalContent =
    finalCompletion.choices?.[0]?.message
      ?.content ?? "";

  const parsedFinal = safeParseJSON(finalContent);

  interview.status = "COMPLETED";

  interview.result = {
    technical: clampScore(parsedFinal.technical),
    communication: clampScore(
      parsedFinal.communication
    ),
    confidence: clampScore(parsedFinal.confidence),
    overall: clampScore(parsedFinal.overall),
    recommendation:
      parsedFinal.recommendation ?? "Not Recommended",
    strengths: asStringArray(parsedFinal.strengths),
    improvements: asStringArray(parsedFinal.improvements),
    finalFeedback:
      typeof parsedFinal.finalFeedback === "string"
        ? parsedFinal.finalFeedback
        : "",
  };

  await interview.save();

  await createNotification(
    interview.user.toString(),
    "Interview Complete",
    `Your ${interview.role} interview has been scored. Overall: ${interview.result.overall}/10`,
    "INTERVIEW_COMPLETE",
    "/interview/history"
  );

  return interview;
  } finally {
    inFlightAnswers.delete(lockKey);
  }
}
