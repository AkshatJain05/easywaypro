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


// @desc    Get Monthly User Growth (Last 6 Months)
// @route   GET /api/admin/stats/growth
router.get("/stats/growth", protect, isAdmin, async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1); // Start from the 1st of that month

    const growthData = await User.aggregate([
      {
        // 1. Filter users from the last 6 months
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        // 2. Group by Year and Month
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      {
        // 3. Sort chronologically
        $sort: { "_id.year": 1, "_id.month": 1 }
      },
      {
        // 4. Project into a cleaner format
        $project: {
          _id: 0,
          month: "$_id.month",
          year: "$_id.year",
          users: "$count"
        }
      }
    ]);

    // Optional: Helper to map month numbers to Names (e.g., 1 -> "Jan")
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedData = growthData.map(item => ({
      name: monthNames[item.month - 1],
      users: item.users
    }));

    res.status(200).json({ success: true, data: formattedData });
  } catch (err) {
    res.status(500).json({ success: false, message: "Growth tracking failed" });
  }
});

export default router;
