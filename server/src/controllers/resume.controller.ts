import { Response } from "express";

import Resume from "../models/Resume";
import User from "../models/User";

import { AuthRequest } from "../middleware/auth.middleware";

import {
  processResume,
  getResumeStats,
} from "../services/resume.service";
import { createNotification } from "../services/notification.service";

export const uploadResume = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume required",
      });
    }

    const resume = await processResume(
      req.userId!,
      req.file
    );

    // Notify all recruiters
    const recruiters = await User.find({
      role: "recruiter",
    }).select("_id");

    const candidate = await User.findById(
      req.userId
    ).select("name");

    await Promise.all(
      recruiters.map((r: any) =>
        createNotification(
          r._id.toString(),
          "New Resume Uploaded",
          `${candidate?.name ?? "A candidate"} uploaded a new resume.`,
          "RESUME_UPLOADED",
          "/recruiter/dashboard"
        )
      )
    );

    res.status(201).json({
      success: true,
      data: resume,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Resume processing failed",
    });

  }
};

export const getResumeHistory = async (
  req: AuthRequest,
  res: Response
) => {
  try {

    const resumes = await Resume.find({
      user: req.userId,
    })
      .sort({
        createdAt: -1,
      });

    res.json({
      success: true,
      data: resumes,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch history",
    });

  }
};

export const getResumeById = async (
  req: AuthRequest,
  res: Response
) => {
  try {

    const resume = await Resume.findOne({
      _id: String(req.params.id),
      user: req.userId,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    res.json({
      success: true,
      data: resume,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed",
    });

  }
};

export const deleteResume = async (
  req: AuthRequest,
  res: Response
) => {
  try {

    const resume = await Resume.findOneAndDelete({
      _id: String(req.params.id),
      user: req.userId,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    res.json({
      success: true,
      message: "Resume deleted",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Delete failed",
    });

  }
};

export const getStats = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const stats = await getResumeStats(
      req.userId!
    );

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch stats",
    });
  }
};