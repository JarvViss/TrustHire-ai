import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import User from "../models/User";
import {
  scheduleInterview,
  getCandidateSchedule,
  getRecruiterSchedule,
  cancelSchedule,
  generateQuestionsForSchedule,
  saveAnswerForSchedule,
  completeScheduleInterview,
  updateMeetingLink,
} from "../services/interviewSchedule.service";

export async function createSchedule(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const {
      candidateId,
      scheduledAt,
      duration,
      type,
      notes,
      role,
      meetingLink,
    } = req.body;

    if (!candidateId || !scheduledAt) {
      return res.status(400).json({
        success: false,
        message:
          "Candidate ID and scheduled time are required",
      });
    }

    const schedule = await scheduleInterview(
      req.userId!,
      candidateId,
      new Date(scheduledAt),
      duration ?? 30,
      type ?? "ONLINE",
      notes ?? "",
      role ?? "",
      meetingLink ?? ""
    );

    res.status(201).json({
      success: true,
      data: schedule,
    });
  } catch (err) {
    next(err);
  }
}

export async function getMySchedule(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const dbUser = await User.findById(req.userId).select("role");

    if (!dbUser) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (dbUser.role !== "recruiter" && dbUser.role !== "candidate") {
      return res.json({
        success: true,
        data: [],
      });
    }

    const isRecruiter = dbUser.role === "recruiter";

    const schedule = isRecruiter
      ? await getRecruiterSchedule(req.userId!)
      : await getCandidateSchedule(req.userId!);

    res.json({
      success: true,
      data: schedule,
    });
  } catch (err) {
    next(err);
  }
}

export async function cancelInterview(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const schedule = await cancelSchedule(
      String(req.params.id),
      req.userId!
    );

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found",
      });
    }

    res.json({
      success: true,
      data: schedule,
    });
  } catch (err) {
    next(err);
  }
}

export async function generateQuestions(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const schedule = await generateQuestionsForSchedule(
      String(req.params.id),
      req.userId!,
      req.body?.role ?? ""
    );

    res.json({
      success: true,
      data: schedule,
    });
  } catch (err) {
    next(err);
  }
}

export async function saveAnswer(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const schedule = await saveAnswerForSchedule(
      String(req.params.id),
      req.userId!,
      {
        questionIndex: req.body?.questionIndex,
        answer: req.body?.answer ?? "",
        rating: req.body?.rating,
        notes: req.body?.notes ?? "",
      }
    );

    res.json({
      success: true,
      data: schedule,
    });
  } catch (err) {
    next(err);
  }
}

export async function completeInterview(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const schedule = await completeScheduleInterview(
      String(req.params.id),
      req.userId!
    );

    res.json({
      success: true,
      data: schedule,
    });
  } catch (err) {
    next(err);
  }
}

export async function setMeetingLink(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const schedule = await updateMeetingLink(
      String(req.params.id),
      req.userId!,
      req.body?.meetingLink ?? ""
    );

    res.json({
      success: true,
      data: schedule,
    });
  } catch (err) {
    next(err);
  }
}
