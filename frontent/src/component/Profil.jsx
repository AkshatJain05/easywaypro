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
  FaCamera,
  FaCheck,
} from "react-icons/fa";
import { MdSchool, MdVerified } from "react-icons/md";
import defaultPhoto from "../assets/photo.png";
import Loading from "../component/Loading";

/* ── tiny helpers ── */
const Chip = ({ children, color = "sky" }) => (
  <span
    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide
    bg-${color}-500/10 text-${color}-400 border border-${color}-500/20`}
  >
    {children}
  </span>
);

const ProgressBar = ({ pct, color = "from-violet-500 to-indigo-400" }) => (
  <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
    <motion.div
      className={`h-full rounded-full bg-gradient-to-r ${color}`}
      initial={{ width: 0 }}
      animate={{ width: `${pct}%` }}
      transition={{ duration: 1, ease: "easeOut" }}
    />
  </div>
);

const PaginationDots = ({ total, current, onSelect, color = "violet" }) => (
  <div className="flex items-center justify-center gap-2 mt-8">
    {Array.from({ length: total }).map((_, i) => (
      <button
        key={i}
        onClick={() => onSelect(i + 1)}
        className={`transition-all duration-300 rounded-full ${
          current === i + 1
            ? `w-6 h-2 bg-${color}-500`
            : "w-2 h-2 bg-white/15 hover:bg-white/30"
        }`}
      />
    ))}
  </div>
);

/* ── stagger container ── */
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

/* ================================================================ */
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
  const [previewPhoto, setPreviewPhoto] = useState(null);

  const [roadmapPage, setRoadmapPage] = useState(1);
  const [certPage, setCertPage] = useState(1);
  const roadmapPerPage = 4;
  const certPerPage = 3;

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "auto";
  }, [isModalOpen]);

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
      } catch {
        toast.error("Please login first.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [API_URL]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0] || null;
    setFormData({ ...formData, profilePhoto: file });
    if (file) setPreviewPhoto(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    try {
      const fd = new FormData();
      for (let key in formData) {
        if (key !== "email" && formData[key] !== null) {
          if (key === "profilePhoto" && formData[key] instanceof File)
            fd.append(key, formData[key]);
          else if (key !== "profilePhoto") fd.append(key, formData[key]);
        }
      }
      const { data } = await axios.put(`${API_URL}/auth/profile`, fd, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUser(data);
      setFormData({ ...data, profilePhoto: null });
      setPreviewPhoto(null);
      toast.success("Profile updated!");
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setUpdateLoading(false);
    }
  };

  const activeRoadmaps = useMemo(
    () => roadmaps.filter((r) => r.overallProgress >= 1),
    [roadmaps],
  );
  const completedRoadmaps = useMemo(
    () => roadmaps.filter((r) => r.overallProgress === 100),
    [roadmaps],
  );

  const totalRoadmapPages = Math.ceil(activeRoadmaps.length / roadmapPerPage);
  const totalCertPages = Math.ceil(certificates.length / certPerPage);

  const paginatedRoadmaps = useMemo(() => {
    const s = (roadmapPage - 1) * roadmapPerPage;
    return activeRoadmaps.slice(s, s + roadmapPerPage);
  }, [roadmapPage, activeRoadmaps]);

  const paginatedCerts = useMemo(() => {
    const s = (certPage - 1) * certPerPage;
    return certificates.slice(s, s + certPerPage);
  }, [certPage, certificates]);

  if (loading) return <Loading />;

  const stats = [
    {
      label: "Roadmaps",
      value: roadmaps.length,
      icon: <FaRoad />,
      grad: "from-blue-600 to-indigo-600",
      glow: "rgba(99,102,241,0.3)",
    },
    {
      label: "Active",
      value: activeRoadmaps.length,
      icon: <FaChartLine />,
      grad: "from-emerald-600 to-teal-500",
      glow: "rgba(20,184,166,0.3)",
    },
    {
      label: "Completed",
      value: completedRoadmaps.length,
      icon: <FaTrophy />,
      grad: "from-amber-500 to-orange-500",
      glow: "rgba(245,158,11,0.3)",
    },
    {
      label: "Certificates",
      value: certificates.length,
      icon: <FaCertificate />,
      grad: "from-violet-600 to-fuchsia-500",
      glow: "rgba(167,139,250,0.3)",
    },
  ];

  const profileFields = [
    { label: "Phone", name: "phoneNo", icon: <FaPhone size={12} /> },
    {
      label: "College",
      name: "CollegeName",
      icon: <FaGraduationCap size={12} />,
    },
    { label: "Course", name: "Course", icon: <MdSchool size={12} /> },
    { label: "Branch", name: "BranchName", icon: <FaMapSigns size={12} /> },
    { label: "Year", name: "YearOfStudy", icon: <FaUser size={12} /> },
  ];

  /* ═══════════════════════════════════ RENDER ═══════════════════════════════════ */
  return (
    <div
      className="min-h-screen text-gray-100 relative overflow-x-hidden"
      style={{
        background:
          "radial-gradient(ellipse 80% 50% at 50% -10%, #1e1033 0%, #09090f 60%)",
      }}
    >
      {/* Ambient mesh */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div
          className="absolute -top-48 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute top-[60%] -left-32 w-[400px] h-[400px] rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #0ea5e9 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute top-[40%] -right-32 w-[350px] h-[350px] rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #a855f7 0%, transparent 70%)",
          }}
        />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="max-w-8xl mx-auto px-4 sm:px-1 lg:px-26 py-5">
        {/* ── Hero (Condensed & Personalized) ── */}
        <motion.div
          className="text-center mb-8 relative"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Minimalist Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3 text-[10px] font-black tracking-[0.2em] text-indigo-400 border border-indigo-500/10"
            style={{
              background: "rgba(99,102,241,0.05)",
              backdropFilter: "blur(4px)",
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <MdVerified size={12} className="text-indigo-400" />
            STUDENT DASHBOARD
          </motion.div>

          {/* Personalized Heading - Reduced leading and size for height efficiency */}
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-2 leading-[1.1]">
            <span className="text-white opacity-90">Welcome back, </span>
            <span
              className="relative inline-block"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #818cf8 0%, #c084fc 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {user?.name?.split(" ")[0] || "Developer"}
              {/* Subtle glow effect behind the name */}
              <span className="absolute inset-0 blur-2xl bg-indigo-500/20 -z-10" />
            </span>
          </h1>

          {/* Condensed Subtext */}
          <p className="text-slate-500 text-[13px] md:text-sm max-w-lg mx-auto font-medium">
            Your progress is synced and ready. Pick up right where you left off.
          </p>

          {/* Compact Divider */}
          <div className="mt-6 flex justify-center">
            <div className="relative">
              <div className="h-[1px] w-32 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-indigo-500/50 shadow-[0_0_8px_#6366f1]" />
            </div>
          </div>
        </motion.div>

        {/* ── Stats Row ── */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-10"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          {stats.map((s, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={{ y: -5, scale: 1.02 }}
              className="relative group rounded-[1rem] p-5 m-0.5 overflow-hidden border border-white/10 transition-all duration-500"
              style={{
                background:
                  "linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)",
                backdropFilter: "blur(20px)",
              }}
            >
              {/* Dynamic Hover Glow - Intense but localized */}
              <div
                className="absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl pointer-events-none"
                style={{
                  background: `radial-gradient(600px circle at center, ${s.glow}22, transparent 40%)`,
                }}
              />

              {/* Top Edge Highlight (The "Apple" look) */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              <div className="relative z-10">
                {/* Icon Container with Glass Effect */}
                <div
                  className={`inline-flex items-center justify-center w-11 h-10 rounded-2xl bg-gradient-to-br ${s.grad} mb-5 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-500`}
                >
                  <span className="text-white text-xl drop-shadow-md">
                    {s.icon}
                  </span>
                </div>

                {/* Value with Tabular Figures (prevents jumping) */}
                <div className="flex items-baseline gap-2">
                  <div className="text-4xl font-black text-white tracking-tighter mb-1 tabular-nums">
                    {s.value}
                  </div>
                  {/* Subtle '+' or 'unit' indicator if needed */}
                  <span className="text-xs font-bold text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    +
                  </span>
                </div>

                {/* Label with increased letter spacing */}
                <div className="text-[10px] text-slate-500 font-black tracking-[0.15em] uppercase opacity-80 group-hover:text-slate-300 transition-colors">
                  {s.label}
                </div>
              </div>

              {/* Bottom Corner Accent */}
              <div
                className="absolute bottom-[-10%] right-[-10%] w-20 h-20 blur-3xl rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                style={{ backgroundColor: s.glow }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
          {/* ── Profile Card ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="self-start w-full max-w-sm rounded-[1rem] border border-white/10 overflow-hidden shadow-2xl group"
            style={{
              background:
                "linear-gradient(170deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)",
              backdropFilter: "blur(24px)",
            }}
          >
            {/* ── Premium Cover Strip ── */}
            <div className="h-24 relative overflow-hidden">
              <div
                className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
                style={{
                  background:
                    "linear-gradient(135deg, #4338ca 0%, #7c3aed 50%, #06b6d4 100%)",
                }}
              />
              {/* SVG Mesh Pattern Overlay */}
              <div
                className="absolute inset-0 opacity-20 mix-blend-overlay"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
                }}
              />
              {/* Decorative Glow */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 blur-3xl rounded-full" />
            </div>

            <div className="px-7 pb-8">
              {/* ── Avatar & Edit Action ── */}
              <div className="flex justify-between items-end -mt-14 mb-6">
                <div className="relative">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="relative z-10"
                  >
                    <img
                      src={user?.profilePhoto || defaultPhoto}
                      alt="Profile"
                      className="w-24 h-24 rounded-[2rem] border-[6px] object-cover shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
                      style={{ borderColor: "#0a0a0f" }}
                    />
                    {/* Online Status Indicator */}
                    <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-[#050508] p-1 shadow-lg">
                      <div className="w-full h-full rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                  </motion.div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05, translateY: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 px-2 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest text-white transition-all overflow-hidden relative group/btn"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 group-hover/btn:from-indigo-500 group-hover/btn:to-violet-500" />
                  <span className="relative z-10 flex items-center gap-2">
                    <FaEdit size={12} /> Edit Profile
                  </span>
                </motion.button>
              </div>

              {/* ── Identity Info ── */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-black text-white tracking-tight">
                    {user?.name}
                  </h2>
                  <MdVerified className="text-indigo-400" size={18} />
                </div>
                <p className="text-xs font-medium text-slate-300 mb-3 tracking-wide">
                  {user?.email}
                </p>
                <div className="inline-flex px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black uppercase tracking-widest text-indigo-400">
                  Active Student
                </div>
              </div>

              {/* ── Detailed Fields ── */}
              <div className="space-y-2">
                {profileFields.map((f, i) => (
                  <motion.div
                    key={i}
                    whileHover={{
                      x: 5,
                      backgroundColor: "rgba(255,255,255,0.05)",
                    }}
                    className="group/item flex items-center justify-between p-3 rounded-2xl border border-white/5 bg-white/[0.02] transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-indigo-400 group-hover/item:text-white group-hover/item:bg-indigo-600 transition-all">
                        {f.icon}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover/item:text-slate-300">
                        {f.label}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-white truncate max-w-[130px]">
                      {user?.[f.name] || (
                        <span className="text-slate-700 font-medium italic">
                          Unset
                        </span>
                      )}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
          {/* ── Right Column ── */}
          <div className="space-y-12 min-w-0">
            {/* ── Active Roadmaps ── */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center text-indigo-400">
                      <FaCompass size={14} />
                    </span>
                    Active Roadmaps
                  </h2>
                  <p className="text-xs text-gray-600 mt-1 ml-10">
                    {activeRoadmaps.length} in progress
                  </p>
                </div>
                {activeRoadmaps.length > 0 && (
                  <Chip color="indigo">{activeRoadmaps.length} Active</Chip>
                )}
              </div>

              {activeRoadmaps.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/8 p-12 text-center">
                  <FaRoad size={32} className="text-gray-700 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">
                    No active roadmaps yet.
                  </p>
                </div>
              ) : (
                <>
                  <motion.div
                    className="grid sm:grid-cols-2 gap-4"
                    variants={stagger}
                    initial="hidden"
                    animate="show"
                  >
                    {paginatedRoadmaps.map((r) => (
                      <motion.div
                        key={r._id}
                        variants={fadeUp}
                        whileHover={{ y: -3 }}
                        onClick={() => navigate(`/roadmap/${r._id}`)}
                        className="group cursor-pointer rounded-2xl border border-white/5 hover:border-indigo-500/30 p-5 transition-all duration-300 relative overflow-hidden"
                        style={{
                          background: "rgba(255,255,255,0.025)",
                          backdropFilter: "blur(12px)",
                        }}
                      >
                        {/* Hover glow */}
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                          style={{
                            background:
                              "radial-gradient(circle at 50% 100%, rgba(99,102,241,0.08), transparent 70%)",
                          }}
                        />

                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-white text-sm leading-snug flex-1 pr-2">
                            {r.title}
                          </h3>
                          <div className="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-500/20 transition-colors">
                            <FaArrowRight
                              size={10}
                              className="text-indigo-400"
                            />
                          </div>
                        </div>

                        <p className="text-xs text-gray-400 line-clamp-2 mb-4">
                          {r.description || "No description available"}
                        </p>

                        <ProgressBar
                          pct={r.overallProgress}
                          color="from-violet-500 to-indigo-400"
                        />

                        <div className="flex justify-between mt-2.5 text-[11px]">
                          <span className="text-indigo-400 font-semibold">
                            {r.overallProgress}%
                          </span>
                          <span className="text-gray-600">
                            {r.totalSteps} steps
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                  {totalRoadmapPages > 1 && (
                    <PaginationDots
                      total={totalRoadmapPages}
                      current={roadmapPage}
                      onSelect={setRoadmapPage}
                      color="violet"
                    />
                  )}
                </>
              )}
            </motion.section>

            {/* ── Certificates ── */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center text-amber-400">
                      🏅
                    </span>
                    Certificates
                  </h2>
                  <p className="text-xs text-gray-600 mt-1 ml-10">
                    {certificates.length} earned
                  </p>
                </div>
                {certificates.length > 0 && (
                  <Chip color="amber">{certificates.length} Earned</Chip>
                )}
              </div>

              {certificates.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/8 p-12 text-center">
                  <FaCertificate
                    size={32}
                    className="text-gray-700 mx-auto mb-3"
                  />
                  <p className="text-gray-500 text-sm">
                    Complete quizzes to earn certificates!
                  </p>
                </div>
              ) : (
                <>
                  <motion.div
                    className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
                    variants={stagger}
                    initial="hidden"
                    animate="show"
                  >
                    {paginatedCerts.map((cert) => (
                      <motion.div
                        key={cert._id}
                        variants={fadeUp}
                        whileHover={{ y: -3 }}
                        className="group rounded-2xl border border-white/5 hover:border-amber-500/25 p-5 transition-all duration-300 relative overflow-hidden"
                        style={{
                          background: "rgba(255,255,255,0.025)",
                          backdropFilter: "blur(12px)",
                        }}
                      >
                        {/* Gold shimmer top */}
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                          style={{
                            background:
                              "radial-gradient(circle at 50% 0%, rgba(245,158,11,0.05), transparent 70%)",
                          }}
                        />

                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center">
                            <FaAward size={14} className="text-amber-400" />
                          </div>
                          <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2 flex-1">
                            {cert.title || "Untitled Course"}
                          </h3>
                        </div>

                        <div className="space-y-1.5 mb-4">
                          <div className="flex items-center gap-1.5 text-[11px]">
                            <span className="text-gray-400">Issued:</span>
                            <span className="text-amber-400 font-medium">
                              {cert.date && !isNaN(new Date(cert.date))
                                ? new Date(cert.date).toLocaleDateString(
                                    "en-US",
                                    {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    },
                                  )
                                : "N/A"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px]">
                            <span className="text-gray-400">Score:</span>
                            <span className="text-emerald-400 font-semibold">
                              {cert.score || "—"}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/certificate/${cert.certificateId}`);
                          }}
                          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-90 hover:scale-[1.02]"
                          style={{
                            background:
                              "linear-gradient(135deg, #d97706, #b45309)",
                            boxShadow: "0 4px 14px rgba(217,119,6,0.25)",
                          }}
                        >
                          View Certificate <FaArrowRight size={10} />
                        </button>
                      </motion.div>
                    ))}
                  </motion.div>
                  {totalCertPages > 1 && (
                    <PaginationDots
                      total={totalCertPages}
                      current={certPage}
                      onSelect={setCertPage}
                      color="amber"
                    />
                  )}
                </>
              )}
            </motion.section>
          </div>
        </div>
      </div>

      {/* ═══════════════════ EDIT MODAL ═══════════════════ */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-2 backdrop-blur-[12px]"
            style={{ background: "rgba(5, 5, 8, 0.85)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-lg rounded-[1rem] border border-white/10 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              style={{
                background: "linear-gradient(165deg, #111118 0%, #08080c 100%)",
              }}
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              {/* Animated Top Glow Line */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />

              <div className="p-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-black text-white tracking-tight">
                      Edit Profile
                    </h2>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-indigo-400/60 font-bold mt-1">
                      Identity Management
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ rotate: 90, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsModalOpen(false)}
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/5 transition-all"
                  >
                    <FaTimes size={18} />
                  </motion.button>
                </div>

                {/* Avatar Section */}
                <div className="flex flex-col items-center mb-2">
                  <div className="relative group">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="relative cursor-pointer overflow-hidden rounded-[2rem] p-[2px] bg-gradient-to-b from-indigo-500 to-fuchsia-500"
                      onClick={() =>
                        document.getElementById("photoInput").click()
                      }
                    >
                      <img
                        src={previewPhoto || user?.profilePhoto || defaultPhoto}
                        alt="avatar"
                        className="w-24 h-24 rounded-[1.9rem] object-cover border-[4px] border-[#0b0b10]"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-indigo-600/40 opacity-0 group-hover:opacity-100 transition-all rounded-[1.9rem] backdrop-blur-[2px]">
                        <FaCamera size={20} className="text-white" />
                      </div>
                    </motion.div>
                    <input
                      id="photoInput"
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                  {/* Field Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {[
                      {
                        label: "Full Name",
                        name: "name",
                        placeholder: "Akshat Jain",
                        full: true,
                      },
                      {
                        label: "Phone Number",
                        name: "phoneNo",
                        placeholder: "+91...",
                      },
                      {
                        label: "Year of Study",
                        name: "YearOfStudy",
                        placeholder: "e.g. 3rd",
                      },
                      {
                        label: "College Name",
                        name: "CollegeName",
                        placeholder: "University Name",
                        full: true,
                      },
                      {
                        label: "Course",
                        name: "Course",
                        placeholder: "B.Tech",
                      },
                      {
                        label: "Branch",
                        name: "BranchName",
                        placeholder: "CSE",
                      },
                    ].map((f) => (
                      <div
                        key={f.name}
                        className={`${f.full ? "md:col-span-2" : "col-span-1"}`}
                      >
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">
                          {f.label}
                        </label>
                        <input
                          type="text"
                          name={f.name}
                          value={formData[f.name] || ""}
                          onChange={handleChange}
                          placeholder={f.placeholder}
                          className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-2 text-sm text-white placeholder-slate-700 focus:border-indigo-500/50 focus:bg-indigo-500/[0.02] focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all duration-300"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <motion.button
                    type="submit"
                    disabled={updateLoading}
                    whileHover={{ scale: 1.02, translateY: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative w-full py-4 mt-4 rounded-2xl font-bold text-sm text-white overflow-hidden group disabled:opacity-50"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 group-hover:from-indigo-500 group-hover:to-violet-500 transition-all" />
                    <div className="relative flex items-center justify-center gap-3">
                      {updateLoading ? (
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <FaCheck size={14} /> Update Identity
                        </>
                      )}
                    </div>
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global CSS for the scrollbar (Add to your global CSS or inside a <style> tag) */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.4);
        }
      `}</style>
    </div>
  );
}
