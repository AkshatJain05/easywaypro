import { User } from "../models/user.model.js";
import { generateToken } from "../utils/generateToken.js";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ================== REGISTER ==================
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    await User.create({ name, email, password });
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    // ── TARGET LOCATION: REPLACE OLD SAVE TRACKING HERE ──────────
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false }); // 👈 Stops validation errors on other fields
    // ─────────────────────────────────────────────────────────────

    const token = generateToken(user._id);

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", 
      maxAge: 24 * 60 * 60 * 1000, 
    });

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePhoto: user.profilePhoto,
        role: user.role,
        lastLogin: user.lastLogin, 
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================== ADMIN LOGIN ==================
const adminLogin = async (req, res) => {
  try {
    const { email, password, role } = req.body; // 'role' parameter passed dynamically from the segment switcher

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 1. Structural Check: Ensure the user's role belongs to the authorized group matrix
    const authorizedRoles = ["admin", "teacher"];
    if (!authorizedRoles.includes(user.role)) {
      return res.status(403).json({ message: "Access denied. Unauthorized role permissions." });
    }

    // 2. Cross-Verification: Validate that the client form intent matches the true database profile schema
    if (role && user.role !== role.toLowerCase()) {
      return res.status(403).json({ 
        message: `Access denied. Selected identity profile does not match your credentials.` 
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // ── TELEMETRY INJECTION ──
    // Captures access telemetry safely, bypassing restrictive schema modification rules
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false }); 
    // ─────────────────────────

    const token = generateToken(user._id);

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Dynamic clean naming text for the payload formatting output block
    const userDisplayRole = user.role.charAt(0).toUpperCase() + user.role.slice(1);

    res.json({
      message: `${userDisplayRole} Login successful`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePhoto: user.profilePhoto,
        role: user.role,
        lastLogin: user.lastLogin, // Populates frontend dashboard tracking indicators flawlessly
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================== LOGOUT ==================
const logout = async (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  res.json({ message: "Logout successful" });
};

// ================== AUTH ME ==================
const authMe = async (req, res) => {
  const token = req.cookies.jwt;
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded?.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

// ================== GOOGLE LOGIN ==================
const googleLogin = async (req, res) => {
  try {
    const { tokenId } = req.body;
    if (!tokenId) return res.status(400).json({ message: "Token missing" });

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name, picture, sub } = ticket.getPayload();

    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name,
        email,
        profilePhoto: picture,
        role: "student",
        googleUID: sub,
      });
    } else if (!user.googleUID) {
      user.googleUID = sub;
      if (!user.profilePhoto) user.profilePhoto = picture;
      await user.save();
    }

    // Issue JWT + cookie
    const token = generateToken(user._id);
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: "Google login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePhoto: user.profilePhoto,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Google login error:", err);
    res.status(500).json({ message: "Google login failed" });
  }
};


const resetPassword = async (req, res) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetToken: hashedToken,
    resetTokenExpire: { $gt: Date.now() },
  });

  if (!user)
    return res.status(400).json({ message: "Token invalid or expired" });

  user.password = req.body.password; // hashed automatically
  user.resetToken = undefined;
  user.resetTokenExpire = undefined;
  await user.save();

  res.json({ message: "Password reset successful" });
};

const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    //  Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    //  Generate secure reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false }); // skip unnecessary validation

    //  Construct reset URL (use HTTPS in production)
    const resetURL = `https://easywaypro.onrender.com/reset-password/${resetToken}`;

    //  Create Nodemailer transporter (Gmail)
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      port: 465, // SSL port
      secure: true, // SSL/TLS from start
      auth: {
        user: process.env.EMAIL_USER, // Gmail address
        pass: process.env.EMAIL_PASS, // Gmail App Password
      },
    });

    //  Compose email (styled HTML)
    const message = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
        <h2>Password Reset Request</h2>
        <p>Hello,</p>
        <p>We received a request to reset your password for your account.</p>
        <p>Click the button below to reset your password. This link is valid for <strong>10 min</strong>.</p>
        <a href="${resetURL}" 
           style="
             display: inline-block;
             padding: 10px 20px;
             margin: 10px 0;
             background-color: #1a73e8;
             color: #ffffff;
             text-decoration: none;
             border-radius: 5px;
           ">
          Reset Password
        </a>
        <p>If you did not request a password reset, you can safely ignore this email.</p>
      </div>
    `;

    // Send email
    await transporter.sendMail({
      from: `"Easyway Pro" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request",
      html: message,
    });

    // Respond to frontend
    res
      .status(200)
      .json({ message: "A password reset link has been sent to your email." });
  } catch (error) {
    console.error("Error sending password reset email:", error);
    res
      .status(500)
      .json({ message: "Error sending email, please try again later." });
  }
};

export {
  register,
  login,
  logout,
  authMe,
  adminLogin,
  resetPassword,
  forgetPassword,
  googleLogin,
};
