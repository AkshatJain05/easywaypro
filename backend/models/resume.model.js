import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema(
  {
    personalInfo: {
      name: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      address: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      github: { type: String, default: "" },
      portfolio: { type: String, default: "" },
      summary: { type: String, default: "" },
    },
    education: { type: Array, default: [] },
    experience: { type: Array, default: [] },
    skills: { type: Array, default: [] },
    projects: { type: Array, default: [] },
    certifications: { type: Array, default: [] },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional if multi-user
  },
  { timestamps: true }
);

export const Resume = mongoose.model("Resume", ResumeSchema);
