import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loading from "../../component/Loading";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaPlayCircle,
  FaAward,
  FaHourglassHalf,
  FaRegSmileBeam,
} from "react-icons/fa";
import { motion } from "framer-motion";

export default function QuizzesList({ userId }) {
  const [quizzes, setQuizzes] = useState([]);
  const [completedQuizzes, setCompletedQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
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

  if (loading) return <Loading />;

  return (
    <div className="p-4 px-8 md:p-8 max-w-7xl mx-auto min-h-screen text-gray-100">
      {/* Back Button */}
      <motion.button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 mb-8 text-gray-400 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 rounded-md p-1"
        whileHover={{ x: -5 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaArrowLeft className="text-lg" />
        <span className="font-medium text-sm px-4 py-1 bg-black/60 rounded-lg border border-gray-700">
          Back
        </span>
      </motion.button>

      {/* Header */}
      <h1 className="text-2xl sm:text-3xl font-extrabold mb-10 text-center">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-fuchsia-400 drop-shadow-lg">
          Quizzes & Certificates
        </span>
      </h1>

      {/* No Quiz */}
      {quizzes.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-60 border border-gray-700/50 rounded-xl bg-gray-900/50">
          <FaHourglassHalf className="text-5xl text-gray-500 mb-3" />
          <p className="text-gray-400 text-center text-sm md:text-base font-medium">
            No quizzes available at the moment. Please check back later!
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((q, index) => {
            const completedQuiz = completedQuizzes.find(
              (cq) => cq.quiz._id === q._id
            );
            const completed = Boolean(completedQuiz);
            const certificateGenerated =
              completedQuiz?.certificateGenerated || false;
            const style = cardStyles[index % cardStyles.length];

            return (
              <motion.div
                key={q._id}
                className={`bg-gradient-to-br from-gray-950 to-black  shadow-lg rounded-xl p-4 flex flex-col justify-between transition-all duration-300 transform border
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
                      completed ? "text-gray-300" : "text-white"
                    }`}
                  >
                    {q.title}
                  </h2>
                  <p className="text-gray-400 text-xs mb-1">
                    <span className="text-fuchsia-400 font-semibold">
                      Subject:
                    </span>{" "}
                    {q.subject || "General"}
                  </p>
                  <p className="text-gray-400 text-xs">
                    <span className="text-fuchsia-400 font-semibold">
                      Questions:
                    </span>{" "}
                    {q.questions.length}
                  </p>

                  {/* Status Section */}
                  <div className="mt-3">
                    {!completed ? (
                      <span className="inline-flex items-center bg-fuchsia-600/20 text-fuchsia-200 text-xs font-bold px-2.5 py-1 rounded-full border border-fuchsia-500/40">
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
                        ? "bg-gray-700 text-gray-400 cursor-not-allowed border border-gray-600"
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
