import { useState, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function TypingCode({ code = "", language = "javascript", speed = 10 }) {
  const [displayedCode, setDisplayedCode] = useState("");

  useEffect(() => {
    if (!code || typeof code !== "string") {
      setDisplayedCode("// No code provided");
      return;
    }

    let i = 0;
    setDisplayedCode(""); // reset when code changes

    const interval = setInterval(() => {
      // ✅ stop exactly when i == code.length
      if (i < code.length) {
        // ✅ slice ensures no "cass" and no "undefined"
        setDisplayedCode(code.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [code, speed]);

  return (
    <div className="text-sm font-mono">
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{
          margin: 0,
          padding: "12px",
          borderRadius: "8px",
          background: "#0d1117",
          fontSize: "14px",
        }}
      >
        {displayedCode || "// Loading..."}
      </SyntaxHighlighter>
    </div>
  );
}
