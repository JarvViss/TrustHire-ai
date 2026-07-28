import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    jobTitle: {
      type: String,
      required: true,
    },

    company: {
      type: String,
      default: "",
    },

    jobDescription: {
      type: String,
      required: true,
    },

    matchScore: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: [
        "APPLIED",
        "UNDER_REVIEW",
        "SHORTLISTED",
        "INTERVIEW",
        "OFFERED",
        "REJECTED",
        "WITHDRAWN",
      ],
      default: "APPLIED",
    },

    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Application",
  ApplicationSchema
);
