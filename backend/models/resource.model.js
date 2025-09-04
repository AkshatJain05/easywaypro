import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ["notes", "pyq", "video"], required: true },
    subject: { type: String, required: true },
    link: { type: String, required: true }, // Drive link or YouTube link
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Resource = mongoose.model("Resource", resourceSchema);
