// routes/roadmap.routes.js
import express from "express";
import { Roadmap } from "../models/roadmap.model.js";
import { Progress } from "../models/Progress.model.js";
import { protect, isAdmin } from "../middlewares/auth.middlerware.js";

const router = express.Router();

/* -------------------------------------------------------------------------- */
/*                            ADMIN: ADD NEW ROADMAP                          */
/* -------------------------------------------------------------------------- */
router.post("/", protect, isAdmin, async (req, res) => {
  try {
    const { title, description, months } = req.body;

    if (!title || !months?.length) {
      return res
        .status(400)
        .json({ success: false, message: "Title and months are required" });
    }

    const roadmap = new Roadmap({ title, description, months });
    await roadmap.save();

    res.status(201).json({
      success: true,
      message: "Roadmap created successfully",
      roadmap,
    });
  } catch (error) {
    console.error("Add Roadmap Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/* -------------------------------------------------------------------------- */
/*                              GET ALL ROADMAPS                              */
/* -------------------------------------------------------------------------- */
router.get("/", async (req, res) => {
  try {
    const roadmaps = await Roadmap.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: roadmaps.length,
      roadmaps,
    });
  } catch (error) {
    console.error("Get All Roadmaps Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/* -------------------------------------------------------------------------- */
/*                              SEARCH ROADMAPS                               */
/* -------------------------------------------------------------------------- */
router.get("/search/:topic", async (req, res) => {
  try {
    const { topic } = req.params;
    const regex = new RegExp(topic, "i");
    const roadmaps = await Roadmap.find({ "months.steps.topic": regex });
    res.status(200).json({ success: true, roadmaps });
  } catch (error) {
    console.error("Search Roadmaps Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/* -------------------------------------------------------------------------- */
/*                  USER: FETCH ALL ROADMAPS WITH USER PROGRESS               */
/* -------------------------------------------------------------------------- */
router.get("/user/all", protect, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all roadmaps
    const roadmaps = await Roadmap.find().sort({ createdAt: -1 });
    // Get user progress documents
    const progresses = await Progress.find({ userId });

    // Create a quick map for fast lookup
    const progressMap = new Map(progresses.map((p) => [p.roadmapId.toString(), p]));

    // Merge roadmap + progress data
    const userRoadmaps = roadmaps.map((roadmap) => {
      const progress = progressMap.get(roadmap._id.toString());
      const totalSteps = roadmap.totalSteps || 1; // use actual roadmap step count
      const completedCount = progress
        ? Array.from(progress.completed.values()).filter(Boolean).length
        : 0;

      //  calculate true progress based on roadmap steps, not progress.totalSteps
      const percentage = Math.min(
        Math.round((completedCount / totalSteps) * 100),
        100
      );

      return {
        _id: roadmap._id,
        title: roadmap.title,
        description: roadmap.description,
        totalSteps,
        months: roadmap.months,
        overallProgress: percentage,
      };
    });

    res.status(200).json({
      success: true,
      count: userRoadmaps.length,
      roadmaps: userRoadmaps,
    });
  } catch (error) {
    console.error("Error fetching user-specific roadmaps:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/* -------------------------------------------------------------------------- */
/*                             GET ROADMAP BY ID                              */
/* -------------------------------------------------------------------------- */
router.get("/:id", async (req, res) => {
  try {
    const roadmap = await Roadmap.findById(req.params.id);
    if (!roadmap) {
      return res
        .status(404)
        .json({ success: false, message: "Roadmap not found" });
    }
    res.status(200).json({ success: true, roadmap });
  } catch (error) {
    console.error("Get Roadmap by ID Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/* -------------------------------------------------------------------------- */
/*                        USER: TOGGLE STEP COMPLETION                        */
/* -------------------------------------------------------------------------- */
router.put(
  "/:roadmapId/month/:monthIndex/step/:stepIndex/toggle",
  protect,
  async (req, res) => {
    try {
      const { roadmapId, monthIndex, stepIndex } = req.params;
      const userId = req.user._id;

      const roadmap = await Roadmap.findById(roadmapId);
      if (!roadmap)
        return res
          .status(404)
          .json({ success: false, message: "Roadmap not found" });

      const month = roadmap.months[monthIndex];
      if (!month)
        return res
          .status(404)
          .json({ success: false, message: "Month not found" });

      const step = month.steps[stepIndex];
      if (!step)
        return res
          .status(404)
          .json({ success: false, message: "Step not found" });

      // find or create progress doc
      let progress = await Progress.findOne({ userId, roadmapId });
      if (!progress) {
        progress = new Progress({ userId, roadmapId, completed: new Map() });
      }

      const key = `${monthIndex}-${stepIndex}`;
      const current = progress.completed.get(key) || false;
      progress.completed.set(key, !current);

      await progress.save();

      const completedCount = Array.from(progress.completed.values()).filter(Boolean).length;
      const percentage = (completedCount / roadmap.totalSteps) * 100;

      res.status(200).json({
        success: true,
        message: `Step "${step.topic}" marked as ${
          !current ? "completed" : "incomplete"
        }`,
        progress: {
          completed: Object.fromEntries(progress.completed),
          completedCount,
          totalSteps: roadmap.totalSteps,
          percentage,
        },
      });
    } catch (error) {
      console.error("Toggle Step Error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

/* -------------------------------------------------------------------------- */
/*                     GET USER ROADMAP PROGRESS BY ID                        */
/* -------------------------------------------------------------------------- */
router.get("/:roadmapId/progress", protect, async (req, res) => {
  try {
    const { roadmapId } = req.params;
    const userId = req.user._id;

    const roadmap = await Roadmap.findById(roadmapId);
    if (!roadmap)
      return res
        .status(404)
        .json({ success: false, message: "Roadmap not found" });

    let progress = await Progress.findOne({ userId, roadmapId });
    if (!progress) {
      progress = await Progress.create({
        userId,
        roadmapId,
        completed: new Map(),
      });
    }

    const completedCount = Array.from(progress.completed.values()).filter(Boolean).length;
    const percentage = (completedCount / roadmap.totalSteps) * 100;

    res.status(200).json({
      success: true,
      roadmapTitle: roadmap.title,
      progress: {
        completed: Object.fromEntries(progress.completed),
        completedCount,
        totalSteps: roadmap.totalSteps,
        percentage,
      },
    });
  } catch (error) {
    console.error("Fetch Progress Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Pagination for admin
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const [roadmaps, count] = await Promise.all([
      Roadmap.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Roadmap.countDocuments()
    ]);

    res.status(200).json({ success: true, count, roadmaps });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin Edit
router.put("/:id", protect, isAdmin, async (req, res) => {
  try {
    const { title, description, months } = req.body;
    const roadmap = await Roadmap.findByIdAndUpdate(
      req.params.id,
      { title, description, months },
      { new: true }
    );
    if (!roadmap) return res.status(404).json({ success: false, message: "Not found" });
    res.status(200).json({ success: true, roadmap });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin Delete
router.delete("/:id", protect, isAdmin, async (req, res) => {
  try {
    await Roadmap.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Roadmap deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


export default router;
