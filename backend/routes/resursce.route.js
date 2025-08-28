import { upload } from "../middlewares/multer.middleware.js";
import express from "express";
import {protect} from "../middlewares/auth.middlerware.js";
import {uploadResource, getResources, deleteResource} from "../controllers/resource.controller.js";
const router = express.Router();

router.post("/upload", upload.single("file"), uploadResource);
router.get("/", protect, getResources);
router.delete("/:id", protect, deleteResource);

export default router;
