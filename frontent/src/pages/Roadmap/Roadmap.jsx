import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft, FaRegDotCircle, FaChevronDown, FaRocket } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import Loading from "../../component/Loading";

export default function Roadmap() {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [roadmap, setRoadmap] = useState(null);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});
  const [error, setError] = useState("");

  /* ------------------------- Fetch Roadmap & Progress ------------------------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [roadmapRes, progressRes] = await Promise.all([
          axios.get(`${API_URL}/roadmap/${id}`, { withCredentials: true }),
          axios.get(`${API_URL}/roadmap/${id}/progress`, { withCredentials: true }),
        ]);
        setRoadmap(roadmapRes.data.roadmap);
        setProgress(progressRes.data.progress || {});
      } catch (err) {
        console.error(err);
        setError("Failed to load roadmap or progress.");
        toast.error("Unable to load roadmap. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id, API_URL]);

  /* ---------------------------- Toggle Step Progress --------------------------- */
  const handleToggle = useCallback(
    async (monthIndex, stepIndex) => {
      try {
        const res = await axios.put(
          `${API_URL}/roadmap/${id}/month/${monthIndex}/step/${stepIndex}/toggle`,
          {},
          { withCredentials: true }
        );
        setProgress(res.data.progress);
        toast.success(res.data.message || "Progress updated!");
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to update progress.");
      }
    },
    [API_URL, id]
  );

  /* ----------------------------- Helper Functions ----------------------------- */
  const isStepDone = (mIdx, sIdx) => progress?.completed?.[`${mIdx}-${sIdx}`] || false;
  const toggleExpand = (key) => setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  //  Calculate progress safely
  const totalSteps =
    roadmap?.months?.reduce((count, month) => count + (month.steps?.length || 0), 0) || 0;
  const completedCount = Object.values(progress?.completed || {}).filter(Boolean).length;
  const progressPct = totalSteps > 0 ? (completedCount / totalSteps) * 100 : 0;

  /* ------------------------------ Loading & Error ----------------------------- */
  if (loading) return <Loading />;
  if (error)
    return (
      <div className="flex items-center justify-center h-screen text-gray-400 text-lg">
        <p>{error}</p>
      </div>
    );

  /* ------------------------------- Main Render ------------------------------- */
  return (
    <div className="relative min-h-screen bg-[#050505] text-white py-10 px-4 sm:px-6 flex justify-center overflow-hidden">
      <Toaster position="top-center" />

      {/* Background Glow Effects */}
      <div className="absolute top-20 left-1/4 w-72 h-72 bg-fuchsia-500/10 blur-[110px] rounded-full" />
      <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-sky-500/10 blur-[110px] rounded-full" />

      <div className="relative w-full max-w-6xl">
        {/* Header */}
        <motion.div
          className="text-center mb-14 p-6 rounded-3xl bg-gradient-to-br from-gray-950 to-black border border-white/10 shadow-2xl backdrop-blur-md"
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 mb-10 bg-slate-900/70 hover:bg-fuchsia-600/80 text-gray-200 rounded-full text-sm shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaArrowLeft /> Back to Roadmaps
          </motion.button>

          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-pink-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent drop-shadow-md">
            {roadmap?.title}
          </h1>

          {roadmap?.description && (
            <p className="text-gray-400 text-sm sm:text-base mt-3 max-w-2xl mx-auto leading-relaxed">
              {roadmap.description}
            </p>
          )}

          {/* Progress Bar */}
          <div className="mt-6 w-full max-w-lg mx-auto">
            <div className="h-3 bg-white/10 rounded-full overflow-hidden shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className={`h-full rounded-full transition-colors ${
                  progressPct < 40
                    ? "bg-gradient-to-r from-red-500 to-yellow-500"
                    : progressPct < 80
                    ? "bg-gradient-to-r from-yellow-400 to-sky-500"
                    : "bg-gradient-to-r from-sky-500 to-emerald-500"
                }`}
              />
            </div>
            <p className="mt-3 text-sm font-bold text-gray-200">
              {progressPct.toFixed(0)}% Complete ({completedCount}/{totalSteps} steps)
            </p>
          </div>
        </motion.div>

        {/* Timeline */}
        <div className="relative flex flex-col gap-12 sm:gap-16 max-w-4xl mx-auto">
          <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-fuchsia-400/30 via-sky-400/40 to-emerald-400/30 rounded-full -translate-x-1/2" />

          {roadmap?.months?.map((month, mIdx) => (
            <section key={mIdx}>
              {/* Month Label */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: true }}
                className="mb-10 text-center"
              >
                <span className="inline-block px-5 py-2 rounded-full bg-gradient-to-r from-fuchsia-600/50 to-sky-600/50 border border-fuchsia-400/60 backdrop-blur-sm font-bold tracking-wider text-sm sm:text-base shadow-lg">
                  {month.month}
                </span>
              </motion.div>

              {/* Steps */}
              <div className="flex flex-col gap-10">
                {month.steps.map((step, sIdx) => {
                  const key = `${mIdx}-${sIdx}`;
                  const isDone = isStepDone(mIdx, sIdx);
                  const isOpen = expanded[key];
                  const isLeft = sIdx % 2 === 0;

                  return (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      viewport={{ once: true }}
                      className={`relative flex items-start w-full ${
                        isLeft ? "justify-start" : "justify-end"
                      }`}
                    >
                      {/* Connector */}
                      <div
                        className={`absolute top-1/2 w-[5%] h-[2px] z-0 -mt-px ${
                          isDone
                            ? "bg-gradient-to-r from-sky-400 to-emerald-400 shadow-[0_0_10px_rgba(56,189,248,0.7)]"
                            : "bg-gray-700/40"
                        } ${isLeft ? "right-[50%]" : "left-[50%]"}`}
                      />

                      {/* Step Marker */}
                      <button
                        onClick={() => handleToggle(mIdx, sIdx)}
                        className="absolute z-20 cursor-pointer group -mt-1 left-1/2 -translate-x-1/2"
                        aria-label={isDone ? "Mark as Incomplete" : "Mark as Complete"}
                      >
                        <motion.span
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                          className={`grid place-items-center w-8 h-8 rounded-full border-4 transition-all duration-300 ${
                            isDone
                              ? "border-emerald-400 bg-emerald-500/30 shadow-[0_0_10px_rgba(16,255,100,0.6)]"
                              : "border-fuchsia-400/70 bg-gray-900"
                          }`}
                        >
                          <FaRegDotCircle
                            className={`${
                              isDone ? "text-emerald-400" : "text-fuchsia-400"
                            } text-sm`}
                          />
                        </motion.span>
                      </button>

                      {/* Step Card */}
                      <div
                        onClick={() => toggleExpand(key)}
                        className={`cursor-pointer w-full sm:w-[45%] mt-4 sm:mt-0 ${
                          isLeft ? "mr-auto" : "ml-auto"
                        }`}
                      >
                        <motion.div
                          whileHover={{ y: -3 }}
                          className={`rounded-2xl p-5 border backdrop-blur-md transition-all duration-300 ${
                            isDone
                              ? "border-emerald-400/50 bg-gradient-to-r from-emerald-900/30 to-sky-900/30 shadow-emerald-900/40 shadow-2xl"
                              : "border-white/10 bg-[#111]/80 shadow-lg"
                          }`}
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
                              className={`transition-transform duration-300 ${
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

        {/* Completion Marker */}
        {progressPct >= 100 && (
          <div className="text-center mt-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-3 px-8 py-3 border border-gray-700 rounded-full font-extrabold text-xl shadow-xl bg-gradient-to-r from-sky-700/30 to-emerald-700/30"
            >
              <FaRocket className="text-2xl text-emerald-400" /> Roadmap Complete!
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
