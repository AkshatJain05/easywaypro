import express from "express";
import {
  getCourses, getCourse, createCourse, updateCourse,
  deleteCourse, getAllCoursesAdmin, addZoomSession
} from "../controllers/course.controller.js";
import { protect, isAdmin, teacherOrAdmin } from "../middlewares/auth.middlerware.js";

const router = express.Router();

router.get("/", protect, getCourses);
router.get("/public", getCourses);
router.get("/admin/all", protect,teacherOrAdmin, getAllCoursesAdmin);
router.get("/:id", protect, getCourse);
router.post("/", protect, teacherOrAdmin, createCourse);
router.put("/:id", protect, teacherOrAdmin, updateCourse);
router.delete("/:id", protect, isAdmin, deleteCourse);
router.post("/:id/zoom", protect, teacherOrAdmin, addZoomSession);

export default router;
