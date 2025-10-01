import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Loading from "../../component/Loading";

export default function AdminQuizForm() {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  // Add new question
  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        questionText: "",
        type: "mcq",
        marks: 5,
        options: [{ text: "", isCorrect: false }],
        answerHint: "",
      },
    ]);
  };

  const removeQuestion = (index) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    if (field === "marks") value = Number(value) || 0;
    updated[index][field] = value;
    setQuestions(updated);
  };

  const addOption = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].options.push({ text: "", isCorrect: false });
    setQuestions(updated);
  };

  const removeOption = (qIndex, optIndex) => {
    const updated = [...questions];
    updated[qIndex].options.splice(optIndex, 1);
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, optIndex, field, value) => {
    const updated = [...questions];
    if (field === "isCorrect") value = value === "true";
    if (field === "text") value = value.trim();
    updated[qIndex].options[optIndex][field] = value;
    setQuestions(updated);
  };

  const handleSubmit = async () => {
    if (!title.trim() || !subject.trim() || questions.length === 0) {
      toast.error("Please add a title, subject, and at least one question.");
      return;
    }

    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.questionText.trim()) {
        toast.error(`Question ${i + 1} is empty`);
        return;
      }
      if (q.type === "mcq") {
        if (!q.options || q.options.length < 2) {
          toast.error(`Question ${i + 1} must have at least 2 options`);
          return;
        }
        for (let j = 0; j < q.options.length; j++) {
          if (!q.options[j].text.trim()) {
            toast.error(`Question ${i + 1}, Option ${j + 1} is empty`);
            return;
          }
        }
      }
      if (q.type === "code" && !q.answerHint.trim()) {
        toast.error(`Question ${i + 1} is a code question but answer hint is empty`);
        return;
      }
    }

    setLoading(true);

    try {
      // Remove options for code questions to prevent validation error
      const sanitizedQuestions = questions.map(q => {
        if (q.type === "code") delete q.options;
        return q;
      });

      await axios.post(
        `${API_URL}/quiz/create`,
        { title, subject, questions: sanitizedQuestions },
        { withCredentials: true }
      );

      toast.success("Quiz created successfully!");
      setTitle("");
      setSubject("");
      setQuestions([]);
    } catch (err) {
      console.error("Error creating quiz:", err);
      toast.error("Error creating quiz");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-10 text-gray-100">
      <div className="max-w-5xl mx-auto bg-gray-800 rounded-lg shadow-lg p-6 md:p-10">
        <h1 className="text-3xl font-bold mb-6">Create Quiz</h1>

        {/* Title */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Title</label>
          <input
            type="text"
            className="w-full p-3 border border-gray-700 rounded bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter quiz title"
          />
        </div>

        {/* Subject */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Subject</label>
          <input
            type="text"
            className="w-full p-3 border border-gray-700 rounded bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter subject"
          />
        </div>

        {/* Questions */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Questions</h2>
          {questions.map((q, idx) => (
            <div
              key={idx}
              className="mb-5 border border-gray-700 p-4 rounded-lg bg-gray-800 relative"
            >
              <button
                onClick={() => removeQuestion(idx)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold"
              >
                ✕
              </button>

              <label className="block font-semibold mb-2">
                Question {idx + 1}
              </label>
              <textarea
                className="w-full p-2 border border-gray-700 rounded bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3 text-gray-100"
                placeholder="Enter question text"
                rows={3}
                value={q.questionText}
                onChange={(e) => handleQuestionChange(idx, "questionText", e.target.value)}
              />

              {/* Type and Marks */}
              <div className="flex flex-col md:flex-row md:space-x-4 mb-3">
                <div className="flex-1">
                  <label className="block font-semibold mb-1">Type</label>
                  <select
                    className="w-full p-2 border border-gray-700 rounded bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100"
                    value={q.type}
                    onChange={(e) => handleQuestionChange(idx, "type", e.target.value)}
                  >
                    <option value="mcq">MCQ</option>
                    <option value="code">Code</option>
                  </select>
                </div>
                <div className="flex-1 mt-3 md:mt-0">
                  <label className="block font-semibold mb-1">Marks</label>
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-700 rounded bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100"
                    value={q.marks}
                    onChange={(e) => handleQuestionChange(idx, "marks", e.target.value)}
                  />
                </div>
              </div>

              {/* MCQ Options */}
              {q.type === "mcq" && (
                <div className="mb-2">
                  <label className="block font-semibold mb-1">Options</label>
                  {q.options.map((opt, i) => (
                    <div key={i} className="flex flex-col md:flex-row md:items-center md:space-x-2 mb-2 space-y-2 md:space-y-0 w-full">
                      <input
                        type="text"
                        className="flex-1 p-2 border border-gray-700 rounded bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 w-full"
                        placeholder={`Option ${i + 1}`}
                        value={opt.text}
                        onChange={(e) => handleOptionChange(idx, i, "text", e.target.value)}
                      />
                      <select
                        className="p-2 border border-gray-700 rounded bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 w-full md:w-auto"
                        value={opt.isCorrect}
                        onChange={(e) => handleOptionChange(idx, i, "isCorrect", e.target.value)}
                      >
                        <option value={true}>Correct</option>
                        <option value={false}>Incorrect</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => removeOption(idx, i)}
                        className="text-red-500 hover:text-red-700 font-bold w-full md:w-auto text-right px-3"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addOption(idx)}
                    className="mt-2 text-blue-400 hover:text-blue-600 font-semibold"
                  >
                    + Add Option
                  </button>
                </div>
              )}

              {/* Code Question */}
              {q.type === "code" && (
                <div className="mt-2">
                  <label className="block font-semibold mb-1">Answer Hint</label>
                  <textarea
                    rows={4}
                    className="w-full p-2 border border-gray-700 rounded bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100"
                    placeholder="Enter answer hint"
                    value={q.answerHint}
                    onChange={(e) => handleQuestionChange(idx, "answerHint", e.target.value)}
                  />
                </div>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addQuestion}
            className="w-full mb-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded shadow-md transition duration-200"
          >
            + Add Question
          </button>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded shadow-md transition duration-200 flex items-center justify-center"
        >
          {loading ? "Creating Quiz..." : "Create Quiz"}
        </button>
      </div>
    </div>
  );
}
