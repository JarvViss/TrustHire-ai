import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { authRateLimit } from "../middleware/rateLimiter";

const router = Router();

router.post("/register", authRateLimit, authController.register);

router.post("/login", authRateLimit, authController.login);

export default router;
