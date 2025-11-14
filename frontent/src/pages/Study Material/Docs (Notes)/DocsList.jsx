import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { MdSearch, MdAdd } from "react-icons/md";

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

  const filteredDocs = docs.filter((doc) =>
    doc.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen text-gray-200 font-mono px-6 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent tracking-wide drop-shadow-md">
            Documentation Hub
          </h1>

          {/* Search Bar */}
          <div className="relative w-full sm:w-80">
            <MdSearch className="absolute left-3 top-3.5 text-gray-500 text-xl" />
            <input
              type="text"
              placeholder="Search by subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-3 pl-10 rounded-lg bg-gradient-to-br from-gray-950 to-black border border-gray-700 focus:border-sky-500 focus:ring-2 focus:ring-sky-600 outline-none text-gray-300 placeholder-gray-500 transition duration-200"
            />
          </div>
        </div>

        {/* Loader */}
        {loading && (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-gray-950 to-black border border-gray-800 rounded-xl p-5 space-y-3"
              >
                <div className="h-5 bg-gray-800 rounded w-3/4"></div>
                <div className="h-3 bg-gray-800 rounded w-full"></div>
                <div className="h-3 bg-gray-800 rounded w-5/6"></div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && filteredDocs.length === 0 && (
          <div className="text-center text-gray-500 mt-20">
            No documentation found 😕
          </div>
        )}

        {/* Docs Grid */}
        {!loading && (
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 px-4">
            {filteredDocs.map((doc, index) => (
              <Link
                key={doc._id}
                to={`/docs/${doc._id}`}
                className="group relative bg-gradient-to-br from-gray-950 to-black border border-gray-800 hover:border-sky-600 rounded-xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_15px_#0ea5e980]"
              >
                {/* Decorative line */}
                <div className="absolute top-0 left-0 h-1 w-0 group-hover:w-full bg-gradient-to-r from-sky-500 to-blue-600 transition-all duration-300 rounded-t-xl"></div>

                <h2 className="text-lg font-semibold text-sky-400 mb-2 group-hover:text-sky-300 transition">
                  {doc.subject}
                </h2>

                <p className="text-sm text-gray-400 line-clamp-3 mb-4 text-justify italic">
                  {doc.description || "No description available"}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
