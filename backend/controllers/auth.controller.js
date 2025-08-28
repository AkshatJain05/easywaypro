import {User} from "../models/user.model.js";
import { generateToken } from "../utils/generateToken.js";

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

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
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    // Compare password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    // Generate JWT + cookie
    const token = generateToken(user._id);
      res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "production", // only https in prod
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 days
    });

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const logout = async(req,res)=>{
    res.clearCookie("jwt", {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "production",
        sameSite: "strict"
    });
    res.json({ message: "Logout successful" });
}

export { register, login, logout };
