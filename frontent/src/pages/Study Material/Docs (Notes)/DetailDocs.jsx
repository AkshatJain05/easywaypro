import { useEffect, useState, useMemo, useCallback } from "react";
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
} from "react-icons/md";
import Loading from "../../../component/Loading";

const API_URL = import.meta.env.VITE_API_URL;
const CODE_STYLE = oneDark;
const ITEMS_PER_PAGE = 5;

// Scroll Spy Hook
const useScrollSpy = (itemIds, offset = 100) => {
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      let current = null;
      itemIds.forEach((id) => {
        const element = document.getElementById(id);
        if (element && element.offsetTop <= window.scrollY + offset) {
          current = id;
        }
      });
      setActiveId(current);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [itemIds, offset]);

  return activeId;
};

export default function DocDetail() {
  const { id } = useParams();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [questionGlobalIds, setQuestionGlobalIds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_URL}/docs/${id}`)
      .then((res) => {
        setDoc(res.data);
        setLoading(false);
        setQuestionGlobalIds(
          res.data.questions.map((_, index) => `question-${index}`)
        );
      })
      .catch((err) => {
        console.error("Error fetching doc:", err);
        setLoading(false);
      });
  }, [id]);

  const activeQuestionId = useScrollSpy(questionGlobalIds, 120);

  const getQuestionGlobalIndex = useCallback(
    (questionTitle) => {
      return doc?.questions?.findIndex((q) => q.title === questionTitle);
    },
    [doc]
  );

  const sidebarQuestions = useMemo(() => {
    if (!doc?.questions) return [];
    if (!search) return doc.questions;
    return doc.questions.filter((q) =>
      q.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [doc, search]);

  const filteredQuestionsForPagination = useMemo(() => {
    setCurrentPage(1);
    if (!doc?.questions) return [];
    if (!search) return doc.questions;
    return doc.questions.filter((q) =>
      q.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [doc, search]);

  const totalPages = Math.ceil(
    filteredQuestionsForPagination.length / ITEMS_PER_PAGE
  );
  const paginatedQuestions = filteredQuestionsForPagination.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleCopy = async (code, index) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const handleSidebarClick = (globalIndex) => {
    const element = document.getElementById(`question-${globalIndex}`);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: "smooth" });
      setSidebarOpen(false);
      const pageIndex = Math.floor(globalIndex / ITEMS_PER_PAGE) + 1;
      setCurrentPage(pageIndex);
    }
  };

  if (loading) return <Loading />;
  if (!doc)
    return (
      <div className="min-h-screen bg-[#010005] flex justify-center items-center text-xl text-red-400">
        ❌ Document not found.
      </div>
    );

  return (
    <div className="flex min-h-screen bg-black text-gray-200">
      {/* Sidebar Toggle (Mobile) */}
      <button
        className="fixed top-2 left-4 z-130 md:hidden p-1 bg-sky-900 rounded-full shadow-xl hover:bg-sky-700 transition mt-14"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? (
          <MdClose className="h-4 w-4 text-white" />
        ) : (
          <MdMenu className="h-5 w-5 text-white" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-20 w-70 bg-gradient-to-br from-gray-950 to-black border-r border-gray-700 p-4 transition-transform duration-300 ease-in-out 
          md:sticky md:h-screen md:translate-x-0 md:overflow-y-auto ${
            sidebarOpen ? "translate-x-0 mt-14" : "-translate-x-full"
          }`}
      >
        <h2 className="text-sky-400 text-xl font-extrabold mb-3 pt-6 md:pt-0 border-b border-gray-700 pb-2">
          {doc.subject}
        </h2>

        {/* Search */}
        <div className="relative mb-4">
          <input
            type="search"
            placeholder="Search topics..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-gray-400 text-sm focus:ring-2 focus:ring-sky-500 outline-none transition"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
        </div>

        {/* Sidebar List */}
        <nav className="space-y-1 pb-10">
          {sidebarQuestions.map((q, i) => {
            const globalIndex = getQuestionGlobalIndex(q.title);
            const questionId = `question-${globalIndex}`;
            const isActive = activeQuestionId === questionId;
            const pageIndex = Math.floor(i / ITEMS_PER_PAGE) + 1;
            const nextPage = pageIndex + 1;

            return (
              <div key={globalIndex}>
                <button
                  onClick={() => handleSidebarClick(globalIndex)}
                  className={`w-full text-left text-sm truncate px-3 py-1.5 rounded transition duration-150 border border-transparent ${
                    isActive
                      ? "bg-sky-600/20 text-sky-300 border-sky-600 font-semibold"
                      : "text-gray-300 hover:text-sky-400 hover:bg-[#333333]"
                  }`}
                >
                  <span className="mr-1 opacity-70">💠</span> {q.title}
                </button>

                {/* Divider after every 5 questions */}
                {(i + 1) % ITEMS_PER_PAGE === 0 &&
                  i !== sidebarQuestions.length - 1 && (
                    <div className="border-t-2 border-gray-600 my-5 relative">
                      <button
                        onClick={() => setCurrentPage(nextPage)}
                        className="absolute right-0 -top-3 text-xs text-cyan-400 hover:text-sky-300 transition bg-[#1f1f1f] px-2 rounded-md p-0.5"
                      >
                        Go to Page {nextPage} →
                      </button>
                    </div>
                  )}
              </div>
            );
          })}
          {sidebarQuestions.length === 0 && (
            <p className="text-xs text-gray-500 text-center pt-4">
              No topics found.
            </p>
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <header className="mb-8 border-b border-gray-700 pb-4 pt-6 md:pt-0">
            <Link
              to="/docs"
              className="text-sky-400 hover:text-sky-300 text-sm mb-2 inline-flex items-center gap-1 transition font-medium"
            >
              <MdArrowBack className="h-4 w-4" /> Back to Documentation
            </Link>
            <h1 className="text-2xl font-bold text-white mt-1">
              {doc.subject}
            </h1>
            <p className="text-gray-400 mt-2 text-md italic text-justify">
              {doc.description}
            </p>
          </header>

          {/* Q&A */}
          {paginatedQuestions.map((q) => {
            const globalIndex = getQuestionGlobalIndex(q.title);
            const questionId = `question-${globalIndex}`;
            const isActive = activeQuestionId === questionId;

            return (
              <article
                id={questionId}
                key={globalIndex}
                className={`mb-3 p-6 border rounded-xl bg-gradient-to-br from-gray-950 to-black shadow-2xl transition duration-300 ${
                  isActive
                    ? "border-sky-500/80 shadow-sky-900/40"
                    : "border-[#3a3a3a] hover:border-sky-500/50"
                }`}
              >
                <h3 className="text-md md:text-lg lg:text-xl font-bold text-yellow-400 mb-2">
                  {q.title}
                </h3>
                <p className="text-base text-gray-100 border p-2 rounded-xl border-gray-900 pb-3 italic mb-3 text-justify">
                  <span className="text-yellow-400 pr-1">Q.</span> {q.Q}
                </p>

                <div className="space-y-3">
                  {q.ans.map((a, j) => {
                    const codeIndex = `${globalIndex}-${j}`;
                    if (a.type === "code") {
                      return (
                        <div
                          key={j}
                          className="relative group rounded-lg overflow-hidden border border-[#444] shadow-xl"
                        >
                          <div className="flex items-center justify-between bg-[#020107] px-3 py-2 border-b border-[#444]">
                            <div className="flex space-x-1.5">
                              <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                              <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                            </div>
                            <button
                              onClick={() => handleCopy(a.content, codeIndex)}
                              className="text-xs text-gray-400 hover:text-sky-400 transition flex items-center gap-1 font-mono"
                            >
                              {copiedIndex === codeIndex ? (
                                <>
                                  <MdCheck className="text-green-400" /> Copied
                                </>
                              ) : (
                                <>
                                  <MdContentCopy /> Copy Code
                                </>
                              )}
                            </button>
                          </div>
                          <SyntaxHighlighter
                            language={a.language || "javascript"}
                            style={CODE_STYLE}
                            customStyle={{
                              background: "#000000",
                              padding: "1.2rem",
                              fontSize: "0.85rem",
                              margin: 0,
                            }}
                          >
                            {a.content}
                          </SyntaxHighlighter>
                        </div>
                      );
                    } else if (Array.isArray(a.content)) {
                      return (
                        <ul
                          key={j}
                          className="list-disc pl-8 text-sm text-gray-200 space-y-2 bg-black p-4 rounded-lg border border-gray-800"
                        >
                          {a.content.map((p, idx) => (
                            <li
                              key={idx}
                              className="marker:text-sky-400 text-justify italic"
                            >
                              {p}
                            </li>
                          ))}
                        </ul>
                      );
                    } else {
                      return (
                        <p
                          key={j}
                          className="text-sm text-gray-200 bg-black border border-gray-800 p-4 rounded-lg text-justify italic"
                        >
                          <span className="text-yellow-400 md:pr-1">Ans. </span>{" "}
                          {a.content}
                        </p>
                      );
                    }
                  })}
                </div>
              </article>
            );
          })}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col items-center mt-10 space-y-4">
              <div className="flex items-center space-x-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="px-4 py-2 bg-black border border-gray-600 rounded-lg text-sm hover:bg-sky-600 hover:border-sky-600 disabled:opacity-50 transition"
                >
                  ← Previous
                </button>
                <span className="text-sm text-gray-400 px-3">
                  Page <strong className="text-white">{currentPage}</strong> of{" "}
                  <strong className="text-white">{totalPages}</strong>
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="px-4 py-2 bg-black border border-gray-600 rounded-lg text-sm hover:bg-sky-600 hover:border-sky-600 disabled:opacity-50 transition"
                >
                  Next →
                </button>
              </div>

              {/* Direct Page Input */}
              <div className="flex items-center space-x-2">
                <span className="text-gray-400 text-sm">Go to Page:</span>
                <input
                  type="number"
                  min="1"
                  max={totalPages}
                  value={currentPage}
                  onChange={(e) => {
                    const pageNum = Number(e.target.value);
                    if (pageNum >= 1 && pageNum <= totalPages)
                      setCurrentPage(pageNum);
                  }}
                  className="w-16 px-2 py-1 text-center rounded bg-black border border-gray-700 text-white text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>
            </div>
          )}
        </div>
      </main>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-10 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}
