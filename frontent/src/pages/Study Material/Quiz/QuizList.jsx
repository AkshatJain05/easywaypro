import { FaPlayCircle, FaArrowLeft, FaClock, FaQuestionCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function QuizList({ quizzes, onSelect }) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="max-w-8xl mx-auto px-4 py-8 relative">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-82 h-72  blur-[100px] rounded-full pointer-events-none -z-10" />

      {/* Back Button */}
      <motion.button
        whileHover={{ x: -5 }}
        onClick={handleBack}
        className="flex items-center gap-2 text-slate-500 hover:text-cyan-400 font-bold text-xs uppercase tracking-widest transition-colors mb-10 z-50 relative cursor-pointer"
      >
        <FaArrowLeft /> Back to Dashboard
      </motion.button>

      {/* Header */}
      <div className="mb-12 text-center md:text-left">
        <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-1">
          Choose a  <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">Quiz</span>
        </h2>
        <p className="text-slate-400 text-sm max-w-lg font-medium">
          Select a module to test your knowledge and track your learning progress.
        </p>
      </div>

      {/* Quizzes Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {quizzes.map((q, idx) => (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group relative flex flex-col bg-[#02010a] border border-white/20 rounded-[2rem] p-6 hover:border-indigo-500/30 hover:bg-white/[0.03] transition-all duration-500 shadow-2xl hover:shadow-indigo-500/10"
          >
            {/* Card Content */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <FaQuestionCircle size={22} />
                </div>
                {/* Duration Badge */}
                <span className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full text-[10px] font-black uppercase tracking-tighter text-slate-400 border border-white/5">
                  <FaClock className="text-indigo-400" /> {Math.ceil(q.duration / 60)} MINS
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                {q.name}
              </h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">
                Challenge yourself with {q.questions.length} specialized questions designed for this module.
              </p>
            </div>

            {/* Bottom Action Area */}
            <div className="mt-4 pt-6 border-t border-white/15 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                {q.questions.length} Items
              </span>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelect(q.id)}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all cursor-pointer"
              >
                <FaPlayCircle className="text-lg" />
                Start Test
              </motion.button>
            </div>

            {/* Subtle Hover Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem] pointer-events-none" />
          </motion.div>
        ))}
      </div>

      {/* Bottom Status */}
      <div className="mt-20 text-center opacity-30">
        <p className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-400">
          Easyway Pro
        </p>
      </div>
    </div>
  );
}