import { Chat } from "../models/chat.model.js"; // Mongoose model
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Chat with AI
export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user._id;

    if (!userId || !message) {
      return res.status(400).json({ error: "userId and message required" });
    }

    // Fetch last 5 messages for context
    let chat = await Chat.findOne({ userId });
    const history = chat
      ? chat.messages.slice(-5).map(m => `${m.sender}: ${m.text}`).join("\n")
      : "";

    // System prompt acts like trained mentor
    const systemPrompt = `
You are an AI mentor for B.Tech students. 
- Help in DSA, Java, MERN, SQL, and Final Year Project ideas.  
- Explain step by step with headings and code examples.  
- Wrap code in \`\`\`language blocks.  
- Be friendly and motivating.
`;

    // Combine prompt + history + user message
    const input = `${systemPrompt}\n\nConversation so far:\n${history}\n\nUser: ${message}\nAI:`;

    // Generate response using Gemini
    const result = await model.generateContent(input);
    const reply = result.response.text();

    // Determine if response contains code
    const responseMsg = {
      sender: "bot",
      text: reply,
      type: reply.includes("```") ? "code" : "text",
      lang: reply.match(/```(\w+)/)?.[1] || "plaintext",
    };

    // Save chat to DB
    if (!chat) chat = new Chat({ userId, messages: [] });
    chat.messages.push({ sender: "user", text: message, type: "text" });
    chat.messages.push(responseMsg);
    await chat.save();

    res.json({ reply, chat });
  } catch (error) {
    console.error("ChatController Error:", error);
    res.status(500).json({ error: "AI response failed" });
  }
};

// Fetch chat history
export const getChatHistory = async (req, res) => {
  try {
    const userId = req.user?._id;
    const chat = await Chat.findOne({ userId });
    res.json(chat || { messages: [] });
  } catch (error) {
    console.error("ChatController History Error:", error);
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
};

export const deleteChatHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    await Chat.deleteOne({ userId });
    res.json({ message: "Chat history deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete chat history" });
  }
}
