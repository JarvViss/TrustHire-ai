import InterviewSchedule from "../models/InterviewSchedule";
import User from "../models/User";
import Resume from "../models/Resume";
import { ApiError } from "../utils/ApiError";
import { createNotification } from "./notification.service";
import {
  generateInterviewQuestions,
  generateInterviewSummary,
} from "./ai.service";

export async function scheduleInterview(
  recruiterId: string,
  candidateId: string,
  scheduledAt: Date,
  duration: number,
  type: string,
  notes: string,
  role: string,
  meetingLink: string
) {
  if (
    !(scheduledAt instanceof Date) ||
    isNaN(scheduledAt.getTime())
  ) {
    throw new ApiError(400, "Invalid scheduled time");
  }

  if (scheduledAt.getTime() <= Date.now()) {
    throw new ApiError(
      400,
      "Scheduled time must be in the future"
    );
  }

  const candidate = await User.findById(candidateId);

  if (!candidate) {
    throw new ApiError(404, "Candidate not found");
  }

  if (candidate.role !== "candidate") {
    throw new ApiError(400, "Selected user is not a candidate");
  }

  if (recruiterId === candidateId) {
    throw new ApiError(400, "Cannot schedule an interview with yourself");
  }

  return InterviewSchedule.create({
    recruiter: recruiterId,
    candidate: candidateId,
    scheduledAt,
    duration,
    type,
    notes,
    role,
    meetingLink,
  }).then(async (schedule) => {
    const recruiter = await User.findById(
      recruiterId
    ).select("name");

    await createNotification(
      candidateId,
      "Interview Scheduled",
      `${recruiter?.name ?? "A recruiter"} scheduled a ${duration} minute ${type.toLowerCase()} interview${role ? ` for the ${role} role` : ""} on ${scheduledAt.toLocaleString()}.`,
      "INTERVIEW_SCHEDULED",
      "/my-interviews"
    );

    return schedule;
  });
}

export async function getCandidateSchedule(
  candidateId: string
) {
  return InterviewSchedule.find({
    candidate: candidateId,
  })
    .sort({ scheduledAt: 1 })
    .populate("recruiter", "name email");
}

export async function getRecruiterSchedule(
  recruiterId: string
) {
  return InterviewSchedule.find({
    recruiter: recruiterId,
  })
    .sort({ scheduledAt: 1 })
    .populate("candidate", "name email");
}

export async function cancelSchedule(
  scheduleId: string,
  userId: string
) {
  const schedule = await InterviewSchedule.findOne({
    _id: scheduleId,
    $or: [
      { recruiter: userId },
      { candidate: userId },
    ],
  });

  if (!schedule) {
    return null;
  }

  if (schedule.status === "CANCELLED") {
    return schedule;
  }

  schedule.status = "CANCELLED";

  await schedule.save();

  const isRecruiter =
    String(schedule.recruiter) === String(userId);

  const otherId = isRecruiter
    ? schedule.candidate
    : schedule.recruiter;

  const other = await User.findById(otherId).select("name");

  await createNotification(
    String(otherId),
    "Interview Cancelled",
    `${other?.name ?? "The other party"} cancelled the ${schedule.type.toLowerCase()} interview scheduled for ${schedule.scheduledAt.toLocaleString()}.`,
    "INTERVIEW_CANCELLED",
    isRecruiter ? "/my-interviews" : "/schedule"
  );

  return schedule;
}

export async function updateMeetingLink(
  scheduleId: string,
  recruiterId: string,
  meetingLink: string
) {
  const schedule = await getRecruiterScheduleById(
    scheduleId,
    recruiterId
  );

  if (schedule.status === "COMPLETED") {
    throw new ApiError(400, "Interview already completed");
  }

  schedule.meetingLink = (meetingLink ?? "").trim();

  await schedule.save();

  await schedule.populate("candidate", "name email");

  return schedule;
}

export async function getRecruiterScheduleById(
  scheduleId: string,
  recruiterId: string
) {
  const schedule = await InterviewSchedule.findOne({
    _id: scheduleId,
    recruiter: recruiterId,
  });

  if (!schedule) {
    throw new ApiError(404, "Schedule not found");
  }

  return schedule;
}

function buildFallbackLiveQuestions(
  role: string,
  skills: string[]
): string[] {
  const safeRole = role.trim() || "software engineer";
  const primarySkill = skills[0] ?? "your core tech stack";

  return [
    `For the ${safeRole} role, walk me through how you would debug a production issue that only shows up intermittently.`,
    `How do you keep the code you write for ${primarySkill} maintainable and easy for other developers to work on?`,
    `Walk me through your approach to designing a new feature end-to-end for a ${safeRole} project.`,
    `How would you test the most critical behavior in a ${safeRole} system, and what would you focus on first?`,
    `Describe a time you improved performance or reliability in a ${safeRole} codebase. How did you measure the result?`,
    `What security or data-integrity concerns do you think about when building a ${safeRole} application?`,
  ];
}

function buildFallbackSummary(
  questionsAndAnswers: {
    rating: number;
  }[]
) {
  const ratings = questionsAndAnswers
    .map((item) => Number(item.rating) || 0)
    .filter((r) => r > 0);

  const average =
    ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
      : 0;

  const overall = Math.round(
    Math.min(10, Math.max(0, average * 2))
  );

  return {
    overall,
    recommendation:
      overall >= 8
        ? "Recommended"
        : overall >= 6
        ? "Borderline"
        : "Not Recommended",
    strengths:
      overall >= 6
        ? ["Showed solid knowledge across the questions asked"]
        : [],
    improvements:
      overall < 6
        ? ["Needs to provide more detailed, structured answers"]
        : [],
    feedback:
      "Interview recorded. See individual question ratings for details.",
  };
}

export async function generateQuestionsForSchedule(
  scheduleId: string,
  recruiterId: string,
  role: string
) {
  const schedule = await getRecruiterScheduleById(
    scheduleId,
    recruiterId
  );

  if (schedule.status === "CANCELLED") {
    throw new ApiError(400, "Interview was cancelled");
  }

  if (schedule.status === "COMPLETED") {
    throw new ApiError(400, "Interview already completed");
  }

  const finalRole = (role || schedule.role || "").trim();

  if (!finalRole) {
    throw new ApiError(400, "Job role is required");
  }

  const resume = await Resume.findOne({
    user: schedule.candidate,
  }).sort({ createdAt: -1 });

  let questions: string[] = [];

  try {
    questions = await generateInterviewQuestions({
      role: finalRole,
      resumeSummary: resume?.summary ?? "",
      resumeSkills: resume?.skills ?? [],
    });
  } catch {
    questions = buildFallbackLiveQuestions(
      finalRole,
      resume?.skills ?? []
    );
  }

  schedule.role = finalRole;
  schedule.questions = questions;
  schedule.answers.splice(0, schedule.answers.length);
  questions.forEach((question) => {
    schedule.answers.push({
      question,
      answer: "",
      rating: 0,
      notes: "",
    });
  });
  schedule.status = "IN_PROGRESS";

  await schedule.save();

  await schedule.populate("candidate", "name email");

  return schedule;
}

export async function saveAnswerForSchedule(
  scheduleId: string,
  recruiterId: string,
  payload: {
    questionIndex: number;
    answer: string;
    rating: number;
    notes: string;
  }
) {
  const schedule = await getRecruiterScheduleById(
    scheduleId,
    recruiterId
  );

  if (schedule.status === "CANCELLED") {
    throw new ApiError(400, "Interview was cancelled");
  }

  if (schedule.status === "COMPLETED") {
    throw new ApiError(400, "Interview already completed");
  }

  if (
    !Array.isArray(schedule.questions) ||
    schedule.questions.length === 0
  ) {
    throw new ApiError(
      400,
      "Generate questions before recording answers"
    );
  }

  const questionIndex = Number(payload.questionIndex);

  if (
    !Number.isInteger(questionIndex) ||
    questionIndex < 0 ||
    questionIndex >= schedule.questions.length
  ) {
    throw new ApiError(400, "Invalid question index");
  }

  const rating = Math.round(Number(payload.rating));

  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    throw new ApiError(400, "Rating must be between 1 and 5");
  }

  const entry = schedule.answers[questionIndex];

  if (!entry) {
    throw new ApiError(
      400,
      "Answers not initialized for this interview"
    );
  }

  entry.answer = (payload.answer ?? "").trim();
  entry.rating = rating;
  entry.notes = (payload.notes ?? "").trim();

  schedule.status = "IN_PROGRESS";

  await schedule.save();

  await schedule.populate("candidate", "name email");

  return schedule;
}

export async function completeScheduleInterview(
  scheduleId: string,
  recruiterId: string
) {
  const schedule = await getRecruiterScheduleById(
    scheduleId,
    recruiterId
  );

  if (schedule.status === "CANCELLED") {
    throw new ApiError(400, "Interview was cancelled");
  }

  if (schedule.status === "COMPLETED") {
    await schedule.populate("candidate", "name email");
    return schedule;
  }

  if (schedule.answers.length === 0) {
    throw new ApiError(400, "No answers recorded yet");
  }

  const resume = await Resume.findOne({
    user: schedule.candidate,
  }).sort({ createdAt: -1 });

  let summary;

  try {
    summary = await generateInterviewSummary({
      role: schedule.role,
      resumeSummary: resume?.summary ?? "",
      questionsAndAnswers: schedule.answers,
    });
  } catch {
    summary = buildFallbackSummary(schedule.answers);
  }

  schedule.summary = summary;
  schedule.status = "COMPLETED";
  schedule.completedAt = new Date();

  await schedule.save();

  await createNotification(
    String(schedule.candidate),
    "Interview Completed",
    `Your ${schedule.role || "job"} interview has been completed. Check the details and next steps.`,
    "INTERVIEW_COMPLETE",
    "/my-interviews"
  );

  await schedule.populate("candidate", "name email");

  return schedule;
}
