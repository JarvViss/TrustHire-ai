import Notification from "../models/Notification";

export async function createNotification(
  userId: string,
  title: string,
  message: string,
  type: string,
  link?: string
) {
  return Notification.create({
    user: userId,
    title,
    message,
    type,
    link: link ?? "",
  });
}

export async function getNotifications(
  userId: string
) {
  return Notification.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(50);
}

export async function getUnreadCount(
  userId: string
) {
  return Notification.countDocuments({
    user: userId,
    read: false,
  });
}

export async function markAsRead(
  userId: string,
  notificationId: string
) {
  return Notification.findOneAndUpdate(
    { _id: notificationId, user: userId },
    { read: true },
    { new: true }
  );
}

export async function markAllAsRead(
  userId: string
) {
  return Notification.updateMany(
    { user: userId, read: false },
    { read: true }
  );
}
