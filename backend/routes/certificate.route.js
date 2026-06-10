import express from "express";
import { generateCertificate, adminIssueCertificate,verifyCertificate } from "../controllers/certificate.controller.js";
import { protect, isAdmin } from "../middlewares/auth.middlerware.js";

const router = express.Router();

router.get("/download/:courseId", protect, generateCertificate);
router.post("/issue", protect, isAdmin, adminIssueCertificate);
router.get("/verify/:id", verifyCertificate);

export default router;
