import express from "express";
import Roadmap from "../models/roadmap.model.js";
import { protect } from "../middlewares/auth.middlerware.js";
import { Progress } from "../models/Progress.model.js";
import { isAdmin } from "../middlewares/auth.middlerware.js";

const router = express.Router();

//Add roadmap
router.post("/", protect, isAdmin, async (req, res) => {
  try {
    const { title, description, months } = req.body;
    const roadmap = new Roadmap({ title, description, months });
    await roadmap.save();
    res.status(201).json(roadmap);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// get  roadmap
router.get("/", async (req, res) => {
  try {
    const roadmaps = await Roadmap.find();
    res.json(roadmaps);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// get all roadmaps
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

// Get roadmap progress
router.get("/progress/:roadmapId", protect, async (req, res) => {
  const progress = await Progress.findOne({
    userId: req.user._id,
    roadmapId: req.params.roadmapId,
  });
  res.json(progress || { completed: {} });
});

// Save progress
router.post("/progress/:roadmapId", protect, async (req, res) => {
  const { completed } = req.body;
  let progress = await Progress.findOne({
    userId: req.user._id,
    roadmapId: req.params.roadmapId,
  });
  console.log("Request body:", req.user._id);

  if (!progress) {
    progress = new Progress({
      userId: req.user._id,
      roadmapId: req.params.roadmapId,
      completed,
    });
  } else {
    progress.completed = completed;
  }

  await progress.save();
  res.json(progress);
});
export default router;
