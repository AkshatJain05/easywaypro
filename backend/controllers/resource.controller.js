import { Resource } from "../models/resource.model.js";

export const getAllResources = async (req, res) => {
  try {
    const { type } = req.query; // type = notes | pyq | video
    const filter = type ? { type } : {};
    const resources = await Resource.find(filter).sort({ createdAt: -1 });
    res.json(resources);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch resources" });
  }
};

export const addNewResources = async (req, res) => {
  try {
    const { title, type, subject, link } = req.body;
    if (!title || !type || !subject || !link) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const newResource = new Resource({ title, type, subject, link });
    await newResource.save();
    res.status(201).json(newResource);
  } catch (err) {
    res.status(500).json({ error: "Failed to create resource" });
  }
};

export const deleteResources = async (req, res) => {
  try {
    // Option 1: Using findByIdAndDelete directly
    const resource = await Resource.findByIdAndDelete(req.params.id);

    if (!resource) {
      return res.status(404).json({ error: "Resource not found" });
    }

    res.json({ message: "Resource deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete resource" });
  }
};
