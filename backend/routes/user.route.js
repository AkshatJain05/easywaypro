import express from "express";
import { authMe, login, logout, register,adminLogin, forgetPassword, resetPassword ,googleLogin} from "../controllers/auth.controller.js";
import {protect} from "../middlewares/auth.middlerware.js";
import { getProfile, updateProfile } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js";

const router = express.Router();

router.post("/login",login);
router.post("/register",register);
router.post("/logout",logout);
router.post("/google", googleLogin);
// Get logged-in user profile
router.get("/profile", protect, getProfile);

// Update user profile
router.put("/profile", protect, upload.single("profilePhoto"), updateProfile);
router.get("/me",authMe);

//admin Login
router.post("/admin/login",adminLogin);

//reset password
router.post("/forgot-password",forgetPassword);
router.post("/reset-password/:token",resetPassword)

export default router;
