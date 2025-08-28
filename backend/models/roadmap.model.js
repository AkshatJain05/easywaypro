import mongoose from "mongoose";

// Step Schema
const StepSchema = new mongoose.Schema({
  day: {
    type: String,
    trim: true,
    required: true,
  },
  topic: {
    type: String,
    trim: true,
    required: true,
  },
  details: {
    type: [String], // Array of strings ✅
    required: true,
  },
});

// RoadMap Schema
const RoadMapSchema = new mongoose.Schema(
  {
    month: {
      type: String,
      trim: true,
      required: true,
    },
    steps: [StepSchema], // Array of step objects
  },
  { timestamps: true }
);

// Main Schema
const RoadMapsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    roadmap: [RoadMapSchema],
  },
  { timestamps: true }
);

export const RoadMap = mongoose.model("RoadMap", RoadMapsSchema);
