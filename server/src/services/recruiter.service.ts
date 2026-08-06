import crypto from "crypto";
import User from "../models/User";
import Resume from "../models/Resume";
import Interview from "../models/Interview";
import JobAnalysis from "../models/JobAnalysis";
import CandidateStatus from "../models/CandidateStatus";
import { createNotification } from "./notification.service";
import { ApiError } from "../utils/ApiError";

const VALID_STATUSES = [
  "PENDING",
  "SHORTLISTED",
  "INTERVIEW",
  "HIRED",
  "REJECTED",
];

export async function dashboardStats() {
  const totalCandidates = await User.countDocuments({
    role: "candidate",
  });

  const totalResumes =
    await Resume.countDocuments();

  const completedInterviews =
    await Interview.countDocuments({
      status: "COMPLETED",
    });

  const verifiedCandidates =
    await User.countDocuments({
      isVerified: true,
      role: "candidate",
    });

  return {
    totalCandidates,
    totalResumes,
    completedInterviews,
    verifiedCandidates,
  };
}

export async function candidateList() {
  const resumes = await Resume.aggregate([
    {
      $sort: { createdAt: -1 as const },
    },
    {
      $group: {
        _id: "$user",
        latestResume: { $first: "$$ROOT" },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "userDoc",
      },
    },
    {
      $unwind: "$userDoc",
    },
    {
      $lookup: {
        from: "interviews",
        let: { userId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$user", "$$userId"],
              },
            },
          },
          { $sort: { createdAt: -1 as const } },
          { $limit: 1 },
        ],
        as: "interviewDoc",
      },
    },
    {
      $lookup: {
        from: "jobanalyses",
        let: { userId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$user", "$$userId"],
              },
            },
          },
          { $sort: { createdAt: -1 as const } },
          { $limit: 1 },
        ],
        as: "analysisDoc",
      },
    },
    {
      $project: {
        _id: 0,
        id: "$_id",
        name: "$userDoc.name",
        email: "$userDoc.email",
        profileImage: "$userDoc.profileImage",
        headline: "$userDoc.headline",
        verified: "$userDoc.isVerified",
        atsScore: "$latestResume.atsScore",
        skills: "$latestResume.skills",
        interviewScore: {
          $ifNull: [
            { $first: "$interviewDoc.result.overall" },
            0,
          ],
        },
        recommendation: {
          $ifNull: [
            {
              $first: "$interviewDoc.result.recommendation",
            },
            "Not Interviewed",
          ],
        },
        jobMatch: {
          $ifNull: [
            { $first: "$analysisDoc.matchScore" },
            0,
          ],
        },
      },
    },
  ]);

  return resumes;
}

export async function getCandidateProfile(
  candidateId: string
) {
  const user = await User.findById(candidateId).select(
    "-password"
  );

  if (!user) {
    throw new ApiError(404, "Candidate not found");
  }

  const resume = await Resume.findOne({
    user: candidateId,
  }).sort({
    createdAt: -1,
  });

  const interview = await Interview.findOne({
    user: candidateId,
  }).sort({
    createdAt: -1,
  });

  const analysis = await JobAnalysis.findOne({
    user: candidateId,
  }).sort({
    createdAt: -1,
  });

  const statusRecord = await CandidateStatus.findOne({
    candidate: candidateId,
  });

  return {
    user,
    resume,
    interview,
    analysis,
    recruitmentStatus: statusRecord?.status ?? "PENDING",
  };
}

export async function changeCandidateStatus(
  candidateId: string,
  recruiterId: string,
  status: string,
  notes: string
) {
  const user =
    await User.findById(candidateId);

  if (!user) {
    throw new ApiError(404, "Candidate not found");
  }

  if (!VALID_STATUSES.includes(status)) {
    throw new ApiError(
      400,
      `Invalid status. Allowed: ${VALID_STATUSES.join(", ")}`
    );
  }

  const record = await CandidateStatus.findOneAndUpdate(
    {
      candidate: candidateId,
      recruiter: recruiterId,
    },
    {
      candidate: candidateId,
      recruiter: recruiterId,
      status,
      notes,
    },
    {
      upsert: true,
      new: true,
    }
  );

  // Notify the candidate
  const recruiter = await User.findById(recruiterId).select("name");
  await createNotification(
    candidateId,
    "Status Updated",
    `Your status has been updated to "${status}" by ${recruiter?.name ?? "a recruiter"}.`,
    "STATUS_UPDATE",
    "/dashboard"
  );

  return record;
}

export async function verifyCandidate(
  candidateId: string
) {
  const user =
    await User.findById(candidateId);

  if (!user) {
    throw new ApiError(404, "Candidate not found");
  }

  const resume = await Resume.findOne({
    user: candidateId,
  }).sort({ createdAt: -1 });

  const interview = await Interview.findOne({
    user: candidateId,
    status: "COMPLETED",
  }).sort({ createdAt: -1 });

  const verificationData = JSON.stringify({
    userId: candidateId,
    name: user.name,
    email: user.email,
    resumeHash: resume?._id?.toString() || "",
    interviewScore: interview?.result?.overall || 0,
    timestamp: Date.now().toString(),
  });

  const verificationHash =
    "0x" +
    crypto
      .createHash("sha256")
      .update(verificationData)
      .digest("hex");

  user.isVerified = true;
  user.verificationHash = verificationHash;

  await user.save();

  return user;
}
