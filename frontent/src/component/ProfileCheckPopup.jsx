import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaUserCircle, FaArrowRight, FaEdit, FaInfoCircle, FaTimes } from "react-icons/fa";
import axios from "axios";

export default function ProfileCheckPopup() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds timer state
  const API_URL = import.meta.env.VITE_API_URL;

  // 1. Initial Profile API Check
  // 1. Initial Profile API Check (Delayed by 30 seconds)
useEffect(() => {
  // 30 seconds (30000 ms) ka delay timer set kiya
  const apiDelayTimer = setTimeout(() => {
    axios.get(`${API_URL}/auth/profile`, { withCredentials: true })
      .then(({ data }) => {
        const requiredFields = ["phoneNo", "CollegeName", "Course", "BranchName", "YearOfStudy"];
        
        const isIncomplete = requiredFields.some(f => 
          data[f] === undefined || data[f] === null || data[f].toString().trim() === ""
        );
        
        if (isIncomplete) {
          setShowPopup(true); // 30 sec baad agar profile incomplete mili toh popup dikhao
        }
      })
      .catch(err => console.error("Profile auto-check error:", err));
  }, 2000); // 1000 milliseconds = 1 seconds

  // Cleanup function: Agar user 30 sec se pehle hi page badal de, toh timer clear ho jaye (Memory leaks se bachata hai)
  return () => clearTimeout(apiDelayTimer);
}, [API_URL]);

  // 2. Countdown Timer Logic (Triggers only when popup is shown)
  useEffect(() => {
    if (!showPopup) return;

    if (timeLeft === 0) {
      setShowPopup(false); // 30 sec complete hote hi automatic close
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId); // Cleanup interval on unmount or state change
  }, [showPopup, timeLeft]);

  return (
    <AnimatePresence>
      {showPopup && (
        <div className="fixed inset-0 z-[9999] flex flex-col md:flex-row items-center justify-center p-4 bg-black/50 backdrop-blur-xl transition-all duration-300">
          
          {/* ── CENTRALIZED RESPONSIVE GRID LAYOUT ── */}
          <div className="w-full max-w-4xl flex flex-col md:flex-row gap-6 items-center justify-center relative">
            
            {/* ── LEFT SIDE: SMALL INSTRUCTION BOX ── */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ delay: 0.1 }}
              className="w-full md:w-64 p-5 rounded-2xl border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent backdrop-blur-md text-left flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm tracking-wide uppercase mb-3">
                  <FaInfoCircle size={14} /> Quick Guide
                </div>
                <h4 className="text-white text-base font-extrabold mb-1">Easy Setup Process</h4>
                <p className="text-slate-400 text-xs leading-relaxed mb-4">
                  Locate the Profile section in your Profile dashboard and click the <span className="text-indigo-400 font-semibold">Edit Profile</span> button to update your information and unlock personalized features.
                </p>
              </div>

              {/* Step Flow indicator mini boxes */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                  <span className="w-4 h-4 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-300 text-[10px]">1</span>
                  Click on Edit Profile button
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                  <span className="w-4 h-4 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-300 text-[10px]">2</span>
                  Fill out all required profile details
                </div>
              </div>
            </motion.div>

            {/* ── RIGHT SIDE: MAIN ATTRACTIVE POPUP CARD ── */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="w-full max-w-sm p-6 rounded-2xl border border-white/10 text-center bg-gradient-to-b from-[#161224] to-[#0c0914] shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden group"
            >
              {/* Premium Top Neon Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-violet-500 opacity-80" />

              {/* 🕒 Top Right Absolute Timer Badge */}
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-black text-slate-400 tabular-nums tracking-widest uppercase">
                Dismiss in <span className="text-indigo-400">{timeLeft}s</span>
              </div>

              {/* Glowing Icon Container */}
              <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-5 mt-4 relative shadow-[0_0_20px_rgba(99,102,241,0.15)]">
                <FaUserCircle size={32} />
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-lg bg-violet-600 border border-white/20 flex items-center justify-center text-white text-[10px]">
                  <FaEdit size={8} />
                </span>
              </div>
              
              {/* Title & Info */}
              <h3 className="text-xl font-black text-white tracking-tight mb-2">
                Profile Setup Required
              </h3>
              <p className="text-xs font-medium text-slate-400 leading-relaxed max-w-[280px] mx-auto mb-6">
                Complete your profile to help us provide more relevant courses, resources, opportunities, and updates based on your learning journey.
              </p>

              {/* Action Buttons Container */}
              <div className="space-y-2.5">
                {/* Primary Action: Go to Profile */}
                <button
                  onClick={() => {
                    setShowPopup(false);
                    navigate("/profile");
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 font-bold text-sm text-white hover:opacity-95 active:scale-[0.98] transition-all shadow-[0_4px_25px_rgba(99,102,241,0.3)]"
                >
                  Edit Profile Now <FaArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* Secondary Action: Glassmorphic Cancel/Skip Button */}
                <button
                  onClick={() => setShowPopup(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-xs font-semibold text-slate-400 hover:text-white transition-all"
                >
                  <FaTimes size={10} /> Skip for now
                </button>
              </div>
            </motion.div>

          </div>
        </div>
      )}
    </AnimatePresence>
  );
}