import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../../redux/authSlice";
import { toast } from "react-hot-toast";
import { MdEmail, MdShield } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaEye, FaEyeSlash, FaChalkboardTeacher } from "react-icons/fa";
import { motion } from "framer-motion";
import ScrollReveal from "../../component/ScllorAnimation";

function Login() {
  const [role, setRole] = useState("admin"); // 'admin' | 'teacher'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const resultAction = await dispatch(adminLogin({ email, password, role }));
      if (adminLogin.fulfilled.match(resultAction)) {
        toast.success(`Access Granted. Welcome ${role === "admin" ? "Admin" : "Teacher"}.`);
        
        // Dynamically guide landing route based on structural role authentication
        const targetPath = role === "admin" ? "/admin/users" : "/admin/courses";
        navigate(targetPath);
      } else {
        toast.error(resultAction.payload || "Unauthorized Access Context");
      }
    } catch (err) {
      toast.error("Security gateway communication timeout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollReveal from="bottom">
      <div className="min-h-screen w-full bg-[#050507] px-5 flex justify-center items-center relative overflow-hidden font-sans antialiased select-none">
        
        {/* Subtle Atmospheric Vector Flare */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/[0.01] blur-[140px] rounded-full pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="max-w-[400px] w-full relative"
        >
          <form
            onSubmit={handleSubmit}
            className="w-full text-center border border-white/[0.04] rounded-2xl px-6 sm:px-8 py-10 bg-[#09090b] shadow-2xl relative z-10"
          >
            {/* Dynamic Console Emblem */}
            <div className="mx-auto w-12 h-12 bg-white text-black rounded-xl flex items-center justify-center mb-5 shadow-sm transition-all duration-300">
              {role === "admin" ? (
                <MdShield className="text-xl" />
              ) : (
                <FaChalkboardTeacher className="text-xl" />
              )}
            </div>

            <h1 className="text-white font-bold text-xl tracking-tight uppercase">
              Easyway Pro <div className="text-zinc-500  font-semibold text-xs"> (Admin Login)</div>
            </h1>
            <p className="text-zinc-500 text-[10px] uppercase tracking-widest mt-1.5 font-semibold">
              Secure Authorization Matrix
            </p>

            {/* Premium Role Segment Selector */}
            <div className="mt-8 p-1 bg-[#0d0d12] border border-white/[0.04] rounded-lg grid grid-cols-2 relative">
              <button
                type="button"
                onClick={() => { setRole("admin"); setEmail(""); setPassword(""); }}
                className={`py-2 text-[11px] font-semibold tracking-wider uppercase rounded-md transition-all relative z-10 cursor-pointer ${
                  role === "admin" ? "text-black bg-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                Administrator
              </button>
              <button
                type="button"
                onClick={() => { setRole("teacher"); setEmail(""); setPassword(""); }}
                className={`py-2 text-[11px] font-semibold tracking-wider uppercase rounded-md transition-all relative z-10 cursor-pointer ${
                  role === "teacher" ? "text-black bg-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                Faculty Staff
              </button>
            </div>

            {/* Input Stack */}
            <div className="mt-6 space-y-4 text-left">
              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wide ml-1">
                  Identity Core Email
                </label>
                <div className="flex items-center w-full bg-[#0d0d12] border border-white/[0.06] h-12 rounded-lg focus-within:border-white/20 transition-all px-3.5 gap-3">
                  <MdEmail className="text-zinc-500 text-lg shrink-0" />
                  <input
                    type="email"
                    placeholder={role === "admin" ? "admin@easyway.pro" : "teacher@easyway.pro"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-transparent text-white placeholder-zinc-700 outline-none text-xs w-full h-full font-medium"
                    required
                  />
                </div>
              </div>

              {/* Password Access Key */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wide ml-1">
                  Access Security Token
                </label>
                <div className="flex items-center w-full bg-[#0d0d12] border border-white/[0.06] h-12 rounded-lg focus-within:border-white/20 transition-all px-3.5 gap-3">
                  <RiLockPasswordFill className="text-zinc-500 text-lg shrink-0" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-transparent text-white placeholder-zinc-700 outline-none text-xs w-full h-full font-medium tracking-wider"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-zinc-600 hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Action Dispatcher */}
            <button
              type="submit"
              disabled={loading}
              className="mt-8 w-full h-12 rounded-lg text-black font-semibold text-xs uppercase tracking-wider bg-white hover:bg-zinc-200 disabled:bg-zinc-900 disabled:text-zinc-600 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              {loading ? (
                <>
                  <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Validating credentials...</span>
                </>
              ) : (
                <span>Authorize & Mount Session</span>
              )}
            </button>

            {/* Security Warning Log Stamp */}
            <p className="mt-6 text-[9px] text-zinc-600 flex items-center justify-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-zinc-700 shrink-0" />
              <span>All authentication handshake routes are logged.</span>
            </p>
          </form>
        </motion.div>
      </div>
    </ScrollReveal>
  );
}

export default Login;