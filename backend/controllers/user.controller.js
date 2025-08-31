import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Get user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // console.log("Request body:", req.body);
    // console.log("Uploaded file:", req.file);

    let uploaded = null;
    if (req.file) {
      // Local file path from multer
      const filePath = req.file.path;
      console.log("File path:", filePath);

      // Upload to Cloudinary
      uploaded = await uploadOnCloudinary(filePath, "profile");
      if (!uploaded) {
        return res.status(500).json({ error: "Cloudinary upload failed" });
      }
    }

    // Update allowed fields
    user.name = req.body.name || user.name;
    user.phoneNo = req.body.phoneNo || user.phoneNo;
    user.profilePhoto = uploaded?.fileUrl || user.profilePhoto;
    user.CollegeName = req.body.CollegeName || user.CollegeName;
    user.Course = req.body.Course || user.Course;
    user.BranchName = req.body.BranchName || user.BranchName;
    user.YearOfStudy = req.body.YearOfStudy || user.YearOfStudy;

    // If password is provided, hash automatically (handled in schema middleware)
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      phoneNo: updatedUser.phoneNo,
      profilePhoto: updatedUser.profilePhoto,
      CollegeName: updatedUser.CollegeName,
      Course: updatedUser.Course,
      BranchName: updatedUser.BranchName,
      YearOfStudy: updatedUser.YearOfStudy,
      role: updatedUser.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
