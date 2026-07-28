import { Router } from "express";

import upload from "../middleware/upload.middleware";

import { protect } from "../middleware/auth.middleware";
import { aiRateLimit } from "../middleware/rateLimiter";

import {
  uploadResume,
  getResumeHistory,
  getResumeById,
  deleteResume,
  getStats,
} from "../controllers/resume.controller";

const router = Router();

router.post(
  "/upload",
  protect,
  aiRateLimit,
  upload.single("resume"),
  uploadResume
);

router.get(
  "/history",
  protect,
  getResumeHistory
);

router.get(
  "/stats",
  protect,
  getStats
);

router.get(
  "/:id",
  protect,
  getResumeById
);

router.delete(
  "/:id",
  protect,
  deleteResume
);

export default router;
