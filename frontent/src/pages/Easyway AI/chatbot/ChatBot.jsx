import { useState, useEffect, useRef } from "react";
import { FaRobot, FaPaperPlane, FaUserCircle, FaTrash,FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import axios from "axios";

export default function ChatBot() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [messages, setMessages] = useState([]);
  console.log(messages);
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
        if (res.data.messages?.length > 0) {
          setMessages(res.data.messages);
        } else {
          setMessages([
            {
              sender: "bot",
              text: "👋 Welcome! Ask me about DSA, Java, MERN, or Projects.",
              type: "mixed",
            },
          ]);
        }
      } catch (err) {
        console.error(err);
        setMessages([
          {
            sender: "bot",
            text: "⚠️ Error fetching history. You can start chatting!",
            type: "mixed",
          },
        ]);
      } finally {
        setFetching(false);
      }
    };
    fetchHistory();
  }, []);

  // Scroll to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, fetching]);

  // Parse message into paragraphs + code blocks
  const parseMessage = (message) => {
    const parts = [];
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
        lang: match[1] || "javascript",
        content: match[2],
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

  // Render Markdown headings in paragraphs
  const renderMarkdown = (text) => {
    const lines = text.split("\n");
    const elements = [];
    let listItems = [];

    lines.forEach((line, i) => {
      const content = line.trim();

      // Headings
      if (content.startsWith("#### ")) {
        if (listItems.length > 0) {
          elements.push(
            <ul key={`ul-${i}`} className="ml-4 list-disc">
              {listItems}
            </ul>
          );
          listItems = [];
        }
        elements.push(
          <p key={i} className="text-base font-semibold text-yellow-300 mt-2">
            {content.slice(5)}
          </p>
        );
        return;
      }
      if (content.startsWith("### ")) {
        if (listItems.length > 0) {
          elements.push(
            <ul key={`ul-${i}`} className="ml-4 list-disc">
              {listItems}
            </ul>
          );
          listItems = [];
        }
        elements.push(
          <p key={i} className="text-lg font-bold text-yellow-400 mt-2">
            {content.slice(4)}
          </p>
        );
        return;
      }
      if (content.startsWith("* ")) {
        // Process inline formatting for each list item
        listItems.push(
          <li key={i} className="ml-4 list-disc">
            {renderInlineFormatting(content.slice(2))}
          </li>
        );
        return;
      }

      // End of list: flush collected items
      if (listItems.length > 0) {
        elements.push(
          <ul key={`ul-${i}`} className="ml-4 list-disc">
            {listItems}
          </ul>
        );
        listItems = [];
      }

      // Normal paragraph
      elements.push(
        <p key={i} className="whitespace-pre-wrap break-words mt-1">
          {renderInlineFormatting(content)}
        </p>
      );
    });

    // Flush remaining list items
    if (listItems.length > 0) {
      elements.push(
        <ul key={`ul-last`} className="ml-4 list-disc">
          {listItems}
        </ul>
      );
    }

    return elements;
  };

  const renderInlineFormatting = (text) => {
    const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
    const segments = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex)
        segments.push(text.slice(lastIndex, match.index));

      const part = match[0];
      if (part.startsWith("**") && part.endsWith("**"))
        segments.push(<strong key={lastIndex}>{part.slice(2, -2)}</strong>);
      else if (part.startsWith("*") && part.endsWith("*"))
        segments.push(<em key={lastIndex}>{part.slice(1, -1)}</em>);
      else if (part.startsWith("`") && part.endsWith("`"))
        segments.push(
          <code key={lastIndex} className="bg-gray-700 px-1 rounded">
            {part.slice(1, -1)}
          </code>
        );
      else segments.push(part);

      lastIndex = match.index + part.length;
    }

    if (lastIndex < text.length) segments.push(text.slice(lastIndex));
    return segments;
  };

  // Send message to backend
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input, type: "mixed" };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/chat/aichat`, {
        message: input,
      });
      const botReply = res.data.reply;

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: botReply, type: "mixed" },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Error connecting to AI", type: "mixed" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Clear chat history
  const deleteHistory = async () => {
    setFetching(true);
    try {
      await axios.delete(`${API_URL}/chat/history`);
      setMessages([
        {
          sender: "bot",
          text: "👋 Chat cleared! Start asking questions.",
          type: "mixed",
        },
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-white  mx-auto">

       
      
      {/* Header */}
      <div className="flex items-center justify-between border-b-1 p-4 shadow-md">
         <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1 px-3  py-1
                         bg-gray-800 hover:bg-gray-700 text-gray-200 
                         rounded-lg text-sm shadow-md transition-all cursor-pointer"
              >
                <FaArrowLeft className="text-sm" />
                <span className="hidden md:block">Back</span>
              </button>

        <div className="flex items-center gap-2">
          
          <FaRobot className="text-blue-400 text-2xl" />
          <h1 className="text-xl font-bold">Easyway AI Chatbot</h1>
        </div>
        <button
          onClick={deleteHistory}
          className="flex items-center gap-1 bg-red-600 hover:bg-red-700 px-3 py-2 rounded-xl text-sm"
        >
          <FaTrash /> <span className="hidden md:block">Clear Chat</span>
        </button>
      </div>

      

      {/* Chat Window */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-950">
        {fetching && (
          <div className="flex justify-center items-center text-gray-400 animate-pulse">
            Loading chat history...
          </div>
        )}

        {!fetching &&
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`rounded-2xl max-w-[80%] p-4 ${
                  msg.sender === "user" ? "bg-blue-600" : "bg-gray-800"
                } shadow-lg`}
              >
                {parseMessage(msg.text).map((part, idx) => {
                  if (part.type === "text")
                    return <div key={idx}>{renderMarkdown(part.content)}</div>;
                  if (part.type === "code") {
                    return (
                      <div key={idx} className="relative my-2">
                        <button
                          onClick={() =>
                            navigator.clipboard.writeText(part.content)
                          }
                          className="absolute top-2 right-2 bg-slate-900 active:bg-gray-800 active:scale-[0.9] text-white px-3 py-1 rounded-lg text-xs z-10"
                        >
                          Copy
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
                          }}
                        >
                          {part.content}
                        </SyntaxHighlighter>
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          ))}

        <div ref={chatEndRef} />
      </div>

      {loading && (
        <div className="flex justify-start p-2 my-2">
          <div className="bg-gray-700 text-white rounded-2xl p-3 max-w-[60%] flex items-center gap-1 animate-pulse">
            <span className="h-2 w-2 bg-white rounded-full animate-bounce"></span>
            <span className="h-2 w-2 bg-white rounded-full animate-bounce delay-150"></span>
            <span className="h-2 w-2 bg-white rounded-full animate-bounce delay-300"></span>
            <span className="ml-2 text-sm">Typing...</span>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="flex p-4 gap-2 bg-gray-900 items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="💡 Ask about DSA, Java, MERN, or Projects..."
          className="flex-1 rounded-2xl bg-gray-800 p-3 outline-none border border-gray-700 focus:ring-2 focus:ring-blue-500"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 hover:bg-blue-600 p-3 rounded-2xl"
        >
          <FaPaperPlane className="text-white" />
        </button>
      </div>

      {/* Animations */}
      <style>
        {`
          .dot-animate::after {
            content: '';
            display: inline-block;
            width: 0.4rem;
            height: 0.4rem;
            margin-left: 0.2rem;
            background-color: currentColor;
            border-radius: 50%;
            animation: blink 1s infinite alternate;
          }
          .dot-animate::after:nth-child(2) { animation-delay: 0.2s; }
          .dot-animate::after:nth-child(3) { animation-delay: 0.4s; }

          @keyframes blink {
            from { opacity: 0.2; transform: scale(0.5);}
            to { opacity: 1; transform: scale(1);}
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(5px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .animate-fadeIn { animation: fadeIn 0.3s ease-in-out; }
        `}
      </style>
    </div>
  );
}



