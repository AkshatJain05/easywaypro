import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { IoIosArrowBack } from "react-icons/io";
import { FaCertificate, FaTrophy } from "react-icons/fa";
import { motion } from "framer-motion";
import Loading from "../../component/Loading";
import { toast } from "react-hot-toast";

// Framer Motion Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

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
        console.error(err);
        setLoading(false);
        if (err.response && err.response.status === 401) {
          toast.error("Please log in to view your certificates.");
          navigate("/login");
        } else {
          toast.error("Failed to load certificates.");
        }
      });
  }, [navigate, API_URL]);

  if (loading) return <Loading />;

  //  FIX: JSX inside return must be a single expression, so we remove the misplaced comment block
  if (!certificates.length) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-gray-400 p-6">
        <FaTrophy className="w-16 h-16 text-purple-500 mb-4" />
        <p className="text-xl font-semibold text-white mb-2">
          No Achievements Yet!
        </p>
        <p className="text-md text-gray-400 max-w-sm text-center">
          Complete a quiz with a passing score to earn your first certificate.
        </p>
        <button
          onClick={() => navigate("/quizzes")}
          className="mt-8 flex items-center space-x-2 bg-gradient-to-r from-sky-600 to-purple-700 hover:from-sky-700 hover:to-purple-800 text-white font-medium py-3 px-8 rounded-xl shadow-lg shadow-purple-900/40 hover:shadow-xl transition duration-300"
        >
          <FaTrophy className="w-4 h-4" />
          <span>Start a Quiz</span>
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] py-10 px-4 sm:px-6 text-gray-100">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center pb-4 border-b border-gray-800"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-sky-400 to-purple-500 bg-clip-text text-transparent">
            My Certificates
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-400 hover:text-sky-400 transition-colors p-2 rounded-lg"
          >
            <IoIosArrowBack className="w-5 h-5 mr-1" />
            <span className="hidden sm:inline">Back</span>
          </button>
        </motion.div>

        {/* Certificates Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {certificates.map((cert) => (
            <motion.div
              key={cert._id}
              variants={itemVariants}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 20px rgba(139, 92, 246, 0.4)",
              }}
              className="bg-gradient-to-br from-gray-900/90 to-black/90 p-6 rounded-2xl border border-white/10 shadow-lg relative overflow-hidden group cursor-pointer"
              onClick={() => navigate(`/certificate/${cert.certificateId}`)}
            >
              {/* Subtle Hover Glow */}
              <div className="absolute inset-0 bg-purple-500 opacity-0 group-hover:opacity-[0.05] transition-opacity duration-300 rounded-2xl"></div>

              {/* Badge Icon */}
              <div className="absolute top-4 right-4 text-yellow-400 text-3xl transform group-hover:rotate-12 transition-transform duration-300">
                <FaCertificate />
              </div>

              {/* Subject */}
              <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-2 pr-10 border-b border-purple-500/50 pb-2">
                {cert.subject}
              </h2>

              {/* Date */}
              <p className="text-sm text-gray-400 mt-4 mb-6">
                Awarded on:{" "}
                <span className="text-sky-400 font-medium">
                  {new Date(cert.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </p>

              {/* Button */}
              <button className="w-full bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 text-white font-medium py-2 px-4 rounded-lg shadow-md shadow-purple-800/30 transition duration-300 opacity-90 group-hover:opacity-100">
                View Certificate
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
