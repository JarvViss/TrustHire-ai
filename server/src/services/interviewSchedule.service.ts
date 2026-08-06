import InterviewSchedule from "../models/InterviewSchedule";
import User from "../models/User";
import { ApiError } from "../utils/ApiError";

export async function scheduleInterview(
  recruiterId: string,
  candidateId: string,
  scheduledAt: Date,
  duration: number,
  type: string,
  notes: string
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
  return InterviewSchedule.findOneAndUpdate(
    {
      _id: scheduleId,
      $or: [
        { recruiter: userId },
        { candidate: userId },
      ],
    },
    { status: "CANCELLED" },
    { new: true }
  );
}
