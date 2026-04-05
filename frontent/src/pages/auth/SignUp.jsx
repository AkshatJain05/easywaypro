import ScrollReveal from "../../component/ScllorAnimation";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password,
      });
      toast.success("Account created successfully 🎉");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollReveal from="bottom">
      <div className="min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-slate-950 to-black relative overflow-hidden px-4">

        {/* Background Glow */}
        <div className="absolute w-[500px] h-[500px] bg-indigo-500/20 blur-[120px] rounded-full top-[-100px] left-[-100px] animate-pulse"></div>
        <div className="absolute w-[400px] h-[400px] bg-yellow-500/10 blur-[100px] rounded-full bottom-[-100px] right-[-100px] animate-pulse"></div>

        <motion.form
          onSubmit={onSubmitHandler}
          autoComplete="on"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 w-full max-w-md p-8 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl"
        >
          {/* Heading */}
          <h1 className="text-3xl font-bold text-white text-center mb-2">
            Create Account 
          </h1>
          <p className="text-gray-400 text-center mb-8 text-sm">
            Join us and start your journey
          </p>

          {/* Name */}
          <div className="relative mb-5">
            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              placeholder="Full Name"
              className="w-full pl-12 pr-4 py-3 rounded-full bg-white/10 text-white placeholder-gray-400 border border-white/10 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30 outline-none transition-all"
            />
          </div>

          {/* Email */}
          <div className="relative mb-5">
            <MdEmail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="Email address"
              className="w-full pl-12 pr-4 py-3 rounded-full bg-white/10 text-white placeholder-gray-400 border border-white/10 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30 outline-none transition-all"
            />
          </div>

          {/* Password */}
          <div className="relative mb-6">
            <RiLockPasswordFill className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              placeholder="Create password"
              className="w-full pl-12 pr-12 py-3 rounded-full bg-white/10 text-white placeholder-gray-400 border border-white/10 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30 outline-none transition-all"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-full font-semibold text-white bg-gradient-to-r from-indigo-500 to-cyan-500 hover:opacity-90 transition shadow-lg shadow-indigo-500/20 ${
              loading && "opacity-50 cursor-not-allowed"
            }`}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

          {/* Login */}
          <p className="text-gray-400 text-center text-sm mt-5">
            Already have an account?
            <NavLink
              to="/login"
              className="text-indigo-400 ml-1 hover:text-indigo-300"
            >
              Login
            </NavLink>
          </p>
        </motion.form>
      </div>
    </ScrollReveal>
  );
}

export default SignUp;