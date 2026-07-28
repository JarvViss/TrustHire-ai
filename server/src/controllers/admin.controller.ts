import { Response, NextFunction } from "express";
import User from "../models/User";
import Resume from "../models/Resume";
import Interview from "../models/Interview";
import JobAnalysis from "../models/JobAnalysis";
import { AuthRequest } from "../middleware/auth.middleware";

export async function getAdminStats(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const [
      totalUsers,
      totalCandidates,
      totalRecruiters,
      totalResumes,
      totalInterviews,
      completedInterviews,
      totalJobAnalyses,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "candidate" }),
      User.countDocuments({ role: "recruiter" }),
      Resume.countDocuments(),
      Interview.countDocuments(),
      Interview.countDocuments({ status: "COMPLETED" }),
      JobAnalysis.countDocuments(),
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalCandidates,
        totalRecruiters,
        totalResumes,
        totalInterviews,
        completedInterviews,
        totalJobAnalyses,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getAllUsers(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const users = await User.find()
      .select("-password -resetToken -resetTokenExpiry")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: users,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateUserRole(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { role } = req.body;

    if (!["candidate", "recruiter", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const user = await User.findByIdAndUpdate(
      String(req.params.id),
      { role },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteUser(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await User.findByIdAndDelete(String(req.params.id));

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const userId = String(req.params.id);
    await Promise.all([
      Resume.deleteMany({ user: userId }),
      Interview.deleteMany({ user: userId }),
      JobAnalysis.deleteMany({ user: userId }),
    ]);

    res.json({
      success: true,
      message: "User deleted",
    });
  } catch (err) {
    next(err);
  }
}
