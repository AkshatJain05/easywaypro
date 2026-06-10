import { Purchase } from "../models/purchase.model.js";
import { AttendanceSession } from "../models/attendance.model.js";
import { Certificates } from "../models/certificateCourse.model.js";

// Get user's purchased courses with full details
export const getMyDashboard = async (req, res) => {
  try {
    const purchases = await Purchase.find({ user: req.user._id, status: "completed" })
      .populate({
        path: "course",
        select: "title thumbnail instructor zoomSchedule whatsappSupport validityDays lessons category",
      })
      .sort({ purchasedAt: -1 });

    // Mark expired
    for (const p of purchases) {
      if (p.expiresAt && new Date() > p.expiresAt) {
        p.isExpired = true;
        await p.save();
      }
    }

    res.json({ success: true, purchases });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get attendance for user's courses
export const getMyAttendance = async (req, res) => {
  try {
    const purchases = await Purchase.find({ user: req.user._id, status: "completed" }).select("course");
    const courseIds = purchases.map((p) => p.course);

    const sessions = await AttendanceSession.find({ course: { $in: courseIds } })
      .populate("course", "title")
      .sort({ date: -1 });

    const sessionsWithAttendance = sessions.map((s) => ({
      ...s.toObject(),
      attended: s.attendees.some((a) => a.user.toString() === req.user._id.toString()),
    }));

    res.json({ success: true, sessions: sessionsWithAttendance });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get my certificates
export const getMyCertificates = async (req, res) => {
  try {
    const certs = await Certificates.find({ user: req.user._id })
      .populate("course", "title instructor thumbnail")
      .sort({ issuedAt: -1 });
    res.json({ success: true, certificates: certs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
