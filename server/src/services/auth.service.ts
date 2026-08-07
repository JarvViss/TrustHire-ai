import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/User";
import { generateToken } from "../utils/generateToken";
import { ApiError } from "../utils/ApiError";
import { sendEmail } from "./email.service";

type UserRole = "candidate" | "recruiter";

const sanitizeUser = (user: any) => {
  const {
    password,
    verificationCode,
    verificationCodeExpiry,
    ...safe
  } = user.toObject();
  return safe;
};

const generateCode = () =>
  String(crypto.randomInt(0, 1000000)).padStart(6, "0");

const hashCode = (code: string) =>
  crypto.createHash("sha256").update(code).digest("hex");

const CODE_EXPIRY_MS = 15 * 60 * 1000;

const sendVerificationEmail = async (
  email: string,
  code: string
) => {
  const sent = await sendEmail(
    email,
    "Verify your TrustHire account",
    `<h1>Verify your email</h1>
     <p>Your TrustHire verification code is:</p>
     <h2 style="letter-spacing:6px;font-size:32px;">${code}</h2>
     <p>This code expires in 15 minutes.</p>`
  );

  if (!sent) {
    console.log(`[DEV] Verification code for ${email}: ${code}`);
  }
};

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  role: UserRole
) => {
  const exists = await User.findOne({ email });

  if (exists) {
    throw new ApiError(409, "User already exists");
  }

  const safeRole: UserRole =
    role === "recruiter" ? "recruiter" : "candidate";

  const hashedPassword = await bcrypt.hash(password, 10);

  const code = generateCode();

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: safeRole,
    isVerified: false,
    verificationCode: hashCode(code),
    verificationCodeExpiry: new Date(
      Date.now() + CODE_EXPIRY_MS
    ),
  });

  await sendVerificationEmail(user.email, code);

  return {
    message:
      "Account created! We sent a 6-digit verification code to your email.",
    user: { email: user.email },
  };
};

export const loginUser = async (
  email: string,
  password: string
) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isMatch = await bcrypt.compare(
    password,
    user.password
  );

  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  if (!user.isVerified && user.role !== "admin") {
    throw new ApiError(403, "Please verify your email first");
  }

  const token = generateToken(user.id);

  return {
    user: sanitizeUser(user),
    token,
  };
};

export const verifyEmail = async (
  email: string,
  code: string
) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.isVerified) {
    return { message: "Email already verified" };
  }

  const expiry = user.verificationCodeExpiry;

  if (
    !user.verificationCode ||
    !expiry ||
    new Date(expiry).getTime() < Date.now()
  ) {
    throw new ApiError(
      400,
      "Code expired. Request a new one."
    );
  }

  if (user.verificationCode !== hashCode(code.trim())) {
    throw new ApiError(400, "Invalid verification code");
  }

  user.isVerified = true;
  user.verificationCode = "";
  user.verificationCodeExpiry = null as any;
  await user.save();

  return { message: "Email verified! You can now log in." };
};

export const resendVerificationCode = async (
  email: string
) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.isVerified) {
    throw new ApiError(400, "Email already verified");
  }

  const code = generateCode();

  user.verificationCode = hashCode(code);
  user.verificationCodeExpiry = new Date(
    Date.now() + CODE_EXPIRY_MS
  );
  await user.save();

  await sendVerificationEmail(user.email, code);

  return { message: "Verification code sent to your email." };
};
