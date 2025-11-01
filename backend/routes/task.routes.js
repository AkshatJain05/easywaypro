import express from "express";
import Task from "../models/Task.model.js";
import { protect } from "../middlewares/auth.middlerware.js";

const router = express.Router();

/**
 *  GET /api/tasks
 *  Get all tasks for the logged-in user (sorted by date + time)
 */
router.get("/", protect, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id })
      .sort({ date: 1, time: 1 })
      .lean();

    res.status(200).json(tasks);
  } catch (error) {
    console.error("❌ Error fetching tasks:", error.message);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

/**
 * POST /api/tasks
 *  Add a new task
 */
router.post("/", protect, async (req, res) => {
  try {
    const { text, date, time } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({ error: "Task text is required" });
    }

    const newTask = await Task.create({
      text: text.trim(),
      date,
      time,
      userId: req.user.id,
    });

    res.status(201).json(newTask);
  } catch (error) {
    console.error("Error creating task:", error.message);
    res.status(500).json({ error: "Failed to create task" });
  }
});

/**
 *  PUT /api/tasks/:id/toggle
 *  Toggle task completion (true/false)
 */
router.put("/:id/toggle", protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ error: "Task not found" });
    if (task.userId.toString() !== req.user.id)
      return res.status(403).json({ error: "Unauthorized" });

    task.completed = !task.completed;
    const updated = await task.save();

    res.status(200).json(updated);
  } catch (error) {
    console.error("Error toggling task:", error.message);
    res.status(500).json({ error: "Failed to toggle task" });
  }
});

/**
 *  PUT /api/tasks/:id/edit
 * Edit task text, date, or time
 */
router.put("/:id/edit", protect, async (req, res) => {
  try {
    const { text, date, time } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ error: "Task not found" });
    if (task.userId.toString() !== req.user.id)
      return res.status(403).json({ error: "Unauthorized" });

    if (text?.trim()) task.text = text.trim();
    if (date) task.date = date;
    if (time) task.time = time;

    const updatedTask = await task.save();
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error(" Error editing task:", error.message);
    res.status(500).json({ error: "Failed to edit task" });
  }
});

/**
 *  Delete /api/tasks/clear
 *  Delete all tasks
 */
router.delete("/clear", protect, async (req, res) => {
  try {
    const result = await Task.deleteMany({ userId: req.user.id });

    return res.status(200).json({
      success: true,
      message: ` Cleared ${result.deletedCount} task(s) successfully.`,
    });
  } catch (error) {
    console.error("Error clearing all tasks:", error.message);
    return res.status(500).json({
      success: false,
      error: "Failed to clear all tasks",
    });
  }
});


/**
 *  DELETE /api/tasks/:id
 *  Delete a task
 */
router.delete("/:id", protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ error: "Task not found" });
    if (task.userId.toString() !== req.user.id)
      return res.status(403).json({ error: "Unauthorized" });

    await task.deleteOne();
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error(" Error deleting task:", error.message);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

export default router;
