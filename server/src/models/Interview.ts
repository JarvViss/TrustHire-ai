import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },

    answer: {
      type: String,
      default: "",
    },

    score: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },

    feedback: {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
  }
);

const InterviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    role: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "ACTIVE",
        "COMPLETED",
        "CANCELLED",
      ],
      default: "ACTIVE",
    },

    currentQuestion: {
      type: Number,
      default: 0,
      min: 0,
    },

    conversation: {
      type: [ConversationSchema],
      default: [],
    },

    result: {
      technical: {
        type: Number,
        default: 0,
      },

      communication: {
        type: Number,
        default: 0,
      },

      confidence: {
        type: Number,
        default: 0,
      },

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

      finalFeedback: {
        type: String,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Interview",
  InterviewSchema
);