import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import User from "../models/User";
import {
  scheduleInterview,
  getCandidateSchedule,
  getRecruiterSchedule,
  cancelSchedule,
} from "../services/interviewSchedule.service";

export async function createSchedule(
  req: AuthRequest,
  res: Response
) {
  try {
    const {
      candidateId,
      scheduledAt,
      duration,
      type,
      notes,
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
      notes ?? ""
    );

    res.status(201).json({
      success: true,
      data: schedule,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

export async function getMySchedule(
  req: AuthRequest,
  res: Response
) {
  try {
    const dbUser = await User.findById(req.userId).select("role");
    const isRecruiter =
      dbUser?.role === "recruiter";

    const schedule = isRecruiter
      ? await getRecruiterSchedule(req.userId!)
      : await getCandidateSchedule(req.userId!);

    res.json({
      success: true,
      data: schedule,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

export async function cancelInterview(
  req: AuthRequest,
  res: Response
) {
  try {
    const schedule = await cancelSchedule(
      req.params.id,
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
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}
