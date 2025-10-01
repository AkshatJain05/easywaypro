import mongoose from "mongoose";

const CertificateSchema = new mongoose.Schema({
  name: {type:String ,required: true},
  email: { type: String, required: true },
  title:{ type: String, required: true },
  subject: { type: String, required: true },
  score: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  certificateId: { type: String, required: true, unique: true }, // unique shareable ID
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },  // optional: track which quiz
});

export default mongoose.model("Certificate", CertificateSchema);
