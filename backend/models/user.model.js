import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePhoto: { type: String },
    phoneNo: {
      type: String,
      validate: {
        validator: (v) => /^\d{10}$/.test(v),
        message: "Phone number must be exactly 10 digits",
      },
    },
    CollegeName: { type: String, trim: true },
    Course: { type: String, trim: true },
    BranchName: { type: String, trim: true },
    YearOfStudy: { type: Number, min: 1, max: 4 },
    role: { type: String, enum: ["student", "teacher", "admin"], default: "student" },

    //  Forgot Password Fields
    resetToken: String,
    resetTokenExpire: Date,
  },
  { timestamps: true }
);

//  Encrypt password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//  Method to check password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to create password reset token
UserSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex"); // generate random token
  this.resetToken = crypto.createHash("sha256").update(resetToken).digest("hex"); // hash token
  this.resetTokenExpire = Date.now() + 10 * 60 * 1000; // expires in 10 minutes
  return resetToken; // send plain token in email
};

export const User = mongoose.model("User", UserSchema);
