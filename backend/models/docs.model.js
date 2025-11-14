import mongoose from "mongoose";

/* ---------------------- Answer Schema ---------------------- */
const AnswerSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["paragraph", "points", "code"],
    required: true,
  },
  content: mongoose.Schema.Types.Mixed, // can be string or array
  language: {
    type: String,
    default: "", // only used if type === "code"
  },
});

/* ---------------------- Question Schema ---------------------- */
const QuestionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  Q: { type: String, required: true },
  ans: [AnswerSchema],
});

/* ---------------------- Docs Schema ---------------------- */
const DocSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true },
    description: { type: String },
    questions: [QuestionSchema], // multiple Qs inside one doc
  },
  { timestamps: true }
);

export default mongoose.model("Doc", DocSchema);
