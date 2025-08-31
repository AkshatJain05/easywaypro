import express from "express";
import dotenv from "dotenv";
import cors from "cors"
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin:"http://localhost:5173",// your frontend origin
  credentials: true               // allow cookies
}));
app.use(cookieParser());
app.use(express.static("public"));

import userRouter from "./routes/user.route.js"
import resouceRouter from "./routes/resursce.route.js"
import roadmapRouter from "./routes/roadmap.route.js"
import aiChatRouter from "./routes/aichat.route.js"
app.use("/api/auth",userRouter);
app.use("/api/resources",resouceRouter);
app.use("/api/roadmap",roadmapRouter);
app.use("/api/chat", aiChatRouter);

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Connect DB first, then start server
const startServer = async () => {
  try {
    await connectDB(); // connect to MongoDB
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1); // exit if DB connection fails
  }
};

startServer();
