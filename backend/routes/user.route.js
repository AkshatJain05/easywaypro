import express from "express";
<<<<<<< HEAD
import { adminLogin, authMe, login, logout, register } from "../controllers/auth.controller.js";
=======
import { authMe, login, logout, register,adminLogin } from "../controllers/auth.controller.js";
>>>>>>> fbcd73d17be362ee68a9a92f8e48d3c696f0d5ac
import {protect} from "../middlewares/auth.middlerware.js";
import { getProfile, updateProfile } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js";

const router = express.Router();

router.post("/login",login);
router.post("/admin/login",adminLogin)
router.post("/register",register);
router.post("/logout",logout);
// Get logged-in user profile
router.get("/profile", protect, getProfile);

// Update user profile
router.put("/profile", protect, upload.single("profilePhoto"), updateProfile);
router.get("/me",authMe);

//admin Login
router.post("/admin/login",adminLogin);

export default router;
