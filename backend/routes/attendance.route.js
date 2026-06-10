import express from "express";
import { markAttendance, toggleSession } from "../controllers/attendance.controller.js";
import { protect, isAdmin ,teacherOrAdmin} from "../middlewares/auth.middlerware.js";

const router = express.Router();

router.post("/mark", protect, markAttendance);
router.put("/session/:id/toggle", protect,teacherOrAdmin, toggleSession);

export default router;
