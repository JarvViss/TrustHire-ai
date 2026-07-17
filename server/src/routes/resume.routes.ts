import { Router } from "express";

import upload from "../middleware/upload.middleware";

import { protect } from "../middleware/auth.middleware";

import { uploadResume } from "../controllers/resume.controller";

const router=Router();

router.post(

"/upload",

protect,

upload.single("resume"),

uploadResume

);

export default router;