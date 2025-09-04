import express from "express";
import {User} from "../models/user.model.js";
import { isAdmin, protect } from "../middlewares/auth.middlerware.js";

const router = express.Router();

// GET /api/admin/users -> get all users
router.get("/users",protect,isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password"); // exclude password
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// GET /api/admin/users/count -> get total number of users
router.get("/users/count",protect,isAdmin, async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user count" });
  }
});

export default router;
