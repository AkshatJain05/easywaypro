import express from "express";
import { isAdmin, protect } from "../middlewares/auth.middlerware.js";
import { addNewResources, deleteResources, getAllResources } from "../controllers/resource.controller.js";

const router = express.Router();

// GET all resources (optionally filtered by type)
router.get("/", getAllResources);

// POST a new resource (admin)
router.post("/",protect,isAdmin,addNewResources );

// DELETE /api/resources/:id
router.delete("/:id",protect,isAdmin,deleteResources );



export default router;
