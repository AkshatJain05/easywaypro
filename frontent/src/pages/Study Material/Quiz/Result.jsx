import { FaRedo } from "react-icons/fa";

export default function Result({ score, total, onRestart, userAnswers = {}, questions = [] }) {
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-gradient-to-br from-gray-950 to-black border-1 border-gray-500 p-6 rounded-2xl shadow-lg text-center">
        <h2 className="text-2xl font-bold text-indigo-400 mb-2">Quiz Result</h2>
        <p className="text-lg mb-4">
          Score: <span className="font-semibold text-green-400">{score}</span> /{" "}
          <span className="font-semibold text-yellow-400">{total}</span>
        </p>

        {/* percentage */}
        <div className="mx-auto w-40 h-40 relative mb-6">
          <svg viewBox="0 0 36 36" className="w-40 h-40">
            <path
              d="M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#374151"
              strokeWidth="3"
            />
            <path
              d="M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831"
              fill="none"
              stroke={percentage >= 60 ? "#16a34a" : percentage >= 40 ? "#f59e0b" : "#ef4444"}
              strokeWidth="3"
              strokeDasharray={`${percentage}, 100`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-xl font-bold">
            {percentage}%
          </div>
        </div>

        {/* stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-900 p-4 rounded-lg">
            <div className="text-sm text-gray-300">Correct</div>
            <div className="text-lg font-bold text-green-400">{score}</div>
          </div>
          <div className="bg-gray-900 p-4 rounded-lg">
            <div className="text-sm text-gray-300">Wrong</div>
            <div className="text-lg font-bold text-red-400">{total - score}</div>
          </div>
          <div className="bg-gray-900 p-4 rounded-lg">
            <div className="text-sm text-gray-300">Total</div>
            <div className="text-lg font-bold text-indigo-300">{total}</div>
          </div>
        </div>

        {/* detailed review */}
        <div className="text-left space-y-4">
          <h3 className="text-lg font-semibold mb-2">Review</h3>
          <ul className="space-y-3">
            {questions.map((q, idx) => {
              const user = userAnswers?.[q.id] ?? null;
              const correct = q.correctAnswer;
              const isCorrect = user === correct;
              return (
                <li
                  key={q.id}
                  className={`p-4 rounded-lg border ${
                    isCorrect ? "border-green-500 bg-green-900/20" : "border-red-500 bg-red-900/20"
                  }`}
                >
                  <div className="font-medium text-white">
                    {idx + 1}. {q.question}
                  </div>
                  <div className="mt-2 text-sm">
                    Your answer:{" "}
                    <span className={isCorrect ? "text-green-300 font-semibold" : "text-red-300 font-semibold"}>
                      {user ?? "Not answered"}
                    </span>
                  </div>
                  {!isCorrect && (
                    <div className="text-sm mt-1">
                      Correct answer: <span className="text-yellow-300 font-semibold">{correct}</span>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-6">
          <button
            onClick={onRestart}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-5 py-2 rounded-md text-white font-semibold"
          >
            <FaRedo /> Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
