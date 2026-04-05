import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // ✅ speeds up user-based queries
    },
    roadmapId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Roadmap",
      required: true,
      index: true, // ✅ improves roadmap lookups
    },
    completed: {
      type: Map,
      of: Boolean,
      default: new Map(), // ✅ ensure consistent Map instance
    },
    percentage: {
      type: Number,
      default: 0,
      min: [0, "Progress cannot be below 0%"],
      max: [100, "Progress cannot exceed 100%"],
    },
    completedCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalSteps: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

/* -------------------------------------------
   🔒 Ensure one progress document per user+roadmap
------------------------------------------- */
progressSchema.index({ userId: 1, roadmapId: 1 }, { unique: true });

/* -------------------------------------------
   ⚙️ Helper Method: safely recalc stats
------------------------------------------- */
progressSchema.methods.recalculateProgress = function () {
  const completedArray = Array.from(this.completed?.values() || []);
  this.completedCount = completedArray.filter(Boolean).length;
  this.percentage =
    this.totalSteps > 0
      ? Math.round((this.completedCount / this.totalSteps) * 100)
      : 0;
};

/* -------------------------------------------
   🧩 Pre-save hook — auto sync before save()
------------------------------------------- */
progressSchema.pre("save", function (next) {
  this.recalculateProgress();
  next();
});

/* -------------------------------------------
   🧠 Pre-findOneAndUpdate hook — auto sync on updates
------------------------------------------- */
progressSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate() || {};
  const completedMap = update.completed || update.$set?.completed;
  const totalSteps = update.totalSteps || update.$set?.totalSteps;

  if (completedMap) {
    const completedArray = Object.values(completedMap);
    const completedCount = completedArray.filter(Boolean).length;
    const total = totalSteps || completedArray.length;

    if (!update.$set) update.$set = {};
    update.$set.completedCount = completedCount;
    update.$set.percentage =
      total > 0 ? Math.round((completedCount / total) * 100) : 0;
  }

  next();
});

/* -------------------------------------------
   ⚡ Static Helper — for easy upserts
------------------------------------------- */
progressSchema.statics.updateProgress = async function (
  userId,
  roadmapId,
  completed,
  totalSteps
) {
  const result = await this.findOneAndUpdate(
    { userId, roadmapId },
    {
      $set: {
        completed,
        totalSteps,
      },
    },
    { new: true, upsert: true, runValidators: true }
  );
  return result;
};

export const Progress = mongoose.model("Progress", progressSchema);
