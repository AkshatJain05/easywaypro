import express from "express";
import mongoose from "mongoose";
import {User} from "../models/user.model.js";
import { isAdmin, protect ,teacherOrAdmin} from "../middlewares/auth.middlerware.js";

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


/**
 * @route   PATCH /api/admin/users/:userId/role
 * @desc    Securely update a user's role using a master password from .env
 * @access  Private/Admin
 */
router.patch("/users/:userId/role", protect, isAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { role, password } = req.body;

    // 1. Validate User ID format to prevent Mongoose cast crashes
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID format." });
    }

    // 2. Structural Payload Validation
    if (!role || !password) {
      return res.status(400).json({ 
        message: "Missing parameters. Target role and authorization verification password are required." 
      });
    }

    const normalizedRole = role.toLowerCase();
    const validRoles = ["student", "teacher", "admin"];
    if (!validRoles.includes(normalizedRole)) {
      return res.status(400).json({ 
        message: `Invalid role assignment. Must be one of: ${validRoles.join(", ")}` 
      });
    }

    // 3. Verify incoming password against .env
    const systemMasterPassword = process.env.ADMIN_ACTION_PASSWORD;
    
    if (!systemMasterPassword) {
      console.error("CRITICAL: ADMIN_ACTION_PASSWORD is not defined in .env");
      return res.status(500).json({ message: "Server configuration error. Master password system is offline." });
    }

    if (password !== systemMasterPassword) {
      return res.status(401).json({ 
        message: "Security authorization failed. Incorrect action confirmation password." 
      });
    }

    // 4. Locate and Update
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ message: "Target user not found." });
    }

    // 5. Update only the role property
    targetUser.role = normalizedRole;
    
    // Saves successfully. Because user.password is untouched, your pre-save hook skips re-hashing.
    await targetUser.save();

    return res.status(200).json({
      success: true,
      message: `Account clearance for [${targetUser.name}] updated to [${normalizedRole}] successfully.`,
      data: { 
        userId: targetUser._id, 
        role: targetUser.role 
      }
    });

  } catch (error) {
    console.error("Role Update Error Sequence:", error);
    return res.status(500).json({ message: error.message });
  }
});

export default router;
