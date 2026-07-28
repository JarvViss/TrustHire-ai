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

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const validRoles = ["candidate", "recruiter"];
    const userRole = validRoles.includes(role) ? role : "candidate";

    const data = await authService.registerUser(
      name,
      email,
      password,
      userRole as UserRole
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