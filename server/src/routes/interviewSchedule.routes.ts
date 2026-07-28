import { Router } from "express";
import { protect } from "../middleware/auth.middleware";
import { recruiterOnly } from "../middleware/recruiter.middleware";
import {
  createSchedule,
  getMySchedule,
  cancelInterview,
} from "../controllers/interviewSchedule.controller";

const router = Router();

router.use(protect);

router.post("/", recruiterOnly, createSchedule);
router.get("/", getMySchedule);
router.patch("/:id/cancel", cancelInterview);

export default router;
