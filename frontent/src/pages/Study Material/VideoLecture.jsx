import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft, FiSearch, FiPlay, FiList,
  FiYoutube, FiExternalLink, FiChevronDown,
  FiVideo, FiLayers, FiChevronLeft, FiChevronRight,
  FiBookOpen
} from "react-icons/fi";
import Loading from "../../component/Loading";

// --- Helpers ---
const getYtVideoId = (url = "") => {
  const m = url.match(/(?:youtu\.be\/|watch\?v=|embed\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
};

const getYtPlaylistId = (url = "") => {
  const m = url.match(/[?&]list=([a-zA-Z0-9_-]+)/);
  return m ? m[1] : null;
};

const isPlaylist = (url = "") => !!getYtPlaylistId(url);

const ytThumbnail = (videoId) => {
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
};

// --- Subject Accent Colours ---
const SUBJECT_COLORS = {
  Mathematics: { pill: "bg-blue-500/5 text-blue-400 border-blue-500/10", dot: "bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.4)]" },
  Physics: { pill: "bg-purple-500/5 text-purple-400 border-purple-500/10", dot: "bg-purple-400" },
  Chemistry: { pill: "bg-pink-500/5 text-pink-400 border-pink-500/10", dot: "bg-pink-400" },
  "Computer Science": { pill: "bg-emerald-500/5 text-emerald-400 border-emerald-500/10", dot: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.4)]" },
};

const getSubjectStyles = (s) => SUBJECT_COLORS[s] || { pill: "bg-slate-500/5 text-slate-400 border-slate-500/10", dot: "bg-slate-400" };

const VideoCard = ({ video, index }) => {
  const [hovered, setHovered] = useState(false);
  const videoId = getYtVideoId(video.link);
  const isPl = isPlaylist(video.link);
  const thumb = ytThumbnail(videoId);
  const styles = getSubjectStyles(video.subject);

  return (
    <motion.a
      href={video.link}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: (index % 6) * 0.05 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group flex flex-col rounded-2xl overflow-hidden border border-white/[0.04] bg-[#0d0d12] transition-all duration-500 hover:border-blue-500/20 hover:shadow-[0_0_50px_rgba(37,99,235,0.06)]"
    >
      <div className="relative aspect-video bg-black overflow-hidden">
        {thumb ? (
          <img
            src={thumb}
            alt={video.title}
            className="w-full h-full object-cover opacity-80 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-t from-black to-[#131317]">
            {isPl ? <FiLayers size={26} className="text-white/5 mb-2" /> : <FiVideo size={26} className="text-white/5 mb-2" />}
          </div>
        )}

        <div className={`absolute inset-0 bg-black/40 transition-opacity duration-300 flex items-center justify-center ${hovered ? 'opacity-100' : 'opacity-0'}`}>
            <div className="w-11 h-11 rounded-full bg-red-600 flex items-center justify-center shadow-2xl shadow-blue-600/20 transform scale-90 group-hover:scale-100 transition-transform">
                <FiPlay size={18} className="text-white ml-0.5 fill-current" />
            </div>
        </div>

        <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-lg bg-black/80 backdrop-blur-md px-2 py-1 text-[8px] font-black uppercase tracking-widest text-white/90 border border-white/5">
          {isPl ? <FiList size={10} className="text-blue-500" /> : <FiVideo size={10} className="text-blue-500" />}
          {isPl ? "Collection" : "Single Lesson"}
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[8px] font-black uppercase tracking-[0.2em] mb-3 self-start ${styles.pill}`}>
          <span className={`w-1 h-1 rounded-full ${styles.dot}`} />
          {video.subject}
        </div>

        <h3 className="text-[12px] font-bold text-white/70 group-hover:text-white transition-colors leading-relaxed line-clamp-2">
          {video.title}
        </h3>

        <div className="mt-auto pt-4 flex items-center justify-between opacity-30 group-hover:opacity-100 transition-opacity">
          <span className="text-[9px] font-black uppercase tracking-widest">YouTube Archive</span>
          <FiExternalLink size={12} className="group-hover:text-blue-500 transition-colors" />
        </div>
      </div>
    </motion.a>
  );
};

export default function VideoLectures() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSubject, setActiveSubject] = useState("All");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios.get(`${API_URL}/resources?type=video`)
      .then((res) => setVideos(Array.isArray(res.data) ? res.data : []))
      .catch(() => setVideos([]))
      .finally(() => setLoading(false));
  }, [API_URL]);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, activeSubject, typeFilter, sortBy]);

  const filteredVideos = useMemo(() => {
    const cleanSearch = searchTerm.trim().toLowerCase();
    return videos
      .filter((v) => {
        const matchesSubject = activeSubject === "All" || v.subject === activeSubject;
        const isPl = isPlaylist(v.link);
        const matchesType = typeFilter === "all" || (typeFilter === "playlist" ? isPl : !isPl);
        const matchesSearch = !cleanSearch || v.title.toLowerCase().includes(cleanSearch);
        return matchesSubject && matchesType && matchesSearch;
      })
      .sort((a, b) => (sortBy === "az" ? a.title.localeCompare(b.title) : sortBy === "za" ? b.title.localeCompare(a.title) : 0));
  }, [videos, activeSubject, typeFilter, searchTerm, sortBy]);

  const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);
  const currentItems = filteredVideos.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const subjects = useMemo(() => {
    const counts = videos.reduce((acc, v) => { acc[v.subject] = (acc[v.subject] || 0) + 1; return acc; }, {});
    return Object.entries(counts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
  }, [videos]);

  if (loading) return (
   <Loading/>
  );

  return (
    <div className="min-h-screen bg-[#050508] text-white flex selection:bg-blue-500/30">
      {/* Background Red Light Garnish changed to Blue */}
      <div className="fixed top-[-10%] left-[30%] w-[500px] h-[400px] bg-blue-600/10 blur-[150px] pointer-events-none z-0" />
      
      {/* Sidebar - Changed accents from Red to Blue */}
      <aside className="hidden lg:flex w-60 border-r border-white/[0.03] flex-col p-6 sticky top-0 h-screen bg-[#07070a] z-10">
        <div className="flex items-center gap-2 mb-10 pl-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20">
            <FiYoutube size={14} />
          </div>
          <h2 className="font-black text-base tracking-tighter uppercase">EasyWay<span className="text-blue-600">Hub</span></h2>
        </div>

        <nav className="space-y-1.5 flex-1">
          <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] mb-4 pl-2">Browse</p>
          <button
            onClick={() => setActiveSubject("All")}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-[11px] font-bold ${activeSubject === "All" ? "bg-white/35 text-white" : "text-white/40 hover:text-white hover:bg-white/[0.01]"}`}
          >
            <FiLayers size={13} /> Overview
          </button>
          
          <div className="pt-6">
            <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] mb-4 pl-2">Categories</p>
            {subjects.map((s) => (
              <button
                key={s.name}
                onClick={() => setActiveSubject(s.name)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all group text-[11px] font-bold ${activeSubject === s.name ? "text-blue-500 bg-blue-500/5" : "text-white/50 hover:text-white hover:bg-white/[0.01]"}`}
              >
                <span className={`w-1 h-1 rounded-full ${getSubjectStyles(s.name).dot}`} />
                <span className="flex-1 text-left">{s.name}</span>
                <span className="text-[8px] opacity-20 font-mono group-hover:opacity-100">{s.count}</span>
              </button>
            ))}
          </div>
        </nav>
      </aside>

      <main className="flex-1 p-6 lg:p-12 max-w-7xl mx-auto w-full relative z-10">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 overflow-hidden relative p-1 rounded-3xl  border border-white/[0.02]">
           {/* Section Blur Accent */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-700/10 blur-[100px] pointer-events-none z-0" />
          
          <div className="space-y-3 z-10 relative">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/50 hover:text-white text-[9px] font-black uppercase tracking-widest transition-colors">
              <FiArrowLeft /> Back to portal
            </button>
            <h1 className="text-3xl font-black tracking-tighter text-white/90">Video <span className="text-blue-600">Lectures</span></h1>
            <p className="text-white/50 text-[10px] font-bold uppercase tracking-[0.2em]">System Status: {filteredVideos.length} Modules Online</p>
          </div>

          <div className="flex bg-white/[0.02] p-1 rounded-xl border border-white/[0.03] z-10 relative">
            {["all", "video", "playlist"].map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${typeFilter === t ? "bg-white/5 text-white shadow-xl" : "text-white/40 hover:text-white"}`}
              >
                {t}s
              </button>
            ))}
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-4 mb-10 relative z-10">
          <div className="flex-1 relative group">
            <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-blue-600 transition-colors" />
            <input
              type="text"
              placeholder="Query database..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0d0d12] border border-white/20 rounded-2xl py-4 pl-14 pr-6 text-[14px] text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/20 focus:ring-1 focus:ring-blue-500/10 transition-all"
            />
          </div>
          <div className="relative min-w-[180px]">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full appearance-none bg-[#0d0d12] border border-white/30 rounded-2xl py-4 px-6 text-[11px] font-bold text-white/40 focus:outline-none cursor-pointer hover:bg-white/[0.01]"
            >
              <option value="default" className="bg-black text-white">Sort: Default</option>
              <option value="az" className="bg-black text-white">Sort: A-Z Index</option>
              <option value="za" className="bg-black text-white">Sort: Z-A Index</option>
            </select>
            <FiChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-white/10" />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {currentItems.length > 0 ? (
            <motion.div
              key={currentPage + activeSubject}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 relative z-10"
            >
              {currentItems.map((v, i) => (
                <VideoCard key={v._id || i} video={v} index={i} />
              ))}
            </motion.div>
          ) : (
            <div className="py-32 text-center rounded-3xl border border-white/[0.02] bg-white/[0.01] relative z-10">
              <FiBookOpen size={30} className="mx-auto text-white/5 mb-3" />
              <p className="text-white/10 text-[9px] font-black uppercase tracking-widest">Null results found in directory</p>
            </div>
          )}
        </AnimatePresence>

        {totalPages > 1 && (
          <div className="mt-16 flex items-center justify-center gap-2 relative z-10">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/[0.02] border border-white/[0.03] disabled:opacity-10 hover:bg-white/[0.05]"
            >
              <FiChevronLeft size={14} className="text-white/40" />
            </button>
            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-9 h-9 rounded-xl text-[10px] font-black transition-all ${currentPage === i + 1 ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "bg-white/[0.02] text-white/20 hover:bg-white/[0.05] border border-white/[0.03]"}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/[0.02] border border-white/[0.03] disabled:opacity-10 hover:bg-white/[0.05]"
            >
              <FiChevronRight size={14} className="text-white/40" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}