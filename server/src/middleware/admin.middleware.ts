import { Response, NextFunction } from "express";
import User from "../models/User";
import { AuthRequest } from "./auth.middleware";

export async function adminOnly(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await User.findById(req.userId);

    if (!user || user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access only",
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
