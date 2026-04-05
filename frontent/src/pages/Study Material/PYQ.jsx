import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { FaFolder, FaFileAlt, FaSearch } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import Loading from "../../component/Loading";
import { useNavigate } from "react-router-dom";

const containerVariants = {
  visible: { transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

// 🔹 Subject Count Badge
const SubjectCount = ({ count }) => (
  <span className="ml-3 px-2 py-0.5 text-[10px] font-semibold rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-300">
    {count} PYQ{count !== 1 ? "s" : ""}
  </span>
);

export default function PYQ() {
  const [allSubjects, setAllSubjects] = useState([]);
  const [openSubjects, setOpenSubjects] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch PYQs
  useEffect(() => {
    const fetchPYQs = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/resources?type=pyq`);

        if (!Array.isArray(res.data)) return setAllSubjects([]);

        const grouped = res.data.reduce((acc, pyq) => {
          const subject = pyq.subject || "General";
          if (!acc[subject]) acc[subject] = [];
          acc[subject].push(pyq);
          return acc;
        }, {});

        setAllSubjects(
          Object.keys(grouped).map((key) => ({
            name: key,
            units: grouped[key],
          }))
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPYQs();
  }, [API_URL]);

  const toggleSubject = (name) => {
    setOpenSubjects((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  // Search
  const filteredSubjects = useMemo(() => {
    if (!searchTerm) return allSubjects;

    const q = searchTerm.toLowerCase();

    return allSubjects
      .map((subject) => {
        const subjectMatch = subject.name.toLowerCase().includes(q);

        const filteredUnits = subject.units.filter((u) =>
          u.title.toLowerCase().includes(q)
        );

        if (subjectMatch || filteredUnits.length > 0) {
          return {
            ...subject,
            units: subjectMatch ? subject.units : filteredUnits,
          };
        }
        return null;
      })
      .filter(Boolean);
  }, [allSubjects, searchTerm]);

  if (loading) return <Loading />;

  const totalPYQ = allSubjects.reduce((n, s) => n + s.units.length, 0);

  return (
    <div className="min-h-screen bg-[#030009] text-gray-100 px-4 py-6 relative">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(#ffffff0f_1px,transparent_1px)] bg-[size:22px_22px]" />

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 px-3 py-1.5 mb-5 rounded-lg text-sm
        bg-white/5 border border-white/10 hover:bg-sky-500/10 hover:border-sky-500/30 transition"
      >
        <IoIosArrowBack />
        Back
      </button>

      <div className="max-w-3xl mx-auto">
        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl font-extrabold text-center mb-6"
        >
          <span className="bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text text-transparent">
            Previous Year Questions
          </span>
        </motion.h1>

        {/* Stats */}
        <div className="flex justify-center gap-3 mb-5 text-xs">
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
            📂 {allSubjects.length} Subjects
          </span>
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
            📄 {totalPYQ} PYQs
          </span>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <FaSearch className="absolute left-3 top-3.5 text-gray-500" />
          <input
            type="text"
            placeholder="Search PYQs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10
            focus:border-sky-500 outline-none text-sm"
          />
        </div>

        {/* Subject List */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          {filteredSubjects.length > 0 ? (
            filteredSubjects.map((subject) => {
              const isOpen = openSubjects[subject.name];

              return (
                <motion.div
                  key={subject.name}
                  variants={itemVariants}
                  className={`mb-3 rounded-xl overflow-hidden border transition
                  ${isOpen ? "border-sky-500/30 shadow-md shadow-sky-500/10" : "border-white/10"}
                  bg-white/5`}
                >
                  {/* Header */}
                  <div
                    onClick={() => toggleSubject(subject.name)}
                    className="flex items-center gap-3 p-3 cursor-pointer hover:bg-white/5 transition"
                  >
                    <FaFolder className="text-sky-400 text-xl" />

                    <h2 className="font-semibold truncate flex-1">
                      {subject.name}
                    </h2>

                    <SubjectCount count={subject.units.length} />

                    <span className="text-gray-400 text-sm">
                      {isOpen ? "▲" : "▼"}
                    </span>
                  </div>

                  {/* Content */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                      >
                        {subject.units.map((unit, i) => (
                          <a
                            key={i}
                            href={unit.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-4 py-2 hover:bg-sky-500/10 transition text-sm border-t border-white/5"
                          >
                            <FaFileAlt className="text-sky-400 text-sm" />
                            <span className="truncate">{unit.title}</span>

                            <span className="ml-auto text-xs text-sky-400">
                              Open →
                            </span>
                          </a>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          ) : (
            <p className="text-center text-gray-500 mt-10 text-sm">
              {searchTerm
                ? `No results for "${searchTerm}"`
                : "No PYQs available"}
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}