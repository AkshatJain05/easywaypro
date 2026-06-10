import express from "express";
import multer from "multer"; // Import Multer to catch file data
import {
  getAllDocs,
  getDocById,
  createDoc,
  updateDoc,
  deleteDoc,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  addAnswer,
  uploadAnswerImage, // Import your new standalone image upload controller
} from "../controllers/docs.controller.js";

import { protect, isAdmin, teacherOrAdmin } from "../middlewares/auth.middlerware.js";

const router = express.Router();

// --- MULTER SETUP ---
// Configures local storage dynamically for incoming temporary files
const upload = multer({ dest: "uploads/" });

/* =========================================================
    🖼️ ASSET UPLOAD ROUTES
========================================================= */
// Standalone route matching your frontend layout setup
router.post(
  "/upload-image", 
  protect, 
  teacherOrAdmin, 
  upload.single("image"), 
  uploadAnswerImage
);


/* =========================================================
    📘 DOC ROUTES
========================================================= */
router.get("/", protect, getAllDocs);
router.get("/:id", protect, getDocById);
router.post("/", protect, teacherOrAdmin, createDoc);
router.put("/:id", protect, teacherOrAdmin, updateDoc);
router.delete("/:id", protect, isAdmin, deleteDoc);


/* =========================================================
    📙 QUESTION ROUTES
========================================================= */
router.post("/:id/questions", protect, teacherOrAdmin, addQuestion);
router.put("/:id/questions/:qid", protect, teacherOrAdmin, updateQuestion);
router.delete("/:id/questions/:qid", protect, teacherOrAdmin, deleteQuestion);


/* =========================================================
    🧾 ANSWER ROUTES
========================================================= */
// Keeps your existing structure intact. Your frontend uploads the image to 
// /upload-image first, then hits this route sending the structured JSON.
router.post("/:id/questions/:qid/answers", protect, teacherOrAdmin, addAnswer);

export default router;






// import express from "express";
// import {
//   getAllDocs,
//   getDocById,
//   createDoc,
//   updateDoc,
//   deleteDoc,
//   addQuestion,
//   updateQuestion,
//   deleteQuestion,
//   addAnswer,
// } from "../controllers/docs.controller.js";

// import { protect, isAdmin,teacherOrAdmin } from "../middlewares/auth.middlerware.js";

// const router = express.Router();

// // --- DOC ROUTES ---
// router.get("/", protect, getAllDocs);
// router.get("/:id", protect, getDocById);
// router.post("/", protect, teacherOrAdmin,createDoc);
// router.put("/:id", protect,teacherOrAdmin, updateDoc);
// router.delete("/:id", protect, isAdmin, deleteDoc);

// // --- QUESTION ROUTES ---
// router.post("/:id/questions", protect,teacherOrAdmin, addQuestion);
// router.put("/:id/questions/:qid", protect,teacherOrAdmin, updateQuestion);
// router.delete("/:id/questions/:qid", protect,teacherOrAdmin, deleteQuestion);

// // --- ANSWER ROUTES ---
// router.post("/:id/questions/:qid/answers", protect,teacherOrAdmin, addAnswer);

// export default router;
