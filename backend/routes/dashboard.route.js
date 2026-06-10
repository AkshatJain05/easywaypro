import express from "express";
import { getMyDashboard, getMyAttendance, getMyCertificates } from "../controllers/dashboard.controller.js";
import { protect } from "../middlewares/auth.middlerware.js";

const router = express.Router();

router.get("/", protect, getMyDashboard);
router.get("/attendance", protect, getMyAttendance);
router.get("/certificates", protect, getMyCertificates);

export default router;
