import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import {
  sendMessage,
  getConversation,
  getConversations,
  markConversationRead,
} from "../services/message.service";

export async function sendMessageHandler(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { receiverId, content } = req.body;

    if (!receiverId || !content) {
      return res.status(400).json({
        success: false,
        message: "Receiver and content are required",
      });
    }

    const message = await sendMessage(
      req.userId!,
      receiverId,
      content
    );

    res.status(201).json({
      success: true,
      data: message,
    });
  } catch (err) {
    next(err);
  }
}

export async function getConversationHandler(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const messages = await getConversation(
      req.userId!,
      String(req.params.userId)
    );

    await markConversationRead(
      String(req.params.userId),
      req.userId!
    );

    res.json({
      success: true,
      data: messages,
    });
  } catch (err) {
    next(err);
  }
}

export async function getConversationsHandler(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const conversations = await getConversations(
      req.userId!
    );

    res.json({
      success: true,
      data: conversations,
    });
  } catch (err) {
    next(err);
  }
}
