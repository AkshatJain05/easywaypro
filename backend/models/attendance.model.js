import mongoose from "mongoose";

const AttendanceSessionSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    title: { type: String, required: true },
    date: { type: Date, required: true },
    zoomLink: { type: String },
    pollCode: { type: String, unique: true },
    isActive: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    attendees: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        markedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export const AttendanceSession = mongoose.model("AttendanceSession", AttendanceSessionSchema);
