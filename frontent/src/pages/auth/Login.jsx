import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, fetchUser } from "../../redux/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import ScrollReveal from "../../component/ScllorAnimation";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaEye, FaEyeSlash } from "react-icons/fa";

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

  // Redirect if already logged in
  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  // Email/password login
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
      console.error(err);
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
          type: "standard",
          shape: "pill",
          text: "signin_with",
          logo_alignment: "left",
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
      const tokenId = response.credential;
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/google`,
        { tokenId },
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
      console.error(err);
      toast.error("Google login failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <ScrollReveal from="bottom">
      <div className="h-[95vh] w-full px-5 flex justify-center items-center">
        <Toaster position="top-center" />
        <form
          onSubmit={handleSubmit}
          autoComplete="on"
          className="max-w-96 w-full text-center border border-gray-300/30 rounded-2xl px-8 py-10 bg-gradient-to-bl from-slate-950 to-slate-900 shadow-lg shadow-slate-900"
        >
          <h1 className="text-gray-100 font-semibold text-3xl mb-2">Login</h1>
          <p className="text-gray-300 text-sm mb-8">
            Sign in to access your account
          </p>

          {/* Email */}
          <div className="flex items-center w-full mb-4 bg-slate-100 border border-yellow-500 h-12 rounded-full overflow-hidden pl-4 gap-2">
            <MdEmail className="text-gray-800 h-6 w-6" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="bg-transparent text-gray-900 placeholder-gray-500 outline-none text-[16px] w-full h-full"
              required
            />
          </div>

          {/* Password */}
          <div className="flex items-center w-full mb-1 bg-slate-100 border border-yellow-500 h-12 rounded-full overflow-hidden pl-4 gap-2">
            <RiLockPasswordFill className="text-gray-800 h-6 w-6" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="bg-transparent text-gray-900 placeholder-gray-500 outline-none text-[16px] w-full h-full"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="pr-4 text-gray-700 focus:outline-none"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Forgot Password */}
          <div className="w-full text-right mb-4">
            <Link
              to="/forgot-password"
              className="text-indigo-500 text-sm hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Email/password login button */}
          <button
            type="submit"
            disabled={status === "loading"}
            className={`w-full h-12 rounded-full text-white  bg-slate-950 hover:bg-gray-950 transition-all border-1 border-slate-100 mb-2 ${
              status === "loading" ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {status === "loading" ? "Logging in..." : "Login"}
          </button>

          <div className="flex justify-center my-4 text-gray-400">OR</div>

         {/* Google login */}
<div className="flex justify-center mb-6">
  {googleLoading ? (
    <button
      className="w-[265px] h-12 bg-gray-300 rounded-full text-gray-700 font-bold cursor-not-allowed flex items-center justify-center"
      disabled
    >
      Logging in with Google...
    </button>
  ) : (
    <div
      id="googleButton"
      className=""
    ></div>
  )}
</div>


          {/* Sign up */}
          <p className="text-gray-300 text-sm">
            Don’t have an account?
            <Link
              to="/sign-up"
              className="text-indigo-500 px-2 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </ScrollReveal>
  );
};

export default Login;
