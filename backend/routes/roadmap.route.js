import express from "express";
import Roadmap from "../models/roadmap.model.js";
import Progress from "../models/Progress.model.js";
import {protect} from "../middlewares/auth.middlerware.js";

const router = express.Router();

/* --- Roadmap routes (public) --- */
router.post("/", async (req, res) => {
  try {
    const { title, description, months } = req.body;
    const roadmap = new Roadmap({ title, description, months });
    await roadmap.save();
    res.status(201).json(roadmap);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});   // add roadmap
router.get("/", async (req, res) => {
  try {
    const roadmaps = await Roadmap.find();
    res.json(roadmaps);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});    // get all roadmaps
router.get("/title/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const roadmap = await Roadmap.findOne({ _id: id });
    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/step/:topic", async (req, res) => {
  try {
    const { topic } = req.params;
    const roadmaps = await Roadmap.find({ "months.steps.topic": topic });
    res.json(roadmaps);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* --- Progress routes (protected, needs login) --- */

// Save/update progress
router.post("/progress/:roadmapId", protect, async (req, res) => {
  try {
    const { roadmapId } = req.params;
    const { completed } = req.body;
    const userId = req.user.id;

    let progress = await Progress.findOne({ userId, roadmapId });
    if (progress) {
      progress.completed = completed;
      await progress.save();
    } else {
      progress = new Progress({ userId, roadmapId, completed });
      await progress.save();
    }
    res.json(progress);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get progress for logged-in user
router.get("/progress/:roadmapId", protect, async (req, res) => {
  try {
    const { roadmapId } = req.params;
    const userId = req.user.id;

    const progress = await Progress.findOne({ userId, roadmapId });
    res.json(progress || { userId, roadmapId, completed: {} });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
