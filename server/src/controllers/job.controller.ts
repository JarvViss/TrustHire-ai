import { Response } from "express";

import Resume from "../models/Resume";

import {
  analyzeJob,
  getLatestJobAnalysis,
  getJobAnalysisHistory,
} from "../services/job.service";

import { AuthRequest } from "../middleware/auth.middleware";

export const analyzeJobController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { jobDescription } = req.body;

    if (!jobDescription) {
      return res.status(400).json({
        success: false,
        message: "Job Description is required",
      });
    }

    if (jobDescription.trim().length < 100) {
      return res.status(400).json({
        success: false,
        message:
          "Please paste a complete Job Description (minimum 100 characters).",
      });
    }

    const resume = await Resume.findOne({
      user: req.userId,
    }).sort({ createdAt: -1 });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    const savedAnalysis = await analyzeJob(
      req.userId!,
      resume._id.toString(),
      jobDescription
    );

    return res.status(200).json({
      success: true,
      data: savedAnalysis,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Job Match Analysis Failed",
    });

  }
};

export const getLatestAnalysis = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const analysis = await getLatestJobAnalysis(
      req.userId!
    );

    res.json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch analysis",
    });
  }
};

export const getJobHistory = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const analyses = await getJobAnalysisHistory(
      req.userId!
    );

    res.json({
      success: true,
      data: analyses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch history",
    });
  }
};
