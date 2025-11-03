import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, //  speeds up user-based queries
    },
    roadmapId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Roadmap",
      required: true,
      index: true, // speeds up roadmap lookups
    },
    completed: {
      type: Map,
      of: Boolean,
      default: {},
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

//  Ensure unique progress per user-roadmap combo
progressSchema.index({ userId: 1, roadmapId: 1 }, { unique: true });

//  Middleware to auto-update progress percentage before saving
progressSchema.pre("save", function (next) {
  const completedArray = [...this.completed.values()];
  const completedCount = completedArray.filter(Boolean).length;

  this.completedCount = completedCount;
  this.percentage =
    this.totalSteps > 0
      ? Math.round((completedCount / this.totalSteps) * 100)
      : 0;

  next();
});

//  automatically recalculate if completed map is modified
progressSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.completed || update.$set?.completed) {
    const completedMap = update.completed || update.$set.completed;
    const completedArray = Object.values(completedMap || {});
    const completedCount = completedArray.filter(Boolean).length;

    if (update.totalSteps || update.$set?.totalSteps) {
      const total =
        update.totalSteps || update.$set?.totalSteps || completedArray.length;
      update.$set = {
        ...update.$set,
        completedCount,
        percentage:
          total > 0 ? Math.round((completedCount / total) * 100) : 0,
      };
    }
  }
  next();
});

export const Progress = mongoose.model("Progress", progressSchema);
