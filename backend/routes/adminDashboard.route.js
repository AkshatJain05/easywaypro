import express from "express";
import {
  getRevenueDashboard, getAllPurchases, getAllUsers,
  getUserActivity, createAttendanceSession, getAttendanceSessions
} from "../controllers/admin.controller.js";
import { protect, isAdmin ,teacherOrAdmin} from "../middlewares/auth.middlerware.js";

const router = express.Router();

router.use(protect);

router.get("/revenue",isAdmin, getRevenueDashboard);
router.get("/purchases",isAdmin, getAllPurchases);
router.get("/users",teacherOrAdmin, getAllUsers);
router.get("/users/:userId/activity",teacherOrAdmin, getUserActivity);
router.post("/attendance/session",teacherOrAdmin, createAttendanceSession);
router.get("/attendance/sessions", teacherOrAdmin, getAttendanceSessions);

export default router;
