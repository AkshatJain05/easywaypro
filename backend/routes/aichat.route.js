import express from "express";
import { aiChat } from "../controllers/aichat.controller.js";

const router = express.Router();

router.post("/", aiChat);

export default router;