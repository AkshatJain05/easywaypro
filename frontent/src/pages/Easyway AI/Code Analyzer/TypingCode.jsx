import { useState, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// Import a brighter theme
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function TypingCode({ code = "", language = "javascript", speed = 15 }) {
  const [displayedCode, setDisplayedCode] = useState("");

  useEffect(() => {
    if (!code || typeof code !== "string") {
      setDisplayedCode("// No code provided");
      return;
    }

    let i = 0;
    setDisplayedCode(""); // reset on new code

    const interval = setInterval(() => {
      if (i < code.length) {
        setDisplayedCode(code.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [code, speed]);

  return (
    <div className="w-full max-w-3xl mx-auto my-4 text-sm font-mono rounded-lg shadow-lg overflow-hidden border border-gray-700">
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus} // ✅ vivid colors
        showLineNumbers
        customStyle={{
          margin: 0,
          padding: "16px",
          borderRadius: "8px",
          fontSize: "14px",
          lineHeight: "1.5",
          background: "rgb(2, 1, 8)",// matches VS Code dark
          boxShadow: "inset 0 0 15px rgba(0,0,0,0.4)",
        }}
      >
        {displayedCode || "// Loading..."}
      </SyntaxHighlighter>
    </div>
  );
}
