import jwt from "jsonwebtoken";
import {User} from "../models/user.model.js";


export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.jwt; // get token from cookie
    if (!token) return res.status(401).json({ message: "Not authorized, no token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select("-password");

    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as an admin" });
  }
};



// Teacher or Admin
export const teacherOrAdmin = (req, res, next) => {
  if (!["teacher", "admin"].includes(req.user?.role)) {
    return res.status(403).json({ success: false, message: "Teacher or Admin access required" });
  }
  next();
};


// Verify course purchase
export const hasPurchased = async (req, res, next) => {
  try {
    const courseId = req.params.courseId || req.body.courseId;
    const purchase = await Purchase.findOne({
      user: req.user._id,
      course: courseId,
      status: "completed",
    });
    if (!purchase) {
      return res.status(403).json({ success: false, message: "Please purchase this course to access content" });
    }
    // Check expiry
    if (purchase.expiresAt && new Date() > purchase.expiresAt) {
      purchase.isExpired = true;
      await purchase.save();
      return res.status(403).json({ success: false, message: "Your course access has expired. Please renew." });
    }
    req.purchase = purchase;
    next();
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};