import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  FiArrowLeft, FiSearch, FiX, FiMap, FiCheckCircle,
  FiClock, FiZap, FiChevronRight, FiTrendingUp, FiTarget,
} from "react-icons/fi";
import Loading from "../../component/Loading";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const clamp = (v, min = 0, max = 100) => Math.min(Math.max(v || 0, min), max);

const progressMeta = (pct) => {
  if (pct === 100) return { label: "Complete",   color: "text-emerald-400", bar: "bg-emerald-500",  ring: "border-emerald-500/20",  bg: "bg-emerald-500/8"  };
  if (pct >= 60)  return { label: "On track",    color: "text-sky-400",    bar: "bg-sky-500",      ring: "border-sky-500/50",      bg: "bg-sky-500/5"      };
  if (pct >= 20)  return { label: "In progress", color: "text-amber-400",  bar: "bg-amber-500",    ring: "border-amber-500/50",    bg: "bg-amber-500/5"    };
  return             { label: "Not started",  color: "text-slate-500",  bar: "bg-slate-600",    ring: "border-slate-600",    bg: "bg-white/[0.01]"   };
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ icon, label, value, accent, sub, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.28, delay }}
    className="bg-white/1 border border-cyan-900 rounded-2xl p-5 flex items-start gap-4 hover:border-white/[0.62] transition-all"
  >
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${accent}`}>
      {icon}
    </div>
    <div>
      <p className="text-2xl font-black text-white tracking-tight leading-none">{value}</p>
      <p className="text-[9px] font-bold uppercase tracking-widest text-white/35 mt-1">{label}</p>
      {sub && <p className="text-[10px] text-white/50 mt-1">{sub}</p>}
    </div>
  </motion.div>
);

// ─── Roadmap Card ─────────────────────────────────────────────────────────────
const RoadmapCard = ({ roadmap, index }) => {
  const progress = clamp(roadmap.overallProgress);
  const meta     = progressMeta(progress);
  const stepsTotal    = roadmap.steps?.length || 0;
  const stepsDone     = roadmap.steps?.filter(s => s.completed)?.length || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.22, delay: index * 0.055 }}
    >
      <Link
        to={`/roadmap/${roadmap._id}`}
        className={`group flex flex-col h-full bg-white/2   border ${meta.ring} rounded-2xl p-5 hover:bg-white/2 hover:border-cyan-400 transition-all duration-300`}
      >
        {/* Top row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0 group-hover:border-white/10 transition">
            <FiMap size={14} className="text-white/30" />
          </div>
          <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${meta.bg} ${meta.color} border ${meta.ring} mt-0.5`}>
            {meta.label}
          </span>
        </div>

        {/* Title & description */}
        <div className="flex-1 mb-5">
          <h2 className="text-sm font-black text-white group-hover:text-white leading-snug transition mb-2">
            {roadmap.title}
          </h2>
          <p className="text-[12px] text-gray-300 leading-relaxed line-clamp-2">
            {roadmap.description || "No description available."}
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="h-1.5 bg-white/[0.09] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.9, delay: index * 0.06 + 0.2, ease: "easeOut" }}
              className={`h-full rounded-full ${meta.bar}`}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
          <div className="flex items-center gap-3">
            <span className={`text-sm font-black ${meta.color}`}>{progress}%</span>
            {stepsTotal > 0 && (
              <span className="text-[10px] text-white/20 font-mono">{stepsDone}/{stepsTotal} steps</span>
            )}
          </div>
          <FiChevronRight size={13} className="text-white/15 group-hover:text-white/50 group-hover:translate-x-0.5 transition-all" />
        </div>
      </Link>
    </motion.div>
  );
};

// ─── Empty State ──────────────────────────────────────────────────────────────
const EmptyState = ({ hasSearch, onClear }) => (
  <motion.div
    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
    className="flex flex-col items-center justify-center py-24 gap-4"
  >
    <div className="w-14 h-14 rounded-3xl bg-white/1 border border-cyan-400 flex items-center justify-center">
      <FiMap size={22} className="text-white/15" />
    </div>
    <div className="text-center">
      <p className="text-sm font-bold text-white/25">
        {hasSearch ? "No roadmaps match your search" : "No roadmaps yet"}
      </p>
      <p className="text-[11px] text-white/1 mt-1">
        {hasSearch ? "Try a different keyword" : "Create your first learning path to get started"}
      </p>
    </div>
    {hasSearch && (
      <button
        onClick={onClear}
        className="text-[11px] font-bold text-sky-400 hover:text-sky-300 transition flex items-center gap-1.5"
      >
        <FiX size={10} /> Clear search
      </button>
    )}
  </motion.div>
);


// ─── Main Component ───────────────────────────────────────────────────────────
export default function RoadmapList() {
  const [roadmaps, setRoadmaps]     = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading]       = useState(true);

  const API_URL  = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_URL}/roadmap/user/all`, { withCredentials: true })
      .then(res => setRoadmaps(res.data?.roadmaps || []))
      .catch(err => {
        if (err.response?.status === 401) {
          toast.error("Please login first");
          navigate("/login");
        } else {
          toast.error("Failed to load roadmaps");
        }
      })
      .finally(() => setLoading(false));
  }, [API_URL, navigate]);

  // ── Derived stats ──
  const stats = useMemo(() => {
    const total     = roadmaps.length;
    const completed = roadmaps.filter(r => clamp(r.overallProgress) === 100).length;
    const inProg    = roadmaps.filter(r => { const p = clamp(r.overallProgress); return p > 0 && p < 100; }).length;
    const avgProg   = total
      ? Math.round(roadmaps.reduce((s, r) => s + clamp(r.overallProgress), 0) / total)
      : 0;
    return { total, completed, inProg, avgProg };
  }, [roadmaps]);

  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return roadmaps;
    return roadmaps.filter(
      r => r.title?.toLowerCase().includes(q) || r.description?.toLowerCase().includes(q)
    );
  }, [roadmaps, searchTerm]);

  if (loading) return <Loading/>;

  return (
    <div className="min-h-screen  text-white font-sans px-4 sm:px-8 py-8 selection:bg-sky-500/25">
      <div className="max-w-7xl mx-auto">

        {/* ── Page header ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.07] hover:border-white/[0.14] transition"
          >
            <FiArrowLeft size={15} />
          </button>

          <div className="text-right">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/50">Learning paths</p>
            <h1 className="text-xl font-black tracking-tight leading-none mt-0.5">
              Roadmap <span className="text-sky-400">Dashboard</span>
            </h1>
          </div>
        </motion.div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          <StatCard
            icon={<FiMap size={16} />}
            label="Total roadmaps" value={stats.total}
            sub="All learning paths"
            accent="bg-sky-500/15 text-sky-400"
            delay={0}
          />
          <StatCard
            icon={<FiCheckCircle size={16} />}
            label="Completed" value={stats.completed}
            sub="100% progress"
            accent="bg-emerald-500/15 text-emerald-400"
            delay={0.07}
          />
          <StatCard
            icon={<FiClock size={16} />}
            label="In progress" value={stats.inProg}
            sub="Actively working"
            accent="bg-amber-500/15 text-amber-400"
            delay={0.14}
          />
          <StatCard
            icon={<FiTrendingUp size={16} />}
            label="Avg. progress" value={`${stats.avgProg}%`}
            sub="Across all paths"
            accent="bg-violet-500/15 text-violet-400"
            delay={0.21}
          />
        </div>

        {/* ── Search ── */}
        <div className="relative mb-6 max-w-md group">
          <FiSearch
            size={13}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-sky-400 transition-colors pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search roadmaps…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-[#111119] border border-slate-700 focus:border-sky-500/40 rounded-2xl pl-10 pr-10 py-3 text-sm text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-sky-500/10 transition-all"
          />
          <AnimatePresence>
            {searchTerm && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-lg bg-white/[0.06] hover:bg-white/10 transition"
              >
                <FiX size={11} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Result count */}
        {searchTerm && (
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-4"
          >
            {filtered.length} result{filtered.length !== 1 ? "s" : ""} for "{searchTerm}"
          </motion.p>
        )}

        {/* ── Grid ── */}
        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {filtered.map((r, i) => (
                <RoadmapCard key={r._id || i} roadmap={r} index={i} />
              ))}
            </motion.div>
          ) : (
            <EmptyState
              hasSearch={!!searchTerm}
              onClear={() => setSearchTerm("")}
            />
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}