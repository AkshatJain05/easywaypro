import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import Loading from "../../component/Loading";

export default function RoadmapList() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:8000/api/roadmap/")
      .then((res) => {
        setRoadmaps(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen  text-white px-8 md:px-18 py-6">
      
      {/* Back Button (small & responsive) */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 px-3 py-1.5 mb-6
                   bg-gray-800 hover:bg-gray-700 text-gray-200 
                   rounded-lg text-sm shadow-md transition-all cursor-pointer"
      >
        <FaArrowLeft className="text-sm" />
        <span>Back</span>
      </button>

      {/* Title */}
      <h1 className="text-2xl md:text-4xl font-extrabold mb-10 text-center text-gray-200">
         Explore Available Roadmaps
      </h1>

      {/* Roadmap Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {roadmaps.length > 0 ? (
          roadmaps.map((r) => (
            <Link
              key={r._id}
              to={`/roadmap/${r._id}`}
              className="bg-gradient-to-br from-gray-950 to-black p-6 md:p-8 rounded-xl 
                         shadow-md hover:shadow-xl hover:-translate-y-2 
                         transition-transform duration-300 border border-gray-800
                         flex flex-col justify-between hover:border-yellow-500"
            >
              <h2 className="text-lg md:text-xl font-bold mb-3">{r.title}</h2>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed line-clamp-4">
                {r.description || "No description available."}
              </p>
            </Link>
          ))
        ) : (
          <p className="text-center text-gray-400 col-span-full text-lg">
            No roadmaps available yet.
          </p>
        )}
      </div>
    </div>
  );
}
