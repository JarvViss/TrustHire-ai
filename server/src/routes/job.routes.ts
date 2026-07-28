import { Router } from "express";

import { protect } from "../middleware/auth.middleware";
import { aiRateLimit } from "../middleware/rateLimiter";

import { analyzeJobController } from "../controllers/job.controller";

import {
  getLatestAnalysis,
  getJobHistory,
} from "../controllers/job.controller";

const router = Router();

router.use(protect);

router.post("/analyze", aiRateLimit, analyzeJobController);

router.get("/latest", getLatestAnalysis);

router.get("/history", getJobHistory);

export default router;
