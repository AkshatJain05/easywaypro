import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../../redux/authSlice";
import { toast } from "react-hot-toast";
import { MdEmail, MdShield } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion"; // Use motion for better feedback
import ScrollReveal from "../../component/ScllorAnimation";

function Login() {
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
      const resultAction = await dispatch(adminLogin({ email, password }));
      if (adminLogin.fulfilled.match(resultAction)) {
        toast.success("Access Granted. Welcome Admin.");
        navigate("/admin/users");
      } else {
        toast.error(resultAction.payload || "Unauthorized Access");
      }
    } catch (err) {
      toast.error("Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollReveal from="bottom">
      <div className="min-h-screen w-full px-5 flex justify-center items-center  relative overflow-hidden">
        {/* Background Decorative Element */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-500/5 blur-[120px] rounded-full pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-[420px] w-full relative group"
        >
          {/* Card Border Glow */}
          <div className="absolute inset-0 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem]" />

          <form
            onSubmit={handleSubmit}
            className="relative w-full text-center border border-white/10 rounded-[2rem] px-6 sm:px-10 py-12 bg-[#0a0a0a]/80 backdrop-blur-xl shadow-2xl"
          >
            {/* Admin Icon */}
            <div className="mx-auto w-16 h-16 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(234,179,8,0.1)]">
              <MdShield className="text-blue-500 text-3xl" />
            </div>

            <h1 className="text-white font-black text-3xl tracking-tight">
              Admin <span className="text-blue-500 italic">Panel</span>
            </h1>
            <p className="text-gray-500 text-xs uppercase tracking-widest mt-2 font-bold">
              Secure Authorization Required
            </p>

            <div className="mt-10 space-y-4 text-left">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-[10px] text-gray-300 font-bold ml-4 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="flex items-center w-full bg-white/[0.03] border border-white/5 h-14 rounded-2xl focus-within:border-blue-500/50 focus-within:ring-4 focus-within:ring-yellow-500/10 transition-all px-4 gap-3">
                  <MdEmail className="text-gray-500 text-xl" />
                  <input
                    type="email"
                    placeholder="admin@easyway.pro"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-transparent text-white placeholder-gray-700 outline-none text-sm w-full h-full"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-[10px] text-gray-300 font-bold ml-4 uppercase tracking-wider">
                  Access Key
                </label>
                <div className="flex items-center w-full bg-white/[0.03] border border-white/5 h-14 rounded-2xl focus-within:border-blue-500/50 focus-within:ring-4 focus-within:ring-yellow-500/10 transition-all px-4 gap-3">
                  <RiLockPasswordFill className="text-gray-500 text-xl" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-transparent text-white placeholder-gray-700 outline-none text-sm w-full h-full tracking-widest"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-600 hover:text-blue-500 transition-colors"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="mt-10 w-full h-14 rounded-2xl text-gray-100 font-black text-sm uppercase tracking-widest bg-blue-600 hover:bg-blue-500 shadow-[0_10px_20px_rgba(234,179,8,0.2)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Verifying...
                </>
              ) : (
                "Authorize Access"
              )}
            </motion.button>

            {/* Security Warning */}
            <p className="mt-8 text-[10px] text-gray-600 flex items-center justify-center gap-1">
              <span className="w-1 h-1 rounded-full bg-red-500 animate-pulse" />
              Unauthorized access attempts are logged.
            </p>
          </form>
        </motion.div>
      </div>
    </ScrollReveal>
  );
}

export default Login;
