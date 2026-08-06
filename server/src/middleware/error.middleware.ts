import { Request, Response, NextFunction } from "express";
import multer from "multer";
import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError";

const UPLOAD_FILTER_MESSAGES = [
  "Only PDF allowed",
  "Only JPEG, PNG, WebP, GIF images allowed",
];

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  if (err instanceof multer.MulterError) {
    let message = "File upload failed";

    switch (err.code) {
      case "LIMIT_FILE_SIZE":
        message = "File is too large";
        break;
      case "LIMIT_UNEXPECTED_FILE":
        message = "Unexpected file field";
        break;
      default:
        message = err.message;
    }

    return res.status(400).json({
      success: false,
      message,
    });
  }

  if (
    err &&
    typeof err.message === "string" &&
    UPLOAD_FILTER_MESSAGES.includes(err.message)
  ) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  if (err && err.message === "Not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: "Not allowed by CORS",
    });
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const messages = Object.values(err.errors).map(
      (e: any) => e.message
    );

    return res.status(400).json({
      success: false,
      message: messages.join(", ") || "Validation error",
    });
  }

  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      success: false,
      message: "Invalid ID format",
    });
  }

  if (err && err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "A record with this value already exists",
    });
  }

  console.error(err);

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};
