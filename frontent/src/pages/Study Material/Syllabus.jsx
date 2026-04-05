import { useState } from "react";
import {
  FaBook,
  FaUniversity,
  FaFileAlt,
  FaExternalLinkAlt,
  FaArrowLeft,
  FaGraduationCap,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function SyllabusLinks() {
  const [activeTab, setActiveTab] = useState("semester");
  const navigate = useNavigate();

  const semesterLinks = [
    {
      name: "AKTU B.Tech Syllabus",
      branch: "All Branches",
      url: "https://aktu.ac.in/syllabus.html",
      tag: "University",
    },
  ];

  const gateLinks = [
    {
      name: "GATE 2026 Official",
      branch: "IIT Guwahati",
      url: "https://gate2026.iitg.ac.in/exam-papers-and-syllabus.html",
      tag: "Competitive",
    },
  ];

  const handleBack = () => {
    // Check if there is history to go back to, otherwise go to home or resources
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/"); // Or "/study-material"
    }
  };

  const currentLinks = activeTab === "semester" ? semesterLinks : gateLinks;

  return (
    <div className="min-h-screen  text-white py-6 px-6 sm:px-12 lg:px-24 relative overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-cyan-500/10 blur-[100px] rounded-full" />

      {/* Back Button */}
      <motion.button
        whileHover={{ x: -5 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleBack}
        className="flex items-center gap-2 text-slate-400 hover:text-cyan-600 font-bold text-xs uppercase tracking-widest transition-colors mb-12 cursor-pointer z-50 relative"
      >
        <FaArrowLeft /> Back to Resources
      </motion.button>

      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto mb-13">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6"
        >
          <FaGraduationCap /> Academic Vault
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-6">
          Syllabus{" "}
          <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Resources
          </span>
        </h1>
        <p className="text-slate-400 text-sm md:text-base leading-relaxed">
          Access the latest official curriculum for AKTU semesters and GATE
          2026. Stay aligned with the correct exam patterns and topics.
        </p>
      </div>

      {/* Custom Segmented Tabs */}
      <div className="flex justify-center mb-10">
        <div className="relative flex bg-white/[0.03] border border-white/10 p-1 rounded-2xl backdrop-blur-md">
          {/* Sliding Background */}
          <motion.div
            layoutId="tab-bg"
            className="absolute inset-y-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl shadow-lg shadow-blue-500/20"
            initial={false}
            animate={{
              x: activeTab === "semester" ? 0 : "100%",
              width: "50%",
            }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />

          <button
            onClick={() => setActiveTab("semester")}
            className={`relative z-10 px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-colors ${
              activeTab === "semester"
                ? "text-white"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            <FaUniversity /> Semester
          </button>
          <button
            onClick={() => setActiveTab("gate")}
            className={`relative z-10 px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-colors ${
              activeTab === "gate"
                ? "text-white"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            <FaBook /> GATE
          </button>
        </div>
      </div>

      {/* Links Grid */}
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid gap-4"
          >
            {currentLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-cyan-500/30 transition-all hover:bg-white/[0.05] hover:shadow-[0_10px_40px_rgba(0,0,0,0.3)] overflow-hidden"
              >
                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                      <FaFileAlt size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-cyan-500 px-2 py-0.5 bg-cyan-500/10 rounded">
                          {link.tag}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500">
                          {link.branch}
                        </span>
                      </div>
                      <h3 className="text-md font-bold text-slate-100 group-hover:text-white transition-colors">
                        {link.name}
                      </h3>
                    </div>
                  </div>

                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-500 group-hover:bg-cyan-500 group-hover:text-black transition-all">
                    <FaExternalLinkAlt size={14} />
                  </div>
                </div>
              </a>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
