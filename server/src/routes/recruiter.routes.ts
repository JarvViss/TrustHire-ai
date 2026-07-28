import { Router } from "express";

import { protect } from "../middleware/auth.middleware";
import { recruiterOnly } from "../middleware/recruiter.middleware";

import {
  getDashboardStats,
  getCandidates,
  getCandidateById,
  updateCandidateStatus,
  verifyCandidateBlockchain,
} from "../controllers/recruiter.controller";

const router = Router();

router.use(protect);
router.use(recruiterOnly);

router.get("/dashboard", getDashboardStats);

router.get("/candidates", getCandidates);

router.get("/candidate/:id", getCandidateById);

router.patch(
  "/candidate/:id/status",
  updateCandidateStatus
);

router.post(
  "/candidate/:id/verify",
  verifyCandidateBlockchain
);

export default router;