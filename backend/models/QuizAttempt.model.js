import mongoose from "mongoose";

const QuizAttemptSchema = new mongoose.Schema({
  email: { type: String, required: true },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
  answers: { type: Array, required: true },
  score: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

export default mongoose.model("QuizAttempt", QuizAttemptSchema);
