import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaCertificate,
  FaTrophy,
  FaCalendarAlt,
  FaArrowLeft
} from "react-icons/fa";
import { motion } from "framer-motion";
import Loading from "../../component/Loading";
import { toast } from "react-hot-toast";

export default function Certificates() {
  const [certificates, setCertificates] = useState([]);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_URL}/quiz/user-certificates`, { withCredentials: true })
      .then((res) => {
        setCertificates(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        if (err.response?.status === 401) {
          toast.error("Login required");
          navigate("/login");
        } else {
          toast.error("Failed to load certificates");
        }
      });
  }, [navigate, API_URL]);

  if (loading) return <Loading />;

  const total = certificates.length;
  const latest = certificates[0];

  /* ================= EMPTY ================= */
  if (!total) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617] text-white">
        <div className="text-center">
          <FaTrophy className="text-6xl text-indigo-400 mb-4 mx-auto" />
          <h2 className="text-2xl font-bold">No Certificates Yet</h2>
          <button
            onClick={() => navigate("/quizzes")}
            className="mt-6 px-6 py-3 bg-indigo-500 rounded-xl"
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white px-4 sm:px-6 py-8">

      <div className="max-w-7xl mx-auto space-y-8">

        {/* ================= HEADER ================= */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl sm:text-4xl font-bold">
            📊 Dashboard
          </h1>

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg hover:bg-white/10"
          >
            <FaArrowLeft /> Back
          </button>
        </div>

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          {/* TOTAL */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <p className="text-gray-400 text-sm">Total Certificates</p>
            <h2 className="text-3xl font-bold text-indigo-400">{total}</h2>
          </div>

          {/* LATEST */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <p className="text-gray-400 text-sm">Latest Achievement</p>
            <h2 className="text-lg font-semibold text-blue-400 truncate">
              {latest.subject}
            </h2>
          </div>

          {/* DATE */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <p className="text-gray-400 text-sm">Last Earned</p>
            <h2 className="text-lg text-green-400">
              {new Date(latest.date).toLocaleDateString()}
            </h2>
          </div>

        </div>

        {/* ================= FEATURE CARD ================= */}
        <div className="bg-gradient-to-r from-indigo-500 to-blue-600 rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-2">
            🎯 Keep Learning!
          </h2>
          <p className="text-sm text-white/80 mb-4">
            You're doing great. Complete more quizzes to unlock achievements.
          </p>
          <button
            onClick={() => navigate("/quizzes")}
            className="bg-white text-black px-5 py-2 rounded-lg font-semibold"
          >
            Explore Quizzes
          </button>
        </div>

        {/* ================= GRID ================= */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Certificates</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {certificates.map((cert) => (
              <motion.div
                key={cert._id}
                whileHover={{ scale: 1.05 }}
                className="bg-white/5 border border-white/10 rounded-xl p-5 hover:shadow-lg hover:shadow-indigo-500/20 transition cursor-pointer"
                onClick={() =>
                  navigate(`/certificate/${cert.certificateId}`)
                }
              >
                <div className="flex justify-between items-center mb-3">
                  <FaCertificate className="text-indigo-400 text-2xl" />
                  <span className="text-xs text-gray-500">
                    #{cert.certificateId.slice(-4)}
                  </span>
                </div>

                <h3 className="text-lg font-semibold mb-2">
                  {cert.subject}
                </h3>

                <p className="text-sm text-gray-400 mb-4 flex items-center gap-2">
                  <FaCalendarAlt />
                  {new Date(cert.date).toLocaleDateString()}
                </p>

                <button className="w-full bg-indigo-500 py-2 rounded-lg text-sm font-medium hover:bg-indigo-600">
                  View Certificate
                </button>
              </motion.div>
            ))}

          </div>
        </div>

      </div>
    </div>
  );
}