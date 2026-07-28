import InterviewSchedule from "../models/InterviewSchedule";

export async function scheduleInterview(
  recruiterId: string,
  candidateId: string,
  scheduledAt: Date,
  duration: number,
  type: string,
  notes: string
) {
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
