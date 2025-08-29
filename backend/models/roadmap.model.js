import mongoose from "mongoose";

const StepSchema = new mongoose.Schema({
  day: { type: String, required: true },
  topic: { type: String, required: true },
  details: { type: [String], required: true },
});

const MonthSchema = new mongoose.Schema({
  month: { type: String, required: true },
  steps: { type: [StepSchema], required: true },
});

const RoadmapSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true }, // e.g., "Java Full Stack Roadmap"
  description: { type: String },
  months: { type: [MonthSchema], required: true },
}, { timestamps: true });

export default mongoose.model("Roadmap", RoadmapSchema);
