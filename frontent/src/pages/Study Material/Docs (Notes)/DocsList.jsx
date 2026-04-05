import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { MdSearch, MdClose, MdArrowForward } from "react-icons/md";

const API_URL = import.meta.env.VITE_API_URL;

export default function DocsList() {
  const [docs, setDocs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_URL}/docs`)
      .then((res) => {
        setDocs(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching docs:", err);
        setLoading(false);
      });
  }, []);

  const filteredDocs = useMemo(
    () =>
      docs.filter((doc) =>
        doc.subject.toLowerCase().includes(search.toLowerCase())
      ),
    [docs, search]
  );

  return (
    <>
      <style>{`
        // @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap');

        .docs-root { font-family: 'Inter', sans-serif; }
        .syne { font-family: 'Syne', sans-serif; }

        /* Card stagger */
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .doc-card { animation: cardIn 0.35s ease both; }
        .doc-card:nth-child(1)  { animation-delay: 0.03s; }
        .doc-card:nth-child(2)  { animation-delay: 0.07s; }
        .doc-card:nth-child(3)  { animation-delay: 0.11s; }
        .doc-card:nth-child(4)  { animation-delay: 0.15s; }
        .doc-card:nth-child(5)  { animation-delay: 0.19s; }
        .doc-card:nth-child(6)  { animation-delay: 0.23s; }
        .doc-card:nth-child(n+7){ animation-delay: 0.27s; }

        /* Glow line */
        .glow-line {
          position: absolute;
          top: 0; left: 0;
          height: 2px; width: 0;
          background: linear-gradient(90deg, #0ea5e9, #6366f1);
          border-radius: 2px 2px 0 0;
          transition: width 0.35s ease;
        }
        .doc-card:hover .glow-line { width: 100%; }

        /* Arrow icon slide */
        .arrow-icon { transition: transform 0.2s ease, opacity 0.2s ease; opacity: 0; }
        .doc-card:hover .arrow-icon { transform: translateX(3px); opacity: 1; }

        /* Skeleton shimmer */
        @keyframes shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        .skeleton {
          background: linear-gradient(90deg, #0f0f1a 25%, #181828 50%, #0f0f1a 75%);
          background-size: 800px 100%;
          animation: shimmer 1.4s infinite linear;
          border-radius: 6px;
        }

        /* Header fade-in */
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .header-anim { animation: fadeDown 0.4s ease both; }

        /* Count badge */
        .count-badge {
          display: inline-flex;
          align-items: center;
          padding: 2px 10px;
          border-radius: 999px;
          background: rgba(14,165,233,0.08);
          border: 1px solid rgba(14,165,233,0.18);
          color: #7dd3fc;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.04em;
        }

        /* Noise texture overlay on cards */
        .card-noise::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none;
          opacity: 0.4;
        }
      `}</style>

      <div className="docs-root min-h-screen bg-[#030009] text-gray-200 px-4 sm:px-8 py-10">
        <div className="max-w-7xl mx-auto">

          {/* ---- Hero Header ---- */}
          <header className="header-anim mb-10 sm:mb-12">
            {/* Decorative top accent */}
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px flex-1 max-w-[40px] bg-gradient-to-r from-transparent to-sky-500/50" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-sky-500/60 font-semibold">Knowledge Base</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              {/* Title */}
              <div>
                <h1 className=" text-xl  sm:text-3xl font-extrabold text-white leading-tight">
                  Documentation{" "}
                  <span
                    style={{
                      background: "linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Hub
                  </span>
                </h1>
                <p className="text-sm text-gray-500 mt-2 flex items-center gap-2.5">
                  Explore all available topics
                  {!loading && (
                    <span className="count-badge">{docs.length} topics</span>
                  )}
                </p>
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-72">
                <MdSearch
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search documentation…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-sky-500/50 focus:border-sky-500/40 transition"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-300 transition"
                  >
                    <MdClose size={15} />
                  </button>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="mt-7 h-px bg-gradient-to-r from-white/[0.06] via-sky-500/20 to-transparent" />
          </header>

          {/* ---- Skeleton Loader ---- */}
          {loading && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl p-5 border border-white/[0.05] bg-[#0a0a14] space-y-3"
                >
                  <div className="skeleton h-4 w-2/3" />
                  <div className="skeleton h-3 w-full" />
                  <div className="skeleton h-3 w-5/6" />
                  <div className="skeleton h-3 w-3/4" />
                  <div className="flex justify-between items-center pt-1">
                    <div className="skeleton h-3 w-16" />
                    <div className="skeleton h-5 w-5 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ---- No Results ---- */}
          {!loading && filteredDocs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-3xl">
                🔍
              </div>
              <p className="text-gray-500 text-sm">
                No results for{" "}
                <span className="text-gray-300 font-medium">"{search}"</span>
              </p>
              <button
                onClick={() => setSearch("")}
                className="text-xs text-sky-400 hover:underline"
              >
                Clear search
              </button>
            </div>
          )}

          {/* ---- Cards Grid ---- */}
          {!loading && filteredDocs.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ">
              {filteredDocs.map((doc, i) => (
                <Link
                  key={doc._id}
                  to={`/docs/${doc._id}`}
                  className="doc-card card-noise group relative rounded-2xl border border-gray-700 bg-gradient-to-br from-gray-950 to-black p-5 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:border-sky-500/30 hover:shadow-[0_8px_30px_-4px_rgba(14,165,233,0.12)] overflow-hidden"
                  style={{ animationDelay: `${Math.min(i, 8) * 0.04}s` }}
                >
                  {/* Glow line */}
                  <span className="glow-line" />

                  {/* Inner subtle gradient */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
                    style={{
                      background:
                        "radial-gradient(ellipse at 50% 0%, rgba(14,165,233,0.05) 0%, transparent 70%)",
                    }}
                  />

                  {/* Card index badge */}
                  <div className="flex items-start justify-between mb-3 relative z-10">
                    <span
                      className="syne text-[10px] font-bold px-2 py-0.5 rounded-md"
                      style={{
                        background: "rgba(14,165,233,0.08)",
                        border: "1px solid rgba(14,165,233,0.15)",
                        color: "#7dd3fc",
                        letterSpacing: "0.05em",
                      }}
                    >
                      #{String(i + 1).padStart(2, "0")}
                    </span>
                    <MdArrowForward
                      className="arrow-icon text-sky-400 mt-0.5"
                      size={15}
                    />
                  </div>

                  {/* Title */}
                  <h2 className="syne text-sm sm:text-base font-bold text-white group-hover:text-sky-300 transition-colors leading-snug mb-2.5 line-clamp-2 relative z-10">
                    {doc.subject}
                  </h2>

                  {/* Description */}
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-3 flex-1 relative text-justify z-10">
                    {doc.description || "No description available."}
                  </p>

                  {/* Footer */}
                  <div className="mt-4 pt-3 border-t border-white/[0.05] flex items-center justify-between relative z-10">
                    <span className="text-[10px] text-gray-600 group-hover:text-sky-500/60 transition-colors font-medium tracking-wide uppercase">
                      View docs
                    </span>
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
                      style={{
                        background: "rgba(14,165,233,0.12)",
                        border: "1px solid rgba(14,165,233,0.2)",
                      }}
                    >
                      <MdArrowForward size={12} className="text-sky-400" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}