import mongoose from "mongoose";

const StepSchema = new mongoose.Schema({
  day: { type: String, required: true },
  topic: { type: String, required: true },
  details: { type: [String], required: true },
  completed: { type: Boolean, default: false }, // Track if step is done
});

const MonthSchema = new mongoose.Schema({
  month: { type: String, required: true },
  steps: { type: [StepSchema], required: true },
  monthProgress: {
    type: Number,
    default: 0, //  Percentage progress for this month (auto-calculated)
  },
});

const RoadmapSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true }, // e.g., "Java Full Stack Roadmap"
    description: { type: String },
    months: { type: [MonthSchema], required: true },

    //  New Fields for Dashboard Progress
    overallProgress: {
      type: Number,
      default: 0, // Total roadmap completion (0–100)
    },
    totalSteps: {
      type: Number,
      default: 0, // Calculated from all months’ steps
    },
    completedSteps: {
      type: Number,
      default: 0, // Count of completed steps
    },
  },
  { timestamps: true }
);

// Optional pre-save hook to auto-update progress
RoadmapSchema.pre("save", function (next) {
  const total = this.months.reduce(
    (acc, m) => acc + (m.steps?.length || 0),
    0
  );
  const done = this.months.reduce(
    (acc, m) => acc + m.steps.filter((s) => s.completed).length,
    0
  );
  this.totalSteps = total;
  this.completedSteps = done;
  this.overallProgress = total ? Math.round((done / total) * 100) : 0;

  // Calculate month-wise progress
  this.months.forEach((month) => {
    const steps = month.steps.length;
    const completed = month.steps.filter((s) => s.completed).length;
    month.monthProgress = steps ? Math.round((completed / steps) * 100) : 0;
  });

  next();
});

export default mongoose.model("Roadmap", RoadmapSchema);
