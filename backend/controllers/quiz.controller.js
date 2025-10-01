import Quiz from "../models/Quiz.model.js";
import Certificate from "../models/Certificate.model.js";
import QuizAttempt from "../models/QuizAttempt.model.js";
import mongoose from "mongoose";
import crypto from "crypto";
import CompletedQuiz from "../models/CompletedQuizSchema .js";

export const getQuiz = async (req, res) => {
  try {
    const { subject } = req.query;
    const filter = subject ? { subject } : {};
    const quizzes = await Quiz.find(filter);
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getQuizById = async (req, res) => {
  try {
    const { quizId } = req.params;
    let quiz = null;

    // Try finding by ObjectId
    try {
      quiz = await Quiz.findById(quizId);
    } catch (err) {
      // If invalid ObjectId, ignore the error
      quiz = null;
    }

    // If not found, try finding by slug
    if (!quiz) {
      quiz = await Quiz.findOne({ slug: quizId });
    }

    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    res.json(quiz);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const submitQuiz = async (req, res) => {
  try {
    const { quizId, answers } = req.body;

    // Fetch quiz safely
    let quiz;
    if (mongoose.Types.ObjectId.isValid(quizId)) {
      quiz = await Quiz.findById(quizId);
    }
    if (!quiz) {
      quiz = await Quiz.findOne({ slug: quizId });
    }
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    // Calculate score
    let score = 0;
    quiz.questions.forEach((q, idx) => {
      const ans = answers[idx];
      if (!ans) return;
      if (q.type === "mcq") {
        const correct = q.options.find((o) => o.isCorrect)?.text;
        if (ans === correct) score += q.marks || 1;
      } else if (q.type === "code") {
        if (
          q.answerHint &&
          ans.toLowerCase().includes(q.answerHint.toLowerCase())
        ) {
          score += q.marks || 1;
        }
      }
    });

    // Save quiz attempt
    const attempt = new QuizAttempt({
      email: req.user.email,
      quizId: quiz._id,
      answers,
      score,
    });
    await attempt.save();

    // Generate certificate if passed
    let certificate = null;
    if (score >= 60) {
      certificate = new Certificate({
        name: req.user.name,
        title: quiz.title,
        email: req.user.email,
        subject: quiz.subject,
        score,
        certificateId: crypto.randomBytes(8).toString("hex"),
      });
      await certificate.save();
    }

    // Save to CompletedQuiz
    await CompletedQuiz.findOneAndUpdate(
      { user: req.user.id, quiz: quiz._id },
      {
        user: req.user.id,
        quiz: quiz._id,
        certificateGenerated: !!certificate,
        score,
      },
      { upsert: true, new: true }
    );

    res.json({ score, certificate });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const userScore = async (req, res) => {
  try {
    // console.log("Hello")
    const email = req.user.email;

    // Get the latest quiz attempt
    const latestAttempt = await QuizAttempt.findOne({ email }).sort({
      date: -1,
    });
    if (!latestAttempt) return res.json({ score: 0, certificate: null });

    let quiz = null;

    // Safely fetch the quiz
    if (latestAttempt.quizId) {
      try {
        // Try findById first
        quiz = await Quiz.findById(latestAttempt.quizId);
      } catch (err) {
        // If invalid ObjectId, fallback to findOne by _id
        quiz = await Quiz.findOne({ _id: latestAttempt.quizId }).catch(
          () => null
        );
      }
    }

    // Find certificate for this quiz subject
    const certificate = quiz
      ? await Certificate.findOne({ email, subject: quiz.subject })
      : null;

    res.json({ score: latestAttempt.score, certificate });
  } catch (err) {
    console.error("User score error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const userCertification = async (req, res) => {
  try {
    const email = req.user.email;
    const certificates = await Certificate.find({ email }).sort({ date: -1 });
    res.json(certificates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const userCertificationById = async (req, res) => {
  try {
    const { id } = req.params;
    const cert = await Certificate.findOne({ certificateId: id });
    if (!cert)
      return res.status(404).json({ message: "Certificate not found" });
    res.json(cert);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createQuiz = async (req, res) => {
  try {
    const { title, subject, questions } = req.body;

    // Basic validation
    if (!title || !subject || !questions || !questions.length) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate each question
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];

      if (!q.questionText || !q.questionText.trim()) {
        return res.status(400).json({
          message: `Question ${i + 1} must have text`,
        });
      }

      if (q.type === "mcq") {
        if (!q.options || q.options.length < 2) {
          return res.status(400).json({
            message: `Question ${i + 1} must have at least 2 options`,
          });
        }

        // Remove empty options
        q.options = q.options.filter(
          (opt) => opt.text && opt.text.trim() !== ""
        );

        if (q.options.length < 2) {
          return res.status(400).json({
            message: `Question ${i + 1} must have at least 2 valid options`,
          });
        }

        // Ensure one option is correct
        const hasCorrect = q.options.some((opt) => opt.isCorrect === true);
        if (!hasCorrect) {
          return res.status(400).json({
            message: `Question ${i + 1} must have at least one correct option`,
          });
        }
      }

      if (q.type === "code" && (!q.answerHint || !q.answerHint.trim())) {
        return res.status(400).json({
          message: `Question ${
            i + 1
          } is a code question but answer hint is empty`,
        });
      }
    }

    // Create quiz
    const newQuiz = new Quiz({ title, subject, questions });
    await newQuiz.save();

    return res.status(201).json({
      message: "Quiz created successfully",
      quiz: newQuiz,
    });
  } catch (error) {
    console.error("Error creating quiz:", error);

    // Return Mongoose validation errors if any
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: "Validation failed", errors });
    }

    res.status(500).json({ message: "Server error" });
  }
};

export const completedQuiz = async (req, res) => {
  try {
    const completed = await CompletedQuiz.find({ user: req.user._id })
      .populate("quiz", "title subject")
      .select("quiz certificateGenerated score");

    res.json({ completed });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
