import { Router } from "express";
import { checkVerification } from "../controllers/verification.controller";

const router = Router();

router.get("/:hash", checkVerification);

export default router;
