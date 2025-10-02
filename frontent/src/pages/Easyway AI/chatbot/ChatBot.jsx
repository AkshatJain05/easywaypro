import { useState, useEffect, useRef } from "react";
import {
  FaRobot,
  FaPaperPlane,
  FaArrowLeft,
  FaTrash,
  FaUserCircle,
  FaSpinner,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import axios from "axios";

// Helper component for the message bubble content
// It ensures text and code blocks are displayed sequentially
function ChatMessageContent({ text }) {
  // Parse message into paragraphs + code blocks
  const parseMessage = (message) => {
    const parts = [];
    // Regex to match code blocks: ```[lang]\n[code]```
    const codeRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let lastIndex = 0;
    let match;

    while ((match = codeRegex.exec(message)) !== null) {
      // Text before code block
      if (match.index > lastIndex) {
        const textPart = message.slice(lastIndex, match.index).trim();
        if (textPart) parts.push({ type: "text", content: textPart });
      }

      // Code block
      parts.push({
        type: "code",
        lang: match[1] || "javascript", // Default to 'javascript' if language not specified
        content: match[2].trim(), // Trim content inside the code block
      });

      lastIndex = codeRegex.lastIndex;
    }

    // Remaining text
    if (lastIndex < message.length) {
      const textPart = message.slice(lastIndex).trim();
      if (textPart) parts.push({ type: "text", content: textPart });
    }

    return parts;
  };

  // Improved inline formatting with correct handling for **bold**
  const renderInlineFormatting = (text) => {
    // Regex for **bold**, *italic*, and `inline code`
    // The lookahead ensures we capture the correct closing markers
    const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`)/g;
    const segments = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      // Text before the format match
      if (match.index > lastIndex) {
        segments.push(text.slice(lastIndex, match.index));
      }

      const part = match[0];
      const key = match.index;

      if (part.startsWith("**") && part.endsWith("**")) {
        // Double asterisk for BOLD text
        segments.push(<strong key={key}>{part.slice(2, -2)}</strong>);
      } else if (part.startsWith("*") && part.endsWith("*")) {
        // Single asterisk for ITALIC text
        segments.push(<em key={key}>{part.slice(1, -1)}</em>);
      } else if (part.startsWith("`") && part.endsWith("`")) {
        // Backticks for INLINE CODE
        segments.push(
          <code
            key={key}
            className="bg-gray-700 px-1 rounded text-sm font-mono break-words"
          >
            {part.slice(1, -1)}
          </code>
        );
      } else {
        segments.push(part);
      }

      lastIndex = match.index + part.length;
    }

    // Remaining text after the last match
    if (lastIndex < text.length) {
      segments.push(text.slice(lastIndex));
    }
    return segments;
  };

  // Render Markdown headings, lists, and paragraphs
  const renderMarkdown = (text) => {
    const lines = text.split("\n");
    const elements = [];
    let listItems = [];

    const flushList = (i) => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`ul-${i}`} className="ml-4 list-disc space-y-1 mt-1">
            {listItems}
          </ul>
        );
        listItems = [];
      }
    };

    lines.forEach((line, i) => {
      const content = line.trim();
      if (content === "") {
        flushList(i);
        return; // Skip empty lines for paragraph creation
      }

      // Headings
      if (content.startsWith("#### ")) {
        flushList(i);
        elements.push(
          <p key={i} className="text-base font-semibold text-yellow-300 mt-2">
            {renderInlineFormatting(content.slice(5).trim())}
          </p>
        );
        return;
      }
      if (content.startsWith("### ")) {
        flushList(i);
        elements.push(
          <p key={i} className="text-lg font-bold text-yellow-400 mt-2">
            {renderInlineFormatting(content.slice(4).trim())}
          </p>
        );
        return;
      }

      // List items
      if (content.startsWith("* ") || content.startsWith("- ")) {
        listItems.push(
          <li key={i} className="ml-2">
            {renderInlineFormatting(content.slice(2).trim())}
          </li>
        );
        return;
      }

      // If we encounter a normal paragraph, flush any pending list
      flushList(i);

      // Normal paragraph
      elements.push(
        <p key={i} className="whitespace-pre-wrap break-words mt-1">
          {renderInlineFormatting(content)}
        </p>
      );
    });

    // Flush remaining list items at the end
    flushList("last");

    return elements;
  };

  const parts = parseMessage(text);

  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopy = (copypart, idx) => {
    navigator.clipboard.writeText(copypart);
    setCopiedIndex(idx);

    // Reset back after 2 seconds
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <>
      {parts.map((part, idx) => {
        if (part.type === "text") {
          return <div key={idx}>{renderMarkdown(part.content)}</div>;
        }
        if (part.type === "code") {
          return (
            <div key={idx} className="relative my-4 overflow-x-auto text-sm">
              <button
                onClick={() => handleCopy(part.content, idx)}
                className="
                  absolute top-2 right-2
                  bg-slate-900 hover:bg-slate-800 active:bg-slate-700
                  text-xs font-medium
                  px-3 py-1.5 rounded-lg
                  shadow-md hover:shadow-lg
                  active:scale-95
                  transition-all duration-200 ease-in-out
                  z-10
                "
              >
                <span
                  className={
                    copiedIndex === idx ? "text-green-400" : "text-white"
                  }
                >
                  {copiedIndex === idx ? "Copied" : "Copy"}
                </span>
              </button>

              <SyntaxHighlighter
                language={part.lang}
                style={oneDark}
                showLineNumbers
                wrapLines
                customStyle={{
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                  padding: "1rem",
                  backgroundColor: "#1e1e2f",
                  margin: 0,
                  maxWidth: "100%", // Ensure responsiveness
                }}
              >
                {part.content}
              </SyntaxHighlighter>
            </div>
          );
        }
        return null;
      })}
    </>
  );
}

export default function ChatBot() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true); // loading chat history
  const chatEndRef = useRef(null);
  const navigate = useNavigate();

  // Fetch chat history on mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${API_URL}/chat/history`);
        const initialMessage = {
          sender: "bot",
          text: "👋 Welcome! Ask me about **DSA**, **Java**, **MERN**, or **Projects**.",
          type: "mixed",
        };
        if (res.data.messages?.length > 0) {
          setMessages([initialMessage, ...res.data.messages]);
        } else {
          setMessages([initialMessage]);
        }
      } catch (err) {
        console.error(err);
        setMessages([
          {
            sender: "bot",
            text: "⚠️ **Error fetching history.** You can start chatting!",
            type: "mixed",
          },
        ]);
      } finally {
        setFetching(false);
      }
    };
    fetchHistory();
  }, []);

  // Scroll to bottom on new message or loading state change
  useEffect(() => {
    // Timeout to ensure content (especially code blocks) has rendered
    const timer = setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    return () => clearTimeout(timer);
  }, [messages, loading, fetching]);

  // Send message to backend
  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { sender: "user", text: input.trim(), type: "mixed" };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/chat/aichat`, {
        message: input.trim(),
      });
      const botReply = res.data.reply || "No reply received.";

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: botReply, type: "mixed" },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "⚠️ **Error connecting to AI**. Please try again.",
          type: "mixed",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Clear chat history
  const deleteHistory = async () => {
    if (fetching || loading) return;
    setFetching(true); // Use fetching state to prevent multiple actions and show loading
    try {
      await axios.delete(`${API_URL}/chat/history`);
      setMessages([
        {
          sender: "bot",
          text: "👋 **Chat cleared!** Start asking questions.",
          type: "mixed",
        },
      ]);
    } catch (err) {
      console.error(err);
      // Optional: Show an error message if clear fails
    } finally {
      setFetching(false);
    }
  };

  return (
    // Main container is centered and takes full screen height, with a max width for large screens
    <div className="flex flex-col h-screen bg-gray-950 text-white md:max-w-8xl md:mx-auto">
      {/* Header */}
      <div className="flex fixed w-full  items-center justify-between px-4 py-3 bg-gradient-to-r from-slate-950 to-gray-950  border-b border-gray-800 shadow-xl z-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg text-sm transition-all cursor-pointer shadow-md active:scale-95"
          aria-label="Go back"
        >
          <FaArrowLeft className="text-base" />
          <span className="hidden sm:block">Back</span>
        </button>

        <div className="flex items-center gap-3">
          <FaRobot className="text-blue-400 text-xl md:text-3xl" />
          <h1 className="text-xl md:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
            Easyway AI Chatbot
          </h1>
        </div>
        <button
          onClick={deleteHistory}
          disabled={loading || fetching}
          className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm transition-all shadow-md active:scale-95 ${
            loading || fetching
              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700"
          }`}
          aria-label="Clear chat history"
        >
          {fetching && !messages.length ? (
            <FaSpinner className="animate-spin" />
          ) : (
            <FaTrash />
          )}
          <span className="hidden sm:block">Clear Chat</span>
        </button>
      </div>

      {/* --- */}

      {/* Chat Window: Takes up available space, scrollable, with padding */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-950">
        {fetching && messages.length === 0 && (
          <div className="flex justify-center items-center h-full text-gray-400 text-lg">
            <FaSpinner className="animate-spin mr-2" />
            Loading chat history...
          </div>
        )}

        {!fetching &&
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 animate-fadeIn ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {/* Icon for Bot
              {msg.sender === "bot" && (
                <FaRobot className="flex-shrink-0 text-blue-400 text-xl mt-1" />
              )} */}

              {/* Message Bubble */}
              <div
                className={`rounded-xl max-w-[90%] md:max-w-[75%] lg:max-w-[65%] p-4 text-base shadow-xl ${
                  msg.sender === "user"
                    ? "bg-blue-800 rounded-br-none"
                    : "bg-gray-900 rounded-tl-none"
                } break-words`}
              >
                <ChatMessageContent text={msg.text} />
              </div>

              {/* Icon for User
              {msg.sender === "user" && (
                <FaUserCircle className="flex-shrink-0 text-gray-300 text-xl mt-1" />
              )} */}
            </div>
          ))}

        {/* Typing Indicator for Bot */}
        {loading && (
          <div className="flex justify-start p-2">
            <div className="bg-gray-800 text-white rounded-xl p-3 max-w-[60%] flex items-center gap-1 shadow-lg">
              <FaRobot className="text-blue-400 text-lg mr-1" />
              <span className="h-2 w-2 bg-blue-400 rounded-full animate-bounce"></span>
              <span className="h-2 w-2 bg-blue-400 rounded-full animate-bounce delay-150"></span>
              <span className="h-2 w-2 bg-blue-400 rounded-full animate-bounce delay-300"></span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* --- */}

      {/* Input Area */}
      <div className="px-4 py-3 bg-gradient-to-r from-slate-950 to-gray-950  border-t border-gray-800 sticky bottom-0 z-10">
        <div className="flex gap-3 max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="💡 Ask about DSA, Java, MERN, or Projects..."
            className="flex-1 rounded-2xl bg-gray-900 p-2 outline-none border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 transition-all text-base"
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className={`p-3 rounded-full transition-all shadow-lg active:scale-95 ${
              loading || !input.trim()
                ? "bg-gray-800 text-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
            aria-label="Send message"
          >
            <FaPaperPlane className="text-white text-xl" />
          </button>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="max-w-7xl  mx-auto px-4 sm:px-6 lg:px-10 py-3 flex flex-col sm:flex-row items-center justify-center text-xs sm:text-sm text-slate-400 gap-2">
          <p className="text-center">
            Easyway AI can make mistakes, so double-check it
          </p>
        </div>
      </div>

      {/* Animations (Keeping the good ones) */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>
    </div>
  );
}
