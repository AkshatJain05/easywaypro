import { useEffect, useRef, useState } from "react";
import { FaClock, FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Quiz({ quiz, onFinish }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: option }
  const [timeLeft, setTimeLeft] = useState(quiz.duration);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const intervalRef = useRef(null);
  const navigate = useNavigate();

  // Start timer
  useEffect(() => {
    if (isSubmitted) return;
    intervalRef.current = setInterval(() => {
      setTimeLeft((s) => {
        if (s <= 1) {
          clearInterval(intervalRef.current);
          handleFinish(); // auto submit
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitted]);

  const handleSelect = (option) => {
    setAnswers((prev) => ({ ...prev, [quiz.questions[current].id]: option }));
  };

  const prevQuestion = () => {
    setCurrent((c) => Math.max(0, c - 1));
  };
  const nextQuestion = () => {
    setCurrent((c) => Math.min(quiz.questions.length - 1, c + 1));
  };

  const handleFinish = () => {
    if (isSubmitted) return; // prevent double submit
    setIsSubmitted(true);
    clearInterval(intervalRef.current);
    // calculate score
    let score = 0;
    quiz.questions.forEach((q) => {
      if (answers[q.id] && answers[q.id] === q.correctAnswer) score++;
    });
    // pass answers and quiz id to parent
    onFinish(score, quiz.questions.length, answers, quiz.id);
  };

  // helper format mm:ss
  const fmt = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const progressPct = Math.round(((current + 1) / quiz.questions.length) * 100);

  return (
    <div className="max-w-3xl mx-auto bg-gradient-to-br from-gray-950 to-black border-1 border-gray-500 p-4 rounded-lg">
      {/* header */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 px-3 py-1.5 mb-8
                                 bg-gray-800 hover:bg-gray-700 text-gray-200 
                                 rounded-lg text-sm shadow-md transition-all cursor-pointer"
      >
        <FaArrowLeft className="text-sm" />
        <span>Back</span>
      </button>

      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-indigo-400 p-1">{quiz.name}</h3>
          <p className="text-sm text-gray-400 p-1">
            {quiz.questions.length} Q • {Math.ceil(quiz.duration / 60)} min
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-gray-900 px-3 py-1 rounded-md">
            <FaClock className="text-red-400" />
            <span className="font-mono">{fmt(timeLeft)}</span>
          </div>
        </div>
      </div>

      {/* progress bar */}
      <div className="w-full bg-gray-800 h-2 rounded-full mb-4 overflow-hidden">
        <div
          className="h-2 bg-indigo-500"
          style={{ width: `${progressPct}%`, transition: "width .2s ease" }}
        />
      </div>

      {/* question */}
      <div className="bg-gray-900 p-5 rounded-2xl shadow mb-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm text-gray-300 mb-2">
              Question <span className="font-semibold">{current + 1}</span> of{" "}
              {quiz.questions.length}
            </div>
            <h4 className="text-lg font-medium text-white">
              {quiz.questions[current].question}
            </h4>
          </div>
        </div>

        <div className="grid gap-3 mt-4">
          {quiz.questions[current].options.map((opt) => {
            const selected = answers[quiz.questions[current].id] === opt;
            return (
              <button
                key={opt}
                onClick={() => handleSelect(opt)}
                disabled={isSubmitted}
                className={`w-full text-left px-4 py-2 rounded-lg border flex items-center gap-3 ${
                  selected
                    ? "bg-indigo-600 border-indigo-600 text-white"
                    : "bg-gray-700 border-gray-600 hover:bg-gray-600 text-gray-200"
                }`}
              >
                <span className="font-semibold">{opt}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={prevQuestion}
            disabled={current === 0}
            className="px-3 py-2 rounded-md bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
          >
            <FaArrowLeft />
          </button>
          <button
            onClick={nextQuestion}
            disabled={current === quiz.questions.length - 1}
            className="px-3 py-2 rounded-md bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
          >
            <FaArrowRight />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleFinish}
            disabled={isSubmitted}
            className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold"
          >
            {isSubmitted ? "Submitted" : "Finish & Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
