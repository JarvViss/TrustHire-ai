import OpenAI from "openai";

import Interview from "../models/Interview";
import Resume from "../models/Resume";
import { createNotification } from "./notification.service";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY!,
  baseURL: "https://api.groq.com/openai/v1",
  timeout: 30000,
});

function safeParseJSON(text: string): any {
  const cleaned = text
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

    throw new Error(
      "Failed to parse AI response as JSON"
    );
  }
}

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
    throw new Error("Resume not found");
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

• The question MUST be related to the candidate's resume.

• Start with an EASY question.

• Do NOT ask HR questions.

• Do NOT ask "Tell me about yourself."

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
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
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

  return await Interview.create({
    user: userId,
    role,
    status: "ACTIVE",
    currentQuestion: 0,
    conversation: [
      {
        question: parsed.question,
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
    throw new Error("Interview not found");
  }

  if (interview.user.toString() !== userId) {
    throw new Error("Unauthorized");
  }

  if (interview.status !== "ACTIVE") {
    throw new Error(
      "Interview is no longer active"
    );
  }

  const resume = await Resume.findOne({
    user: interview.user,
  }).sort({
    createdAt: -1,
  });

  if (!resume) {
    throw new Error("Resume not found");
  }

  const current = interview.currentQuestion;

  if (
    current < 0 ||
    current >= interview.conversation.length
  ) {
    throw new Error(
      "Interview state is corrupted"
    );
  }

  interview.conversation[current].answer = answer;

  const history = buildHistory(
    interview.conversation
  );

  const lastQuestion = current >= 4;

  if (!lastQuestion) {
    const difficulty = getDifficulty(current + 1);

    const prompt = `
You are a Senior Staff Software Engineer and Hiring Manager at Google.

You are conducting a REAL software engineering interview.

Candidate Role:

${interview.role}

Resume Summary:

${resume.summary}

Candidate Skills:

${resume.skills.join(", ")}

Interview Conversation:

${history}

The latest answer to evaluate is:

"${answer}"

The NEXT question difficulty should be:

${difficulty}

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

- Do NOT repeat previous questions.
- Ask about technologies in the resume.
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
        model: "llama-3.3-70b-versatile",
        temperature: 0.2,
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

    interview.conversation[current].score =
      parsed.score ?? 0;

    interview.conversation[current].feedback =
      parsed.feedback ?? "";

    interview.currentQuestion++;

    interview.conversation.push({
      question:
        parsed.nextQuestion || "Tell me more.",
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

Interview Conversation:

${history}

The latest answer to evaluate is:

"${answer}"

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
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
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
    evalParsed.score ?? 0;

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
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
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
    technical: parsedFinal.technical ?? 0,
    communication:
      parsedFinal.communication ?? 0,
    confidence: parsedFinal.confidence ?? 0,
    overall: parsedFinal.overall ?? 0,
    recommendation:
      parsedFinal.recommendation ?? "Not Recommended",
    strengths: parsedFinal.strengths ?? [],
    improvements: parsedFinal.improvements ?? [],
    finalFeedback:
      parsedFinal.finalFeedback ?? "",
  };

  await interview.save();

  await createNotification(
    interview.user.toString(),
    "Interview Complete",
    `Your ${interview.role} interview has been scored. Overall: ${parsedFinal.overall ?? 0}/10`,
    "INTERVIEW_COMPLETE",
    "/interview/history"
  );

  return interview;
}
