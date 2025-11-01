import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { FaPaperPlane, FaCode } from "react-icons/fa";
import Loading from "../../component/Loading";

// Helper function to check if an answer is empty
const isAnswerEmpty = (answer) => {
  return !answer || (typeof answer === "string" && answer.trim() === "");
};

export default function Quiz() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    axios
      .get(`${API_URL}/quiz/quizSet/${quizId}`)
      .then((res) => {
        setQuiz(res.data);
        setAnswers(new Array(res.data.questions.length).fill(null));
        setLoading(false);
      })
      .catch(() => {
        toast.error("Quiz not found or failed to load.");
        navigate("/quizzes");
      });
  }, [quizId, navigate, API_URL]);

  const handleChange = (index, value) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const totalQuestions = useMemo(() => quiz?.questions?.length || 0, [quiz]);
  const answeredCount = useMemo(
    () => answers.filter((a) => !isAnswerEmpty(a)).length,
    [answers]
  );

  const handleSubmit = async () => {
    if (answeredCount === 0) {
      toast.error("Please answer at least one question before submitting.");
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(
        `${API_URL}/quiz/submit`,
        { quizId: quiz._id, answers: answers.slice(0, totalQuestions) },
        { withCredentials: true }
      );
      navigate("/result");
    } catch (err) {
      toast.error(
        err.response?.data?.error || "Error submitting quiz. Try again later."
      );
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen px-4 py-10 sm:px-6 flex justify-center bg-[#050505] text-white">
      <div className="relative w-full max-w-4xl space-y-6">
        {/* Header (includes Progress Bar) */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 60 }}
          className="text-center p-6 sm:p-8 bg-gradient-to-br from-[#101010]/70 via-[#181818]/70 to-[#0a0a0a]/70 border border-white/10 rounded-3xl shadow-2xl backdrop-blur-md"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-sky-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
            {quiz.title}
          </h1>
          <p className="text-gray-400 text-sm sm:text-base mt-2">
            Total Questions: {totalQuestions}
          </p>
          <p className="text-gray-300 text-sm mt-1">
            Progress: {answeredCount} / {totalQuestions} answered
          </p>

          {/* Progress Bar */}
          <div className="mt-4 w-full max-w-xs mx-auto">
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${Math.round(
                    (answeredCount / totalQuestions) * 100
                  )}%`,
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-sky-500 to-purple-500"
              />
            </div>
          </div>
        </motion.div>

        {/* Questions */}
        <AnimatePresence>
          {quiz.questions.map((q, idx) => {
            const isCode = q.type !== "mcq";
            const ans = answers[idx];
            const answered = !isAnswerEmpty(ans);

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className={`p-5 sm:p-7 rounded-2xl border backdrop-blur-md transition-all ${
                  answered
                    ? "border-sky-400/40 bg-gradient-to-br from-[#0a1a2a]/60 to-[#111]/60 shadow-sky-800/40 shadow-2xl"
                    : "border-white/10 bg-[#111]/70"
                }`}
              >
                {/* Question Header */}
                <div className="flex flex-wrap justify-between items-center mb-3">
                  <p className="text-lg sm:text-xl font-semibold text-gray-200 whitespace-pre-wrap break-words">
                    <span className="text-purple-400 mr-2">{idx + 1}.</span>
                    {q.questionText}
                  </p>
                  
                  {/* Marks Display */}
                  <span className="text-sm font-semibold px-3 py-1 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md">
                    {q.marks} Marks
                  </span>
                </div>

                {/* Question Type */}
                {isCode ? (
                  <div className="mt-3">
                    <label className="text-sm text-gray-400 flex items-center mb-2">
                      <FaCode className="mr-2" /> Code Answer
                    </label>
                    <textarea
                      className="w-full p-4 rounded-lg bg-[#0a0a0a] border border-gray-700 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 font-mono text-sm sm:text-base resize-y"
                      rows={6}
                      value={ans || ""}
                      onChange={(e) => handleChange(idx, e.target.value)}
                      placeholder="Write your code here..."
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                    {q.options.map((opt, i) => {
                      const selected = ans === opt.text;
                      return (
                        <label
                          key={i}
                          className={`flex items-center p-3 rounded-lg cursor-pointer border transition-all ${
                            selected
                              ? "bg-gradient-to-r from-sky-600/30 to-purple-600/30 border-sky-400 shadow-lg shadow-sky-700/20"
                              : "bg-gray-800/40 border-gray-700 hover:bg-gray-700/50"
                          }`}
                        >
                          <input
                            type="radio"
                            name={`q${idx}`}
                            value={opt.text}
                            checked={selected}
                            onChange={(e) => handleChange(idx, e.target.value)}
                            className="h-4 w-4 accent-purple-500 focus:ring-purple-400"
                          />
                          <span className="ml-3 text-sm sm:text-base">
                            {opt.text}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Note */}
        <p className="text-yellow-400 text-xs sm:text-sm text-center italic">
          * Code questions are checked for keyword presence, not exact logic.
        </p>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSubmit}
          disabled={submitting || answeredCount === 0}
          className={`w-full sm:w-1/2 mx-auto flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-sky-600 to-purple-600 transition-all ${
            submitting || answeredCount === 0
              ? "opacity-70 cursor-not-allowed"
              : "hover:from-sky-500 hover:to-purple-500 shadow-xl shadow-sky-600/30"
          }`}
        >
          <FaPaperPlane
            className={`${
              submitting ? "animate-pulse" : ""
            } text-white text-xl`}
          />
          {submitting ? "Submitting..." : "Submit Quiz"}
        </motion.button>
      </div>
    </div>
  );
}
