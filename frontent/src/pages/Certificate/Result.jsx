import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaCertificate,
  FaListAlt,
  FaRedoAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";
import Loading from "../../component/Loading";
import { toast } from "react-hot-toast";

const PASS_SCORE = 60; // Passing threshold

export default function Result() {
  const navigate = useNavigate();
  const [score, setScore] = useState(null);
  const [certificateId, setCertificateId] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios
      .get(`${API_URL}/quiz/user-score`, { withCredentials: true })
      .then((res) => {
        setScore(res.data.score);
        setCertificateId(res.data.certificate?.certificateId || null);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Result fetch error:", error);
        toast.error(
          "You must be logged in to view the result, or no recent result found."
        );
        navigate("/login");
      });
  }, [navigate, API_URL]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#050505] text-gray-300">
        <Loading />
      </div>
    );

  const hasPassed = score >= PASS_SCORE;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] px-4 py-10 text-gray-100">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        className="bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-2xl p-8 sm:p-10 max-w-sm w-full text-center border border-blue-400 space-y-6"
      >
        <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-purple-400">
          Final Result
        </h1>

        {/* Score Display */}
        <div className="p-4 bg-gray-950/70 rounded-lg border border-gray-700">
          <p className="text-lg text-gray-400 mb-1">Your Final Score</p>
          <div
            className={`text-5xl font-bold ${
              hasPassed ? "text-green-400" : "text-red-400"
            }`}
          >
            {score} / 100
          </div>
        </div>

        {/* Pass / Fail Status */}
        {hasPassed ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <FaCheckCircle className="text-green-500 text-5xl mx-auto" />
            <p className="text-green-400 text-xl font-bold">
              Congratulations! You passed.
            </p>

            {certificateId && (
              <button
                onClick={() => navigate(`/certificate/${certificateId}`)}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-semibold py-3 rounded-xl transition-all shadow-md shadow-sky-800/50"
              >
                <FaCertificate /> View Certificate
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <FaTimesCircle className="text-red-500 text-5xl mx-auto" />
            <p className="text-red-400 text-xl font-bold">
              Failed. Keep practicing!
            </p>

            <button
              onClick={() => navigate("/quizzes")}
              className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 rounded-xl transition-all shadow-md shadow-gray-800/50"
            >
              <FaRedoAlt /> Try Another Quiz
            </button>
          </motion.div>
        )}

        {/* Divider */}
        <div className="border-t border-gray-700 pt-6">
          <button
            onClick={() => navigate("/certificates")}
            className="w-full flex items-center justify-center gap-2 text-gray-400 hover:text-purple-400 font-medium py-2 rounded transition-colors"
          >
            <FaListAlt /> View All Certificates
          </button>
        </div>
      </motion.div>
    </div>
  );
}
