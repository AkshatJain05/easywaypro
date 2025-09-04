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
  origin:["https://easywaypro.onrender.com","http://localhost:5173"],// your frontend origin
  credentials: true               // allow cookies
}));
app.use(cookieParser());
app.use(express.static("public"));

import userRouter from "./routes/user.route.js"
import resouceRouter from "./routes/resource.routes.js"
import roadmapRouter from "./routes/roadmap.route.js"
import aiChatRouter from "./routes/aichat.route.js"
import resumeRouter from "./routes/resume.route.js"
import codeAnalyzerRouter from "./routes/codeAnalyze.route.js"
import taskRouter from "./routes/task.routes.js"  
import contactRouter from "./routes/contact.route.js"
import adminRouter from "./routes/admin.route.js"
app.use("/api/auth",userRouter);
app.use("/api/resources",resouceRouter);
app.use("/api/roadmap",roadmapRouter);
app.use("/api/chat", aiChatRouter);
app.use("/api/resumes", resumeRouter);
app.use("/api/code",codeAnalyzerRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/contacts", contactRouter);
app.use("/api/admin",adminRouter)


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
