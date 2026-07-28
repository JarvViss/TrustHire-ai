import { Router } from "express";
import { protect } from "../middleware/auth.middleware";
import { aiRateLimit } from "../middleware/rateLimiter";
import {
  applyToJob,
  getMyApplications,
  updateStatus,
} from "../controllers/application.controller";

const router = Router();

router.use(protect);

router.post("/", aiRateLimit, applyToJob);
router.get("/", getMyApplications);
router.patch("/:id/status", updateStatus);

export default router;
