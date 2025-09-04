import { useState } from "react";
import quizzes from "../../../data/quizzes.js";
import QuizList from "./QuizList.jsx";
import Quiz from "./Quiz.jsx";
import Result from "./Result.jsx";

export default function QuizPlacement() {
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [result, setResult] = useState(null); // { score, total, userAnswers, quizId }

  // Called by Quiz when finished
  const handleFinish = (correctAnswers, total, userAnswers, quizId) => {
    setResult({ score: correctAnswers, total, userAnswers, quizId });
  };

  const handleRestart = () => {
    setResult(null);
    setSelectedQuizId(null);
  };

  const currentQuiz = quizzes.find((q) => q.id === selectedQuizId) || null;

  return (
    <div className="flex flex-col min-h-screen">
     

      {/* Content */}
      <main className="flex-grow flex items-start justify-center p-6">
        <div className="w-full max-w-5xl">
          {!selectedQuizId && !result && (
            <div className="animate-fadeIn">
              <QuizList quizzes={quizzes} onSelect={(id) => setSelectedQuizId(id)} />
            </div>
          )}

          {selectedQuizId && !result && currentQuiz && (
            <div className="animate-fadeIn">
              <Quiz quiz={currentQuiz} onFinish={handleFinish} />
            </div>
          )}

          {result && (
            <div className="animate-fadeIn">
              <Result
                score={result.score}
                total={result.total}
                onRestart={handleRestart}
                userAnswers={result.userAnswers}
                questions={
                  quizzes.find((q) => q.id === result.quizId)?.questions || []
                }
              />
            </div>
          )}
        </div>
      </main>
      </div>    

    
  );
}
