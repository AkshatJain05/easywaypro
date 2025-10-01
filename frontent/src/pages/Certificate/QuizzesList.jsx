import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loading from "../../component/Loading";
import { FaArrowLeft } from "react-icons/fa";

export default function QuizzesList({ userId }) {
  const [quizzes, setQuizzes] = useState([]);
  const [completedQuizzes, setCompletedQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

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
  }, [userId]);

  const handleStartQuiz = (quizId) => {
    navigate(`/quiz/${quizId}`);
  };

  if (loading) return <Loading />;

  return (
    <div className="p-6 max-w-5xl mx-auto min-h-screen bg-gray-900 text-gray-100">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 mb-6 text-gray-300 hover:text-white"
      >
        <FaArrowLeft /> <span>Back</span>
      </button>

      <h1 className="text-2xl md:text-4xl font-bold mb-8 text-center">Available Quizzes and Code (Certificate)</h1>

      {quizzes.length === 0 ? (
        <p className="text-center mt-10 text-gray-300">
          No quizzes available.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {quizzes.map((q) => {
            const completed = completedQuizzes.some(
              (cq) => cq.quiz._id === q._id
            );

            return (
              <div
                key={q._id}
                className={`bg-gradient-to-r from-slate-950 to-gray-950  shadow-lg rounded-lg p-6 flex flex-col justify-between hover:scale-105 transition-transform duration-200 border ${
                  completed ? "border-green-500" : "border-gray-100"
                }`}
              >
                <div>
                  <h2 className="text-2xl font-semibold mb-2">{q.title}</h2>
                  <p className="text-gray-300 mb-1">Subject: {q.subject}</p>
                  <p className="text-gray-300 mb-2">
                    Questions: {q.questions.length}
                  </p>
                  {completed && (
                    <span className="inline-block bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded">
                      Completed
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleStartQuiz(q._id)}
                  disabled={completed}
                  className={`mt-4 py-2 rounded-lg font-semibold transition duration-200 flex justify-center items-center
                    ${
                      completed
                        ? "bg-green-600 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                >
                  {completed ? "Completed" : "Start Quiz"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
