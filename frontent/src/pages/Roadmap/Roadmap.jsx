import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaArrowLeft,
  FaRegDotCircle,
  FaChevronDown,
  FaRocket,
} from "react-icons/fa"; 
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import Loading from "../../component/Loading";

export default function Roadmap() {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});

  // --- Fetch roadmap ---
  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const res = await axios.get(`${API_URL}/roadmap/${id}`);
        setRoadmap(res.data.roadmap);
      } catch {
        toast.error("Failed to load roadmap");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchRoadmap();
  }, [id, API_URL]);

  // --- Progress Calculations ---
  const totalSteps = useMemo(
    () => roadmap?.months?.reduce((sum, m) => sum + m.steps.length, 0) || 0,
    [roadmap]
  );
  const completedSteps = useMemo(
    () =>
      roadmap?.months?.reduce(
        (sum, m) => sum + m.steps.filter((s) => s.completed).length,
        0
      ) || 0,
    [roadmap]
  );

  const progressPct = totalSteps
    ? Math.round((completedSteps / totalSteps) * 100)
    : 0;

  // --- RESTORED: Marker Click Handler ---
  const handleToggle = async (monthIndex, stepIndex) => {
    try {
      const res = await axios.put(
        `${API_URL}/roadmap/${id}/month/${monthIndex}/step/${stepIndex}/toggle`,
        {},
        { withCredentials: true }
      );
      // Update local state with the new roadmap data
      setRoadmap(res.data.roadmap);
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update progress");
    }
  };

  const toggleExpand = (key) =>
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  if (loading) return <Loading />;

  // --- Render Component ---
  return (
    <div className="relative min-h-screen w-full bg-[#050505] text-white flex justify-center py-10 px-4 sm:px-6 overflow-hidden">
      <Toaster position="top-center" />
      <div className="absolute top-20 left-1/4 w-72 h-72 bg-fuchsia-500/10 blur-[110px] rounded-full" />
      <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-sky-500/10 blur-[110px] rounded-full" />

      <div className="relative w-full max-w-6xl">
        {/* Header content (Back button, Title, Progress Bar) */}
        <motion.div
          className="text-center mb-14 p-3 sm:p-6 rounded-3xl bg-gradient-to-br from-gray-950 to-black border border-white/10 shadow-2xl backdrop-blur-md"
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 mb-10 bg-slate-900/70 hover:bg-fuchsia-600 text-gray-200 rounded-full text-sm shadow-lg backdrop-blur-sm transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaArrowLeft />
            Back to Roadmaps
          </motion.button>
          
          <h1 className="text-2xl md:text-4xl font-extrabold bg-gradient-to-r from-pink-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent drop-shadow-md">
            {roadmap?.title}
          </h1>
          <p className="text-gray-400 text-sm sm:text-sm mt-3 max-w-2xl mx-auto leading-relaxed">
            {roadmap?.description}
          </p>

          <div className="mt-6 relative w-full max-w-lg mx-auto">
            <div className="h-3 bg-white/10 rounded-full overflow-hidden shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 1 }}
                className={`h-full bg-gradient-to-r ${
                  progressPct < 40
                    ? "from-red-500 to-yellow-500"
                    : progressPct < 80
                    ? "from-yellow-400 to-sky-500"
                    : "from-sky-500 to-emerald-500"
                } rounded-full shadow-[0_0_12px_rgba(56,189,248,0.6)]`}
              />
            </div>
            <p className="mt-3 text-sm font-bold text-gray-200">
              {progressPct}% Complete
            </p>
          </div>
        </motion.div>

        {/* --- Timeline Body --- */}
        <div className="relative flex flex-col gap-12 sm:gap-16 max-w-4xl mx-auto">
          
          {/* Vertical Line (Always Centered) */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-fuchsia-400/30 via-sky-400/40 to-emerald-400/30 rounded-full -translate-x-1/2" />

          {roadmap?.months?.map((month, mIdx) => (
            <section key={mIdx} className="relative">
              
              {/* Month title (Always Centered) */}
              <motion.div
                initial={{ opacity: 0, y: -15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: true }}
                className="mb-10 w-fit mx-auto relative"
              >
                <span className="inline-block px-5 py-2 rounded-full bg-gradient-to-r from-fuchsia-600/50 to-sky-600/50 border border-fuchsia-400/60 backdrop-blur-sm font-bold tracking-wider text-sm sm:text-base shadow-lg">
                  {month.month}
                </span>
              </motion.div>

              {/* Steps */}
              <div className="flex flex-col gap-10">
                {month.steps.map((step, sIdx) => {
                  const key = `${mIdx}-${sIdx}`;
                  const isLeft = sIdx % 2 === 0;
                  const isDone = step.completed;
                  const isOpen = expanded[key];

                  return (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, type: "spring", stiffness: 80 }}
                      viewport={{ once: true }}
                      // Layout: Alternating left/right is now applied to ALL screens (using justify-start/justify-end)
                      className={`relative flex items-start w-full ${
                        isLeft ? "justify-start" : "justify-end"
                      }`}
                    >
                      {/* Horizontal connector (Always Visible, Connects to Card) */}
                      <div
                        className={`absolute top-1/2 w-[5%] h-[2px] z-0 -mt-px ${
                          isDone
                            ? "bg-gradient-to-r from-sky-400 to-emerald-400 shadow-[0_0_10px_rgba(56,189,248,0.7)]"
                            : "bg-gray-700/40"
                        } ${
                          // Positioned to run from the center line to the card edge
                          isLeft ? "right-[50%]" : "left-[50%]"
                        }`}
                      />

                      {/* 🌟 Marker (RESTORED: Clickable Button) */}
                      <button
                        onClick={() => handleToggle(mIdx, sIdx)}
                        className={`absolute z-20 cursor-pointer group -mt-1 left-1/2 -translate-x-1/2`}
                        aria-label={isDone ? "Mark as Incomplete" : "Mark as Complete"}
                      >
                        <motion.span
                          whileHover={{ scale: 1.15 }} // Restore hover effect
                          whileTap={{ scale: 0.9 }}  // Restore tap effect
                          className={`grid place-items-center w-8 h-8 rounded-full border-4 transition-all duration-300 ${
                            isDone
                              ? "border-emerald-400 bg-emerald-500/30 shadow-[0_0_10px_rgba(16,255,100,0.6)]"
                              : "border-fuchsia-400/70 bg-gray-900"
                          }`}
                        >
                            {/* Only show FaRegDotCircle (no checkmark) */}
                           <FaRegDotCircle className={`${isDone ? 'text-emerald-400' : 'text-fuchsia-400'} text-sm`} />
                        </motion.span>
                      </button>

                      {/* Step Card (Always Alternating Left/Right) */}
                      <div
                        onClick={() => toggleExpand(key)}
                        className={`cursor-pointer w-full sm:w-[45%] mt-4 sm:mt-0 ${
                            isLeft ? "mr-auto" : "ml-auto"
                        }`}
                      >
                        <motion.div
                          className={`rounded-2xl p-5 border backdrop-blur-md transition-all ${
                            isDone
                              ? "border-emerald-400/50 bg-gradient-to-r from-emerald-900/30 to-sky-900/30 shadow-emerald-900/40 shadow-2xl"
                              : "border-white/10 bg-[#111]/80 shadow-lg"
                          }`}
                          whileHover={{ y: -2 }}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="text-sm sm:text-base font-semibold text-gray-300">
                              {step.day}
                            </h3>
                            <span
                              className={`text-xs sm:text-sm px-3 py-1 rounded-full ${
                                isDone
                                  ? "bg-emerald-500/20 text-emerald-300"
                                  : "bg-fuchsia-500/20 text-fuchsia-300"
                              }`}
                            >
                              {isDone ? "COMPLETED" : "PENDING"}
                            </span>
                          </div>

                          <p className="text-md sm:text-lg font-bold text-white leading-snug">
                            {step.topic}
                          </p>
                        
                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="mt-4 pt-3 border-t border-gray-700/50"
                              >
                                <ul className="list-disc pl-4 text-gray-300 text-sm sm:text-base space-y-2">
                                  {step.details.map((d, i) => (
                                    <li key={i}>{d}</li>
                                  ))}
                                </ul>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          <div className="flex justify-end mt-2">
                            <FaChevronDown
                              className={`transition-transform ${
                                isOpen ? "rotate-180 text-sky-400" : "text-gray-500"
                              }`}
                            />
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {/* --- End marker (Roadmap Complete) --- */}
        <div className="text-center mt-3">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 px-8 py-3 border-1 border-gray-700 rounded-full font-extrabold text-xl shadow-xl"
          >
            <FaRocket className="text-2xl" /> Roadmap Complete!
          </motion.div>
        </div>
      </div>
    </div>
  );
}