import mongoose from "mongoose";
import Message from "../models/Message";

export async function sendMessage(
  sender: string,
  receiver: string,
  content: string
) {
  return Message.create({ sender, receiver, content });
}

export async function getConversation(
  user1: string,
  user2: string
) {
  return Message.find({
    $or: [
      { sender: user1, receiver: user2 },
      { sender: user2, receiver: user1 },
    ],
  })
    .sort({ createdAt: 1 })
    .populate("sender", "name profileImage");
}

export async function getConversations(
  userId: string
) {
  const userObjectId = new mongoose.Types.ObjectId(userId);

  const messages = await Message.aggregate([
    {
      $match: {
        $or: [
          { sender: userObjectId },
          { receiver: userObjectId },
        ],
      },
    },
    { $sort: { createdAt: -1 as const } },
    {
      $group: {
        _id: {
          $cond: [
            { $eq: ["$sender", userObjectId] },
            "$receiver",
            "$sender",
          ],
        },
        lastMessage: { $first: "$$ROOT" },
        unread: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ["$receiver", userObjectId] },
                  { $eq: ["$read", false] },
                ],
              },
              1,
              0,
            ],
          },
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "otherUser",
      },
    },
    { $unwind: "$otherUser" },
    {
      $project: {
        _id: 0,
        userId: "$_id",
        name: "$otherUser.name",
        profileImage: "$otherUser.profileImage",
        lastMessage: "$lastMessage.content",
        lastAt: "$lastMessage.createdAt",
        unread: 1,
      },
    },
    { $sort: { lastAt: -1 as const } },
  ]);

  return messages;
}

export async function markConversationRead(
  sender: string,
  receiver: string
) {
  return Message.updateMany(
    { sender, receiver, read: false },
    { read: true }
  );
}
