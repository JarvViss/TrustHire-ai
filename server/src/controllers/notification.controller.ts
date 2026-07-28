import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} from "../services/notification.service";

export async function getMyNotifications(
  req: AuthRequest,
  res: Response
) {
  try {
    const notifications = await getNotifications(
      req.userId!
    );
    const unreadCount = await getUnreadCount(
      req.userId!
    );

    res.json({
      success: true,
      data: notifications,
      unreadCount,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
    });
  }
}

export async function markNotificationRead(
  req: AuthRequest,
  res: Response
) {
  try {
    await markAsRead(req.userId!, req.params.id);
    res.json({ success: true });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed",
    });
  }
}

export async function markAllRead(
  req: AuthRequest,
  res: Response
) {
  try {
    await markAllAsRead(req.userId!);
    res.json({ success: true });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed",
    });
  }
}
