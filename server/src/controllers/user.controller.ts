import { Response, NextFunction } from "express";
import User from "../models/User";
import { AuthRequest } from "../middleware/auth.middleware";

const ALLOWED_PROFILE_FIELDS = [
  "name",
  "phone",
  "headline",
  "bio",
  "walletAddress",
  "github",
  "linkedin",
  "portfolio",
  "location",
];

export const getProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(
      req.userId
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
};

export const updateProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const updates: Record<string, string> = {};

    for (const field of ALLOWED_PROFILE_FIELDS) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const updated = await User.findByIdAndUpdate(
      req.userId,
      { $set: updates },
      { new: true }
    ).select("-password");

    res.json({
      success: true,
      message: "Profile updated",
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

export const uploadImage = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image file required",
      });
    }

    const { type } = req.body;
    const field =
      type === "cover" ? "coverImage" : "profileImage";

    const imageUrl = `/uploads/images/${req.file.filename}`;

    const updated = await User.findByIdAndUpdate(
      req.userId,
      { $set: { [field]: imageUrl } },
      { new: true }
    ).select("-password");

    res.json({
      success: true,
      message: `${field === "coverImage" ? "Cover" : "Profile"} image uploaded`,
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};
