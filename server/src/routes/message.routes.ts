import { Router } from "express";
import { protect } from "../middleware/auth.middleware";
import {
  sendMessageHandler,
  getConversationHandler,
  getConversationsHandler,
} from "../controllers/message.controller";

const router = Router();

router.use(protect);

router.get("/", getConversationsHandler);
router.get("/:userId", getConversationHandler);
router.post("/", sendMessageHandler);

export default router;
