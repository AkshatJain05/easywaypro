import { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiX,
  FiMenu,
  FiArrowLeft,
  FiFileText,
  FiGrid,
  FiLayers,
  FiBookOpen,
  FiExternalLink,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

const API_URL = import.meta.env.VITE_API_URL;
const ITEMS_PER_PAGE = 8;

const MOCK_DATA = [
  {
    subject: "Mathematics",
    title: "Calculus – Limits & Continuity",
    link: "#",
  },
  { subject: "Physics", title: "Newton's Laws of Motion", link: "#" },
  { subject: "Chemistry", title: "Organic Reaction Mechanisms", link: "#" },
  { subject: "Computer Science", title: "Data Structures – Trees", link: "#" },
  { subject: "Biology", title: "DNA Replication", link: "#" },
  { subject: "Mathematics", title: "Linear Algebra", link: "#" },
  { subject: "Physics", title: "Thermodynamics", link: "#" },
  { subject: "Computer Science", title: "React Hooks Deep Dive", link: "#" },
  { subject: "History", title: "The Industrial Revolution", link: "#" },
];

// --- Sub-Components ---

const NoteCard = ({ note, index }) => (
  <motion.a
    href={note.link}
    target="_blank"
    rel="noopener noreferrer"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.2, delay: (index % ITEMS_PER_PAGE) * 0.05 }}
    whileHover={{ y: -5 }}
    className="group relative block p-4 rounded-xl bg-white/1 border border-cyan-950 hover:border-sky-500/50 hover:bg-gray-950 transition-all duration-300"
  >
    <div className="flex justify-between items-start mb-4">
      <span className="px-2 py-1 rounded-md bg-sky-500/10 text-[10px] font-bold text-sky-400 uppercase tracking-wider">
        {note.subject}
      </span>
      <FiFileText className="text-gray-600 group-hover:text-sky-400 transition-colors" />
    </div>
    <h3 className="text-md  text-gray-100 line-clamp-2 min-h-[40px] group-hover:text-white">
      {note.title}
    </h3>
    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-xs text-gray-500 font-medium">
      <span>Study Resource</span>
      <span className="flex items-center gap-1 text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity">
        View <FiExternalLink size={12} />
      </span>
    </div>
  </motion.a>
);

const Stat = ({ icon, label, value }) => (
  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/3  border border-blue-950 backdrop-blur-sm">
    <div className="p-2 rounded-lg bg-sky-500/10 text-slate-200">{icon}</div>
    <div>
      <p className="text-md font-semibold text-gray-100 leading-tight">{value}</p>
      <p className="text-[11px] text-gray-500 uppercase tracking-tighter">
        {label}
      </p>
    </div>
  </div>
);

const Sidebar = ({ subjects, active, setActive, closeMobile }) => (
  <div className="w-74 h-full   border-r border-white/10 p-6 flex flex-col">
    <div className="mb-8 px-2">
      <h2 className="text-xs font-bold uppercase text-gray-500 tracking-[0.2em] mb-4">
        Library
      </h2>
      <nav className="space-y-1">
        <button
          onClick={() => {
            setActive("All");
            closeMobile?.();
          }}
          className={`flex items-center font-blod justify-between w-full px-4 py-3 rounded-xl text-md transition-all ${
            active === "All"
              ? "bg-sky-600 text-white shadow-md shadow-sky-500/20"
              : "text-gray-400 hover:bg-white/5"
          }`}
        >
          <span className="flex items-center gap-3">
            <FiLayers /> All Notes
          </span>
        </button>
      </nav>
    </div>

    <div className="flex-1 overflow-y-auto px-2">
      <h2 className="text-xs font-bold uppercase text-gray-500 tracking-[0.2em] mb-4">
        Subjects
      </h2>
      <div className="space-y-1">
        {subjects.map((s) => (
          <button
            key={s.name}
            onClick={() => {
              setActive(s.name);
              closeMobile?.();
            }}
            className={`flex items-center justify-between font-bold w-full px-4 py-2.5 rounded-xl text-md transition-all ${
              active === s.name
                ? "bg-white/7 text-blue-500"
                : "text-gray-400 hover:bg-white/5"
            }`}
          >
            <span className="flex items-center gap-3 truncate">
              <FiBookOpen size={16} /> {s.name}
            </span>
            <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded-full">
              {s.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  </div>
);

// --- Main Component ---

export default function Notes() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [active, setActive] = useState("All");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL}/resources?type=notes`);
        setData(res.data);
      } catch {
        setData(MOCK_DATA);
      }
    };
    fetchData();
  }, []);

  // Optimized Grouping
  const subjects = useMemo(() => {
    const counts = data.reduce((acc, note) => {
      acc[note.subject] = (acc[note.subject] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [data]);

  // Optimized Filtering
  const filtered = useMemo(() => {
    let result =
      active === "All" ? data : data.filter((n) => n.subject === active);
    if (searchTerm) {
      result = result.filter((n) =>
        n.title.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
    return result;
  }, [data, active, searchTerm]);

  // Pagination Logic
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  // Reset page when filters change
  useEffect(() => setCurrentPage(1), [active, searchTerm]);

  const handleSidebarClose = useCallback(() => setSidebarOpen(false), []);

  return (
    <div className="flex min-h-screen bg-[#030009] text-gray-200 font-sans selection:bg-sky-500/30">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:block sticky top-0 h-screen">
        <Sidebar subjects={subjects} active={active} setActive={setActive} />
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleSidebarClose}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full z-50 lg:hidden"
            >
              <Sidebar
                subjects={subjects}
                active={active}
                setActive={setActive}
                closeMobile={handleSidebarClose}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col min-w-0 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              <FiArrowLeft size={18} />
            </button>
            <div>
              <div className="flex gap-2">
                <h1 className="text-2xl font-bold  tracking-tight text-blue-400 ">
                  Resource{" "}
                </h1>
                <span className="text-2xl font-bold  tracking-tight text-white ">
                  Library
                </span>
              </div>
              <p className="text-sm text-gray-500">
                Access and manage your study notes
              </p>
            </div>
          </div>

          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10"
          >
            <FiMenu />{" "}
            <span className="text-sm font-medium">Filter Subjects</span>
          </button>
        </header>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Stat
            icon={<FiGrid />}
            label="Total Subjects"
            value={subjects.length}
          />
          <Stat icon={<FiFileText />} label="Total Notes" value={data.length} />
          <Stat icon={<FiSearch />} label="Results" value={filtered.length} />
          <Stat
            icon={<FiLayers size={14} />}
            label="Current View"
            value={active}
          />
        </section>

        {/* Search Bar */}
        <div className="relative mb-8 group">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-200 group-focus-within:text-sky-400 transition-colors" />
          <input
            type="text"
            placeholder="Search by topic or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/4 border border-white/10 rounded-2xl pl-12 pr-12 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500/40 transition-all shadow-inner"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <FiX size={16} />
            </button>
          )}
        </div>

        {/* Notes Grid */}
        <div className="flex-1">
          {paginatedData.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
              <AnimatePresence mode="popLayout">
                {paginatedData.map((note, i) => (
                  <NoteCard key={note.title + i} note={note} index={i} />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-white/5 rounded-3xl">
              <FiSearch size={40} className="mb-4 opacity-20" />
              <p>No notes found matching your criteria.</p>
            </div>
          )}
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <footer className="mt-12 flex items-center justify-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="p-2 rounded-lg bg-white/5 border border-white/10 disabled:opacity-30 hover:bg-white/10 transition-colors"
            >
              <FiChevronLeft size={20} />
            </button>

            <div className="flex gap-2 mx-4">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                    currentPage === i + 1
                      ? "bg-sky-500 text-white shadow-lg shadow-sky-500/20"
                      : "bg-white/5 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="p-2 rounded-lg bg-white/5 border border-white/10 disabled:opacity-30 hover:bg-white/10 transition-colors"
            >
              <FiChevronRight size={20} />
            </button>
          </footer>
        )}
      </main>
    </div>
  );
}
