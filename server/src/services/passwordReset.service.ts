import crypto from "crypto";
import bcrypt from "bcryptjs";
import User from "../models/User";
import { ApiError } from "../utils/ApiError";
import { sendEmail } from "./email.service";

const generateCode = () =>
  String(crypto.randomInt(0, 1000000)).padStart(6, "0");

const hashCode = (code: string) =>
  crypto.createHash("sha256").update(code).digest("hex");

const CODE_EXPIRY_MS = 15 * 60 * 1000;

export const generateResetToken = async (
  email: string
) => {
  const user = await User.findOne({ email });

  if (!user) {
    return {
      message:
        "If an account exists with this email, a reset code has been sent.",
    };
  }

  const code = generateCode();

  user.resetToken = hashCode(code);
  user.resetTokenExpiry = new Date(
    Date.now() + CODE_EXPIRY_MS
  );
  await user.save();

  const sent = await sendEmail(
    user.email,
    "Reset your TrustHire password",
    `<h1>Reset your password</h1>
     <p>Your TrustHire password reset code is:</p>
     <h2 style="letter-spacing:6px;font-size:32px;">${code}</h2>
     <p>This code expires in 15 minutes. If you didn't request this, you can ignore this email.</p>`
  );

  if (!sent) {
    console.log(`[DEV] Reset code for ${email}: ${code}`);
  }

  return {
    message:
      "If an account exists with this email, a reset code has been sent.",
  };
};

export const resetPassword = async (
  email: string,
  code: string,
  newPassword: string
) => {
  const hashed = hashCode(code.trim());

  const user = await User.findOne({
    email,
    resetToken: hashed,
    resetTokenExpiry: { $gt: new Date() },
  });

  if (!user) {
    throw new ApiError(
      400,
      "Invalid or expired reset code"
    );
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetToken = "";
  user.resetTokenExpiry = null as any;
  await user.save();

  return { message: "Password reset successful" };
};
