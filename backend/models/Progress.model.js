// models/progress.model.js
import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  roadmapId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Roadmap", // ✅ link to roadmap collection
    required: true,
  },
  completed: {
    type: Map,       // stores progress like { "0-0": true, "1-2": false }
    of: Boolean,
    default: {},
  },
}, { timestamps: true });

export const Progress = mongoose.model("Progress", progressSchema);
