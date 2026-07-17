import { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service";

type UserRole = "candidate" | "recruiter" | "admin";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password, role } = req.body;

    const data = await authService.registerUser(
      name,
      email,
      password,
      role as UserRole
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const data = await authService.loginUser(
      email,
      password
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      data,
    });
  } catch (error) {
    next(error);
  }
};