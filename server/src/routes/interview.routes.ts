import { Router } from "express";

import { protect } from "../middleware/auth.middleware";
import { aiRateLimit } from "../middleware/rateLimiter";

import {
  createInterview,
  answerInterview,
  getInterview,
  getInterviewHistory,
} from "../controllers/interview.controller";

const router = Router();

router.use(protect);

router.post("/start", aiRateLimit, createInterview);

router.post("/answer", aiRateLimit, answerInterview);

router.get("/history", getInterviewHistory);

router.get("/:id", getInterview);

export default router;
