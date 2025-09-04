import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaRegDotCircle, FaArrowLeft } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Loading from "../../component/Loading";

export default function Roadmap() {
  const { id } = useParams(); // roadmapId from URL
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [roadmapData, setRoadmapData] = useState([]);
  const [title, setTitle] = useState("");
  const [completed, setCompleted] = useState({});
  const [expanded, setExpanded] = useState({});
  const [loading, setLoading] = useState(true);

  // Load roadmap data
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axios
      .get(`${API_URL}/roadmap/title/${id}`)
      .then((res) => {
        setRoadmapData(res.data?.months || []);
        setTitle(res.data?.title || "");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  // Load progress from backend
  useEffect(() => {
    if (!id) return;
    axios
      .get(`${API_URL}/roadmap/progress/${id}`, {
        withCredentials: true,
      })
      .then((res) => setCompleted(res.data.completed || {}))
      .catch(() => setCompleted({}));
  }, [id]);

  // Save progress to backend
  useEffect(() => {
    if (!id) return;
    if (Object.keys(completed).length > 0) {
      axios
        .post(
          `${API_URL}/roadmap/progress/${id}`,
          { completed },
          { withCredentials: true }
        )
        .catch((err) => console.error("Save failed", err));
    }
  }, [completed, id]);

  // Progress calculation
  const totalSteps = useMemo(
    () => roadmapData.reduce((acc, m) => acc + m.steps.length, 0),
    [roadmapData]
  );
  const doneCount = useMemo(
    () => Object.values(completed).reduce((acc, v) => (v ? acc + 1 : acc), 0),
    [completed]
  );
  const progressPct = totalSteps
    ? Math.round((doneCount / totalSteps) * 100)
    : 0;

  // Toggle step done
  const toggleDone = (key) =>
    setCompleted((prev) => ({ ...prev, [key]: !prev[key] }));

  // Toggle expand details
  const toggleExpand = (key) =>
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="relative  w-full flex justify-center py-6 px-4  text-white overflow-hidden">
      {/* glowing backgrounds */}
      <div className="pointer-events-none absolute top-0 left-1/3 w-96 h-96 bg-fuchsia-500/20 blur-3xl rounded-full" />
      <div className="pointer-events-none absolute bottom-0 right-1/3 w-96 h-96 bg-sky-500/20 blur-3xl rounded-full" />

      <div className="relative w-full max-w-6xl">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 px-3 py-1.5 mb-6
                   bg-gray-800 hover:bg-gray-700 text-gray-200 
                   rounded-lg text-sm shadow-md transition-all cursor-pointer"
        >
          <FaArrowLeft className="text-sm" />
          <span>Back</span>
        </button>

        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="z-60 relative text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-pink-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent py-3">
            {title}
          </h1>
          <div className="mt-4 w-full max-w-sm mx-auto h-3 rounded-full bg-white/10 overflow-hidden">
            <div
              className={`h-full transition-all duration-700 ${
                progressPct < 40
                  ? "bg-gradient-to-r from-red-400 to-yellow-400"
                  : progressPct < 80
                  ? "bg-gradient-to-r from-yellow-400 to-sky-400"
                  : "bg-gradient-to-r from-sky-400 to-emerald-400"
              }`}
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="text-sm text-gray-300 mt-1">{progressPct}% complete</p>
        </div>

        {/* Timeline line */}
        <div className="absolute top-63 z-1  left-1/2 -translate-x-1/2 w-1.5 h-full bg-slate-700/50 rounded-full opacity-30 md:opacity-80">
          {/* Progress overlay */}
          <div
            className="absolute top-0 left-0 w-full transition-all duration-700 
               bg-gradient-to-b from-pink-400 via-sky-400 to-emerald-400 rounded-full shadow-[0_0_20px_rgba(56,189,248,0.6)]"
            style={{ height: `${progressPct}%` }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex flex-col gap-20">
          {roadmapData.map((section, mIdx) => (
            <section key={mIdx}>
              {/* Month Label */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mx-auto w-fit mb-10"
              >
                <div className="z-20 relative px-6 py-3 rounded-2xl shadow-lg bg-gradient-to-r from-fuchsia-500/20 to-sky-500/20 border border-white/20">
                  <span className="font-semibold tracking-wide">
                    {section.month}
                  </span>
                </div>
              </motion.div>

              <div className="flex flex-col gap-14">
                {section.steps.map((step, sIdx) => {
                  const key = `${mIdx}-${sIdx}`;
                  const isLeft = sIdx % 2 === 0;
                  const isDone = !!completed[key];
                  const isOpen = !!expanded[key];

                  return (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.4 }}
                      transition={{ duration: 0.5 }}
                      className={`relative flex ${
                        isLeft ? "justify-start" : "justify-end"
                      }`}
                    >
                      {/* Connector line */}
                      <div
                        className={`hidden md:block absolute z-2 top-1/2 w-[11%] h-0.5 bg-slate-600/50 
                          ${isLeft ? "right-1/2" : "left-1/2"} 
                          ${
                            isDone
                              ? "bg-gradient-to-r from-sky-400 to-emerald-400 shadow-[0_0_10px_rgba(56,189,248,0.7)]"
                              : ""
                          }
                        `}
                      />

                      {/* Marker */}
                      <button
                        onClick={() => toggleDone(key)}
                        className="absolute left-1/2 -translate-x-1/2 z-70 cursor-pointer"
                      >
                        <span
                          className={`grid place-items-center w-7 h-7 rounded-full border-4 transition-all duration-300 ${
                            isDone
                              ? "border-emerald-400 bg-emerald-500/20"
                              : "border-gray-500 bg-gray-800"
                          }`}
                        >
                          <FaRegDotCircle size={14} />
                        </span>
                      </button>

                      {/* Step Card */}
                      <div
                        onClick={() => toggleExpand(key)}
                        className={`cursor-pointer relative max-w-md w-full md:w-[40%] z-60 ${
                          isLeft ? "mr-auto" : "ml-auto"
                        }`}
                      >
                        <div
                          className={`rounded-2xl p-5 border shadow-xl transition-all duration-300
                          ${
                            isDone
                              ? "border-emerald-400/90 bg-gradient-to-r from-emerald-900/40 to-sky-900/60"
                              : "border-white/60 bg-gradient-to-r from-gray-800/60 to-gray-900/80"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <h3 className="text-sm font-semibold text-gray-300">
                              {step.day}
                            </h3>
                            {isDone && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                                Done
                              </span>
                            )}
                          </div>
                          <p className="mt-2 text-lg font-bold text-white">
                            {step.topic}
                          </p>

                          {/* Details expand */}
                          <AnimatePresence>
                            {isOpen && (
                              <motion.ul
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="mt-3 pl-4 list-disc text-gray-300 text-sm space-y-1"
                              >
                                {step.details.map((d, i) => (
                                  <li key={i}>{d}</li>
                                ))}
                              </motion.ul>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {/* End marker */}
        <div className="text-center mt-20">
          <span className="z-20 relative px-6 py-3 bg-gradient-to-r from-pink-400 via-sky-500 to-emerald-500 rounded-2xl font-bold shadow-lg border-1 border-yellow-900">
            🎉 End of Roadmap
          </span>
        </div>
      </div>
    </div>
  );
}
