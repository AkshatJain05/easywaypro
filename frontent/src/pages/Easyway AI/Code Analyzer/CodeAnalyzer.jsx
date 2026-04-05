import { useState } from "react";
import axios from "axios";
import CodeEditor from "./CodeEditor";
import ResultPanel from "./ResultPanel";
import { MdArrowBack, MdOutlineCode, MdAutoAwesome } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export default function CodeAnalyzer() {
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const handleRun = async (code, language) => {
    setLoading(true);
    setResult(null);
    try {
      const { data } = await axios.post(
        `${API_URL}/code/analyze-code`,
        { code, language },
        { headers: { "Content-Type": "application/json" } }
      );

      const cleanData = {};
      for (const key in data) {
        if (typeof data[key] === "string") {
          cleanData[key] = data[key]
            .replace(/```[a-zA-Z]*/g, "")
            .replace(/```/g, "")
            .replace(/\bundefined\b/g, "")
            .trim();
        } else {
          cleanData[key] = data[key] ?? "";
        }
      }
      setResult(cleanData);
    } catch (err) {
      setResult({
        error: err.response?.data?.error || err.message || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;500;600&display=swap');
        .ca-root { font-family: 'Inter', sans-serif; }
        .syne { font-family: 'Syne', sans-serif; }

        .dot-bg {
          background-image: radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 26px 26px;
        }

        .back-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 7px 14px; border-radius: 10px;
          font-size: 0.78rem; font-weight: 500;
          color: #9ca3af;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          transition: all 0.2s ease; cursor: pointer;
        }
        .back-btn:hover {
          background: rgba(14,165,233,0.08);
          border-color: rgba(14,165,233,0.2);
          color: #7dd3fc;
        }

        /* Loading shimmer bar */
        @keyframes shimmer {
          0%   { background-position: -600px 0; }
          100% { background-position: 600px 0; }
        }
        .loading-bar {
          height: 2px; border-radius: 2px;
          background: linear-gradient(90deg, transparent 0%, #38bdf8 50%, transparent 100%);
          background-size: 600px 2px;
          animation: shimmer 1.5s infinite linear;
        }

        /* Pulse dots */
        @keyframes dotPulse {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
          40%            { opacity: 1;   transform: scale(1); }
        }
        .dot-1 { animation: dotPulse 1.2s infinite 0s; }
        .dot-2 { animation: dotPulse 1.2s infinite 0.2s; }
        .dot-3 { animation: dotPulse 1.2s infinite 0.4s; }

        /* Section divider */
        .section-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(14,165,233,0.15), transparent);
          margin: 0;
        }
      `}</style>

      <div className="ca-root min-h-screen bg-[#030009] text-white relative overflow-x-hidden">
        {/* Dot bg */}
        <div className="dot-bg absolute inset-0 pointer-events-none opacity-50" />

        {/* Top accent line */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-sky-500/25 to-transparent" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">

          {/* ── Back button ── */}
          <button onClick={() => navigate(-1)} className="back-btn mb-2">
            <MdArrowBack size={14} /> Back
          </button>

          {/* ── Header ── */}
          <div className="text-center mb-3">
            {/* Badge */}
            <div className="flex justify-center mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
                style={{ background: "rgba(14,165,233,0.08)", border: "1px solid rgba(14,165,233,0.18)", color: "#7dd3fc" }}>
                <MdAutoAwesome size={10} />
                AI Powered
              </span>
            </div>

            <h1 className="syne text-3xl sm:text-4xl font-extrabold text-white">
              Easyway{" "}
              <span style={{
                background: "linear-gradient(135deg,#38bdf8 0%,#818cf8 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>
                Code Analyzer
              </span>
            </h1>

            <p className="mt-2 text-xs text-gray-500 max-w-md mx-auto">
              Paste your code, select the language, and get instant AI-powered analysis, suggestions, and improvements.
            </p>

            {/* Stats pills */}
            <div className="flex items-center justify-center gap-3 mt-4 flex-wrap">
              {["Debug", "Optimize", "Explain", "Improve"].map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", color: "#4b5563" }}>
                  <MdOutlineCode size={10} /> {tag}
                </span>
              ))}
            </div>

            {/* Divider */}
            <div className="mt-5 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
          </div>

          {/* ── Code Editor ── */}
          <div className="rounded-2xl overflow-hidden border border-white/[0.07] bg-[#0a0a14] mb-5 shadow-xl">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]"
              style={{ background: "rgba(14,165,233,0.03)" }}>
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
              </div>
              <span className="text-[10px] uppercase tracking-widest text-gray-600 ml-2 syne">
                Code Editor
              </span>
            </div>
            <CodeEditor initialCode="" onRun={handleRun} />
          </div>

          {/* ── Loading state ── */}
          {loading && (
            <div className="rounded-2xl border border-white/[0.07] bg-[#0a0a14] p-8 flex flex-col items-center gap-4">
              <div className="w-full max-w-xs">
                <div className="loading-bar w-full" />
              </div>
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="dot-1 w-2 h-2 rounded-full bg-sky-400" />
                  <span className="dot-2 w-2 h-2 rounded-full bg-sky-400" />
                  <span className="dot-3 w-2 h-2 rounded-full bg-sky-400" />
                </div>
                <p className="text-sm text-gray-400 font-medium">
                  Analyzing your code with AI…
                </p>
              </div>
              <p className="text-[11px] text-gray-700">This may take a few seconds</p>
            </div>
          )}

          {/* ── Result Panel ── */}
          {!loading && result && (
            <div className="rounded-2xl overflow-hidden border border-white/[0.07] bg-[#0a0a14] shadow-xl">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]"
                style={{ background: "rgba(14,165,233,0.03)" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                <span className="text-[10px] uppercase tracking-widest text-gray-500 syne">
                  Analysis Result
                </span>
              </div>
              <ResultPanel result={result} language="javascript" />
            </div>
          )}

          {/* ── Idle placeholder ── */}
          {!loading && !result && (
            <div className="rounded-2xl border border-dashed border-white/[0.06] p-10 flex flex-col items-center gap-3 text-center">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(14,165,233,0.06)", border: "1px solid rgba(14,165,233,0.12)" }}>
                <MdOutlineCode className="text-sky-500/50" size={22} />
              </div>
              <p className="text-sm text-gray-600">
                Paste your code above and click <span className="text-sky-500/70 font-semibold">Analyze</span> to get started.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}