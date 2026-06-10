import express from "express";
import {
  createOrder, verifyPayment, getReceipt, renewCourse, updateProgress
} from "../controllers/purchase.controller.js";
import { protect } from "../middlewares/auth.middlerware.js";

const router = express.Router();

router.post("/create-order", protect, createOrder);
router.post("/verify", protect, verifyPayment);
router.post("/renew", protect, renewCourse);
router.post("/progress", protect, updateProgress);
router.get("/receipt/:id", protect, getReceipt);

export default router;
