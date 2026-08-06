import bcrypt from "bcryptjs";
import User from "../models/User";
import { generateToken } from "../utils/generateToken";
import { ApiError } from "../utils/ApiError";

type UserRole = "candidate" | "recruiter";

const sanitizeUser = (user: any) => {
  const { password, ...safe } = user.toObject();
  return safe;
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

  const safeRole: UserRole = role === "recruiter" ? "recruiter" : "candidate";

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: safeRole,
  });

  const token = generateToken(user.id);

  return {
    user: sanitizeUser(user),
    token,
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

  const token = generateToken(user.id);

  return {
    user: sanitizeUser(user),
    token,
  };
};