import express from "express";
import Roadmap from "../models/roadmap.model.js";
import { protect, isAdmin } from "../middlewares/auth.middlerware.js";

const router = express.Router();

/* ------------------------------- ADD ROADMAP ------------------------------- */
router.post("/", protect, isAdmin, async (req, res) => {
  try {
    const { title, description, months } = req.body;

    const roadmap = new Roadmap({ title, description, months });
    await roadmap.save(); // pre-save hook auto-calculates progress

    res.status(201).json({
      success: true,
      message: "Roadmap created successfully",
      roadmap,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/* ------------------------------ GET ALL ROADMAPS ------------------------------ */
router.get("/", async (req, res) => {
  try {
    const roadmaps = await Roadmap.find();
    res.status(200).json({ success: true, count: roadmaps.length, roadmaps });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/* ------------------------------ GET ROADMAP BY ID ----------------------------- */
router.get("/:id", async (req, res) => {
  try {
    const roadmap = await Roadmap.findById(req.params.id);
    if (!roadmap)
      return res.status(404).json({ success: false, error: "Roadmap not found" });

    res.status(200).json({ success: true, roadmap });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/* ----------------------------- SEARCH BY TOPIC ----------------------------- */
router.get("/search/:topic", async (req, res) => {
  try {
    const { topic } = req.params;
    const roadmaps = await Roadmap.find({ "months.steps.topic": topic });
    res.status(200).json({ success: true, roadmaps });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/* --------------------------- TOGGLE STEP COMPLETION --------------------------- */
// mark step as completed/uncompleted
router.put("/:roadmapId/month/:monthIndex/step/:stepIndex/toggle", protect, async (req, res) => {
  try {
    const { roadmapId, monthIndex, stepIndex } = req.params;
    const roadmap = await Roadmap.findById(roadmapId);
    if (!roadmap) return res.status(404).json({ success: false, error: "Roadmap not found" });

    const month = roadmap.months[monthIndex];
    if (!month) return res.status(404).json({ success: false, error: "Month not found" });

    const step = month.steps[stepIndex];
    if (!step) return res.status(404).json({ success: false, error: "Step not found" });

    // ✅ Toggle step completion
    step.completed = !step.completed;

    // ✅ Save and trigger pre-save hook for recalculating progress
    await roadmap.save();

    res.status(200).json({
      success: true,
      message: `Step "${step.topic}" marked as ${step.completed ? "completed" : "incomplete"}`,
      roadmap,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/* ----------------------------- GET ROADMAP PROGRESS ----------------------------- */
router.get("/progress/:id", async (req, res) => {
  try {
    const roadmap = await Roadmap.findById(req.params.id);
    if (!roadmap)
      return res.status(404).json({ success: false, error: "Roadmap not found" });

    res.status(200).json({
      success: true,
      progress: {
        overallProgress: roadmap.overallProgress,
        completedSteps: roadmap.completedSteps,
        totalSteps: roadmap.totalSteps,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
