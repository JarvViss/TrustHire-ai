import { Response } from "express";

import { AuthRequest } from "../middleware/auth.middleware";

import Interview from "../models/Interview";

import {
  startInterview,
  submitAnswer,
} from "../services/interview.service";

export async function createInterview(
  req: AuthRequest,
  res: Response
) {
  try {
    const { role } = req.body;

    if (!role || typeof role !== "string") {
      return res.status(400).json({
        success: false,
        message: "Role is required",
      });
    }

    const interview = await startInterview(
      req.userId!,
      role
    );

    return res.status(201).json({
      success: true,
      data: interview,
    });
  } catch (error: any) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        error.message || "Failed to start interview",
    });
  }
}

export async function answerInterview(
  req: AuthRequest,
  res: Response
) {
  try {
    const { interviewId, answer } = req.body;

    if (
      !interviewId ||
      typeof interviewId !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Interview ID is required",
      });
    }

    if (
      !answer ||
      typeof answer !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Answer is required",
      });
    }

    const interview = await submitAnswer(
      interviewId,
      answer,
      req.userId!
    );

    return res.json({
      success: true,
      data: interview,
    });
  } catch (error: any) {
    console.error(error);

    const message = error.message || "Interview failed";
    const status =
      message === "Unauthorized"
        ? 403
        : message === "Interview not found"
        ? 404
        : message === "Interview is no longer active"
        ? 400
        : 500;

    return res.status(status).json({
      success: false,
      message,
    });
  }
}

export async function getInterviewHistory(
  req: AuthRequest,
  res: Response
) {
  try {
    const interviews = await Interview.find({
      user: req.userId,
    })
      .sort({ createdAt: -1 })
      .select(
        "role status currentQuestion conversation result createdAt"
      );

    return res.json({
      success: true,
      data: interviews,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch interview history",
    });
  }
}

export async function getInterview(
  req: AuthRequest,
  res: Response
) {
  try {
    const interview = await Interview.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    return res.json({
      success: true,
      data: interview,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch interview",
    });
  }
}
