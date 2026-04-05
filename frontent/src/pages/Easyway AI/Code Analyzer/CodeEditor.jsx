import { useState, useRef, useEffect, useCallback } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  MdContentCopy,
  MdCheck,
  MdDeleteOutline,
  MdAutoAwesome,
  MdFullscreen,
  MdFullscreenExit,
  MdKeyboard,
  MdExpandMore,
} from "react-icons/md";
import {
  SiJavascript,
  SiPython,
  SiCplusplus,
  SiC,
  SiOpenjdk,
} from "react-icons/si";

// ── Language config ──────────────────────────────────────────────
const LANGUAGES = [
  {
    value: "javascript",
    label: "JavaScript",
    ext: "js",
    icon: SiJavascript,
    color: "#F7DF1E",
  },
  {
    value: "python",
    label: "Python",
    ext: "py",
    icon: SiPython,
    color: "#4B9CD3",
  },
  {
    value: "java",
    label: "Java",
    ext: "java",
    icon: SiOpenjdk,
    color: "#ED8B00",
  },
  {
    value: "cpp",
    label: "C++",
    ext: "cpp",
    icon: SiCplusplus,
    color: "#659BD3",
  },
  { value: "c", label: "C", ext: "c", icon: SiC, color: "#A8B9CC" },
];

const PLACEHOLDER = `// Paste or type your code here…
// Select a language, then click Analyze.`;

// ── Main Component ───────────────────────────────────────────────
export default function CodeEditor({
  initialCode = "",
  defaultLanguage = "javascript",
  onRun,
}) {
  const [code, setCode] = useState(initialCode);
  const [language, setLanguage] = useState(defaultLanguage);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [focused, setFocused] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [lineCount, setLineCount] = useState(1);

  const textareaRef = useRef(null);
  const langMenuRef = useRef(null);

  const currentLang =
    LANGUAGES.find((l) => l.value === language) || LANGUAGES[0];
  const LangIcon = currentLang.icon;

  // Update stats
  useEffect(() => {
    setLineCount(code.split("\n").length || 1);
    setCharCount(code.length);
  }, [code]);

  // Close lang menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target))
        setLangOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close expand on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") setExpanded(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  const handleClear = useCallback(() => {
    setCode("");
    textareaRef.current?.focus();
  }, []);

  const handleRun = useCallback(async () => {
    if (!onRun || !code.trim()) return;
    setLoading(true);
    try {
      await onRun(code, language);
    } finally {
      setLoading(false);
    }
  }, [onRun, code, language]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const { selectionStart: s, selectionEnd: end } = e.target;
        const next = code.substring(0, s) + "  " + code.substring(end);
        setCode(next);
        requestAnimationFrame(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = s + 2;
            textareaRef.current.selectionEnd = s + 2;
          }
        });
      }
      // Ctrl/Cmd + Enter → run
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleRun();
      }
    },
    [code, handleRun],
  );

  // ── Shared editor height ──
  const editorMinH = expanded ? "100%" : "clamp(260px, 40vh, 440px)";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,400;0,500;1,400&display=swap');

        .ce-root * { box-sizing: border-box; }
        .ce-root textarea,
        .ce-root pre,
        .ce-root code {
          font-family: 'DM Mono', 'Fira Code', 'Cascadia Code', monospace !important;
        }

        /* Caret glow */
        .ce-textarea { caret-color: #38bdf8; }
        .ce-textarea:focus { outline: none; }

        /* Custom scrollbar */
        .ce-scroll::-webkit-scrollbar { width: 5px; height: 5px; }
        .ce-scroll::-webkit-scrollbar-track { background: transparent; }
        .ce-scroll::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 4px; }
        .ce-scroll::-webkit-scrollbar-thumb:hover { background: #334155; }

        /* Lang menu */
        .lang-menu {
          position: absolute;
          top: calc(100% + 6px);
          left: 0;
          min-width: 160px;
          background: #0e0e1c;
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 16px 40px rgba(0,0,0,0.7);
          z-index: 100;
          animation: menuIn 0.15s ease;
        }
        @keyframes menuIn {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .lang-item {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 14px;
          font-size: 12px; font-weight: 500;
          color: rgba(255,255,255,0.45);
          transition: background 0.15s ease, color 0.15s ease;
          cursor: pointer;
          font-family: 'DM Mono', monospace;
        }
        .lang-item:hover { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.85); }
        .lang-item.active { color: #fff; }

        /* Toolbar buttons */
        .tb-btn {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 5px 11px; border-radius: 8px;
          font-size: 11px; font-weight: 600;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.45);
          transition: all 0.18s ease;
          cursor: pointer; white-space: nowrap;
          font-family: 'DM Mono', monospace;
        }
        .tb-btn:hover:not(:disabled) {
          color: rgba(255,255,255,0.85);
          border-color: rgba(255,255,255,0.16);
          background: rgba(255,255,255,0.07);
        }
        .tb-btn:disabled { opacity: 0.35; cursor: not-allowed; }

        /* Analyze button */
        .analyze-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 16px; border-radius: 9px;
          font-size: 12px; font-weight: 700;
          color: #fff; letter-spacing: 0.02em;
          border: none; cursor: pointer;
          transition: all 0.2s ease;
          font-family: 'DM Mono', monospace;
          white-space: nowrap;
        }
        .analyze-btn:not(:disabled) {
          background: linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%);
          box-shadow: 0 0 18px rgba(14,165,233,0.3), 0 4px 12px rgba(0,0,0,0.4);
        }
        .analyze-btn:not(:disabled):hover {
          box-shadow: 0 0 28px rgba(14,165,233,0.45), 0 4px 16px rgba(0,0,0,0.5);
          transform: translateY(-1px);
        }
        .analyze-btn:disabled {
          background: linear-gradient(135deg, #0c4a6e 0%, #312e81 100%);
          opacity: 0.7; cursor: not-allowed;
        }

        /* Focus ring on outer shell */
        .ce-shell {
          transition: box-shadow 0.25s ease;
        }
        .ce-shell.is-focused {
          box-shadow: 0 0 0 1px rgba(14,165,233,0.3), 0 20px 50px rgba(0,0,0,0.8), 0 0 60px rgba(14,165,233,0.05);
        }

        /* Spinner */
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { animation: spin 0.8s linear infinite; }

        /* Status dot */
        .status-dot {
          width: 6px; height: 6px; border-radius: 50%;
          transition: background 0.3s ease, box-shadow 0.3s ease;
        }
        .status-dot.idle    { background: #1e293b; }
        .status-dot.editing { background: #38bdf8; box-shadow: 0 0 6px #38bdf8; }
        .status-dot.loading { background: #a78bfa; box-shadow: 0 0 6px #a78bfa; animation: statusPulse 1s ease-in-out infinite; }
        @keyframes statusPulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }

        /* Gutter line */
        .gutter-line {
          font-size: 12px; line-height: 1.65;
          padding: 0 10px 0 8px;
          text-align: right;
          color: #1e3a5f;
          user-select: none;
          transition: color 0.15s ease;
        }
        .gutter-line.active { color: rgba(56,189,248,0.4); }
      `}</style>

      {/* ── Fullscreen backdrop ── */}
      {expanded && (
        <div
          className="fixed inset-0 z-40 bg-black/85"
          style={{ backdropFilter: "blur(6px)" }}
          onClick={() => setExpanded(false)}
        />
      )}

      {/* ── Editor shell ── */}
      <div
        className={`ce-root ${expanded ? "fixed inset-4 sm:inset-6 z-50 flex items-stretch" : "relative w-full"}`}
      >
        <div
          className={`ce-shell flex flex-col w-full rounded-2xl overflow-hidden ${focused ? "is-focused" : ""}`}
          style={{
            background: "#080812",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {/* ══ Chrome bar ══ */}
          <div
            className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.05]"
            style={{ background: "rgba(255,255,255,0.02)" }}
          >
            {/* Traffic lights */}
            <div className="flex gap-1.5">
              <span
                className="w-3 h-3 rounded-full bg-red-500/70 hover:bg-red-400 cursor-pointer transition-colors"
                onClick={() => setExpanded(false)}
              />
              <span
                className="w-3 h-3 rounded-full bg-yellow-500/70 hover:bg-yellow-400 cursor-pointer transition-colors"
                onClick={handleClear}
              />
              <span
                className="w-3 h-3 rounded-full bg-green-500/70 hover:bg-green-400 cursor-pointer transition-colors"
                onClick={() => setExpanded(!expanded)}
              />
            </div>

            {/* Filename chip */}
            <div
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] text-gray-300 border border-white/[0.07]"
              style={{
                background: "rgba(255,255,255,0.03)",
                fontFamily: "'DM Mono', monospace",
              }}
            >
              main.{currentLang.ext}
            </div>

            {/* Expand toggle */}
            <button
              className="text-gray-300 hover:text-white/60 transition-colors mt-6"
              onClick={() => setExpanded((v) => !v)}
              title={expanded ? "Exit fullscreen (Esc)" : "Fullscreen"}
            >
              {expanded ? (
                <MdFullscreenExit size={16} />
              ) : (
                <MdFullscreen size={16} />
              )}
            </button>
          </div>

          {/* ══ Toolbar ══ */}
          <div
            className="flex flex-wrap items-center justify-between gap-2 px-3 sm:px-4 py-2.5 border-b border-white/[0.05]"
            style={{ background: "rgba(255,255,255,0.015)" }}
          >
            {/* Language picker */}
            <div className="relative" ref={langMenuRef}>
              <button
                className="tb-btn"
                onClick={() => setLangOpen((v) => !v)}
                disabled={loading}
              >
                <LangIcon size={13} style={{ color: currentLang.color }} />
                <span className="hidden xs:inline">{currentLang.label}</span>
                <MdExpandMore
                  size={14}
                  className={`transition-transform ${langOpen ? "rotate-180" : ""}`}
                />
              </button>

              {langOpen && (
                <div className="lang-menu">
                  {LANGUAGES.map((lang) => {
                    const Icon = lang.icon;
                    return (
                      <div
                        key={lang.value}
                        className={`lang-item ${lang.value === language ? "active" : ""}`}
                        onClick={() => {
                          setLanguage(lang.value);
                          setLangOpen(false);
                        }}
                      >
                        <Icon size={13} style={{ color: lang.color }} />
                        <span>{lang.label}</span>
                        {lang.value === language && (
                          <MdCheck
                            size={12}
                            className="ml-auto"
                            style={{ color: "#38bdf8" }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-end">
              {/* Line / char stats — hidden on very small screens */}
              <div
                className="hidden sm:flex items-center gap-1 tb-btn"
                style={{ cursor: "default", pointerEvents: "none" }}
              >
                <MdKeyboard size={12} />
                <span>
                  {lineCount}L · {charCount}C
                </span>
              </div>

              {/* Copy */}
              <button
                className={`tb-btn ${copied ? "!text-emerald-400 !border-emerald-500/25 !bg-emerald-500/8" : ""}`}
                onClick={handleCopy}
                disabled={loading}
                title="Copy code"
              >
                {copied ? <MdCheck size={13} /> : <MdContentCopy size={12} />}
                <span className="hidden sm:inline">
                  {copied ? "Copied" : "Copy"}
                </span>
              </button>

              {/* Clear */}
              <button
                className="tb-btn hover:!text-red-400 hover:!border-red-500/20 hover:!bg-red-500/5"
                onClick={handleClear}
                disabled={loading}
                title="Clear editor"
              >
                <MdDeleteOutline size={13} />
                <span className="hidden sm:inline">Clear</span>
              </button>

              {/* Analyze */}
              <button
                className="analyze-btn"
                onClick={handleRun}
                disabled={loading || !code.trim()}
                title="Analyze code (Ctrl+Enter)"
              >
                {loading ? (
                  <>
                    <svg
                      className="spinner"
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path
                        d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span>Analyzing…</span>
                  </>
                ) : (
                  <>
                    <MdAutoAwesome size={14} />
                    <span>Analyze</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ══ Editor body ══ */}
          <div
            className="ce-scroll relative flex overflow-auto flex-1"
            style={{ minHeight: editorMinH }}
            onClick={() => {
              setLangOpen(false);
              textareaRef.current?.focus();
            }}
          >
            {/* Gutter */}
            <div
              className="flex-none select-none flex flex-col pt-3 pb-3 border-r border-white/[0.04]"
              style={{ background: "rgba(0,0,0,0.25)", minWidth: "3rem" }}
            >
              {Array.from({ length: Math.max(lineCount, 1) }, (_, i) => (
                <div
                  key={i}
                  className={`gutter-line ${i + 1 === lineCount ? "active" : ""}`}
                >
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Syntax + Textarea overlay */}
            <div className="relative flex-1 min-w-0">
              <SyntaxHighlighter
                language={language}
                style={oneDark}
                wrapLines={false}
                PreTag="div"
                customStyle={{
                  margin: 0,
                  padding: "12px 16px",
                  fontSize: "16px",
                  lineHeight: "1.65",
                  fontFamily: "'DM Mono', monospace",
                  background: "transparent",
                  minHeight: editorMinH,
                  borderRadius: 0,
                  whiteSpace: "pre",
                  overflowX: "visible",
                  pointerEvents: "none",
                }}
              >
                {code || PLACEHOLDER}
              </SyntaxHighlighter>

              <textarea
                ref={textareaRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className="ce-textarea absolute inset-0 w-full h-full resize-none bg-transparent text-transparent"
                style={{
                  fontSize: "13px",
                  lineHeight: "1.65",
                  padding: "12px 16px",
                  fontFamily: "'DM Mono', monospace",
                  minHeight: editorMinH,
                  tabSize: 2,
                  spellCheck: false,
                }}
                spellCheck={false}
                autoCapitalize="off"
                autoCorrect="off"
                disabled={loading}
                placeholder=""
              />
            </div>
          </div>

          {/* ══ Status bar ══ */}
          <div
            className="flex items-center justify-between px-4 py-1.5 border-t border-white/[0.04] flex-wrap gap-2"
            style={{
              background: "rgba(0,0,0,0.3)",
              fontFamily: "'DM Mono', monospace",
              fontSize: "10px",
              color: "rgba(255,255,255,0.18)",
            }}
          >
            {/* Left */}
            <div className="flex items-center gap-2.5">
              <span
                className={`status-dot ${loading ? "loading" : focused ? "editing" : "idle"}`}
              />
              <span>
                {loading ? "analyzing…" : focused ? "editing" : "ready"}
              </span>
            </div>

            {/* Right */}
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline">Tab · 2sp</span>
              <span>Ctrl+↵ run</span>
              <span style={{ color: currentLang.color, opacity: 0.6 }}>
                {currentLang.label}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
