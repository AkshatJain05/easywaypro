import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { FaPlus, FaTrash, FaQuestionCircle, FaCode, FaCheckCircle } from "react-icons/fa";
import Loading from "../../component/Loading";

export default function AdminQuizForm() {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        questionText: "",
        type: "mcq",
        marks: 5,
        options: [{ text: "", isCorrect: false }, { text: "", isCorrect: false }],
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
    updated[qIndex].options[optIndex][field] = value;
    setQuestions(updated);
  };

  const handleSubmit = async () => {
    if (!title.trim() || !subject.trim() || questions.length === 0) {
      toast.error("Please add a title, subject, and at least one question.");
      return;
    }

    setLoading(true);
    try {
      const sanitizedQuestions = questions.map(q => {
        const newQ = { ...q };
        if (newQ.type === "code") delete newQ.options;
        return newQ;
      });

      await axios.post(
        `${API_URL}/quiz/create`,
        { title, subject, questions: sanitizedQuestions },
        { withCredentials: true }
      );

      toast.success("Quiz created successfully!");
      setTitle(""); setSubject(""); setQuestions([]);
    } catch (err) {
      toast.error("Error creating quiz");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 px-2 md:px-0">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-white uppercase">Create Quiz</h1>
          <p className="text-[10px] text-blue-500 font-black tracking-[0.2em] uppercase">Knowledge Assessment Builder</p>
        </div>
      </div>

      {/* Quiz Settings Card */}
      <div className="bg-[#0d0d12] border border-white/5 rounded-[2rem] p-4 md:p-6 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/60 ml-2">Quiz Title</label>
            <input
              type="text"
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-3 text-sm text-white focus:border-blue-500/50 outline-none transition-all"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Advanced React Patterns"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/50 ml-2">Subject / Category</label>
            <input
              type="text"
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-3 text-sm text-white focus:border-blue-500/50 outline-none transition-all"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Web Development"
            />
          </div>
        </div>
      </div>

      {/* Questions Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white/60 flex items-center gap-2">
            <FaQuestionCircle className="text-blue-500" /> Questions List ({questions.length})
          </h2>
        </div>

        <AnimatePresence mode="popLayout">
          {questions.map((q, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0d0d12] border border-white/50 rounded-[1rem] p-4 relative group overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-1">
                 <button onClick={() => removeQuestion(idx)} className="text-white/50 hover:text-red-500 transition-colors p-2">
                   <FaTrash size={14} />
                 </button>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <span className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center text-xs font-bold text-blue-500">
                  {idx + 1}
                </span>
                <div className="flex gap-2">
                  <span className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${q.type === 'mcq' ? 'border-blue-500/30 text-blue-400 bg-blue-500/5' : 'border-purple-500/30 text-purple-400 bg-purple-500/5'}`}>
                    {q.type}
                  </span>
                </div>
              </div>

              <textarea
                className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:border-blue-500/30 outline-none transition-all mb-4 resize-none"
                placeholder="Type your question here..."
                rows={2}
                value={q.questionText}
                onChange={(e) => handleQuestionChange(idx, "questionText", e.target.value)}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-2 mb-1 block">Question Type</label>
                  <select
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white/60 outline-none cursor-pointer"
                    value={q.type}
                    onChange={(e) => handleQuestionChange(idx, "type", e.target.value)}
                  >
                    <option value="mcq" className="bg-black text-white">Multiple Choice (MCQ)</option>
                    <option value="code" className="bg-black text-white">Coding / Theory</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/50 ml-2 mb-1 block">Points / Marks</label>
                  <input
                    type="number"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white/60 outline-none"
                    value={q.marks}
                    onChange={(e) => handleQuestionChange(idx, "marks", e.target.value)}
                  />
                </div>
              </div>

              {/* MCQ Logic */}
              {q.type === "mcq" && (
                <div className="space-y-3 bg-white/[0.01] p-1 rounded-2xl border border-white/[0.03]">
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/50 mb-2">Options & Answers</p>
                  {q.options.map((opt, i) => (
                    <div key={i} className="flex gap-3 items-center">
                      <input
                        type="text"
                        className="flex-1 bg-white/[0.03] border border-white/5 rounded-xl px-4 py-2 text-xs text-white/70 outline-none focus:border-blue-500/20"
                        placeholder={`Option ${i + 1}`}
                        value={opt.text}
                        onChange={(e) => handleOptionChange(idx, i, "text", e.target.value)}
                      />
                      <select
                        className={`w-20 bg-white/[0.03] border border-white/5 rounded-xl px-2 py-2 text-[10px] font-bold uppercase outline-none ${opt.isCorrect ? 'text-green-500' : 'text-white/50'}`}
                        value={opt.isCorrect}
                        onChange={(e) => handleOptionChange(idx, i, "isCorrect", e.target.value)}
                      >
                        <option value={false} className="bg-black text-white">Wrong</option>
                        <option value={true} className="bg-black text-white">Correct</option>
                      </select>
                      <button onClick={() => removeOption(idx, i)} className="text-white/50 hover:text-red-500 p-1">
                        <FaTrash size={10} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addOption(idx)}
                    className="text-[9px] font-black uppercase text-blue-500/60 hover:text-blue-500 transition-colors mt-2"
                  >
                    + Add Alternative
                  </button>
                </div>
              )}

              {/* Code Logic */}
              {q.type === "code" && (
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-2">Solution Hint / Expected Output</label>
                  <textarea
                    rows={3}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-xs text-white/50 font-mono outline-none"
                    placeholder="Enter the logic or correct code block here..."
                    value={q.answerHint}
                    onChange={(e) => handleQuestionChange(idx, "answerHint", e.target.value)}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        <button
          type="button"
          onClick={addQuestion}
          className="w-full py-5 border-2 border-dashed border-white/10 rounded-[2rem] text-white/30 hover:text-blue-500 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-3"
        >
          <FaPlus /> Append New Question
        </button>
      </div>

      {/* Submit Action */}
      <div className="pt-10 border-t border-white/5 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={loading || questions.length === 0}
          className="w-full md:w-64 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black text-sm rounded-2xl shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-3 disabled:opacity-30 disabled:grayscale"
        >
          <FaCheckCircle /> {loading ? "DEPLOYING..." : "DEPLOY QUIZ"}
        </button>
      </div>
    </div>
  );
} 