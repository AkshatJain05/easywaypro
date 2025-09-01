import express from "express";
import { protect } from "../middlewares/auth.middlerware.js";
import {
  getResume,
  createNewResume,
  updateResume,
  resetResume,
} from "../controllers/resume.controller.js";

const router = express.Router();

// Get resume by ID
router.get("/", protect, getResume);

// Create new resume
router.post("/", protect, createNewResume);

// Update resume
router.put("/:id", protect, updateResume);

// Reset resume
router.post("/reset", protect, resetResume);


export default router;
