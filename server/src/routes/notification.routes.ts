import { Router } from "express";
import { protect } from "../middleware/auth.middleware";
import {
  getMyNotifications,
  markNotificationRead,
  markAllRead,
} from "../controllers/notification.controller";

const router = Router();

router.use(protect);

router.get("/", getMyNotifications);
router.patch("/read-all", markAllRead);
router.patch("/:id/read", markNotificationRead);

export default router;
