import { Resume } from "../models/resume.model.js";

/* ================================
   GET ALL RESUMES (Logged-in User)
================================ */
const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.json(resumes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* ================================
   GET SINGLE RESUME BY ID
================================ */
const getSingleResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.json(resume);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* ================================
   CREATE NEW RESUME
================================ */
const createNewResume = async (req, res) => {
  try {

    // Optional limit (max 5 resumes per user)
    const count = await Resume.countDocuments({ userId: req.user._id });
    if (count >= 5) {
      return res.status(400).json({
        message: "Maximum 5 resumes allowed"
      });
    }

    const newResume = new Resume({
      ...req.body,
      userId: req.user._id
    });

    const saved = await newResume.save();

    res.status(201).json(saved);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


/* ================================
   UPDATE RESUME
================================ */
const updateResume = async (req, res) => {
  try {
    const updated = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.json(updated);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


/* ================================
   DELETE RESUME
================================ */
const deleteResume = async (req, res) => {
  try {
    const deleted = await Resume.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!deleted) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.json({ message: "Resume deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* ================================
   RESET RESUME
================================ */
const resetResume = async (req, res) => {
  try {

    const initialResumeData = {
      personalInfo: {
        name: "",
        title: "",
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

    const updatedDoc = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: initialResumeData },
      { new: true }
    );

    if (!updatedDoc) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.json({
      success: true,
      message: "Resume reset successfully",
      data: updatedDoc,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


/* ================================
   DUPLICATE RESUME (Bonus Feature 🔥)
================================ */
const duplicateResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const duplicated = new Resume({
      ...resume.toObject(),
      _id: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      title: resume.title + " (Copy)",
      userId: req.user._id
    });

    const saved = await duplicated.save();

    res.status(201).json(saved);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* ================================
   EXPORT ALL
================================ */
export {
  getResumes,
  getSingleResume,
  createNewResume,
  updateResume,
  deleteResume,
  resetResume,
  duplicateResume
};


















// import { Resume } from "../models/resume.model.js";

// const getResume = async (req, res) => {
//   try {
//     const resume = await Resume.findOne({ userId: req.user._id });
//     res.json(resume || null);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// }

// const createNewResume =  async (req, res) => {
    
//   try {
//     const newResume = new Resume({ ...req.body, userId: req.user._id });
//     const saved = await newResume.save();
//     res.json(saved);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// }

// const updateResume = async (req, res) => {
//   try {
//     const updated = await Resume.findOneAndUpdate(
//       { _id: req.params.id, userId: req.user._id},
//       req.body,
//       { new: true }
//     );
//     res.json(updated);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// }

// const resetResume =  async (req, res) => {
//   try {
//     const userId = req.user._id; // set by your protect middleware
//     if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

//     // reset exactly the fields that exist in your schema (root-level, not `resumeData`)
//     const initialResumeData = {
//       personalInfo: {
//         name: "",
//         title: "",
//         email: "",
//         phone: "",
//         address: "",
//         linkedin: "",
//         github: "",
//         portfolio: "",
//         summary: "",
//       },
//       education: [],
//       experience: [],
//       skills: [],
//       projects: [],
//       certifications: [],
//     };

//     //  Use set and $setOnInsert to guarantee userId on upsert
//     const updatedDoc = await Resume.findOneAndUpdate(
//       { userId },
//       { $set: initialResumeData, $setOnInsert: { userId } },
//       { new: true, upsert: true }
//     );

//     return res.json({
//       success: true,
//       message: "Resume reset successfully",
//       data: updatedDoc,
//     });
//   } catch (error) {
//     console.error("resetResume error:", error);
//     return res.status(500).json({ success: false, message: error.message });
//   }
// }

// export { getResume, createNewResume, updateResume, resetResume }



















