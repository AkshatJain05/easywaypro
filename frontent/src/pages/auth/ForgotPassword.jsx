import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaPaperPlane } from "react-icons/fa";
import { MdLockReset, MdEmail } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const handleForgot = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/forgot-password`, { email });
      setMsg(res.data.message || "Reset link sent to your inbox!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full" />

      {/* Back Button (Floating) */}
      <motion.button
        whileHover={{ x: -4 }}
        onClick={() => navigate(-1)}
        className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-blue-400 font-bold text-xs uppercase tracking-widest transition-colors z-20"
      >
        <FaArrowLeft /> Back to Login
      </motion.button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className=" backdrop-blur-3xl border border-white/60 p-8 md:p-10 rounded-[2.5rem] shadow-2xl">
          
          {/* Icon and Title */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-blue-600/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <MdLockReset className="text-blue-400 text-4xl" />
            </div>
            <h2 className="text-3xl font-black text-white tracking-tighter">
              Reset <span className="text-blue-400">Password</span>
            </h2>
            <p className="mt-3 text-slate-500 text-sm leading-relaxed">
              Enter your email and we'll send you a secure link to recover your account.
            </p>
          </div>

          <form onSubmit={handleForgot} className="space-y-6">
            <div className="group relative">
              <MdEmail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-900/50 border border-slate-800 text-white placeholder-slate-600 outline-none transition-all focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10"
                required
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm uppercase tracking-widest shadow-lg shadow-blue-500/20 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <FaPaperPlane className="text-xs" />
                  Send Reset Link
                </>
              )}
            </motion.button>
          </form>

          {/* Feedback Messages */}
          <AnimatePresence mode="wait">
            {msg && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm text-center font-medium"
              >
                {msg}
              </motion.div>
            )}

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center font-medium"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer info */}
        <p className="text-center mt-8 text-slate-600 text-xs font-bold tracking-widest uppercase">
          Easyway Pro Security
        </p>
      </motion.div>
    </div>
  );
}

export default ForgotPassword;