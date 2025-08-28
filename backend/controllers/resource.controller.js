import { Resource } from "../models/resource.model.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";

// 📌 Upload Resource (Notes / PYQ / Roadmap / VideoLecture)
export const uploadResource = async (req, res) => {
  try {
    const { title, subject, category, description } = req.body;

    // multer gives file path
    const filePath = req.file?.path;
    if (!filePath) {
      return res.status(400).json({ error: "File is required" });
    }

    // Upload to Cloudinary
    const uploaded = await uploadOnCloudinary(filePath, category);
    if (!uploaded) {
      return res.status(500).json({ error: "Cloudinary upload failed" });
    }

    // Save in DB
    const resource = await Resource.create({
      title,
      subject,
      category,
      description,
      fileUrl: uploaded.fileUrl,  // ✅ secure https URL
      publicId: uploaded.publicId, // ✅ for deletion
      uploadedBy: req.user?._id || null, // if you use auth
    });

    return res.status(201).json({
      message: "✅ Resource uploaded successfully",
      resource,
    });
  } catch (error) {
    console.error("❌ Upload Resource Error:", error);
    return res.status(500).json({ error: error.message });
  }
};

// 📌 Get All Resources (filter + pagination optional)
export const getResources = async (req, res) => {
  try {
    const { category, subject, limit = 20, page = 1 } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (subject) filter.subject = subject;

    const resources = await Resource.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    return res.json(resources);
  } catch (error) {
    console.error("❌ Get Resources Error:", error);
    return res.status(500).json({ error: error.message });
  }
};

// 📌 Delete Resource (from DB + Cloudinary)
export const deleteResource = async (req, res) => {
  try {
    const { id } = req.params;

    // Find resource
    const resource = await Resource.findById(id);
    if (!resource) {
      return res.status(404).json({ error: "Resource not found" });
    }

    // Delete from Cloudinary
    await deleteFromCloudinary(resource.publicId);

    // Delete from MongoDB
    await resource.deleteOne();

    return res.json({ message: "✅ Resource deleted successfully" });
  } catch (error) {
    console.error("❌ Delete Resource Error:", error);
    return res.status(500).json({ error: error.message });
  }
};
