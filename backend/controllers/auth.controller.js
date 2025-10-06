import { User } from "../models/user.model.js";
import { generateToken } from "../utils/generateToken.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Fetch user
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    // Compare password
    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    // Generate JWT + cookie
    const token = generateToken(user._id);
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // only https in prod
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000, // 1 days
    });

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePhoto: user.profilePhoto,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Fetch user
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    // Check role
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Not an admin." });
    }

    // Compare password
    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    // Generate JWT + cookie
    const token = generateToken(user._id);
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // only https in prod
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000, // 1 days
    });

    res.json({
      message: "Admin Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePhoto: user.profilePhoto,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const logout = async (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
  });
  res.json({ message: "Logout successful" });
};

const authMe = async (req, res) => {
  const token = req.cookies.jwt;
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("decoded", decoded);
    const user = await User.findById(decoded?.userId).select("-password");
    res.json({ user: user });
  } catch {
    res.status(401).json({ message: "Invalid token" });
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
};
