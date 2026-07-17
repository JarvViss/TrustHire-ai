import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { processResume } from "../services/resume.service";

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