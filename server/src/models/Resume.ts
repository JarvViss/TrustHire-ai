import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    filename: {
      type: String,
      required: true,
    },

    fileUrl: {
      type: String,
      default: "",
    },

    atsScore: {
      type: Number,
      required: true,
    },

    summary: {
      type: String,
      required: true,
    },

    skills: {
      type: [String],
      default: [],
    },

    missingSkills: {
      type: [String],
      default: [],
    },

    strengths: {
      type: [String],
      default: [],
    },

    suggestions: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Resume", ResumeSchema);