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

    meetingLink: {
      type: String,
      default: "",
    },

    notes: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      default: "",
    },

    questions: {
      type: [String],
      default: [],
    },

    answers: {
      type: [
        {
          question: {
            type: String,
            default: "",
          },
          answer: {
            type: String,
            default: "",
          },
          rating: {
            type: Number,
            min: 0,
            max: 5,
            default: 0,
          },
          notes: {
            type: String,
            default: "",
          },
        },
      ],
      default: [],
    },

    summary: {
      type: {
        overall: {
          type: Number,
          default: 0,
        },
        recommendation: {
          type: String,
          default: "",
        },
        strengths: {
          type: [String],
          default: [],
        },
        improvements: {
          type: [String],
          default: [],
        },
        feedback: {
          type: String,
          default: "",
        },
      },
      default: undefined,
    },

    completedAt: {
      type: Date,
    },

    status: {
      type: String,
      enum: [
        "SCHEDULED",
        "IN_PROGRESS",
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
