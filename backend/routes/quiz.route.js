import express from "express";
import { isAdmin, protect } from "../middlewares/auth.middlerware.js";

import {
  createQuiz,
  getQuiz,
  getQuizById,
  submitQuiz,
  userCertification,
  userCertificationById,
  userScore,
  completedQuiz,
} from "../controllers/quizController.js";

const router = express.Router();

// Get all quizzes (optionally by subject)
router.get("/", getQuiz);

router.get("/quizSet/:quizId", getQuizById);

// Submit quiz and calculate score
router.post("/submit", protect, submitQuiz);

router.get("/user-score", protect, userScore);

// Get all certificates of logged-in user
router.get("/user-certificates", protect, userCertification);

// Get certificate by certificateId
router.get("/certificate/:id", userCertificationById);

router.post("/create", protect, isAdmin, createQuiz);

router.get("/complete-quiz", protect, completedQuiz);

export default router;
