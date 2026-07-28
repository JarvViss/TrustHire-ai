import mongoose from "mongoose";

const InterviewScheduleSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    scheduledAt: {
      type: Date,
      required: true,
    },

    duration: {
      type: Number,
      default: 30,
    },

    type: {
      type: String,
      enum: ["ONLINE", "PHONE", "ONSITE"],
      default: "ONLINE",
    },

    notes: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "SCHEDULED",
        "COMPLETED",
        "CANCELLED",
      ],
      default: "SCHEDULED",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "InterviewSchedule",
  InterviewScheduleSchema
);
