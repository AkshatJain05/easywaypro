import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: function () {
        return !this.googleUID;
      },
    }, // still required for local users
    profilePhoto: { type: String },

    // Optional Google login UID (won't affect existing users)
    googleUID: { type: String, unique: true, sparse: true },

    phoneNo: {
      type: String,
      validate: {
        validator: (v) => !v || /^\d{10}$/.test(v),
        message: "Phone number must be exactly 10 digits",
      },
    },
    CollegeName: { type: String, trim: true },
    Course: { type: String, trim: true },
    BranchName: { type: String, trim: true },
    YearOfStudy: { type: Number, min: 1, max: 4 },
    role: {
      type: String,
      enum: ["student", "teacher", "admin"],
      default: "student",
    },

    // Forgot Password Fields
    resetToken: String,
    resetTokenExpire: Date,
  },
  { timestamps: true }
);

// Encrypt password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false; // Google users may not have password
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create password reset token
UserSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.resetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetTokenExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  return resetToken;
};

export const User = mongoose.model("User", UserSchema);
