import { AttendanceSession } from "../models/attendance.model.js";
import { Purchase } from "../models/purchase.model.js";

// Student marks attendance with poll code
export const markAttendance = async (req, res) => {
  try {
    const { pollCode } = req.body;
    const session = await AttendanceSession.findOne({ pollCode, isActive: true });
    if (!session) return res.status(404).json({ success: false, message: "Invalid or expired attendance code" });

    // Check if user purchased the course
    const purchase = await Purchase.findOne({ user: req.user._id, course: session.course, status: "completed" });
    if (!purchase) return res.status(403).json({ success: false, message: "You haven't purchased this course" });

    // Check if already marked
    const alreadyMarked = session.attendees.some((a) => a.user.toString() === req.user._id.toString());
    if (alreadyMarked) return res.status(400).json({ success: false, message: "Attendance already marked" });

    session.attendees.push({ user: req.user._id });
    await session.save();

    res.json({ success: true, message: "Attendance marked successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin toggle session active/inactive
export const toggleSession = async (req, res) => {
  try {
    const session = await AttendanceSession.findById(req.params.id);
    if (!session) return res.status(404).json({ success: false, message: "Session not found" });
    session.isActive = !session.isActive;
    await session.save();
    res.json({ success: true, session });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
