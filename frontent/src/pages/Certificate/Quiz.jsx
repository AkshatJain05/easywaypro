import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Loading from "../../component/Loading";
import { toast } from "react-hot-toast";

export default function Quiz() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios
      .get(`${API_URL}/quiz/quizSet/${quizId}`)
      .then((res) => {
        setQuiz(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Quiz not found.");
        navigate("/quizzes");
      });
  }, [quizId]);

  const handleChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await axios.post(
        `${API_URL}/quiz/submit`,
        { quizId: quiz._id, answers },
        { withCredentials: true }
      );
      navigate("/result");
    } catch (err) {
      console.error(err);
      toast.error("Error submitting quiz. Make sure you are logged in.");
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-900 py-6 px-4 md:px-8 flex justify-center">
      <div className="w-full max-w-5xl flex flex-col gap-6">
        <h1 className="text-4xl font-extrabold text-center text-white mb-4">
          {quiz.title}
        </h1>

        {quiz.questions.map((q, idx) => (
          <div
            key={idx}
            className={`p-6 rounded-xl shadow-lg ${
              q.type === "mcq"
                ? "bg-gradient-to-r from-slate-950 to-gray-950"
                : "bg-gradient-to-r from-slate-950 to-gray-950"
            }`}
          >
            <pre className="font-semibold mb-4 text-white whitespace-pre-wrap break-words text-lg">
              {idx + 1}. {q.questionText}
            </pre>

            {q.type === "mcq" ? (
              <div className="flex flex-col gap-3">
                {q.options.map((opt, i) => (
                  <label
                    key={i}
                    className="flex items-center p-3 rounded-lg cursor-pointer transition-all hover:bg-blue-700/30 bg-blue-700/10 text-white"
                  >
                    <input
                      type="radio"
                      name={`q${idx}`}
                      value={opt.text}
                      onChange={(e) => handleChange(idx, e.target.value)}
                      className="form-radio h-5 w-5 text-blue-900 accent-orange-400"
                    />
                    <span className="ml-3">{opt.text}</span>
                  </label>
                ))}
              </div>
            ) : (
              <textarea
                className="w-full p-4 rounded-lg bg-gray-950 border-1 border-gray-200 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
                rows={6}
                onChange={(e) => handleChange(idx, e.target.value)}
                placeholder="Write your code here..."
              />
            )}
          </div>
        ))}

        <p className="text-yellow-400 text-sm md:text-base mt-2 mb-6 text-center md:text-left">
          Note: Code questions are evaluated only for the presence of specific
          keywords (answer hints). They do not check full correctness or logic
          of your program.
        </p>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className={`w-full md:w-1/3 mx-auto bg-green-800 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all flex justify-center items-center ${
            submitting ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {submitting ? "Submitting..." : "Submit Quiz"}
        </button>
      </div>
    </div>
  );
}
