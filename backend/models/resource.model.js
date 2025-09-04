import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ["note", "pyq"], required: true },
  course: String,
  topic: String,
  description: String,
  fileUrl: String,
  createdAt: { type: Date, default: Date.now }
});

export const Resource = mongoose.model("Resource", resourceSchema);
