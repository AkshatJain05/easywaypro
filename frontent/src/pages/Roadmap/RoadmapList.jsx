import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaSearch } from "react-icons/fa";
import Loading from "../../component/Loading";

export default function RoadmapList() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [filteredRoadmaps, setFilteredRoadmaps] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_URL}/roadmap/`)
      .then((res) => {
        const data = res.data.roadmaps || [];
        setRoadmaps(data);
        setFilteredRoadmaps(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  //  Filter roadmaps by search term
  useEffect(() => {
    const filtered = roadmaps.filter(
      (r) =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.description && r.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredRoadmaps(filtered);
  }, [searchTerm, roadmaps]);

  if (loading) return <Loading />;

  return (
    <div
      className="min-h-screen text-white px-6 md:px-16 py-3
      bg-gradient-to-br from-[#050505] via-[#0a0a0a] to-[#1a1a1a]
      bg-[radial-gradient(#ffffff1a_1px,transparent_1px)] bg-[size:22px_22px]
      animate-bgMove"
    >
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 px-4 py-2 mb-8 
                   bg-gray-900 hover:bg-gray-800 text-gray-200 
                   rounded-lg text-sm shadow-md transition-all cursor-pointer"
      >
        <FaArrowLeft className="text-sm" />
        <span>Back</span>
      </button>

      {/* Header Section */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-100 tracking-wide mb-2">
          Explore Available Roadmaps
        </h1>
        <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto">
          Track your learning journey — mark progress, visualize goals, and stay on course every day.
        </p>

        {/* Glowing Divider */}
        <div className="relative mt-6 mb-8 flex items-center justify-center">
          <div className="w-32 h-[2px] bg-gradient-to-r from-yellow-500 via-orange-400 to-yellow-500 animate-pulse rounded-full" />
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-md mx-auto mb-12">
        <div className="relative">
          <FaSearch className="absolute left-4 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search roadmap by title or topic..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-900 border border-gray-800 
                       focus:outline-none focus:ring-2 focus:ring-yellow-500 text-gray-200 
                       placeholder-gray-500 transition-all"
          />
        </div>
      </div>

      {/* Roadmap Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredRoadmaps.length > 0 ? (
          filteredRoadmaps.map((r) => (
            <Link
              key={r._id}
              to={`/roadmap/${r._id}`}
              className="group bg-gradient-to-br from-gray-950 to-black p-6 md:p-8 
                         rounded-xl border border-gray-800 hover:border-yellow-500 
                         hover:shadow-[0_0_25px_rgba(234,179,8,0.25)] transition-all duration-300 
                         flex flex-col justify-between relative overflow-hidden"
            >
              {/* Glow Line */}
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-70" />

              <h2 className="text-xl font-semibold mb-3 group-hover:text-yellow-400 transition-colors">
                {r.title}
              </h2>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed line-clamp-4">
                {r.description || "No description available."}
              </p>

              {/* Optional Progress Bar */}
              {r.overallProgress !== undefined && (
                <div className="mt-5">
                  <div className="w-full bg-gray-800 rounded-full h-2.5">
                    <div
                      className="bg-yellow-500 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${r.overallProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    Progress: <span className="text-yellow-400">{r.overallProgress}%</span>
                  </p>
                </div>
              )}
            </Link>
          ))
        ) : (
          <p className="text-center text-gray-400 col-span-full text-lg">
            No matching roadmaps found.
          </p>
        )}
      </div>

      {/* Footer Divider */}
      <div className="relative mt-16 flex items-center justify-center">
        <div className="w-48 h-[2px] bg-gradient-to-r from-yellow-500 via-orange-400 to-yellow-500 animate-pulse rounded-full" />
      </div>
      <p className="text-center text-gray-500 text-sm mt-4">
        Keep learning — your progress matters.
      </p>
    </div>
  );
}
