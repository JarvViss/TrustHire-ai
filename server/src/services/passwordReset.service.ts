import crypto from "crypto";
import bcrypt from "bcryptjs";
import User from "../models/User";

export const generateResetToken = async (
  email: string
) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error(
      "If an account exists with this email, a reset link has been sent."
    );
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
    throw new Error(
      "Invalid or expired reset token"
    );
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetToken = "";
  user.resetTokenExpiry = null as any;
  await user.save();

  return { message: "Password reset successful" };
};
