import mongoose from "mongoose";

const CompletedQuizSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
    certificateGenerated: { type: Boolean, default: false },
    score: { type: Number }, // optional: store quiz score
  },
  { timestamps: true }
);

export default mongoose.model("CompletedQuiz", CompletedQuizSchema);
