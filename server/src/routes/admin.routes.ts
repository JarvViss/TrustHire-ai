import { Router } from "express";
import { protect } from "../middleware/auth.middleware";
import { adminOnly } from "../middleware/admin.middleware";
import {
  getAdminStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
} from "../controllers/admin.controller";

const router = Router();

router.use(protect);
router.use(adminOnly);

router.get("/stats", getAdminStats);
router.get("/users", getAllUsers);
router.patch("/user/:id/role", updateUserRole);
router.delete("/user/:id", deleteUser);

export default router;
