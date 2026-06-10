import mongoose from "mongoose";

const PurchaseSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    purchasedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date },
    isExpired: { type: Boolean, default: false },
    // Progress tracking
    progress: { type: Number, default: 0, min: 0, max: 100 },
    completedLessons: [{ type: String }],
    lastAccessed: { type: Date },
    isCompleted: { type: Boolean, default: false },
    completedAt: { type: Date },
    // Certificate
    certificateIssued: { type: Boolean, default: false },
    certificateIssuedAt: { type: Date },
  },
  { timestamps: true }
);

// Unique purchase per user per course
PurchaseSchema.index({ user: 1, course: 1 }, { unique: true });

// Check expiry before saving
PurchaseSchema.pre("save", function (next) {
  if (this.expiresAt && new Date() > this.expiresAt) {
    this.isExpired = true;
  }
  next();
});

export const Purchase = mongoose.model("Purchase", PurchaseSchema);
