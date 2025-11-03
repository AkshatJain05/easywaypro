import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft, FaSearch } from "react-icons/fa";
import Loading from "../../component/Loading";
import { toast } from "react-hot-toast";

export default function RoadmapList() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  /* ------------------------ Fetch User Roadmaps (Cookie-based) ------------------------ */
  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/roadmap/user/all`, {
          withCredentials: true,
        });
        const data = res.data?.roadmaps || [];
        setRoadmaps(data);
      } catch (err) {
        console.error("Error fetching user roadmaps:", err);
        if (err.response?.status === 401) {
          toast.error("Please log in to view your roadmaps");
          navigate("/login");
        } else {
          toast.error("Unable to load your roadmaps");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmaps();
  }, [API_URL, navigate]);

  /* ------------------------------- Search Filtering ------------------------------- */
  const filteredRoadmaps = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return roadmaps.filter(
      (r) =>
        r.title?.toLowerCase().includes(term) ||
        r.description?.toLowerCase().includes(term)
    );
  }, [roadmaps, searchTerm]);

  if (loading) return <Loading />;

  /* ----------------------------- Component Structure ----------------------------- */
  return (
    <div
      className="min-h-screen text-white px-6 md:px-16 py-6
      bg-gradient-to-br from-[#050505] via-[#0a0a0a] to-[#1a1a1a]
      bg-[radial-gradient(#ffffff1a_1px,transparent_1px)] bg-[size:22px_22px]
      animate-bgMove"
    >
      {/* 🔙 Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 px-4 py-2 mb-8 
                   bg-gray-900 hover:bg-gray-800 text-gray-200 
                   rounded-lg text-sm shadow-md transition-all cursor-pointer"
      >
        <FaArrowLeft className="text-sm" />
        <span>Back</span>
      </button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-orange-600 via-yellow-400 to-yellow-600 bg-clip-text text-transparent tracking-wide mb-2 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]">
          Your Learning Roadmaps
        </h1>
        <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto">
          Explore your personalized learning journeys and track your progress easily.
        </p>

        <div className="relative mt-6 mb-8 flex items-center justify-center">
          <div className="w-32 h-[2px] bg-gradient-to-r from-yellow-500 via-orange-400 to-yellow-500 animate-pulse rounded-full" />
        </div>
      </motion.div>

      {/*  Search */}
      <div className="max-w-md mx-auto mb-12 relative">
        <FaSearch className="absolute left-4 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search your roadmaps..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-900 border border-gray-800 
                     focus:outline-none focus:ring-2 focus:ring-yellow-500 text-gray-200 
                     placeholder-gray-500 transition-all"
        />
      </div>

      {/*  Roadmap Grid */}
      <AnimatePresence>
        {filteredRoadmaps.length > 0 ? (
          <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRoadmaps.map((r, i) => {
              const progress = Math.min(Math.max(r.overallProgress || 0, 0), 100);

              return (
                <motion.div
                  key={r._id || i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <Link
                    to={`/roadmap/${r._id}`}
                    className="group bg-gradient-to-br from-gray-950 to-black p-6 md:p-8 
                               rounded-xl border border-gray-800 hover:border-yellow-500 
                               hover:shadow-[0_0_25px_rgba(234,179,8,0.25)] transition-all duration-300 
                               flex flex-col justify-between relative overflow-hidden"
                  >
                    {/* Top Glow Line */}
                    <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-70" />

                    <h2 className="text-xl font-semibold mb-3 group-hover:text-yellow-400 transition-colors line-clamp-1">
                      {r.title}
                    </h2>

                    <p className="text-gray-400 text-sm md:text-base leading-relaxed line-clamp-4">
                      {r.description || "No description available."}
                    </p>

                    {/*  Progress Bar */}
                    <div className="mt-5">
                      <div className="relative w-full bg-gray-800 rounded-full h-2.5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 1 }}
                          className={`h-2.5 rounded-full ${
                            progress < 40
                              ? "bg-gradient-to-r from-red-500 to-yellow-500"
                              : progress < 80
                              ? "bg-gradient-to-r from-yellow-400 to-sky-500"
                              : "bg-gradient-to-r from-sky-500 to-emerald-500"
                          } shadow-[0_0_10px_rgba(234,179,8,0.4)]`}
                        />
                        {progress >= 100 && (
                          <motion.span
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="absolute right-2 -top-6 text-emerald-400 text-xs font-semibold"
                          >
                             Completed!
                          </motion.span>
                        )}
                      </div>

                      <div className="flex justify-between mt-1 text-sm text-gray-400">
                        <span>Progress</span>
                        <span className="text-yellow-400 font-semibold">
                          {progress.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-gray-400"
          >
            <p className="text-lg mb-4">No roadmaps found for your account.</p>
            <button
              onClick={() => navigate("/explore")}
              className="px-6 py-2 bg-yellow-500 text-black font-semibold rounded-md hover:bg-yellow-400 transition-all"
            >
              Explore Roadmaps
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="relative mt-16 flex items-center justify-center">
        <div className="w-48 h-[2px] bg-gradient-to-r from-yellow-500 via-orange-400 to-yellow-500 animate-pulse rounded-full" />
      </div>
      <p className="text-center text-gray-500 text-sm mt-4">
        Keep learning — your progress matters.
      </p>
    </div>
  );
}
