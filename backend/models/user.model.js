import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePhoto: {
      type: String,
    },
    phoneNo: {
      type: String, 
      validate: {
        validator: (v) => /^\d{10}$/.test(v),
        message: "Phone number must be exactly 10 digits",
      },
    },
    CollegeName: {
      type: String,
      trim: true,
    },
    Course: {
      type: String,
      trim: true,
    },
    BranchName: {
      type: String,
      trim: true,
    },
    YearOfStudy: {
      type: Number,
      min: 1,
      max: 4,
    },
    role: {
      type: String,
      enum: ["student", "teacher", "admin"],
      default: "student",
    },
  },
  { timestamps: true }
);


// ✅ Encrypt password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // only hash if changed
  this.password = await bcrypt.hash(this.password, 10); // salt rounds = 10
  next();
});

// ✅ Method to check password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};  

export const User = mongoose.model("User", UserSchema);


