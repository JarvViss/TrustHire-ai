import crypto from "crypto";
import bcrypt from "bcryptjs";
import User from "../models/User";
import { ApiError } from "../utils/ApiError";

export const generateResetToken = async (
  email: string
) => {
  const user = await User.findOne({ email });

  if (!user) {
    return {
      message:
        "If an account exists with this email, a reset link has been sent.",
    };
  }

  const token = crypto.randomBytes(32).toString("hex");
  const hashed = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  user.resetToken = hashed;
  user.resetTokenExpiry = new Date(
    Date.now() + 60 * 60 * 1000
  );
  await user.save();

  return {
    message:
      "If an account exists with this email, a reset link has been sent.",
    resetToken: token,
  };
};

export const resetPassword = async (
  token: string,
  newPassword: string
) => {
  const hashed = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetToken: hashed,
    resetTokenExpiry: { $gt: new Date() },
  });

  if (!user) {
    throw new ApiError(
      400,
      "Invalid or expired reset token"
    );
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetToken = "";
  user.resetTokenExpiry = null as any;
  await user.save();

  return { message: "Password reset successful" };
};
