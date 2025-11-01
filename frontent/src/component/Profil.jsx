import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
    FaEdit, 
    FaSearch, 
    FaArrowRight, 
    FaGraduationCap, 
    FaMapSigns, 
    FaBookOpen, 
    FaTimes,
    FaPhone 
} from "react-icons/fa"; 
import { toast } from "react-hot-toast";
import defaultPhoto from "../assets/photo.png";
import Loading from "./Loading";

export default function Dashboard() {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [roadmaps, setRoadmaps] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- Utility Functions (Kept same for brevity) ---
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [profileRes, roadmapRes, certRes] = await Promise.all([
          axios.get(`${API_URL}/auth/profile`, { withCredentials: true }),
          axios.get(`${API_URL}/roadmap`, { withCredentials: true }),
          axios.get(`${API_URL}/quiz/user-certificates`, { withCredentials: true }),
        ]);

        setUser(profileRes.data);
        setFormData({ ...profileRes.data, profilePhoto: null });
        setCertificates(certRes.data || []);

        const rm = Array.isArray(roadmapRes.data)
          ? roadmapRes.data
          : roadmapRes.data?.roadmaps || [];
        setRoadmaps(rm);
      } catch (err) {
        toast.error("Please login first.");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [API_URL, navigate]);

  const getProgress = (months) => {
    if (!Array.isArray(months)) return 0;
    const total = months.reduce((acc, m) => acc + (m.steps?.length || 0), 0);
    const done = months.reduce(
      (acc, m) => acc + (m.steps?.filter((s) => s.completed)?.length || 0),
      0
    );
    return total ? Math.round((done / total) * 100) : 0;
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleFileChange = (e) => {
      setFormData({ 
          ...formData, 
          profilePhoto: e.target.files[0] || null
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    
    try {
      const fd = new FormData();
      
      for (let k in formData) {
        if (k !== 'email' && formData[k] !== null) { 
            if (k === 'profilePhoto' && formData[k] instanceof File) {
                fd.append(k, formData[k]);
            } else if (k !== 'profilePhoto') {
                fd.append(k, formData[k]);
            }
        }
      }

      const { data } = await axios.put(`${API_URL}/auth/profile`, fd, {
        withCredentials: true,
      });
      
      setUser(data);
      setFormData({ ...data, profilePhoto: null });
      toast.success("Profile updated!");
      setIsModalOpen(false);

    } catch(err) {
      console.error("Profile update error:", err.response || err);
      const errMsg = err.response?.data?.message || "Update failed due to a server error.";
      toast.error(errMsg);
    } finally {
      setUpdateLoading(false);
    }
  };
  // --- End Utility Functions ---

  if (loading) return <Loading />;

  const startedRoadmaps = roadmaps.filter((r) => getProgress(r.months) > 0);
  const filteredRoadmaps = startedRoadmaps.filter((r) =>
    r.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const profileDetails = [
    { label: "Phone", value: user?.phoneNo, icon: FaPhone },
    { label: "College", value: user?.CollegeName, icon: FaGraduationCap },
    { label: "Course", value: user?.Course, icon: FaMapSigns },
    { label: "Branch", value: user?.BranchName, icon: FaMapSigns },
    { label: "Year", value: user?.YearOfStudy, icon: FaGraduationCap },
  ];

  const totalCertificates = certificates.length;
  const totalRoadmaps = roadmaps.length;
  const activeRoadmaps = startedRoadmaps.length;


  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020202] to-[#0f0f0f] text-gray-100 px-4 sm:px-8 py-12">
      <motion.h1
        className="text-4xl sm:text-5xl font-extrabold mb-12 text-center bg-gradient-to-r from-sky-400 to-cyan-400 text-transparent bg-clip-text drop-shadow-lg"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Personal Development Hub
      </motion.h1>

      {/* --- Section 1: Welcome Box and Key Stats --- */}
      <section className="max-w-7xl mx-auto mb-16 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Welcome Box */}
        <div className="lg:col-span-2 bg-gradient-to-r from-blue-700 via-sky-600 to-cyan-600 p-0.5 rounded-3xl shadow-xl shadow-sky-900/40">
          <div className="bg-[#0f0f0f] p-6 sm:p-8 rounded-[1.4rem]">
            <h2 className="text-3xl font-bold text-white">
              Welcome back, <span className="bg-gradient-to-r from-sky-400 to-cyan-400 text-transparent bg-clip-text">{user?.name}!</span>
            </h2>
            <p className="text-gray-400 mt-2 text-lg">
              It's time to check your progress and conquer the next step in your learning journey.
            </p>
            <div className="mt-5 flex flex-wrap gap-4">
              <button
                onClick={() => navigate('/roadmap')}
                className="flex items-center bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-full transition duration-300"
              >
                <FaBookOpen className="mr-2" /> Explore Roadmaps
              </button>
              <button
                onClick={() => navigate('/quizzes')}
                className="flex items-center bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded-full transition duration-300"
              >
                <FaArrowRight className="mr-2" /> Take a Quiz
              </button>
            </div>
          </div>
        </div>
        {/* Stats */}
        <div className="lg:col-span-1 grid grid-cols-3 lg:grid-cols-1 gap-6">
          <motion.div
            className="p-4 bg-[#181818] rounded-2xl border border-slate-800 shadow-lg text-center"
            whileHover={{ scale: 1.05 }}
          >
            <p className="text-4xl font-bold text-sky-400">{totalCertificates}</p>
            <p className="text-sm text-gray-400">Certificates Earned</p>
          </motion.div>
          <motion.div
            className="p-4 bg-[#181818] rounded-2xl border border-slate-800 shadow-lg text-center"
            whileHover={{ scale: 1.05 }}
          >
            <p className="text-4xl font-bold text-cyan-400">{activeRoadmaps}</p>
            <p className="text-sm text-gray-400">Active Roadmaps</p>
          </motion.div>
          <motion.div
            className="p-4 bg-[#181818] rounded-2xl border border-slate-800 shadow-lg text-center"
            whileHover={{ scale: 1.05 }}
          >
            <p className="text-4xl font-bold text-gray-300">{totalRoadmaps}</p>
            <p className="text-sm text-gray-400">Total Roadmaps</p>
          </motion.div>
        </div>
      </section>

      {/* --- Section 2: Main Content (Profile/Certs vs. Roadmaps) --- */}
      <section className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Profile and Certificates */}
        <div className="lg:col-span-2 space-y-12 p-6 rounded-3xl bg-[#0a0a0a] border border-slate-800 shadow-2xl shadow-black/50">
          
          {/* Profile Card */}
          <div className="bg-gradient-to-r from-blue-700 via-sky-600 to-cyan-600 p-0.5 rounded-3xl shadow-xl shadow-sky-900/40">
            <div className="bg-[#0f0f0f] p-6 sm:p-8 rounded-[1.4rem] flex flex-col md:flex-row items-center gap-8 relative">
              <img
                src={user?.profilePhoto || defaultPhoto}
                alt="Profile"
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-sky-400 shadow-xl object-cover"
              />
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-1">Your Profile Details</h3>
                <p className="text-sky-300 mb-4 font-mono"><span className="text-gray-400">email: </span>{user?.email}</p>
                
                {/* Profile Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
                  {profileDetails.map((item, index) => (
                    <motion.div
                      key={index}
                      className="flex flex-col items-center md:items-start"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <div className="flex items-center text-sm text-gray-400 mb-1">
                        <item.icon className="text-sky-500 mr-2" size={14} />
                        {item.label}
                      </div>
                      <span className="text-white text-lg font-bold truncate w-full text-center md:text-left">
                        {item.value || "N/A"}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="absolute top-4 right-4 bg-sky-500 hover:bg-sky-600 text-white p-3 rounded-full shadow-lg transition duration-300 hover:scale-110 active:scale-95"
                aria-label="Edit Profile"
              >
                <FaEdit size={20} />
              </button>
            </div>
          </div>

          {/* Certificates Section */}
          {certificates.length > 0 && (
            <div>
              <h2 className="text-3xl font-semibold mb-6 text-sky-400">
                <span className="mr-2">🏅</span> Recent Certifications
              </h2>
              <section className="grid md:grid-cols-2 gap-6">
                {certificates.slice(0, 2).map((cert, index) => (
                  <motion.div
                    key={cert._id}
                    className="bg-[#181818] p-6 rounded-2xl shadow-xl border border-slate-800 hover:border-sky-500 transform transition duration-300 relative overflow-hidden"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.03 }}
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-400 to-cyan-400"></div>
                    <h3 className="text-xl font-bold text-white mt-2 mb-2">{cert.subject}</h3>
                    <p className="text-sm text-gray-400 mb-4">
                      Issued: <span className="text-gray-200 font-medium">{new Date(cert.date).toLocaleDateString()}</span>
                    </p>
                    <button
                      onClick={() => navigate(`/certificate/${cert.certificateId}`)}
                      className="w-full flex items-center justify-center bg-gradient-to-r from-sky-600 to-cyan-700 hover:from-sky-700 hover:to-cyan-800 text-white font-medium py-3 px-4 rounded-xl shadow-lg transition duration-300 active:scale-98"
                    >
                      Verify Certificate <FaArrowRight className="ml-2 h-4 w-4" />
                    </button>
                  </motion.div>
                ))}
              </section>
              {certificates.length > 2 && (
                <p className="text-right mt-4">
                  <button onClick={() => navigate('/certificates')} className="text-sky-400 hover:text-sky-300 font-medium">
                    View all {certificates.length} certificates &rarr;
                  </button>
                </p>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Active Roadmaps */}
        <div className="lg:col-span-1 space-y-8 p-6 rounded-3xl bg-[#0a0a0a] border border-slate-800 shadow-2xl shadow-black/50">
          <h2 className="text-3xl font-semibold text-sky-400">
            <span className="mr-2">🧭</span> Active Roadmaps
          </h2>
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search active learning tracks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#181818] border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-gray-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all duration-300 shadow-inner"
            />
          </div>
          <div className="space-y-4">
            {filteredRoadmaps.length > 0 ? (
              filteredRoadmaps.map((r, index) => (
                <motion.div
                  key={r._id}
                  onClick={() => navigate(`/roadmap/${r._id}`)}
                  className="bg-[#181818] border border-slate-800 hover:border-sky-500 rounded-xl p-5 transition-all shadow-md cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <h3 className="text-lg font-bold text-sky-300 mb-1 line-clamp-1">{r.title}</h3>
                  <p className="text-gray-400 text-xs mb-3 line-clamp-2">{r.description}</p>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500 font-medium">Progress</span>
                    <span className="text-sky-400 font-bold">{getProgress(r.months)}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden shadow-inner shadow-black/50">
                    <motion.div
                      className="h-2 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${getProgress(r.months)}%` }}
                      transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
                    />
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-center text-gray-500 p-6 bg-[#181818] rounded-xl border border-slate-800">
                {searchTerm
                  ? `No roadmaps found matching "${searchTerm}".`
                  : "No active roadmaps. Start one now!"}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* --- Edit Profile Modal (Kept the same) --- */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[#0f0f0f] w-full max-w-lg p-6 sm:p-8 rounded-3xl shadow-2xl shadow-sky-900/60 relative border border-sky-700 max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 text-gray-400 hover:text-white transition text-2xl p-2 rounded-full hover:bg-slate-800"
                aria-label="Close Modal"
              >
                <FaTimes size={20} />
              </button>
              <h2 className="text-3xl font-bold mb-6 text-sky-400 text-center">Update Profile</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                {[
                  { field: "name", label: "Full Name" },
                  { field: "phoneNo", label: "Phone Number", type: "tel" }, 
                  { field: "CollegeName", label: "College Name" },
                  { field: "Course", label: "Course/Program" },
                  { field: "BranchName", label: "Branch Name" },
                  { field: "YearOfStudy", label: "Year of Study" },
                ].map(({ field, label, type = "text" }) => (
                  <div key={field}>
                    <label className="block text-sm text-gray-300 font-medium mb-1">{label}</label>
                    <input
                      name={field}
                      type={type}
                      value={formData[field] || ""} 
                      onChange={handleChange}
                      className="w-full bg-[#181818] border border-slate-700 p-3 rounded-xl focus:border-sky-500 focus:ring-2 focus:ring-sky-500 outline-none text-gray-200 transition"
                      disabled={field === 'email'} 
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-sm text-gray-300 font-medium mb-1">Profile Photo (Optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-500 file:text-white hover:file:bg-sky-600 bg-[#181818] border border-slate-700 p-3 rounded-xl text-gray-200 cursor-pointer transition"
                  />
                </div>
                <div className="flex justify-end gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2.5 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-sky-500 to-cyan-500 text-white rounded-xl shadow-lg hover:opacity-95 transition font-semibold disabled:opacity-50 active:scale-98"
                    disabled={updateLoading}
                  >
                    {updateLoading ? "Saving Changes..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}