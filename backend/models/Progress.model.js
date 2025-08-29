import mongoose from "mongoose";

const ProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  roadmapId: { type: mongoose.Schema.Types.ObjectId, ref: "Roadmap", required: true },
  completed: { type: Map, of: Boolean, default: {} }, 
  // Example: { "0-0": true, "0-1": false } (monthIndex-stepIndex)
}, { timestamps: true });

export default mongoose.model("Progress", ProgressSchema);
