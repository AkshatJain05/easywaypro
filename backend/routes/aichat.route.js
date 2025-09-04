import express from "express";
import { aiChat } from "../controllers/aichat.controller.js";
import { protect } from "../middlewares/auth.middlerware.js";
import { chatWithAI, deleteChatHistory, getChatHistory } from "../controllers/chatController.js";

const router = express.Router();

router.post("/", protect, aiChat);
router.post("/aichat",protect,chatWithAI)
router.get("/history", protect, getChatHistory);
router.delete("/history", protect, deleteChatHistory);

export default router;