import { Router } from "express";
import {
  forgotPassword,
  resetPasswordHandler,
} from "../controllers/passwordReset.controller";

const router = Router();

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPasswordHandler);

export default router;
