import express from "express";
import { Resource } from "../models/resource.model.js";

const router = express.Router();

// Add new resource
router.post("/", async (req, res) => {
  try {
    const resource = new Resource(req.body);
    await resource.save();
    res.status(201).json(resource);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all resources (with filter)
router.get("/", async (req, res) => {
  try {
    const { type, course, topic } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (course) filter.course = course;
    if (topic) filter.topic = topic;

    const resources = await Resource.find(filter);
    res.json(resources);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
