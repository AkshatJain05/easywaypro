import express from "express";
import Task from "../models/Task.model.js";
import { protect } from "../middlewares/auth.middlerware.js";

const router = express.Router();

// Get all tasks
router.get("/", protect, async (req, res) => {
  const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json(tasks);
});

// Add new task
router.post("/", protect, async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Task text required" });

  const newTask = new Task({ text, userId: req.user.id }); 
  await newTask.save();
  res.json(newTask);
});

// Toggle task completion
router.put("/:id", protect, async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ error: "Task not found" });
  if (task.userId.toString() !== req.user.id) {
    return res.status(403).json({ error: "Not authorized" });
  }

  task.completed = !task.completed;
  await task.save();
  res.json(task);
});

// Delete task
router.delete("/:id", protect, async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) return res.status(404).json({ error: "Task not found" });
  if (task.userId.toString() !== req.user.id) {
    return res.status(403).json({ error: "Not authorized" });
  }

  res.json({ message: "Task deleted" });
});

export default router;
