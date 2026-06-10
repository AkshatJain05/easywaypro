import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, fetchUser } from "../../redux/authSlice";
import { useNavigate, Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import ScrollReveal from "../../component/ScllorAnimation";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
axios.defaults.withCredentials = true;

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (user) return;
  }, [user]);

  // ---------------- HANDLE LOGIN ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return; //  block double submit
    setIsLoading(true);
    try {
      const resultAction = await dispatch(login({ email, password }));
      if (login.fulfilled.match(resultAction)) {
        toast.success("Login successful!");
        await new Promise((resolve) => setTimeout(resolve, 1500));
        navigate(from, { replace: true });
      } else {
        toast.error(resultAction.payload || "Login failed");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------- GOOGLE LOGIN SETUP ----------------
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: handleGoogleResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("googleButton"),
        {
          theme: "outline",
          size: "large",
          width: 265,
          shape: "pill",
        },
      );
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // ---------------- HANDLE GOOGLE RESPONSE ----------------
  const handleGoogleResponse = async (response) => {
    setGoogleLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/google`,
        { tokenId: response.credential },
        { withCredentials: true },
      );

      if (res.data.user) {
        await dispatch(fetchUser());
        toast.success(`Welcome ${res.data.user.name}`);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        navigate(from, { replace: true });
      } else {
        toast.error("Google login failed");
      }
    } catch (err) {
      toast.error("Google login failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <ScrollReveal from="bottom">
      <div className="min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-slate-950 to-black relative overflow-hidden px-4">
        {/* Background Glows */}
        <div className="absolute w-[600px] h-[600px] bg-indigo-600/20 blur-[140px] rounded-full top-[-150px] left-[-150px] animate-pulse"></div>
        <div className="absolute w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full bottom-[-150px] right-[-150px] animate-pulse"></div>
        <div className="absolute w-[300px] h-[300px] bg-purple-500/10 blur-[100px] rounded-full top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2"></div>

        {/* Form Card */}
        <motion.form
          onSubmit={handleSubmit}
          autoComplete="on"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 w-full max-w-md p-8 rounded-3xl backdrop-blur-2xl bg-white/[0.04] border border-white/10 shadow-[0_8px_60px_rgba(0,0,0,0.5)]"
        >
          {/* Top Shine Line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-indigo-400/50 to-transparent rounded-full"></div>

          {/* Avatar Icon */}
          <div className="flex justify-center mb-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <RiLockPasswordFill className="text-white text-2xl" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-bold text-white text-center mb-1 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-gray-400 text-center mb-8 text-sm">
            Sign in to continue your journey ✨
          </p>

          {/* Email Field */}
          <div className="relative mb-4 group">
            <MdEmail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg group-focus-within:text-indigo-400 transition-colors" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/[0.06] text-white placeholder-gray-500 border border-white/10 focus:border-indigo-500/70 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter your email"
            />
          </div>

          {/* Password Field */}
          <div className="relative mb-3 group">
            <RiLockPasswordFill className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg group-focus-within:text-indigo-400 transition-colors" />
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-white/[0.06] text-white placeholder-gray-500 border border-white/10 focus:border-indigo-500/70 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Forgot Password */}
          <div className="text-right mb-6">
            <Link
              to="/forgot-password"
              className="text-indigo-400 text-xs hover:text-indigo-300 transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          {/*  Login Button — fully blocked during loading */}
          <button
            type="submit"
            disabled={isLoading}
            className="relative w-full py-3.5 rounded-xl font-semibold text-white text-sm overflow-hidden transition-all duration-300 disabled:cursor-not-allowed group"
            style={{
              background: isLoading ? "rgba(99,102,241,0.4)" : undefined,
            }}
          >
            {/* Gradient bg when not loading */}
            {!isLoading && (
              <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-cyan-500 group-hover:opacity-90 transition-opacity"></span>
            )}

            {/* Shimmer effect when loading */}
            {isLoading && (
              <span className="absolute inset-0 overflow-hidden rounded-xl">
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-500/30 via-cyan-500/30 to-indigo-500/30 animate-pulse"></span>
                <span className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_1.5s_infinite]"></span>
              </span>
            )}

            {/* Button Content */}
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white/80"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  <span className="text-white/80">Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </span>
          </button>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
            <span className="px-3 text-gray-500 text-xs uppercase tracking-widest">
              or
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
          </div>

          {/*  Google Login with improved loading design */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              {/* Google Button Always Present */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                id="googleButton"
                className={`transition-all duration-200 ${
                  googleLoading ? "opacity-0 pointer-events-none" : ""
                }`}
              />

              {/* Loading Overlay */}
              {googleLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="
          absolute inset-0
          w-[265px] h-11
          flex items-center justify-center
          rounded-full
          bg-white/[0.06]
          border border-white/10
          backdrop-blur-sm
        "
                >
                  <div className="w-5 h-5 rounded-full border-2 border-white/10 border-t-indigo-400 animate-spin" />
                </motion.div>
              )}
            </div>
          </div>

          {/* Signup Link */}
          <p className="text-gray-500 text-center text-xs">
            Don't have an account?{" "}
            <Link
              to="/sign-up"
              className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
            >
              Create one
            </Link>
          </p>
        </motion.form>
      </div>
    </ScrollReveal>
  );
};

export default Login;
