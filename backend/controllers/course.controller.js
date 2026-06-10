import { Course } from "../models/course.model.js";
import { Purchase } from "../models/purchase.model.js";

// Public - Get all published courses
export const getCourses = async (req, res) => {
  try {
    const { category, level, search } = req.query;
    const filter = { isPublished: true };
    if (category) filter.category = category;
    if (level) filter.level = level;
    if (search) filter.title = { $regex: search, $options: "i" };

    const courses = await Course.find(filter).select("-lessons").sort({ createdAt: -1 });
    res.json({ success: true, courses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Public - Get single course
export const getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate("createdBy", "name email");
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });

    // Hide lesson videos if not purchased
    let courseData = course.toObject();
    if (req.user) {
      const purchase = await Purchase.findOne({ user: req.user._id, course: course._id, status: "completed" });
      if (!purchase || (purchase.expiresAt && new Date() > purchase.expiresAt)) {
        courseData.lessons = courseData.lessons.map((l) => ({ ...l, videoUrl: null }));
        courseData.isPurchased = false;
      } else {
        courseData.isPurchased = true;
        courseData.purchase = purchase;
      }
    } else {
      courseData.lessons = courseData.lessons.map((l) => ({ ...l, videoUrl: null }));
      courseData.isPurchased = false;
    }

    res.json({ success: true, course: courseData });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin - Create course
export const createCourse = async (req, res) => {
  try {
    const course = await Course.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, message: "Course created", course });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin - Update course
export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });
    res.json({ success: true, message: "Course updated", course });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin - Delete course
export const deleteCourse = async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Course deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin - Get all courses
export const getAllCoursesAdmin = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json({ success: true, courses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Add zoom session
export const addZoomSession = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { $push: { zoomSchedule: req.body } },
      { new: true }
    );
    res.json({ success: true, course });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
