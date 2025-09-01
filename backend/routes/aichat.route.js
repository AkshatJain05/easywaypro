import express from "express";
import { aiChat } from "../controllers/aichat.controller.js";
import { protect } from "../middlewares/auth.middlerware.js";

const router = express.Router();

router.post("/", protect, aiChat);

export default router;