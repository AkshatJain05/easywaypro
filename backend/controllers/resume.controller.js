import { Resume } from "../models/resume.model.js";

const getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.user._id });
    res.json(resume || null);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

const createNewResume =  async (req, res) => {
    
  try {
    const newResume = new Resume({ ...req.body, userId: req.user._id });
    const saved = await newResume.save();
    res.json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

const updateResume = async (req, res) => {
  try {
    const updated = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id},
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

const resetResume =  async (req, res) => {
  try {
    const userId = req.user._id; // set by your protect middleware
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    // reset exactly the fields that exist in your schema (root-level, not `resumeData`)
    const initialResumeData = {
      personalInfo: {
        name: "",
        email: "",
        phone: "",
        address: "",
        linkedin: "",
        github: "",
        portfolio: "",
        summary: "",
      },
      education: [],
      experience: [],
      skills: [],
      projects: [],
      certifications: [],
    };

    //  Use set and $setOnInsert to guarantee userId on upsert
    const updatedDoc = await Resume.findOneAndUpdate(
      { userId },
      { $set: initialResumeData, $setOnInsert: { userId } },
      { new: true, upsert: true }
    );

    return res.json({
      success: true,
      message: "Resume reset successfully",
      data: updatedDoc,
    });
  } catch (error) {
    console.error("resetResume error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

export { getResume, createNewResume, updateResume, resetResume }