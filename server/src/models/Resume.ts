import mongoose, { Schema, Document } from "mongoose";

export interface IResume extends Document {
  user: mongoose.Types.ObjectId;

  originalName: string;

  filePath: string;

  extractedText: string;

  atsScore: number;

  aiFeedback: string;

  skills: string[];
}

const resumeSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    originalName: {
      type: String,
      required: true,
    },

    filePath: {
      type: String,
      required: true,
    },

    extractedText: {
      type: String,
      default: "",
    },

    atsScore: {
      type: Number,
      default: 0,
    },

    aiFeedback: {
      type: String,
      default: "",
    },

    skills: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IResume>("Resume", resumeSchema);