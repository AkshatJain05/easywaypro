import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const handleReset = async (e) => {
    e.preventDefault();
    setMsg(""); 
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/reset-password/${token}`, { password });
      setMsg(res.data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-950 to-black border-1 w-full max-w-md p-8 rounded-2xl shadow-lg text-white">
        <h2 className="text-3xl font-bold text-center mb-6">Reset Password</h2>
        <form onSubmit={handleReset} className="space-y-4">
          
          {/* Password Field */}
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="New Password" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              className="w-full border-1 border-gray-100 rounded-xl p-3 pr-10 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              required 
            />
            <span 
              className="absolute right-3 top-3 cursor-pointer text-gray-400"
              onClick={() => setShowPassword(prev => !prev)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Confirm Password Field */}
          <div className="relative">
            <input 
              type={showConfirmPassword ? "text" : "password"} 
              placeholder="Confirm Password" 
              value={confirmPassword} 
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full border-1 border-gray-100 rounded-xl p-3 pr-10 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              required 
            />
            <span 
              className="absolute right-3 top-3 cursor-pointer text-gray-400"
              onClick={() => setShowConfirmPassword(prev => !prev)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-indigo-600 py-3 rounded hover:bg-indigo-500 transition font-semibold"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        {msg && <p className="mt-4 text-green-400 text-center">{msg}</p>}
        {error && <p className="mt-4 text-red-400 text-center">{error}</p>}
      </div>
    </div>
  );
}

export default ResetPassword;
