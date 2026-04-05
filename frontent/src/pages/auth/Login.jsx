import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, fetchUser } from "../../redux/authSlice";
import { useNavigate, Link } from "react-router-dom";
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
  const { user, status } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Redirect if logged in
  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  // Handle login
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(login({ email, password }));
      if (login.fulfilled.match(resultAction)) {
        toast.success("Login successful!");
        navigate("/");
      } else {
        toast.error(resultAction.payload || "Login failed");
      }
    } catch (err) {
      toast.error("Login failed");
    }
  };

  // Google login setup
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
        }
      );
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleGoogleResponse = async (response) => {
    setGoogleLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/google`,
        { tokenId: response.credential },
        { withCredentials: true }
      );

      if (res.data.user) {
        await dispatch(fetchUser());
        toast.success(`Welcome ${res.data.user.name}`);
        navigate("/");
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

        {/* Background Glow */}
        <div className="absolute w-[500px] h-[500px] bg-indigo-500/20 blur-[120px] rounded-full top-[-100px] left-[-100px] animate-pulse"></div>
        <div className="absolute w-[400px] h-[400px] bg-yellow-500/10 blur-[100px] rounded-full bottom-[-100px] right-[-100px] animate-pulse"></div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          autoComplete="on"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 w-full max-w-md p-8 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl"
        >
          {/* Heading */}
          <h1 className="text-3xl font-bold text-white text-center mb-2">
            Welcome Back 👋
          </h1>
          <p className="text-gray-400 text-center mb-8 text-sm">
            Login to continue your journey
          </p>

          {/* Email */}
          <div className="relative mb-6">
            <MdEmail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full bg-white/10 text-white placeholder-gray-400 border border-white/10 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30 outline-none transition-all"
              placeholder="Enter your email"
            />
          </div>

          {/* Password */}
          <div className="relative mb-3">
            <RiLockPasswordFill className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-12 py-3 rounded-full bg-white/10 text-white placeholder-gray-400 border border-white/10 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30 outline-none transition-all"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Forgot Password */}
          <div className="text-right mb-6">
            <Link
              to="/forgot-password"
              className="text-indigo-400 text-sm hover:text-indigo-300"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={status === "loading"}
            className={`w-full py-3 rounded-full font-semibold text-white bg-gradient-to-r from-indigo-500 to-cyan-500 hover:opacity-90 transition shadow-lg shadow-indigo-500/20 ${
              status === "loading" && "opacity-50 cursor-not-allowed"
            }`}
          >
            {status === "loading" ? "Logging in..." : "Login"}
          </button>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-600"></div>
            <span className="px-3 text-gray-400 text-sm">OR</span>
            <div className="flex-1 h-px bg-gray-600"></div>
          </div>

          {/* Google Login */}
          <div className="flex justify-center mb-6">
            {googleLoading ? (
              <div className="w-[265px] h-12 flex items-center justify-center rounded-full bg-white/10 text-gray-300">
                Logging in...
              </div>
            ) : (
              <div
                id="googleButton"
                className="scale-105 hover:scale-110 transition-transform"
              ></div>
            )}
          </div>

          {/* Signup */}
          <p className="text-gray-400 text-center text-sm">
            Don’t have an account?
            <Link
              to="/sign-up"
              className="text-indigo-400 ml-1 hover:text-indigo-300"
            >
              Sign up
            </Link>
          </p>
        </motion.form>
      </div>
    </ScrollReveal>
  );
};

export default Login;