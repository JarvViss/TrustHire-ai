import { Request, Response, NextFunction } from "express";
import {
  generateResetToken,
  resetPassword,
} from "../services/passwordReset.service";

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const result = await generateResetToken(email);

    res.json({
      success: true,
      message: result.message,
    });
  } catch (err) {
    next(err);
  }
};

export const resetPasswordHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, code, password } = req.body;

    if (!email || !code || !password) {
      return res.status(400).json({
        success: false,
        message: "Email, code, and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters",
      });
    }

    const result = await resetPassword(
      email,
      code,
      password
    );

    res.json({
      success: true,
      message: result.message,
    });
  } catch (err) {
    next(err);
  }
};
