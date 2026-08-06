import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} from "../services/notification.service";

export async function getMyNotifications(
  req: AuthRequest,
  res: Response,
  next: NextFunction
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
  } catch (err) {
    next(err);
  }
}

export async function markNotificationRead(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    await markAsRead(req.userId!, String(req.params.id));
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

export async function markAllRead(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    await markAllAsRead(req.userId!);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}
