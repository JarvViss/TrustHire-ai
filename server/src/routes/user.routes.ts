import { Router } from "express";

import * as userController from "../controllers/user.controller";

import { protect } from "../middleware/auth.middleware";
import imageUpload from "../middleware/imageUpload.middleware";

const router = Router();

router.get(
  "/me",
  protect,
  userController.getProfile
);

router.put(
  "/profile",
  protect,
  userController.updateProfile
);

router.post(
  "/upload-image",
  protect,
  imageUpload.single("image"),
  userController.uploadImage
);

export default router;
