import mongoose from "mongoose";

const CandidateStatusSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: [
        "PENDING",
        "SHORTLISTED",
        "INTERVIEW",
        "HIRED",
        "REJECTED",
      ],
      default: "PENDING",
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

CandidateStatusSchema.index(
  { candidate: 1, recruiter: 1 },
  { unique: true }
);

export default mongoose.model(
  "CandidateStatus",
  CandidateStatusSchema
);
