import mongoose from "mongoose";

const OptionSchema = new mongoose.Schema({
  text: { type: String, required: true },   // Option text
  isCorrect: { type: Boolean, default: false } // True if this is the correct answer
});

const QuestionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  type: { type: String, enum: ["mcq", "code"], default: "mcq" }, // MCQ or coding problem
  options: [OptionSchema], // Only for MCQs
  marks: { type: Number, required: true, default: 10 }, // Marks for this question
  answerHint: { type: String } // Optional, for evaluation (coding)
});

const QuizSchema = new mongoose.Schema({
  title: { type: String, required: true },       // e.g., "Python Basics Quiz"
  subject: { type: String, required: true },     // e.g., "Python", "Java"
  questions: [QuestionSchema],
  totalMarks: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// Pre-save hook to calculate totalMarks automatically
QuizSchema.pre("save", function(next) {
  this.totalMarks = this.questions.reduce((sum, q) => sum + (q.marks || 0), 0);
  next();
});

export default mongoose.model("Quiz", QuizSchema);
