import { useState, useEffect, useRef } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { MdContentCopy, MdCheck, MdOutlinePlayCircle } from "react-icons/md";

export default function TypingCode({
  code = "",
  language = "javascript",
  speed = 12,
}) {
  const [displayedCode, setDisplayedCode]   = useState("");
  const [isTyping, setIsTyping]             = useState(false);
  const [isDone, setIsDone]                 = useState(false);
  const [copied, setCopied]                 = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!code || typeof code !== "string") {
      setDisplayedCode("// No code provided");
      setIsDone(true);
      return;
    }

    // Reset
    setDisplayedCode("");
    setIsDone(false);
    setIsTyping(true);
    let i = 0;

    intervalRef.current = setInterval(() => {
      if (i < code.length) {
        setDisplayedCode(code.slice(0, i + 1));
        i++;
      } else {
        clearInterval(intervalRef.current);
        setIsTyping(false);
        setIsDone(true);
      }
    }, speed);

    return () => clearInterval(intervalRef.current);
  }, [code, speed]);

  // Skip to end
  const handleSkip = () => {
    clearInterval(intervalRef.current);
    setDisplayedCode(code);
    setIsTyping(false);
    setIsDone(true);
  };

  // Copy
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  // Progress
  const progress = code.length > 0 ? (displayedCode.length / code.length) * 100 : 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap');

        .tc-root code,
        .tc-root pre {
          font-family: 'DM Mono', 'Fira Code', monospace !important;
        }

        /* Typing cursor */
        .cursor-blink::after {
          content: '|';
          color: #38bdf8;
          animation: blink 0.9s step-end infinite;
          margin-left: 1px;
          font-weight: 300;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }

        /* Progress bar shimmer */
        @keyframes progressShimmer {
          0%   { opacity: 0.7; }
          50%  { opacity: 1; }
          100% { opacity: 0.7; }
        }
        .progress-shimmer { animation: progressShimmer 1.2s ease-in-out infinite; }

        /* Copy button */
        .copy-btn {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 4px 10px; border-radius: 7px;
          font-size: 11px; font-weight: 600;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .copy-btn:hover { opacity: 0.85; }

        /* Skip button */
        .skip-btn {
          display: inline-flex; align-items: center; gap: 3px;
          padding: 4px 10px; border-radius: 7px;
          font-size: 11px; font-weight: 500;
          color: #6b7280;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .skip-btn:hover { color: #9ca3af; background: rgba(255,255,255,0.07); }

        /* Scrollbar */
        .tc-scroll::-webkit-scrollbar { width: 4px; height: 4px; }
        .tc-scroll::-webkit-scrollbar-track { background: transparent; }
        .tc-scroll::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 2px; }
        .tc-scroll::-webkit-scrollbar-thumb:hover { background: #334155; }
      `}</style>

      <div className="tc-root w-full rounded-xl overflow-hidden border border-white/[0.07]"
        style={{ background: "#050510" }}>

        {/* ── Header bar ── */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06]"
          style={{ background: "rgba(255,255,255,0.02)" }}>

          {/* Left: dots + language */}
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
            </div>
            <span className="text-[10px] uppercase tracking-widest text-gray-600 ml-1.5">
              {language}
            </span>
          </div>

          {/* Right: skip + copy */}
          <div className="flex items-center gap-2">
            {isTyping && (
              <button onClick={handleSkip} className="skip-btn">
                <MdOutlinePlayCircle size={12} /> Skip
              </button>
            )}
            <button
              onClick={handleCopy}
              className={`copy-btn ${
                copied
                  ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                  : "text-gray-500 bg-white/[0.04] border border-white/[0.07] hover:text-sky-400 hover:border-sky-500/25 hover:bg-sky-500/8"
              }`}
            >
              {copied
                ? <><MdCheck size={12} /> Copied</>
                : <><MdContentCopy size={11} /> Copy</>
              }
            </button>
          </div>
        </div>

        {/* ── Typing progress bar ── */}
        {isTyping && (
          <div className="h-0.5 w-full bg-white/[0.04]">
            <div
              className="h-full progress-shimmer transition-all duration-100 ease-linear"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #38bdf8, #818cf8)",
              }}
            />
          </div>
        )}

        {/* ── Code ── */}
        <div className={`tc-scroll overflow-auto max-h-[420px] ${isTyping ? "cursor-blink" : ""}`}>
          <SyntaxHighlighter
            language={language}
            style={oneDark}
            showLineNumbers
            customStyle={{
              margin: 0,
              padding: "16px 14px",
              background: "#050510",
              fontSize: "13px",
              lineHeight: "1.7",
              borderRadius: 0,
              boxShadow: "none",
              minHeight: "80px",
            }}
            lineNumberStyle={{
              color: "#1e293b",
              fontSize: "11px",
              paddingRight: "16px",
              userSelect: "none",
              minWidth: "2.5em",
            }}
          >
            {displayedCode || "// Waiting for code…"}
          </SyntaxHighlighter>
        </div>

        {/* ── Footer: done indicator ── */}
        {isDone && code && (
          <div className="flex items-center justify-between px-4 py-2 border-t border-white/[0.05]"
            style={{ background: "rgba(255,255,255,0.01)" }}>
            <span className="text-[10px] text-gray-700">
              {code.split("\n").length} lines · {code.length} chars
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold"
              style={{ color: "#34d399" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Done
            </span>
          </div>
        )}
      </div>
    </>
  );
}