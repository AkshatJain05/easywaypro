import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  MdMenu,
  MdClose,
  MdArrowBack,
  MdSearch,
  MdContentCopy,
  MdCheck,
  MdChevronLeft,
  MdChevronRight,
} from "react-icons/md";
import Loading from "../../../component/Loading";

const API_URL = import.meta.env.VITE_API_URL;
const CODE_STYLE = oneDark;
const ITEMS_PER_PAGE = 5;
const HEADER_OFFSET = 80;

// ---------------------- Scroll Spy Hook ----------------------
const useScrollSpy = (itemIds, offset = 100) => {
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      let current = null;
      for (let i = itemIds.length - 1; i >= 0; i--) {
        const id = itemIds[i];
        const element = document.getElementById(id);
        if (!element) continue;
        const rectTop = element.getBoundingClientRect().top;
        if (rectTop <= offset) {
          current = id;
          break;
        }
      }
      setActiveId(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [itemIds, offset]);

  return activeId;
};

// ---------------------- Badge Component ----------------------
const TagBadge = ({ label }) => (
  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20 tracking-wide">
    {label}
  </span>
);

// ---------------------- MAIN COMPONENT ----------------------
export default function DocDetail() {
  const { id } = useParams();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [questionGlobalIds, setQuestionGlobalIds] = useState([]);
  const mainRef = useRef(null);

  // ------------------- Fetch Document -------------------
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_URL}/docs/${id}`)
      .then((res) => {
        setDoc(res.data ?? null);
        const qIds = (res.data?.questions || []).map((_, i) => `question-${i}`);
        setQuestionGlobalIds(qIds);
        setSearch("");
        setCurrentPage(1);
      })
      .catch((err) => {
        console.error("Error fetching doc:", err);
        setDoc(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const activeQuestionId = useScrollSpy(questionGlobalIds, HEADER_OFFSET);

  const sidebarQuestions = useMemo(() => {
    if (!doc?.questions) return [];
    return doc.questions
      .map((q, idx) => ({ ...q, __idx: idx }))
      .filter((q) =>
        !search.trim()
          ? true
          : (q.title || "").toLowerCase().includes(search.toLowerCase())
      );
  }, [doc, search]);

  const filteredPaginated = useMemo(() => {
    if (!doc?.questions) return [];
    return doc.questions
      .map((q, idx) => ({ ...q, __idx: idx }))
      .filter((q) =>
        !search.trim()
          ? true
          : (q.title || "").toLowerCase().includes(search.toLowerCase())
      );
  }, [doc, search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(filteredPaginated.length / ITEMS_PER_PAGE));
  const paginatedQuestions = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPaginated.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPaginated, currentPage]);

  const handleCopy = async (code, index) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1400);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const handleSidebarClick = (globalIndex) => {
    if (typeof globalIndex !== "number" || globalIndex < 0) return;
    const targetPage = Math.floor(globalIndex / ITEMS_PER_PAGE) + 1;
    setCurrentPage(targetPage);
    setSidebarOpen(false);
    requestAnimationFrame(() => {
      setTimeout(() => {
        const el = document.getElementById(`question-${globalIndex}`);
        if (el) {
          const y = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 40);
    });
  };

  useEffect(() => {
  window.scrollTo({ top: 0, behavior: "smooth" });
}, [currentPage]);

  // Close sidebar on outside click
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  if (loading) return <Loading />;

  if (!doc)
    return (
      <div className="min-h-screen bg-[#030009] flex flex-col justify-center items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-3xl">
          ⚠️
        </div>
        <p className="text-xl font-semibold text-red-400">Document not found</p>
        <Link to="/docs" className="text-sky-400 hover:underline text-sm flex items-center gap-1">
          <MdArrowBack /> Back to Docs
        </Link>
      </div>
    );

  const questionCount = doc.questions?.length ?? 0;

  return (
    <>
      {/* Global styles injected */}
      <style>{`
        // @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&family=Inter:wght@400;500;600&display=swap');

        .doc-root * { box-sizing: border-box; }
        .doc-root { font-family: 'Inter', sans-serif; }

        /* Custom scrollbar */
        .sidebar-scroll::-webkit-scrollbar { width: 4px; }
        .sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
        .sidebar-scroll::-webkit-scrollbar-thumb { background: #1e3a5f; border-radius: 2px; }
        .sidebar-scroll::-webkit-scrollbar-thumb:hover { background: #2563eb; }

        /* Animated active indicator */
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.8); }
        }
        .active-dot { animation: pulse-dot 2s ease-in-out infinite; }

        /* Card hover glow */
        .qa-card { transition: box-shadow 0.3s ease, border-color 0.3s ease, transform 0.2s ease; }
        .qa-card:hover { transform: translateY(-1px); }
        .qa-card.active { box-shadow: 0 0 0 1px #0ea5e9, 0 8px 30px -4px rgba(14,165,233,0.15); }

        /* Sidebar nav item */
        .nav-btn { transition: all 0.15s ease; }
        .nav-btn:hover { background: rgba(14,165,233,0.08); }
        .nav-btn.active-nav { background: rgba(14,165,233,0.12); }

        /* Overlay fade */
        .overlay-fade { animation: fadeIn 0.2s ease; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        /* Stagger animation for cards */
        .qa-card { animation: slideUp 0.3s ease both; }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .qa-card:nth-child(1) { animation-delay: 0.04s; }
        .qa-card:nth-child(2) { animation-delay: 0.08s; }
        .qa-card:nth-child(3) { animation-delay: 0.12s; }
        .qa-card:nth-child(4) { animation-delay: 0.16s; }
        .qa-card:nth-child(5) { animation-delay: 0.20s; }

        /* Code block font */
        .code-block code, .code-block pre { font-family: 'DM Mono', monospace !important; }

        /* Heading font */
        .syne { font-family: 'Syne', sans-serif; }

        /* Gradient text */
        .gradient-text {
          background: linear-gradient(135deg, #38bdf8 0%, #818cf8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Sidebar backdrop blur */
        .sidebar-panel {
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }

        /* Page input */
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
      `}</style>

      <div className="doc-root flex min-h-screen  text-gray-200">

        {/* ---- Mobile Header Bar ---- */}
        <div className="fixed  top-[-8px] left-0 right-0 z-40 md:hidden flex items-center gap-3 px-4 py-3 bg-[#030009]/90 border-b border-white/5 backdrop-blur-sm" style={{ marginTop: "56px" }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-8 h-5 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 hover:bg-sky-500/20 transition"
          >
            {sidebarOpen ? <MdClose size={18} /> : <MdMenu size={18} />}
          </button>
          <span className="text-sm font-semibold text-white syne truncate">{doc.subject}</span>
        </div>

        {/* ---- Sidebar ---- */}
        <aside
          className={`
            sidebar-panel fixed md:sticky top-0 left-0 z-30
            w-[280px] lg:w-[320px] h-screen
            bg-gradient-to-br from-gray-950 to-black border-r border-white/[0.06]
            flex flex-col
            transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            md:translate-x-0
          `}
        >
          {/* Sidebar Header */}
          <div className="flex-none px-5 pt-6 pb-4 border-b border-white/[0.06]">
            {/* Top row: back + close */}
            <div className="flex items-center justify-between mb-4">
              <Link
                to="/docs"
                className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-sky-400 transition-colors group"
              >
                <MdArrowBack className="group-hover:-translate-x-0.5 transition-transform" />
                All Docs
              </Link>
              <button
                className="md:hidden w-7 h-7 rounded-md bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition"
                onClick={closeSidebar}
              >
                <MdClose size={16} />
              </button>
            </div>

            {/* Subject */}
            <h2 className="syne text-base font-bold text-white leading-snug mb-1 line-clamp-2">
              {doc.subject}
            </h2>
            <p className="text-xs text-gray-500">{questionCount} topic{questionCount !== 1 ? "s" : ""}</p>

            {/* Search */}
            <div className="relative mt-4">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={15} />
              <input
                type="search"
                placeholder="Search topics…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs rounded-lg bg-white/[0.04] border border-white/[0.08] text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-sky-500/50 focus:border-sky-500/40 transition"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-300"
                >
                  <MdClose size={13} />
                </button>
              )}
            </div>
          </div>

          {/* Sidebar Nav */}
          <nav className="flex-1 overflow-y-auto sidebar-scroll px-3 py-3 space-y-0.5">
            {sidebarQuestions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <span className="text-3xl opacity-30">🔍</span>
                <p className="text-xs text-gray-600">No topics found</p>
              </div>
            ) : (
              sidebarQuestions.map((q) => {
                const gIdx = q.__idx;
                const qId = `question-${gIdx}`;
                const isActive = activeQuestionId === qId;
                return (
                  <button
                    key={gIdx}
                    onClick={() => handleSidebarClick(gIdx)}
                    className={`nav-btn w-full text-left flex items-start gap-2.5 px-3 py-2 rounded-lg ${isActive ? "active-nav" : ""}`}
                  >
                    {/* Active indicator */}
                    <span className={`mt-1.5 flex-none w-1.5 h-1.5 rounded-full ${isActive ? "bg-sky-400 active-dot" : "bg-white/10"}`} />
                    <span className={`text-sm leading-tight line-clamp-2  border-gray-900 ${isActive ? "text-sky-300 font-bold" : "text-gray-100 hover:text-gray-200"}`}>
                      {q.title}
                    </span>
                  </button>
                );
              })
            )}
          </nav>

          {/* Sidebar Footer */}
          <div className="flex-none px-5 py-3 border-t border-white/[0.05]">
            <p className="text-[10px] text-gray-700 text-center">
              Page {currentPage} of {totalPages}
            </p>
          </div>
        </aside>

        {/* ---- Overlay (mobile) ---- */}
        {sidebarOpen && (
          <div
            className="overlay-fade fixed inset-0 z-20 bg-black/60 md:hidden"
            onClick={closeSidebar}
          />
        )}

        {/* ---- Main Content ---- */}
        <main ref={mainRef} className="flex-1 min-w-0 px-4 sm:px-8 lg:px-12 py-8 pt-20 md:pt-8 bg-black">
          <div className="max-w-6xl mx-auto">

            {/* ---- Page Header ---- */}
            <header className="mb-10">
              <Link
                to="/docs"
                className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-sky-400 transition mb-5 group"
              >
                <MdArrowBack className="group-hover:-translate-x-0.5 transition-transform" />
                Back to Documentation
              </Link>

              {/* Title area */}
              <div className="relative pl-4 border-l-2 border-sky-500/40">
                <p className="text-xs uppercase tracking-widest text-sky-500/70 font-semibold mb-1.5">
                  Documentation
                </p>
                <h1 className="syne text-xl sm:text-2xl font-extrabold text-white leading-tight text-justify">
                  {doc.subject}
                </h1>
              </div>

              {doc.description && (
                <p className="mt-4 mx-4 text-sm text-gray-400 leading-relaxed max-w-7xl text-justify">
                  {doc.description}
                </p>
              )}

              {/* Stats row */}
              <div className="flex flex-wrap gap-2 mt-5">
                <TagBadge label={`${questionCount} Topics`} />
                {doc.tags?.map((t, i) => <TagBadge key={i} label={t} />)}
              </div>
            </header>

            {/* ---- No results ---- */}
            {paginatedQuestions.length === 0 && (
              <div className="flex flex-col items-center py-20 gap-3 text-center">
                <span className="text-5xl opacity-20">🔎</span>
                <p className="text-gray-500 text-sm">No questions match your search.</p>
                <button onClick={() => setSearch("")} className="text-sky-400 text-xs hover:underline">Clear search</button>
              </div>
            )}

            {/* ---- Q&A Cards ---- */}
            <div className="space-y-4">
              {paginatedQuestions.map((q, cardIdx) => {
                const gIdx = q.__idx;
                const qId = `question-${gIdx}`;
                const isActive = activeQuestionId === qId;

                return (
                  <article
                    id={qId}
                    key={gIdx}
                    className={`qa-card rounded-2xl border-1 overflow-hidden ${
                      isActive
                        ? "active border-sky-400 bg-black"
                        : "border-slate-600 bg-black hover:border-white/[0.14]"
                    }`}
                    style={{ animationDelay: `${cardIdx * 0.05}s` }}
                  >
                    {/* Card Header */}
                    <div className="px-1 pt-5 pb-2 border-b border-white/[0.05]">
                      {/* Question number pill */}
                      <div className="flex items-start gap-2 px-5">
                        <span className="flex-none mt-0.5 w-6 h-6 rounded-md bg-gradient-to-br from-gray-800 to-black border border-sky-500/20 flex items-center justify-center text-sky-400 text-xs font-bold syne">
                          {gIdx + 1}
                        </span>
                        <div className="min-w-0">
                          <h3 className="syne text-sm sm:text-base font-bold bg-gray-950 md:bg-transparent  text-white  mb-3 border border-gray-900 p-2 rounded-xl">
                            {q.title}
                          </h3>
                          <p className="text-sm sm:text-md md:text-lg text-gray-300 leading-relaxed right-6 relative">
                            <span className="text-amber-400/80 font-semibold mr-1.5 syne tracking-tight">Q.</span>
                            {q.Q}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Answer blocks */}
                    <div className="px-5 py-2 md:py-1 space-y-2">
                      {q.ans.map((a, j) => {
                        const codeIndex = `${gIdx}-${j}`;

                        // --- Code block ---
                        if (a.type === "code") {
                          return (
                            <div key={j} className="code-block rounded-xl overflow-hidden border border-white/[0.08]">
                              {/* Code header */}
                              <div className="flex items-center justify-between  px-4 py-2.5 border-b border-white/[0.06]">
                                <div className="flex items-center gap-2">
                                  <div className="flex gap-1.5">
                                    <span className="w-2.5 h-2.5 bg-red-500/70 rounded-full" />
                                    <span className="w-2.5 h-2.5 bg-yellow-500/70 rounded-full" />
                                    <span className="w-2.5 h-2.5 bg-green-500/70 rounded-full" />
                                  </div>
                                  <span className="text-[10px] text-gray-600 uppercase tracking-widest ml-1">
                                    {a.language || "js"}
                                  </span>
                                </div>
                                <button
                                  onClick={() => handleCopy(a.content, codeIndex)}
                                  className={`flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-md transition font-medium ${
                                    copiedIndex === codeIndex
                                      ? "bg-green-500/15 text-green-400 border border-green-500/25"
                                      : "bg-white/[0.04] text-gray-400 hover:text-sky-300 border border-white/[0.06] hover:border-sky-500/25"
                                  }`}
                                >
                                  {copiedIndex === codeIndex ? (
                                    <><MdCheck size={12} /> Copied!</>
                                  ) : (
                                    <><MdContentCopy size={12} /> Copy</>
                                  )}
                                </button>
                              </div>
                              <SyntaxHighlighter
                                language={a.language.toLowerCase() || "javascript"}
                                style={CODE_STYLE}
                                customStyle={{
                                  background: "black",
                                  padding: "1rem 1.25rem",
                                  fontSize: "0.8rem",
                                  margin: 0,
                                  lineHeight: "1.65",
                                }}
                                showLineNumbers
                                lineNumberStyle={{ color: "#2a2a4a", fontSize: "0.7rem", userSelect: "none" }}
                              >
                                {a.content}
                              </SyntaxHighlighter>
                            </div>
                          );
                        }

                        // --- Bullet list ---
                        if (Array.isArray(a.content)) {
                          return (
                            <ul key={j} className="space-y-2 bg-gradient-to-br from-slate-950 to-black border border-white/[0.06] rounded-xl p-4">
                              {a.content.map((point, idx) => (
                                <li key={idx} className="flex items-start gap-2.5 text-sm text-justify sm:text-md text-gray-300">
                                  <span className="flex-none mt-1 w-1.5 h-1.5 rounded-full bg-sky-500/60 text-justify syne tracking-tight" />
                                  {point}
                                </li>
                              ))}
                            </ul>
                          );
                        }

                        // --- Text block ---
                        return (
                          <div key={j} className="bg-gradient-to-br from-slate-950 to-black border border-white/[0.05] rounded-xl p-4">
                            <p className="text-sm sm:text-md text-gray-300 text-justify leading-relaxed">
                              <span className="text-amber-400/80 font-semibold text-justify mr-1.5 syne tracking-tight">Ans.</span>
                              {a.content}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </article>
                );
              })}
            </div>

            {/* ---- Pagination ---- */}
            {totalPages > 1 && (
              <div className="mt-10 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 px-1">
                {/* Prev / Next */}
                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-white/[0.08] bg-white/[0.02] text-gray-300 hover:border-sky-500/40 hover:text-sky-300 disabled:opacity-30 disabled:cursor-not-allowed transition"
                  >
                    <MdChevronLeft size={16} /> Prev
                  </button>

                  {/* Page pills */}
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-8 h-8 rounded-lg text-xs font-bold transition ${
                            currentPage === page
                              ? "bg-sky-500 text-white shadow-lg shadow-sky-500/20"
                              : "bg-white/[0.03] border border-white/[0.07] text-gray-500 hover:text-white hover:border-white/20"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                    {totalPages > 5 && (
                      <span className="w-8 h-8 flex items-center justify-center text-gray-600 text-xs">…</span>
                    )}
                  </div>

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-white/[0.08] bg-white/[0.02] text-gray-300 hover:border-sky-500/40 hover:text-sky-300 disabled:opacity-30 disabled:cursor-not-allowed transition"
                  >
                    Next <MdChevronRight size={16} />
                  </button>
                </div>

                {/* Go to page */}
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>Go to</span>
                  <input
                    type="number"
                    min="1"
                    max={totalPages}
                    value={currentPage}
                    onChange={(e) => {
                      const num = Number(e.target.value);
                      if (Number.isInteger(num) && num >= 1 && num <= totalPages) setCurrentPage(num);
                    }}
                    className="w-12 text-center px-2 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-xs focus:outline-none focus:ring-1 focus:ring-sky-500/50"
                  />
                  <span>of {totalPages}</span>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}