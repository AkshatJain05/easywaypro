import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  HiOutlineClock,
  HiChevronLeft,
  HiChevronRight,
  HiCheckCircle,
  HiTerminal,
  HiShieldCheck,
} from "react-icons/hi";
import Loading from "../../component/Loading";

/* ================= RULE COMPONENT ================= */
function QuizRules({ onStart }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] text-white px-4">
      <div className="max-w-xl w-full bg-[#0b0f1a] border border-white/10 rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <HiShieldCheck className="text-indigo-500 text-4xl" />
          <h1 className="text-2xl sm:text-3xl font-bold">
            Examination Protocol
          </h1>
        </div>

        <div className="space-y-4 bg-white/5 p-6 rounded-2xl border border-white/5 mb-8">
          <ul className="space-y-4 text-sm sm:text-base text-gray-400">
            <li className="flex gap-3">
              <span>🚫</span>{" "}
              <p>
                <strong className="text-white">Anti-Cheat:</strong> Switching
                tabs or minimizing will trigger an instant auto-submission.
              </p>
            </li>
            <li className="flex gap-3">
              <span>⏱️</span>{" "}
              <p>
                <strong className="text-white">Timed Sessions:</strong> MCQ
                (40s) and Coding (20m). Progress is saved per question.
              </p>
            </li>
            <li className="flex gap-3">
              <span>🔒</span>{" "}
              <p>
                <strong className="text-white">Navigation:</strong> Back button
                is disabled to ensure sequence integrity.
              </p>
            </li>
          </ul>
        </div>

        <button
          onClick={onStart}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-bold"
        >
          Acknowledge & Start
        </button>
      </div>
    </div>
  );
}

/* ================= MAIN QUIZ ================= */
export default function Quiz() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const answersRef = useRef([]);

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [started, setStarted] = useState(false);

  /* ================= SUBMIT ================= */
  const handleSubmit = useCallback(async () => {
    if (submitting || !quiz) return;
    setSubmitting(true);
    try {
      await axios.post(
        `${API_URL}/quiz/submit`,
        {
          quizId: quiz._id,
          answers: answersRef.current,
        },
        { withCredentials: true },
      );

      toast.success("Assessment Complete");
      navigate("/result");
    } catch {
      toast.error("Submission Failed");
    } finally {
      setSubmitting(false);
    }
  }, [submitting, quiz, API_URL, navigate]);

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(`${API_URL}/quiz/quizSet/${quizId}`);
        setQuiz(res.data);
        const init = new Array(res.data.questions.length).fill(null);
        setAnswers(init);
        answersRef.current = init;
      } catch {
        toast.error("Quiz Not Found");
        navigate("/quizzes");
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId, API_URL, navigate]);

  /* ================= TIMER ================= */
  useEffect(() => {
    if (!quiz) return;
    const q = quiz.questions[current];
    setTimeLeft(q.type === "mcq" ? 40 : 1200);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleNext();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [current, quiz]);

  /* ================= ANTI CHEAT ================= */
  useEffect(() => {
    if (!started) return;

    const handleTab = () => {
      if (document.hidden) {
        toast.error("Auto-submitting...");
        handleSubmit();
      }
    };

    document.addEventListener("visibilitychange", handleTab);

    window.history.pushState(null, "", window.location.href);
    window.onpopstate = () => {
      window.history.pushState(null, "", window.location.href);
      toast.error("Back disabled");
    };

    return () => {
      document.removeEventListener("visibilitychange", handleTab);
    };
  }, [started, handleSubmit]);

  /* ================= ACTIONS ================= */
  const handleNext = () => {
    if (current < quiz.questions.length - 1) {
      setCurrent((prev) => prev + 1);
    }
  };

  const handleChange = (value) => {
    const updated = [...answers];
    updated[current] = value;
    setAnswers(updated);
    answersRef.current = updated;
  };

  const validateCoding = () => {
    const q = quiz.questions[current];
    if (q.type !== "coding") return true;

    const ans = answers[current] || "";
    return (q.keywords || []).every((k) =>
      ans.toLowerCase().includes(k.toLowerCase()),
    );
  };

  if (loading) return <Loading />;
  if (!quiz) return <div className="text-white">Quiz not found</div>;
  if (!started) return <QuizRules onStart={() => setStarted(true)} />;

  const q = quiz.questions[current];

  const formatTime = (s) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const progress = ((current + 1) / quiz.questions.length) * 100;

  return (
    <div className="bg-[#020617] text-white flex flex-col">
      {/* HEADER */}
      <header className="sticky top-0 bg-[#020617]/80 backdrop-blur px-6 py-4 border-b border-white/5 z-50 flex-wrap">
        <div className="flex justify-between items-center flex-wrap">
          <div>
            <h1 className="font-bold">{quiz.title}</h1>
            <p className="text-xs text-gray-400">
              Question {current + 1}/{quiz.questions.length}
            </p>
          </div>

          <div className="flex gap-4 items-center">
            {/* MARKS */}
            <div className="text-xs bg-white/5 px-3 py-1 rounded-full">
              Marks: {q.marks || 0}
            </div>

            {/* TIMER */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-white/10">
              <HiOutlineClock />
              {formatTime(timeLeft)}
            </div>

            <button
              onClick={handleSubmit}
              className="text-red-400 text-xs px-3 py-1 border border-red-400 rounded-full"
            >
              Terminate
            </button>
          </div>
        </div>

        {/* PROGRESS */}
        <div className="h-1 bg-white/5 mt-3">
          <div
            className="h-full bg-indigo-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* QUESTION */}
      <main className="flex-grow max-w-4xl mx-auto p-6">
        <h2 className="text-xl mb-4">{q.questionText}</h2>

        {q.type === "mcq" ? (
          <div className="space-y-3">
            {q.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleChange(opt.text)}
                className={`w-full p-4 rounded-xl border text-left flex justify-between ${
                  answers[current] === opt.text
                    ? "bg-indigo-600 border-indigo-400"
                    : "bg-[#0b0f1a] border-white/10"
                }`}
              >
                {opt.text}
                {answers[current] === opt.text && <HiCheckCircle />}
              </button>
            ))}
          </div>
        ) : (
          <textarea
            className="w-full h-64 p-4 bg-[#0b0f1a] border border-white/10 rounded-xl font-mono"
            value={answers[current] || ""}
            onChange={(e) => handleChange(e.target.value)}
          />
        )}
      </main>

      {/* FOOTER */}
      <footer className="max-w-4xl mx-auto w-full px-6 pb-6 mb-6">
        <div className="flex justify-between bg-slate-900 p-4 rounded-2xl border border-white/5">
          <button
            onClick={()=>toast.error(" You cannot go back during the quiz.")}
            className="text-gray-500"
          >
            <HiChevronLeft /> Prev
          </button>

          {current < quiz.questions.length - 1 ? (
            <button
              onClick={handleNext}
              className="bg-white text-black px-6 py-2 rounded-xl gap-2 flex items-center"
            >
              Next <HiChevronRight />
            </button>
          ) : (
            <button
              onClick={() => {
                if (!validateCoding()) return toast.error("Validation failed");
                handleSubmit();
              }}
              className="bg-green-600 px-6 py-2 rounded-xl"
            >
              Submit
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}
