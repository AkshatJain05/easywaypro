import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    subject: { type: String, trim: true },
    category: {
      type: String,
      enum: ["notes", "pyq", "videoLecture"],
      required: true,
    },
    fileUrl: { type: String, required: true }, // Cloudinary URL
    publicId: { type: String, required: true }, // for delete
    description: { type: String, trim: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Resource = mongoose.model("Resource", resourceSchema);
