import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loading from "../../component/Loading";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaPlayCircle,
  FaHourglassHalf,
  FaRegSmileBeam,
  FaSearch,
} from "react-icons/fa";
import { motion } from "framer-motion";

export default function QuizzesList({ userId }) {
  const [quizzes, setQuizzes] = useState([]);
  const [completedQuizzes, setCompletedQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const cardStyles = [
    {
      color: "blue",
      border: "border-blue-500/40",
      gradient: "from-blue-600 to-indigo-600",
    },
    {
      color: "purple",
      border: "border-purple-500/40",
      gradient: "from-purple-600 to-fuchsia-600",
    },
    {
      color: "teal",
      border: "border-teal-500/40",
      gradient: "from-teal-600 to-cyan-600",
    },
    {
      color: "amber",
      border: "border-amber-500/40",
      gradient: "from-amber-500 to-orange-500",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allRes, completedRes] = await Promise.all([
          axios.get(`${API_URL}/quiz`),
          axios.get(`${API_URL}/quiz/complete-quiz`),
        ]);
        setQuizzes(allRes.data);
        setCompletedQuizzes(completedRes.data.completed || []);
      } catch (err) {
        console.error("Error fetching quizzes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId, API_URL]);

  const handleStartQuiz = (quizId) => navigate(`/quiz/${quizId}`);

  //  Filter quizzes by search
  const filteredQuizzes = useMemo(() => {
    return quizzes.filter(
      (q) =>
        q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (q.subject &&
          q.subject.toLowerCase().includes(searchTerm.toLowerCase())),
    );
  }, [searchTerm, quizzes]);

  if (loading) return <Loading />;

  return (
    <div className="p-4 px-8 md:px-20 md:p-8 max-w-8xl mx-auto min-h-screen text-gray-100">
      {/* Back Button */}
      <motion.button
        onClick={() => navigate(-1)}
        className="group relative flex items-center gap-3 mb-2 transition-all duration-300 outline-none"
        whileHover="hover"
        initial="initial"
      >
        {/* Icon Container (The "Keycap") */}
        <motion.div
          variants={{
            initial: { x: 0, backgroundColor: "rgba(255, 255, 255, 0.05)" },
            hover: {
              x: -4,
              backgroundColor: "rgba(6, 182, 212, 0.1)",
              borderColor: "rgba(6, 182, 212, 0.4)",
            },
          }}
          className="flex items-center justify-center w-10 h-10 rounded-xl border border-white/10 backdrop-blur-md transition-colors"
        >
          <FaArrowLeft className="text-slate-400 group-hover:text-cyan-400 transition-colors" />
        </motion.div>

        {/* Label Container */}
        <div className="flex flex-col items-start">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 group-hover:text-slate-300 transition-colors">
            Return
          </span>
          <span className="text-sm font-bold text-slate-400 group-hover:text-white transition-colors -mt-1">
            Back to Hub
          </span>
        </div>

        {/* Subtle Underline Animation */}
        <motion.div
          variants={{
            initial: { width: 0, opacity: 0 },
            hover: { width: "100%", opacity: 1 },
          }}
          className="absolute -bottom-1 left-0 h-[1px] bg-gradient-to-r from-cyan-500/50 to-transparent"
        />
      </motion.button>

      {/* ── HEADER SECTION ── */}
      <div className="relative mb-5 flex flex-col items-center text-center">
        {/* Eyebrow Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6"
        >
          <div className="h-1.5 w-1.5  rounded-full bg-indigo-400 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">
            Academic Portal
          </span>
        </motion.div>

        {/* Main Title */}

        <div className="flex flex-col justify-center items-center">
          <h1 className="flex justify-center flex-wrap gap-1 text-4xl md:text-4xl font-black tracking-tighter mb-1">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/40">
              Quizzes &
            </span>
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-cyan-400 to-blue-500 drop-shadow-[0_0_15px_rgba(99,102,241,0.3)]">
              Certifications
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-500 text-sm md:text-base max-w-lg font-medium leading-relaxed">
            Validate your technical expertise through our industry-standard
            assessment modules and earn verifiable credentials.
          </p>
        </div>
      </div>

      {/* ── SEARCH BAR SECTION ── */}
      <div className="flex justify-center mb-16 relative z-20">
        <div className="relative w-full max-w-xl group">
          {/* Background Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-2xl blur opacity-0 group-focus-within:opacity-20 transition duration-500" />

          <div className="relative flex items-center">
            <FaSearch className="absolute left-5 text-slate-200 group-focus-within:text-fuchsia-400 transition-colors duration-300" />
            <input
              type="search"
              placeholder="Filter by subject or module title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full  backdrop-blur-xl border border-white/30 rounded-2xl pl-14 pr-6 py-4 text-sm text-white placeholder:text-slate-600 focus:border-fuchsia-500/50 outline-none transition-all shadow-2xl"
            />

            {/* Visual Shortcut Hint (Hidden on mobile) */}
            <div className="absolute right-4 hidden md:flex items-center gap-1 px-2 py-1 rounded-md bg-white/5 border border-white/10">
              <span className="text-[10px] font-bold text-slate-500 tracking-tighter italic">
                ESC to clear
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* No Quiz */}
      {filteredQuizzes.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-60 border border-gray-700/50 rounded-xl bg-gray-900/50">
          <FaHourglassHalf className="text-5xl text-gray-500 mb-3" />
          <p className="text-gray-400 text-center text-sm md:text-base font-medium">
            {searchTerm
              ? "No quizzes found matching your search."
              : "No quizzes available at the moment. Please check back later!"}
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((q, index) => {
            const completedQuiz = completedQuizzes.find(
              (cq) => cq.quiz._id === q._id,
            );
            const completed = Boolean(completedQuiz);
            const certificateGenerated =
              completedQuiz?.certificateGenerated || false;
            const style = cardStyles[index % cardStyles.length];

            return (
              <motion.div
                key={q._id}
                className={`bg-gradient-to-br from-gray-950 to-black shadow-lg rounded-xl p-4 flex flex-col justify-between transition-all duration-300 transform border
                ${
                  completed
                    ? "border-green-500/60 hover:shadow-green-500/20"
                    : `hover:shadow-${style.color}-500/30 ${style.border}`
                } hover:bg-gray-800/50`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                {/* Quiz Info */}
                <div>
                  <h2
                    className={`text-lg font-bold mb-2 ${
                      completed ? "text-gray-100" : "text-white"
                    }`}
                  >
                    {q.title}
                  </h2>
                  <p className="text-gray-300 text-xs mb-1">
                    <span className="text-blue-400 font-semibold">
                      Subject:
                    </span>{" "}
                    {q.subject || "General"}
                  </p>
                  <p className="text-gray-300 text-xs">
                    <span className="text-blue-400 font-semibold">
                      Questions:
                    </span>{" "}
                    {q.questions.length}
                  </p>

                  {/* Status Section */}
                  <div className="mt-3">
                    {!completed ? (
                      <span className="inline-flex items-center bg-gray-950 text-fuchsia-200 text-xs font-bold px-2.5 py-1 rounded-full border border-fuchsia-500/40">
                        <FaPlayCircle className="mr-1 text-xs" /> Not Attempted
                      </span>
                    ) : certificateGenerated ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center bg-green-500/20 text-blue-300 text-xs font-bold px-2.5 py-1 rounded-full border border-blue-500/40"
                      >
                        <FaRegSmileBeam className="mr-1 text-xs" />
                        Certificate Granted
                      </motion.div>
                    ) : (
                      <span className="inline-flex items-center bg-blue-500/20 text-blue-300 text-xs font-bold px-2.5 py-1 rounded-full border border-blue-500/40">
                        <FaHourglassHalf className="mr-1 text-xs" /> Certificate
                        Not Earned
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleStartQuiz(q._id)}
                  disabled={completed}
                  className={`mt-4 py-2 text-sm rounded-lg font-semibold uppercase tracking-wide transition duration-300 shadow-md flex justify-center items-center gap-2
                    ${
                      completed
                        ? "bg-gray-800 text-gray-400 cursor-not-allowed border border-gray-600"
                        : `text-white bg-gradient-to-r ${style.gradient} hover:shadow-md hover:shadow-${style.color}-500/30 focus:ring-4 focus:ring-${style.color}-500/30`
                    }`}
                >
                  {completed ? (
                    <span className="flex items-center gap-1">
                      <FaCheckCircle /> Attempted
                    </span>
                  ) : (
                    <>
                      <FaPlayCircle /> Start
                    </>
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
