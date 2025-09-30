import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

// Ensure the API key is loaded
if (!process.env.GEMINI_API_KEY) {
  console.error("Error: GEMINI_API_KEY is not set in your .env file.");
  process.exit(1); // Exit the process if the key is missing
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Initialize a chat session outside the request handler
// This allows for maintaining conversational context across multiple turns
// For a production application, you'd likely store this in a user session or database
let chatSession;

const aiChat = async (req, res) => {
  const { message } = req.body;
  // console.log("Received message:", message);

  if (!message || typeof message !== 'string' || message.trim() === '') {
    return res.status(400).json({ error: "Message is required and cannot be empty." });
  }

  try {
    // Get the generative model
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    // "Training" prompt for resume + career roadmap expert
    const systemPrompt = `You are Easyway AI, a smart assistant for a resume builder.
Your role is to generate professional, clear, and resume-ready text.
Only answer questions related to resumes, education, skills, projects, internships, coding preparation, placements, and career guidance.

Rules:
Career Objective → Write 3-4 short professional lines.
Skills → Group into categories like Technical Skills, Programming Languages, Frontend, Backend, Soft Skills, and Tools.
Projects → List in points with short descriptions (2–3 lines each, including technologies used and outcome).
Education → Mention degree, university/institute, and duration in resume style.
Work Experience → Give role and 2–3 short responsibilities. If none, suggest internship-style content.
Certifications → List 1–3 relevant certifications with issuing authority.
Roadmaps / Coding Prep → Give clear step-by-step or list-style guidance.
Always keep answers short for chatbot replies, longer only if user asks for detail.

If a query is unrelated, reply with:
"I can only help with resume, education, coding, projects, and career-related topics."

Tone: Simple, formal, encouraging, and student-friendly.`;

    // Initialize chat session if it doesn't exist
    // This maintains conversation history.
    if (!chatSession) {
      chatSession = model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: systemPrompt }], // Send the system prompt as the first user message
          },
          {
            role: "model",
            parts: [{ text: "Hello! I'm Easyway AI. How can I assist you with your career today?" }], // Initial model response
          },
        ],
        generationConfig: {
          maxOutputTokens: 2000, // Set a reasonable limit for output tokens
        },
      });
    }

    // Send the user's message to the chat session
    const result = await chatSession.sendMessage(message);
    const responseText = result.response.text();

    if (!responseText) {
      return res.status(500).json({ error: "Gemini API returned an empty response." });
    }

    res.json({ reply: responseText });

  } catch (err) {
    console.error("Gemini API error:", err);

    // Differentiate between API errors and other errors
    if (err.name === 'GoogleGenerativeAIError') {
      res.status(502).json({ error: `Gemini API specific error: ${err.message}` });
    } else {
      res.status(500).json({ error: "An unexpected error occurred while processing your request." });
    }
  }
};

export { aiChat };