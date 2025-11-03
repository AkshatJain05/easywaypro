import mongoose from "mongoose";

/* -------------------------------------------------------------------------- */
/*                                  STEP MODEL                                */
/* -------------------------------------------------------------------------- */
const StepSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      required: true,
      trim: true,
    },
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    details: {
      type: [String],
      required: true,
      validate: {
        validator: (arr) => arr.length > 0,
        message: "Each step must contain at least one detail.",
      },
    },
  },
  { _id: false } //  prevents nested unnecessary _id fields
);

/* -------------------------------------------------------------------------- */
/*                                 MONTH MODEL                                */
/* -------------------------------------------------------------------------- */
const MonthSchema = new mongoose.Schema(
  {
    month: {
      type: String,
      required: true,
      trim: true,
    },
    steps: {
      type: [StepSchema],
      required: true,
      validate: {
        validator: (arr) => arr.length > 0,
        message: "Each month must contain at least one step.",
      },
    },
  },
  { _id: false }
);

/* -------------------------------------------------------------------------- */
/*                                ROADMAP MODEL                               */
/* -------------------------------------------------------------------------- */
const RoadmapSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true, //  speeds up title searches
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    months: {
      type: [MonthSchema],
      required: true,
      validate: {
        validator: (arr) => arr.length > 0,
        message: "Roadmap must have at least one month.",
      },
    },
    totalSteps: {
      type: Number,
      default: 0,
      min: [0, "Total steps cannot be negative"],
    },
  },
  { timestamps: true }
);

/* -------------------------------------------------------------------------- */
/*                        AUTO-CALCULATE TOTAL STEPS                          */
/* -------------------------------------------------------------------------- */
RoadmapSchema.pre("save", function (next) {
  try {
    this.totalSteps = this.months.reduce(
      (acc, m) => acc + (m.steps?.length || 0),
      0
    );
  } catch {
    this.totalSteps = 0;
  }
  next();
});

/*  Automatically recalc totalSteps on updates (findOneAndUpdate) */
RoadmapSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.months || update.$set?.months) {
    const months = update.months || update.$set?.months;
    const totalSteps = months.reduce(
      (acc, m) => acc + (m.steps?.length || 0),
      0
    );
    if (!update.$set) update.$set = {};
    update.$set.totalSteps = totalSteps;
  }
  next();
});

/* -------------------------------------------------------------------------- */
/*                      VIRTUAL FIELD: FLATTEN ALL STEPS                      */
/* -------------------------------------------------------------------------- */
RoadmapSchema.virtual("allSteps").get(function () {
  return this.months.flatMap((m) => m.steps.map((s) => ({ month: m.month, ...s })));
});


export const Roadmap = mongoose.model("Roadmap", RoadmapSchema);
