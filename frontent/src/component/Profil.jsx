import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  FaEdit,
  FaTimes,
  FaPhone,
  FaArrowRight,
  FaGraduationCap,
  FaMapSigns,
  FaUser,
  FaAward,
  FaCompass,
  FaTrophy,
  FaRoad,
  FaCertificate,
  FaChartLine,
} from "react-icons/fa";
import defaultPhoto from "../assets/photo.png";
import Loading from "../component/Loading";

export default function Profile() {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roadmaps, setRoadmaps] = useState([]);
  const [certificates, setCertificates] = useState([]);

  // Pagination states
  const [roadmapPage, setRoadmapPage] = useState(1);
  const [certPage, setCertPage] = useState(1);
  const roadmapPerPage = 4;
  const certPerPage = 3;

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "auto";
  }, [isModalOpen]);

  /* ---------------------- Fetch Data ---------------------- */
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [profileRes, roadmapRes, certRes] = await Promise.all([
          axios.get(`${API_URL}/auth/profile`, { withCredentials: true }),
          axios.get(`${API_URL}/roadmap/user/all`, { withCredentials: true }),
          axios.get(`${API_URL}/quiz/user-certificates`, {
            withCredentials: true,
          }),
        ]);

        setUser(profileRes.data);
        setFormData({ ...profileRes.data, profilePhoto: null });
        setRoadmaps(roadmapRes.data.roadmaps || []);

        const certData = Array.isArray(certRes.data)
          ? certRes.data
          : certRes.data.certificates || certRes.data.certs || [];
        setCertificates(certData);
      } catch (err) {
        toast.error("Please login first.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [API_URL, navigate]);

  /* ---------------------- Update Profile ---------------------- */
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) =>
    setFormData({ ...formData, profilePhoto: e.target.files[0] || null });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    try {
      const fd = new FormData();
      for (let key in formData) {
        if (key !== "email" && formData[key] !== null) {
          if (key === "profilePhoto" && formData[key] instanceof File) {
            fd.append(key, formData[key]);
          } else if (key !== "profilePhoto") {
            fd.append(key, formData[key]);
          }
        }
      }
      const { data } = await axios.put(`${API_URL}/auth/profile`, fd, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUser(data);
      setFormData({ ...data, profilePhoto: null });
      toast.success("Profile updated!");
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setUpdateLoading(false);
    }
  };

  /* ---------------------- Derived Data ---------------------- */
  const activeRoadmaps = useMemo(
    () => roadmaps.filter((r) => r.overallProgress >= 1),
    [roadmaps]
  );
  const completedRoadmaps = useMemo(
    () => roadmaps.filter((r) => r.overallProgress === 100),
    [roadmaps]
  );

  // Pagination derived data
  const totalRoadmapPages = Math.ceil(activeRoadmaps.length / roadmapPerPage);
  const totalCertPages = Math.ceil(certificates.length / certPerPage);

  const paginatedRoadmaps = useMemo(() => {
    const start = (roadmapPage - 1) * roadmapPerPage;
    return activeRoadmaps.slice(start, start + roadmapPerPage);
  }, [roadmapPage, activeRoadmaps]);

  const paginatedCerts = useMemo(() => {
    const start = (certPage - 1) * certPerPage;
    return certificates.slice(start, start + certPerPage);
  }, [certPage, certificates]);

  if (loading) return <Loading />;

  /* ---------------------- UI ---------------------- */
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020202] via-[#0a0a0a] to-[#0f0f0f] text-gray-100 px-4 sm:px-8 py-12">
      {/* Hero Section */}
      <motion.div
        className="max-w-6xl mx-auto text-center mb-12"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-sky-400 to-cyan-400 text-transparent bg-clip-text mb-3">
          Your Learning Profile
        </h1>
        <p className="text-gray-400 text-sm px-6 lg:text-lg">
          Manage your details, explore active roadmaps, and celebrate your
          achievements!
        </p>
      </motion.div>

      {/* Stats Summary */}
      <motion.div
        className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {[
          {
            title: "Total Roadmaps",
            value: roadmaps.length,
            icon: <FaRoad />,
            color: "from-sky-500 to-blue-500",
          },
          {
            title: "Active Roadmaps",
            value: activeRoadmaps.length,
            icon: <FaChartLine />,
            color: "from-cyan-500 to-green-500",
          },
          {
            title: "Completed",
            value: completedRoadmaps.length,
            icon: <FaTrophy />,
            color: "from-yellow-400 to-orange-500",
          },
          {
            title: "Certificates",
            value: certificates.length,
            icon: <FaCertificate />,
            color: "from-purple-500 to-pink-500",
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            className={`rounded-2xl p-6 bg-gradient-to-br ${item.color} shadow-lg flex flex-col items-center justify-center text-white border-2 border-black mx-5 md:mx-0`}
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-4xl mb-2">{item.icon}</div>
            <h3 className="text-3xl font-bold">{item.value}</h3>
            <p className="text-lg opacity-90">{item.title}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Profile + Details */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Profile Card */}
        <motion.div
          className="bg-[#0a0a0a]/80 backdrop-blur-md border border-slate-800 rounded-3xl p-8 shadow-2xl relative flex flex-col items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <img
            src={user?.profilePhoto || defaultPhoto}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-sky-500 shadow-lg object-cover"
          />
          <h2 className="text-3xl font-bold mt-4">{user?.name}</h2>
          <p className="text-sky-400">{user?.email}</p>

          <button
            onClick={() => setIsModalOpen(true)}
            className="absolute top-6 right-6 bg-sky-500 hover:bg-sky-600 text-white p-3 rounded-full transition hover:scale-110"
          >
            <FaEdit />
          </button>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
            {[
              { label: "Phone", value: user?.phoneNo || "N/A", icon: <FaPhone /> },
              { label: "College", value: user?.CollegeName || "N/A", icon: <FaGraduationCap /> },
              { label: "Course", value: user?.Course || "N/A", icon: <FaMapSigns /> },
              { label: "Branch", value: user?.BranchName || "N/A", icon: <FaUser /> },
              { label: "Year", value: user?.YearOfStudy || "N/A", icon: "🎓" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex flex-col bg-[#121212] p-4 rounded-xl border border-slate-800 hover:border-sky-500 transition"
              >
                <div className="flex items-center text-gray-400 text-sm mb-1 gap-2">
                  <span className="text-sky-400">{item.icon}</span> {item.label}
                </div>
                <span className="text-lg font-semibold text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-12">
          {/* Active Roadmaps */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-3xl font-bold mb-6 text-sky-400 flex items-center gap-2">
              <FaCompass /> Active Roadmaps
            </h2>

            {activeRoadmaps.length === 0 ? (
              <p className="text-gray-400">No active roadmaps (≥1% progress).</p>
            ) : (
              <>
                <div className="grid md:grid-cols-2 gap-6">
                  {paginatedRoadmaps.map((r) => (
                    <motion.div
                      key={r._id}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate(`/roadmap/${r._id}`)}
                      className="cursor-pointer bg-[#0b0b0b] border border-slate-800 rounded-2xl p-6 hover:border-sky-500 hover:shadow-lg hover:shadow-sky-800/40 transition relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-sky-500/10 to-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                      <div className="relative z-10">
                        <h3 className="text-xl font-semibold mb-2 text-white flex items-center gap-2">
                          <FaCompass className="text-sky-400 " /> {r.title}
                        </h3>
                        <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                          {r.description || "No description available"}
                        </p>
                        <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden mb-2">
                          <motion.div
                            className="bg-gradient-to-r from-sky-500 to-cyan-400 h-2"
                            initial={{ width: 0 }}
                            animate={{ width: `${r.overallProgress}%` }}
                            transition={{ duration: 0.8 }}
                          />
                        </div>
                        <p className="text-sm text-sky-400 font-medium flex justify-between">
                          <span>{r.overallProgress}% completed</span>
                          <span>{r.totalSteps} steps</span>
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Roadmap Pagination */}
                {totalRoadmapPages > 1 && (
                  <div className="flex justify-center mt-6 gap-2">
                    {Array.from({ length: totalRoadmapPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setRoadmapPage(i + 1)}
                        className={`px-4 py-2 rounded-lg border ${
                          roadmapPage === i + 1
                            ? "bg-sky-600 text-white border-sky-700"
                            : "bg-[#0a0a0a] text-gray-400 border-slate-800 hover:bg-slate-800"
                        } transition`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </motion.div>

          {/* Certificates */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold mb-6 text-cyan-400 flex items-center gap-2">
              🏅 Certificates
            </h2>

            {certificates.length === 0 ? (
              <p className="text-gray-400">
                No certificates yet. Complete quizzes to earn them!
              </p>
            ) : (
              <>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedCerts.map((cert) => (
                    <motion.div
                      key={cert._id}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.98 }}
                      className="relative cursor-pointer bg-[#0b0b0b] border border-slate-800 rounded-2xl p-6 hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-800/40 transition overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                      <div className="relative z-10">
                        <h3 className="text-xl font-semibold text-white flex items-center gap-2 mb-3">
                          <FaAward className="text-cyan-400" />{" "}
                          {cert.title || "Untitled Course"}
                        </h3>
                        <p className="text-gray-400 text-sm mb-1">
                          Issued on:{" "}
                          <span className="text-cyan-400 font-medium">
                            {cert.date && !isNaN(new Date(cert.date))
                              ? new Date(cert.date).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })
                              : "Date unavailable"}
                          </span>
                        </p>
                        <p className="text-gray-400 text-sm mb-4">
                          Score:{" "}
                          <span className="text-cyan-400 font-medium">
                            {cert.score || "Unavailable"}
                          </span>
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/certificate/${cert.certificateId}`);
                          }}
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-medium py-2 px-4 rounded-lg shadow-md shadow-cyan-800/30 transition duration-300 opacity-90 group-hover:opacity-100"
                        >
                          View Certificate <FaArrowRight size={14} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Certificate Pagination */}
                {totalCertPages > 1 && (
                  <div className="flex justify-center mt-6 gap-2">
                    {Array.from({ length: totalCertPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCertPage(i + 1)}
                        className={`px-4 py-2 rounded-lg border ${
                          certPage === i + 1
                            ? "bg-cyan-600 text-white border-cyan-700"
                            : "bg-[#0a0a0a] text-gray-400 border-slate-800 hover:bg-slate-800"
                        } transition`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </motion.div>
        </div>
      </div>

      {/*  Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Scrollable Modal */}
            <motion.form
              onSubmit={handleSubmit}
              className="relative bg-[#0d0d0d] border border-slate-800 rounded-3xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
              >
                <FaTimes size={22} />
              </button>

              <h2 className="text-2xl font-bold mb-6 text-center text-sky-400">
                Edit Profile
              </h2>

              <div className="space-y-4">
                {[
                  { label: "Name", name: "name" },
                  { label: "Phone", name: "phoneNo" },
                  { label: "College", name: "CollegeName" },
                  { label: "Course", name: "Course" },
                  { label: "Branch", name: "BranchName" },
                  { label: "Year of Study", name: "YearOfStudy" },
                ].map((f) => (
                  <div key={f.name}>
                    <label className="block text-sm text-gray-400 mb-1">
                      {f.label}
                    </label>
                    <input
                      type="text"
                      name={f.name}
                      value={formData[f.name] || ""}
                      onChange={handleChange}
                      className="w-full bg-[#1a1a1a] border border-slate-700 focus:border-sky-500 rounded-xl px-4 py-2 text-white outline-none transition"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <label className="block text-sm text-gray-400 mb-1">
                  Profile Photo
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full text-gray-300"
                  accept="image/*"
                />
              </div>

              <button
                type="submit"
                disabled={updateLoading}
                className="mt-6 w-full bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white py-2 rounded-xl font-semibold transition"
              >
                {updateLoading ? "Updating..." : "Save Changes"}
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
