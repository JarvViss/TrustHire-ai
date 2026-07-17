import { Router } from "express";

import * as userController from "../controllers/user.controller";

import { protect } from "../middleware/auth.middleware";

const router=Router();

router.get("/me",

protect,

userController.getProfile);

router.put("/profile",

protect,

userController.updateProfile);

export default router;