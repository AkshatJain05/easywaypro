import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loading from "../../component/Loading";
import { FaArrowLeft, FaCheckCircle, FaPlayCircle } from "react-icons/fa"; // Kept essential status/action icons
import { motion } from "framer-motion";

export default function QuizzesList({ userId }) {
  const [quizzes, setQuizzes] = useState([]);
  const [completedQuizzes, setCompletedQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  // Reduced card styles array for a cleaner look, focusing only on colors
  const cardStyles = [
    { color: 'blue', border: 'border-blue-500/50', gradient: 'from-blue-600 to-indigo-600' },
    { color: 'purple', border: 'border-purple-500/50', gradient: 'from-purple-600 to-fuchsia-600' },
    { color: 'teal', border: 'border-teal-500/50', gradient: 'from-teal-600 to-cyan-600' },
    { color: 'amber', border: 'border-amber-500/50', gradient: 'from-amber-500 to-orange-500' },
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

  const handleStartQuiz = (quizId) => {
    navigate(`/quiz/${quizId}`);
  };

  if (loading) return <Loading />;

  // --- UI START ---
  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto min-h-screen  text-gray-100">
      
      {/* Back Button */}
      <motion.button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 mb-10 text-gray-400 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 rounded-md p-1 -ml-1"
        whileHover={{ x: -5 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaArrowLeft className="text-lg" /> 
        <span className="font-medium text-sm border-1 py-2 px-4 bg-black rounded">Back</span>
      </motion.button>
      
      {/* Header */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-12 text-center drop-shadow-lg">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-fuchsia-400">
          Available Quizzes and Code (Certificate)
        </span>
      </h1>

      {quizzes.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 border border-gray-700/50 rounded-xl bg-gray-900/50">
          {/* Using FaCheckCircle as a placeholder for a quiz/code icon */}
          <FaCheckCircle className="text-6xl text-gray-500 mb-4" /> 
          <p className="text-center text-lg text-gray-400 font-medium">
            No quizzes available at this time. Check back soon!
          </p>
        </div>
      ) : (
        //  Layout change: md:grid-cols-2 (Two columns on desktop)
        <div className="grid md:grid-cols-2 gap-8">
          {quizzes.map((q, index) => {
            const completed = completedQuizzes.some(
              (cq) => cq.quiz._id === q._id
            );
            
            const style = cardStyles[index % cardStyles.length];

            return (
              <motion.div
                key={q._id}
                className={`bg-gray-900/30 shadow-2xl rounded-xl p-6 flex flex-col justify-between transition-all duration-300 transform border-2 
                  ${
                    completed 
                      ? "border-green-500/70 opacity-80" 
                      : `hover:shadow-fuchsia-500/30 ${style.border} hover:scale-[1.02]`
                  }
                  hover:bg-gray-800/50
                `}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <div>
                  <div className="flex items-center mb-4">
                    {/* Removed emoji icon, simplified title presentation */}
                    <h2 className={`text-2xl font-bold ${completed ? 'text-gray-300' : 'text-white'}`}>
                        {q.title}
                    </h2>
                  </div>
                  
                  <div className="text-sm space-y-2">
                    <p className="text-gray-400 font-medium">
                        <span className="text-fuchsia-400">Subject:</span> {q.subject || 'General'}
                    </p>
                    <p className="text-gray-400 font-medium">
                        <span className="text-fuchsia-400">Questions:</span> {q.questions.length}
                    </p>
                  </div>
                  
                  {/* Status Badge */}
                  <div className="mt-5">
                    {completed ? (
                      <span className="inline-flex items-center bg-green-700/50 text-green-300 text-xs font-bold px-3 py-1 rounded-full border border-green-500/50">
                        <FaCheckCircle className="mr-1" /> Completed
                      </span>
                    ) : (
                      <span className="inline-block bg-fuchsia-600/50 text-fuchsia-200 text-xs font-bold px-3 py-1 rounded-full border border-fuchsia-500/50">
                        Ready to Start
                      </span>
                    )}
                  </div>
                  
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleStartQuiz(q._id)}
                  disabled={completed}
                  className={`mt-6 py-3 rounded-lg font-bold uppercase tracking-wider transition duration-300 shadow-lg flex justify-center items-center gap-2
                    ${
                      completed
                        //  Changed button background and text color for attempted status
                        ? "bg-gray-700 text-gray-400 cursor-not-allowed border border-gray-600" 
                        : `text-white bg-gradient-to-r ${style.gradient} hover:shadow-xl hover:shadow-${style.color}-500/20 focus:ring-4 focus:ring-${style.color}-500/50`
                    }`}
                >
                  {completed ? (
                    //  Button text changed to "Attempted"
                    <span className="flex items-center gap-2">
                        <FaCheckCircle /> Attempted
                    </span>
                  ) : (
                    <>
                      <FaPlayCircle /> Start Quiz
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