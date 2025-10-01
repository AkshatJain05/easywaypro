import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {FaArrowLeft} from "react-icons/fa";


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
      const res = await axios.post(`${API_URL}/auth/forgot-password`, {
        email,
      });
      setMsg(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 px-3 py-1.5 m-5 md:my-8 md:mx-18
                               bg-gray-800 hover:bg-gray-700 text-gray-200 
                               rounded-lg text-sm shadow-md transition-all cursor-pointer"
      >
        <FaArrowLeft className="text-sm" />
        <span>Back</span>
      </button>

      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-gray-950 to-black border-1 w-full max-w-md p-8 rounded-2xl shadow-lg text-white">
          <h2 className="text-3xl font-bold text-center mb-6">
            Forgot Password
          </h2>
          <form onSubmit={handleForgot} className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3  text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 border-gray-100 border-2 rounded-xl"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 py-3 rounded hover:bg-indigo-500 transition font-semibold"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
          {msg && <p className="mt-4 text-green-400 text-center">{msg}</p>}
          {error && <p className="mt-4 text-red-400 text-center">{error}</p>}
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;
