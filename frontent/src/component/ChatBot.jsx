import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { FaPaperPlane, FaComments, FaTimes } from "react-icons/fa";
import "../App.css";

// ✅ Pass "context" prop (resume, roadmap, notes, code, general)
export default function ChatBot({ context = "general" }) {
  const greetings = {
    resume: "Hi 👋, I’m Easyway AI! Want me to help you build or improve your resume?",
    roadmap: "Hey 🚀, I can guide you with your learning roadmap step by step. What topic are you focusing on?",
    notes: "Hello 📒, need help organizing your study notes or summarizing content?",
    code: "Hi 💻, stuck on code? I can debug, explain, or give you examples.",
    general: "Hello there 👋, I’m Easyway AI! Ask me anything — resume, roadmap, code, or notes."
  };

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: greetings[context] || greetings.general,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Format messages: handle headings, lists, normal text
  // Format messages: handle headings, lists, normal text
const formatMessage = (text) => {
  const lines = text.split("\n");

  return lines.map((line, i) => {
    const trimmed = line.trim();

    // Headings like **I. Core Technologies:**
    if (/^\*\*(.+)\*\*$/.test(trimmed) || /^\*\*(.+)\*\:/.test(trimmed)) {
      return (
        <h3
          key={i}
          className="font-semibold text-indigo-600 dark:text-indigo-400 text-sm mb-1"
        >
          {trimmed.replace(/^\*\*(.+)\*\*$/, "$1").replace(/^\*\*(.+)\*\:$/, "$1:")}
        </h3>
      );
    }

    // Normal text (remove any stray ** or *)
    return (
      <p key={i} className="text-sm mb-1">
        {trimmed.replace(/\*\*/g, "").replace(/\*/g, "")}
      </p>
    );
  });
};



  // auto-scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newMessage = { sender: "user", text: input, time };
    setMessages([...messages, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8000/api/chat", { message: input });
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: res.data.reply, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }
      ]);
    } catch (error) {
      setMessages((prev) => [...prev, { sender: "bot", text: "Server error, please try again.", time }]);
    }
    setLoading(false);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white p-4 rounded-full shadow-xl z-140"
      >
        <FaComments className="h-6 w-6" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-20 right-6 w-80 md:w-96 bg-white dark:bg-gray-900 shadow-2xl rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden z-120"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 flex justify-between items-center">
              <h2 className="font-semibold text-white">Easyway AI</h2>
              <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">
                <FaTimes />
              </button>
            </div>

            {/* Messages */}
            <div
              className="flex-1 p-3 overflow-y-auto space-y-3 
                        bg-gray-50 dark:bg-gray-800 rounded-b-2xl
                        min-h-[150px] max-h-[400px]"
              style={{ scrollBehavior: "smooth" }}
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col max-w-[75%] ${
                    msg.sender === "user" ? "ml-auto items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`px-3 py-2 rounded-2xl shadow-sm ${
                      msg.sender === "user"
                        ? "bg-indigo-600 text-white"
                        : "bg-white dark:bg-gray-700 dark:text-gray-200 text-gray-800 border dark:border-gray-600"
                    }`}
                  >
                    {msg.sender === "bot" ? formatMessage(msg.text) : msg.text}
                  </div>
                  <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {msg.time}
                  </span>
                </div>
              ))}

              {loading && <div className="text-gray-400 text-sm">Typing...</div>}

              {/* Keeps view locked at latest message */}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-2 flex items-center border-t bg-white dark:bg-gray-900 dark:border-gray-700">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type your message..."
                className="flex-1 border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
              />
              <button
                onClick={handleSend}
                className="ml-2 bg-indigo-600 dark:bg-indigo-500 text-white p-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 flex items-center justify-center"
              >
                <FaPaperPlane className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
