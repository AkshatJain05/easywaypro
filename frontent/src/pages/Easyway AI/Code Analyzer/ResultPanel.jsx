import TypingCode from "./TypingCode";
import { FaExclamationCircle, FaCode, FaMagic } from "react-icons/fa";

export default function ResultPanel({ result, language }) {
  if (!result) return null;

  const codeKeys = ["optimizedCode", "fixedCode", "refactoredCode", "analyzedCode"];

  return (
    <div className="mt-6 max-w-6xl w-full mx-auto rounded-2xl bg-gradient-to-r from-gray-950 to-black text-gray-100 space-y-6 shadow-2xl border border-gray-800 p-4 sm:p-6 transition-all">
      
      {/* Heading */}
      <div className="flex items-center gap-3 mb-4">
        <FaMagic className="text-cyan-400 text-xl sm:text-2xl" />
        <h2 className="text-lg sm:text-2xl font-bold text-gray-100">
          Code Analyzer Results
        </h2>
      </div>

      {/* Error Section */}
      {result.error && (
        <div className="flex items-center gap-3 text-red-400 font-semibold bg-red-900/40 p-3 rounded-xl border border-red-700 text-sm sm:text-base shadow-inner">
          <FaExclamationCircle size={18} />
          <span>{result.error}</span>
        </div>
      )}

      {/* Dynamic Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(result).map(([key, value]) => {
          if (!value || key === "error") return null;

          const label = key
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase());

          return (
            <div
              key={key}
              className="bg-gray-900/70 p-4 rounded-xl shadow-lg hover:shadow-cyan-500/30 transition-all hover:bg-gray-900/90 flex flex-col"
            >
              {/* Label */}
              <h3 className="font-semibold text-cyan-400 mb-3 flex items-center gap-2 text-sm sm:text-base">
                <FaCode /> {label}
              </h3>

              {/* Code Block */}
              {codeKeys.includes(key) ? (
                <div className="bg-gray-950 rounded-lg p-3 overflow-x-auto max-h-80 sm:max-h-[400px] border border-gray-800 shadow-inner">
                  <TypingCode code={String(value)} language={language} />
                </div>
              ) : (
                <p className="text-gray-300 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                  {String(value)}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
