import React, { useState } from "react";
import axios from "axios";
import CodeEditor from "./CodeEditor";
import ResultPanel from "./ResultPanel";
import {FaArrowLeft} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function CodeAnalyzer() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRun = async (code, language) => {
    setLoading(true);
    setResult(null);

    try {
      const { data } = await axios.post(
        "http://localhost:8000/api/code/analyze-code",
        { code, language },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log(data)

      // 🔹 Clean up the response (remove undefined + markdown fences)
      const cleanData = {};
      for (const key in data) {
        if (typeof data[key] === "string") {
          cleanData[key] = data[key]
            .replace(/```[a-zA-Z]*/g, "") // remove ```java / ```python etc.
            .replace(/```/g, "")          // remove leftover ```
            .replace(/\bundefined\b/g, "") // remove "undefined"
            .trim();
        } else {
          cleanData[key] = data[key] ?? "";
        }
      }
     console.log("Cleaned Analysis Data:", cleanData);
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
      {/* header */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 px-3 py-1 mb-1 m-2 mx-5
                                     bg-gray-800 hover:bg-gray-700 text-gray-200 
                                     rounded-lg text-sm shadow-md transition-all cursor-pointer"
          >
            <FaArrowLeft className="text-sm" />
            <span>Back</span>
          </button>
    <div className="flex justify-center text-3xl font-semibold pt-3">
      Easyway AI Code Analyzer
    </div>
    <div className="p-6 space-y-6">
      <CodeEditor
        initialCode="// Write your code here..."
        onRun={handleRun}
      />

      {loading ? (
        <div className="text-center text-blue-400 font-semibold">
          Analyzing your code...
        </div>
      ) : (
        <ResultPanel result={result} language="javascript" />
      )}
    </div>
    </>
  );
}
