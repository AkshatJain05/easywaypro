import TypingCode from "./TypingCode";
import { FaExclamationCircle, FaCode } from "react-icons/fa";

export default function ResultPanel({ result, language }) {
  if (!result) return null;

  // Keys that should be displayed as code blocks
  const codeKeys = ["optimizedCode", "fixedCode", "refactoredCode", "analyzedCode"];

  return (
    <div className="mt-6 max-w-6xl w-full mx-auto rounded-xl bg-gray-900 text-gray-100 space-y-6 shadow-2xl border border-gray-700 p-4 sm:p-6">
      {/* Error Section */}
      {result.error && (
        <div className="flex items-center gap-2 text-red-400 font-semibold bg-red-900/30 p-3 rounded-lg border border-red-700 text-sm sm:text-base">
          <FaExclamationCircle size={18} />
          <span>{result.error}</span>
        </div>
      )}

      {/* Dynamic Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(result).map(([key, value]) => {
          if (!value || key === "error") return null;

          const label = key
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase());

          return (
            <div
              key={key}
              className="bg-gray-800/80 p-4 rounded-lg shadow-inner hover:bg-gray-800 transition flex flex-col"
            >
              <h3 className="font-semibold text-blue-300 mb-2 flex items-center gap-2 text-sm sm:text-base">
                <FaCode /> {label}
              </h3>

              {codeKeys.includes(key) ? (
                <div className="bg-gray-900 rounded-md p-3 overflow-x-auto max-h-80 sm:max-h-[400px]">
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
