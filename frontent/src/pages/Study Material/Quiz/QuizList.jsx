import { FaPlayCircle, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function QuizList({ quizzes, onSelect }) {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 px-3 py-1.5 mb-8
                                 bg-gray-800 hover:bg-gray-700 text-gray-200 
                                 rounded-lg text-sm shadow-md transition-all cursor-pointer"
      >
        <FaArrowLeft className="text-sm" />
        <span>Back</span>
      </button>

      <h2 className="text-3xl font-bold text-center mb-6">Choose a Quiz</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {quizzes.map((q) => (
          <div
            key={q.id}
            className="bg-gradient-to-br from-gray-950 to-black border-1 border-gray-500 p-5 rounded-2xl shadow hover:shadow-lg transition flex flex-col justify-between"
          >
            <div>
              <h3 className="text-lg font-semibold">{q.name}</h3>
              <p className="text-sm text-gray-400">
                {q.questions.length} questions • {Math.ceil(q.duration / 60)}{" "}
                min
              </p>
            </div>
            <div className="mt-4 text-right">
              <button
                onClick={() => onSelect(q.id)}
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-md text-white font-semibold"
              >
                <FaPlayCircle /> Start
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
