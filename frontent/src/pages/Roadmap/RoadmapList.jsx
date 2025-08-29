import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function RoadmapList() {
  const [roadmaps, setRoadmaps] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/roadmap/").then((res) => {
      setRoadmaps(res.data);
    });
  }, []);

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Available Roadmaps</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roadmaps.map((r) => (
          <Link key={r._id} to={`/roadmap/${r._id}`}
            className="bg-gray-800 p-6 rounded-2xl shadow hover:shadow-lg hover:-translate-y-1 transform transition">
            <h2 className="text-xl font-semibold">{r.title}</h2>
            <p className="text-gray-400">{r.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
