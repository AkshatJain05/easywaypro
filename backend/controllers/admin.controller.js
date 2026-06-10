import { Purchase } from "../models/purchase.model.js";
import { Course } from "../models/course.model.js";
import { User } from "../models/user.model.js";
import { AttendanceSession } from "../models/attendance.model.js";

// Revenue dashboard
export const getRevenueDashboard = async (req, res) => {
  try {
    const [totalRevenue] = await Purchase.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalCourses = await Course.countDocuments();
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalPurchases = await Purchase.countDocuments({
      status: "completed",
    });
    const activePurchases = await Purchase.countDocuments({
      status: "completed",
      $or: [{ expiresAt: { $gt: new Date() } }, { expiresAt: null }],
    });
    const expiredPurchases = await Purchase.countDocuments({
      status: "completed",
      expiresAt: { $lt: new Date() },
    });

    // Revenue per course
    const revenuePerCourse = await Purchase.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: "$course",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "courses",
          localField: "_id",
          foreignField: "_id",
          as: "course",
        },
      },
      { $unwind: "$course" },
      { $project: { title: "$course.title", total: 1, count: 1 } },
      { $sort: { total: -1 } },
    ]);

    // Monthly revenue (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const monthlyRevenue = await Purchase.aggregate([
      { $match: { status: "completed", purchasedAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: "$purchasedAt" },
            month: { $month: "$purchasedAt" },
          },
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.json({
      success: true,
      stats: {
        totalRevenue: totalRevenue?.total || 0,
        totalCourses,
        totalStudents,
        totalPurchases,
        activePurchases,
        expiredPurchases,
      },
      revenuePerCourse,
      monthlyRevenue,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// All purchases
export const getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find({ status: "completed" })
      .populate("user", "name email phoneNo")
      .populate("course", "title price")
      .sort({ purchasedAt: -1 });
    res.json({ success: true, purchases });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// All users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ lastLogin: -1, createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// User activity
export const getUserActivity = async (req, res) => {
  try {
    const purchases = await Purchase.find({ user: req.params.userId })
      .populate("course", "title thumbnail")
      .sort({ lastAccessed: -1 });
    res.json({ success: true, purchases });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Create attendance session
export const createAttendanceSession = async (req, res) => {
  try {
    const { courseId, title, date, zoomLink } = req.body;
    const pollCode = Math.random().toString(36).substr(2, 8).toUpperCase();
    const session = await AttendanceSession.create({
      course: courseId,
      title,
      date,
      zoomLink,
      pollCode,
      isActive: true,
      createdBy: req.user._id,
    });
    res.status(201).json({ success: true, session });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all attendance sessions
export const getAttendanceSessions = async (req, res) => {
  try {
    const sessions = await AttendanceSession.find()
      .populate("course", "title")
      .populate("attendees.user", "name email")
      .sort({ date: -1 });
    res.json({ success: true, sessions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

