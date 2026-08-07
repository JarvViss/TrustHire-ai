import { Router } from "express";
import { protect } from "../middleware/auth.middleware";
import { recruiterOnly } from "../middleware/recruiter.middleware";
import { aiRateLimit } from "../middleware/rateLimiter";
import {
  createSchedule,
  getMySchedule,
  cancelInterview,
  generateQuestions,
  saveAnswer,
  completeInterview,
  setMeetingLink,
} from "../controllers/interviewSchedule.controller";

const router = Router();

router.use(protect);

router.post("/", recruiterOnly, createSchedule);
router.get("/", getMySchedule);
router.patch("/:id/cancel", cancelInterview);
router.patch("/:id/link", recruiterOnly, setMeetingLink);

router.post(
  "/:id/generate-questions",
  recruiterOnly,
  aiRateLimit,
  generateQuestions
);

router.post(
  "/:id/answer",
  recruiterOnly,
  saveAnswer
);

router.post(
  "/:id/complete",
  recruiterOnly,
  aiRateLimit,
  completeInterview
);

export default router;
