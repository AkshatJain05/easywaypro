import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FaCopy, FaCheck, FaTrash, FaPlay, FaSpinner } from "react-icons/fa";

export default function CodeEditor({ initialCode = "", defaultLanguage = "javascript", onRun }) {
  const [code, setCode] = useState(initialCode);
  const [language, setLanguage] = useState(defaultLanguage);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setCode("");
  };

  const handleRun = async () => {
    if (!onRun) return;
    setLoading(true);
    try {
      await onRun(code, language);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl  mx-auto rounded-xl bg-gray-900 border border-gray-700 shadow-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex justify-between items-center px-4 py-2 bg-gray-800 border-b border-gray-700">
        {/* Language Selector */}
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-gray-700 text-white text-sm px-2 py-1 rounded-md focus:outline-none"
          disabled={loading}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
          <option value="cpp">C</option>

        </select>

        {/* Toolbar Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleCopy}
            disabled={loading}
            className={`flex items-center gap-1 text-sm transition ${
              copied ? "text-green-400" : "text-gray-300 hover:text-white"
            }`}
          >
            {copied ? <FaCheck size={14} /> : <FaCopy size={14} />}
            {copied ? "Copied!" : "Copy"}
          </button>

          <button
            onClick={handleClear}
            disabled={loading}
            className="flex items-center gap-1 text-gray-300 hover:text-red-400 transition text-sm"
          >
            <FaTrash size={14} /> Clear
          </button>

          <button
            onClick={handleRun}
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" size={14} /> Analyzing...
              </>
            ) : (
              <>
                <FaPlay size={14} /> Analyze
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editable Code Area */}
      <div className="relative">
        {/* Syntax Highlighting Layer */}
        <SyntaxHighlighter
          language={language}
          style={oneDark}
          customStyle={{
            margin: 0,
            padding: "12px",
            fontSize: "14px",
            fontFamily: '"Fira Code", monospace',
            minHeight: "300px",
            borderRadius: "0 0 12px 12px",
            background: "transparent",
          }}
        >
          {code || "// Start typing your code..."}
        </SyntaxHighlighter>

        {/* Transparent Textarea Overlay */}
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="absolute top-0 left-0 w-full h-full bg-transparent text-transparent caret-green-400 resize-none p-3 font-mono text-sm focus:outline-none"
          spellCheck="false"
          disabled={loading}
        />
      </div>
    </div>
  );
}
