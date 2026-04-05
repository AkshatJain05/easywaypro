import TypingCode from "./TypingCode";
import {
  MdOutlineCode, MdErrorOutline, MdAutoAwesome,
  MdOutlineDescription, MdOutlineLightbulb, MdOutlineSpeed,
  MdOutlineBugReport, MdOutlineCheckCircle, MdOutlineBolt,
} from "react-icons/md";

// ── Key → meta map ────────────────────────────────────────────────
const KEY_META = {
  optimizedCode:   { label: "Optimized Code",    icon: MdOutlineBolt,        color: "#38bdf8", bg: "rgba(56,189,248,0.08)",  border: "rgba(56,189,248,0.18)"  },
  fixedCode:       { label: "Fixed Code",         icon: MdOutlineBugReport,   color: "#34d399", bg: "rgba(52,211,153,0.08)",  border: "rgba(52,211,153,0.18)"  },
  refactoredCode:  { label: "Refactored Code",    icon: MdOutlineCode,        color: "#818cf8", bg: "rgba(129,140,248,0.08)", border: "rgba(129,140,248,0.18)" },
  analyzedCode:    { label: "Analyzed Code",      icon: MdOutlineCode,        color: "#38bdf8", bg: "rgba(56,189,248,0.08)",  border: "rgba(56,189,248,0.18)"  },
  explanation:     { label: "Explanation",        icon: MdOutlineDescription, color: "#f9a8d4", bg: "rgba(249,168,212,0.07)", border: "rgba(249,168,212,0.15)" },
  suggestions:     { label: "Suggestions",        icon: MdOutlineLightbulb,   color: "#fbbf24", bg: "rgba(251,191,36,0.08)",  border: "rgba(251,191,36,0.18)"  },
  improvements:    { label: "Improvements",       icon: MdOutlineSpeed,       color: "#a78bfa", bg: "rgba(167,139,250,0.08)", border: "rgba(167,139,250,0.18)" },
  issues:          { label: "Issues Found",       icon: MdOutlineBugReport,   color: "#f87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.18)" },
  summary:         { label: "Summary",            icon: MdOutlineCheckCircle, color: "#34d399", bg: "rgba(52,211,153,0.08)",  border: "rgba(52,211,153,0.18)"  },
};

const CODE_KEYS = ["optimizedCode", "fixedCode", "refactoredCode", "analyzedCode"];

function getMeta(key) {
  if (KEY_META[key]) return KEY_META[key];
  const label = key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  return { label, icon: MdOutlineDescription, color: "#7dd3fc", bg: "rgba(14,165,233,0.07)", border: "rgba(14,165,233,0.15)" };
}

// ── Sub-components ────────────────────────────────────────────────
function CodeBlock({ code, language }) {
  return (
    <div className="rounded-xl overflow-hidden border border-white/[0.07]">
      {/* Mac dots */}
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/[0.06]"
        style={{ background: "rgba(255,255,255,0.02)" }}>
        <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
        <span className="ml-2 text-[10px] uppercase tracking-widest text-gray-600">{language}</span>
      </div>
      <div className="overflow-x-auto max-h-[380px] bg-[#050510]">
        <TypingCode code={String(code)} language={language} />
      </div>
    </div>
  );
}

function TextBlock({ value }) {
  return (
    <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-line">
      {String(value)}
    </p>
  );
}

// ── Main Component ─────────────────────────────────────────────────
export default function ResultPanel({ result, language }) {
  if (!result) return null;

  const entries = Object.entries(result).filter(([k, v]) => v && k !== "error");
  const codeEntries = entries.filter(([k]) => CODE_KEYS.includes(k));
  const textEntries = entries.filter(([k]) => !CODE_KEYS.includes(k));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;500;600&display=swap');
        .rp-root { font-family: 'Inter', sans-serif; }
        .syne { font-family: 'Syne', sans-serif; }

        .rp-card {
          background: #0d0d1c;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px;
          overflow: hidden;
          transition: border-color 0.25s ease, box-shadow 0.25s ease;
        }
        .rp-card:hover {
          border-color: rgba(14,165,233,0.2);
          box-shadow: 0 6px 24px -4px rgba(14,165,233,0.08);
        }

        .rp-card-header {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 14px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .rp-card-body { padding: 14px; }
      `}</style>

      <div className="rp-root w-full p-4 sm:p-5 space-y-5">

        {/* ── Panel heading ── */}
        <div className="flex items-center gap-2.5 pb-4 border-b border-white/[0.06]">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(14,165,233,0.1)", border: "1px solid rgba(14,165,233,0.2)" }}>
            <MdAutoAwesome className="text-sky-400" size={14} />
          </div>
          <h2 className="syne text-base sm:text-lg font-bold text-white">
            Analysis Results
          </h2>
          <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold"
            style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)", color: "#34d399" }}>
            ✓ Complete
          </span>
        </div>

        {/* ── Error ── */}
        {result.error && (
          <div className="flex items-start gap-3 p-4 rounded-xl text-sm"
            style={{ background: "rgba(248,113,113,0.07)", border: "1px solid rgba(248,113,113,0.2)" }}>
            <MdErrorOutline className="text-red-400 flex-shrink-0 mt-0.5" size={18} />
            <span className="text-red-300 leading-relaxed">{result.error}</span>
          </div>
        )}

        {/* ── Text sections — 2 col grid ── */}
        {textEntries.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {textEntries.map(([key, value]) => {
              const meta = getMeta(key);
              const Icon = meta.icon;
              return (
                <div key={key} className="rp-card">
                  <div className="rp-card-header" style={{ background: meta.bg }}>
                    <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                      style={{ background: meta.bg, border: `1px solid ${meta.border}` }}>
                      <Icon size={12} style={{ color: meta.color }} />
                    </div>
                    <span className="text-xs font-bold syne" style={{ color: meta.color }}>
                      {meta.label}
                    </span>
                  </div>
                  <div className="rp-card-body">
                    <TextBlock value={value} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Code sections — full width ── */}
        {codeEntries.map(([key, value]) => {
          const meta = getMeta(key);
          const Icon = meta.icon;
          return (
            <div key={key} className="rp-card">
              <div className="rp-card-header" style={{ background: meta.bg }}>
                <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ background: meta.bg, border: `1px solid ${meta.border}` }}>
                  <Icon size={12} style={{ color: meta.color }} />
                </div>
                <span className="text-xs font-bold syne" style={{ color: meta.color }}>
                  {meta.label}
                </span>
              </div>
              <div className="rp-card-body">
                <CodeBlock code={value} language={language} />
              </div>
            </div>
          );
        })}

        {/* ── No meaningful content ── */}
        {entries.length === 0 && !result.error && (
          <p className="text-center text-gray-600 text-sm py-8">
            No analysis data returned. Try running the analyzer again.
          </p>
        )}
      </div>
    </>
  );
}