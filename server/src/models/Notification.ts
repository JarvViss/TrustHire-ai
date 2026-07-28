import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: [
        "STATUS_UPDATE",
        "NEW_CANDIDATE",
        "INTERVIEW_COMPLETE",
        "RESUME_UPLOADED",
        "VERIFICATION",
        "SYSTEM",
      ],
      default: "SYSTEM",
    },

    read: {
      type: Boolean,
      default: false,
    },

    link: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Notification",
  NotificationSchema
);
