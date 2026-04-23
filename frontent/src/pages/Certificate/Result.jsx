import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaCertificate,
  FaListAlt,
  FaRedoAlt,
  FaBookOpen
} from "react-icons/fa";
import { motion } from "framer-motion";
import Loading from "../../component/Loading";
import { toast } from "react-hot-toast";

const PASS_SCORE = 60;

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
      .catch(() => {
        toast.error("Login required or no result found");
        navigate("/login");
      });
  }, [navigate, API_URL]);

  if (loading) {
    return (
        <Loading />
    );
  }

  const hasPassed = score >= PASS_SCORE;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-br from-[#020617] via-[#0f172a] to-black text-white">

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl p-6 sm:p-8 text-center space-y-6"
      >

        {/* TITLE */}
        <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-400 text-transparent bg-clip-text">
          Quiz Result
        </h1>

        {/* SCORE CARD */}
        <div className="flex flex-col items-center">

          <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-emerald-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <div className="w-24 h-24 rounded-full bg-[#020617] flex items-center justify-center">
              <span className="text-3xl font-bold">{score}</span>
            </div>
          </div>

          <p className="mt-3 text-sm text-gray-400">Score out of 100</p>
        </div>

        {/* STATUS */}
        {hasPassed ? (
          <div className="space-y-3">
            <FaCheckCircle className="text-emerald-400 text-5xl mx-auto animate-bounce" />
            <p className="text-emerald-400 text-xl font-bold">
              🎉 You Passed!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <FaTimesCircle className="text-red-400 text-5xl mx-auto" />
            <p className="text-red-400 text-xl font-bold">
               Better Luck Next Time
            </p>
          </div>
        )}

        {/* ACTIONS */}
        <div className="grid gap-3">

          {hasPassed && certificateId && (
            <button
              onClick={() => navigate(`/certificate/${certificateId}`)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold bg-gradient-to-r from-emerald-500 to-indigo-500 hover:opacity-90 transition shadow-lg"
            >
              <FaCertificate /> View Certificate
            </button>
          )}

         

          {/* NEW: TRY OTHER COURSE */}
          <button
            onClick={() => navigate("/quizzes")}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 transition shadow-lg"
          >
            <FaBookOpen /> Try Other Quiz
          </button>

          <button
            onClick={() => navigate("/certificates")}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium bg-white/5 hover:bg-white/10 transition"
          >
            <FaListAlt /> All Certificates
          </button>

        </div>

        {/* EXTRA INFO */}
        <div className="text-xs text-gray-500 pt-2 border-t border-white/10">
          Passing Score: {PASS_SCORE}%
        </div>

      </motion.div>
    </div>
  );
}