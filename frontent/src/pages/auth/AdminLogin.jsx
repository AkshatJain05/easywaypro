import ScrollReveal from "../../component/ScllorAnimation";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { adminLogin } from "../../redux/authSlice";
import { toast } from "react-hot-toast";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

     try {
      const resultAction = await dispatch(adminLogin({ email, password }));
      // Check if login was successful
      if (adminLogin.fulfilled.match(resultAction)) {
        toast.success("Login successful!");
        navigate("/admin/add-roadmap"); // redirect after login
      } else {
        toast.error(resultAction.payload || "Admin Login failed");
      }
    } catch (err) {
      toast.error("Admin Login failed");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollReveal from="bottom">
      <div className="h-[90vh] w-full px-5 flex justify-center items-center">
        <form
          onSubmit={handleSubmit}
          className="max-w-96 w-full text-center border border-gray-300/60 rounded-2xl px-5 sm:px-8 bg-gradient-to-bl from-slate-950 to-slate-900 shadow-sm shadow-slate-600"
        >
          <h1 className="text-gray-100 font-semibold text-3xl mt-10">Admin Login</h1>
          <p className="text-gray-200 text-sm mt-2">Please sign in to continue</p>

          {/* Email */}
          <div className="flex items-center w-full mt-10 bg-slate-100 border border-yellow-500 h-11 rounded-full overflow-hidden pl-4 gap-2">
            <MdEmail className="text-gray-800 h-9 w-5" />
            <input
              type="email"
              placeholder="Email id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent text-gray-900 placeholder-gray-500 outline-none text-[16px] w-full h-full"
              required
            />
          </div>

          {/* Password */}
          <div className="flex items-center mt-4 w-full bg-slate-100 border border-yellow-500 h-11 rounded-full overflow-hidden pl-4 gap-2">
            <RiLockPasswordFill className="text-gray-800 h-8 w-5" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="bg-transparent text-gray-900 placeholder-gray-500 outline-none text-sm w-full h-full"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`mt-2 mb-8 w-full h-11 rounded-full text-white bg-slate-950 hover:opacity-90 border-1 border-slate-300 active:scale-[0.96] transition-all ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>
      </div>
    </ScrollReveal>
  );
}

export default Login;
