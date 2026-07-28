import { Response, NextFunction } from "express";

import User from "../models/User";
import { AuthRequest } from "./auth.middleware";

export async function recruiterOnly(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (user.role !== "recruiter") {
      return res.status(403).json({
        success: false,
        message: "Recruiter access only",
      });
    }

    next();
  } catch {
    return res.status(500).json({
      success: false,
      message: "Authorization failed",
    });
  }
}