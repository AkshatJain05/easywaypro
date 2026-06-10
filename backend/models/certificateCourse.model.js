import mongoose from "mongoose";

const CertificateSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    purchase: { type: mongoose.Schema.Types.ObjectId, ref: "Purchase" },
    certificateId: { type: String, unique: true },
    issuedAt: { type: Date, default: Date.now },
    isValid: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Certificates = mongoose.model("Certificates", CertificateSchema);
