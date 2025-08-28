import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // force HTTPS
});

// ✅ Upload file (PDF / Docs / Images / Videos)
const uploadOnCloudinary = async (localFilePath, folderName = "resources") => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "raw", // important for PDFs
      folder: folderName,
    });

    fs.unlinkSync(localFilePath); // remove local file after upload

    return {
      fileUrl: response.secure_url,
      publicId: response.public_id,
      format: response.format,
      bytes: response.bytes,
    };
  } catch (error) {
    if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
    console.error("❌ Cloudinary Upload Error:", error.message);
    return null;
  }
};

// ✅ Delete from Cloudinary
const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "raw",
    });
    return result;
  } catch (error) {
    console.error("❌ Cloudinary Delete Error:", error.message);
    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
