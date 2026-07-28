import { Router } from "express";

import { protect } from "../middleware/auth.middleware";

import {
  createInterview,
  answerInterview,
  getInterview,
  getInterviewHistory,
} from "../controllers/interview.controller";

const router = Router();

router.use(protect);

router.post("/start", createInterview);

router.post("/answer", answerInterview);

router.get("/history", getInterviewHistory);

router.get("/:id", getInterview);

export default router;
