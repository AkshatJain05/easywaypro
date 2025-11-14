import express from "express";
import {
  getAllDocs,
  getDocById,
  createDoc,
  updateDoc,
  deleteDoc,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  addAnswer,
} from "../controllers/docs.controller.js";

import { protect, isAdmin } from "../middlewares/auth.middlerware.js";

const router = express.Router();

// --- DOC ROUTES ---
router.get("/", protect,getAllDocs);
router.get("/:id",protect, getDocById);
router.post("/", protect, isAdmin, createDoc);
router.put("/:id", protect, isAdmin, updateDoc);
router.delete("/:id", protect, isAdmin, deleteDoc);

// --- QUESTION ROUTES ---
router.post("/:id/questions", protect, isAdmin, addQuestion);
router.put("/:id/questions/:qid", protect, isAdmin, updateQuestion);
router.delete("/:id/questions/:qid", protect, isAdmin, deleteQuestion);

// --- ANSWER ROUTES ---
router.post("/:id/questions/:qid/answers", protect, isAdmin, addAnswer);

export default router;
