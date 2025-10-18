import ScrollReveal from "../../component/ScllorAnimation";
import { FcGoogle } from "react-icons/fc";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaUser } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";

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
      await axios.post(`${API_URL}/auth/register`, { name, email, password });
      toast.success("Sign up successful!");
      navigate("/login");
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollReveal from="bottom">
      <div className="h-[90vh] w-full px-5 flex justify-center items-center">
        <form
          onSubmit={onSubmitHandler}
          autoComplete="on"   //  enables autofill
          className="max-w-96 w-full text-center border border-gray-300/60 rounded-2xl px-5 sm:px-8 bg-gradient-to-bl from-slate-950 to-slate-900 shadow-sm shadow-slate-600"
        >
          <h1 className="text-gray-100 font-semibold text-3xl mt-10">
            Sign Up
          </h1>
          <p className="text-gray-200 text-sm mt-2">
            Please sign up to continue
          </p>

          {/* Name */}
          <div className="flex items-center w-full mt-10 bg-slate-100 border border-yellow-500 h-11 rounded-full overflow-hidden pl-4 gap-2">
            <FaUser className="text-gray-800 h-4 w-5" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              autoComplete="name"   // autofill full name
              className="bg-transparent text-gray-900 placeholder-gray-500 outline-none text-[16px] w-full h-full"
              required
            />
          </div>

          {/* Email */}
          <div className="flex items-center w-full mt-4 bg-slate-100 border border-yellow-500 h-11 rounded-full overflow-hidden pl-4 gap-2">
            <MdEmail className="text-gray-800 h-9 w-5" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email id"
              autoComplete="email"   // helps with email autofill
              className="bg-transparent text-gray-900 placeholder-gray-500 outline-none text-[16px] w-full h-full"
              required
            />
          </div>

          {/* Password */}
          <div className="flex items-center mt-4 w-full bg-slate-100 border border-yellow-500 h-11 rounded-full overflow-hidden pl-4 gap-2 mb-5">
            <RiLockPasswordFill className="text-gray-800 h-8 w-5" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoComplete="new-password"   //  for signup forms
              className="bg-transparent text-gray-900 placeholder-gray-500 outline-none text-sm w-full h-full"
              required
            />
            {/* Eye toggle */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="pr-4 text-gray-700 focus:outline-none"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`mt-2 w-full h-11 rounded-full text-white bg-slate-950 hover:opacity-90 border-1 border-slate-300 active:scale-[0.96] transition-all ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>

          {/* Login Link */}
          <p className="text-gray-200 text-sm mt-3 mb-9 ">
            Already have an account?
            <NavLink className="text-indigo-500 px-2" to="/login">
              Login
            </NavLink>
          </p>
        </form>
      </div>
    </ScrollReveal>
  );
}

export default SignUp;
