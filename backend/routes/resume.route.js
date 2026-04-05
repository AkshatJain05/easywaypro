import express from "express";
import { protect } from "../middlewares/auth.middlerware.js";
import {
  getResumes,
  getSingleResume,
  createNewResume,
  updateResume,
  deleteResume,
  resetResume,
  duplicateResume,

} from "../controllers/resume.controller.js";

const router = express.Router();


router.get("/", protect, getResumes);
router.get("/:id", protect, getSingleResume);
router.post("/", protect, createNewResume);
router.put("/:id", protect, updateResume);
router.delete("/:id", protect, deleteResume);
router.put("/reset/:id", protect, resetResume);
router.post("/duplicate/:id", protect, duplicateResume);



export default router;




// import express from "express";
// import { protect } from "../middlewares/auth.middlerware.js";
// import {
//   getResume,
//   createNewResume,
//   updateResume,
//   resetResume,
// } from "../controllers/resume.controller.js";

// const router = express.Router();

// // Get resume by ID
// router.get("/", protect, getResume);

// // Create new resume
// router.post("/", protect, createNewResume);

// // Update resume
// router.put("/:id", protect, updateResume);

// // Reset resume
// router.post("/reset", protect, resetResume);


// export default router;










