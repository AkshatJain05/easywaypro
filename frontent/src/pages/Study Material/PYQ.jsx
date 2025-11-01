import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { FaFolder, FaFileAlt, FaSearch } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import Loading from "../../component/Loading";
import { useNavigate } from "react-router-dom";

// --- Framer Motion Variants ---
const containerVariants = {
  visible: { transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};
// ------------------------------

export default function PYQ() {
  const [allSubjects, setAllSubjects] = useState([]);
  const [openSubjects, setOpenSubjects] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch all PYQs
  const fetchPYQs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/resources?type=pyq`);

      if (!Array.isArray(res.data)) {
        console.error("Unexpected API response:", res.data);
        setAllSubjects([]);
        setLoading(false);
        return;
      }

      const grouped = res.data.reduce((acc, pyq) => {
        const subject = pyq.subject || "General";
        if (!acc[subject]) acc[subject] = [];
        acc[subject].push(pyq);
        return acc;
      }, {});

      const subjectArray = Object.keys(grouped).map((key) => ({
        name: key,
        units: grouped[key],
      }));

      setAllSubjects(subjectArray);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching PYQs:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPYQs();
  }, [API_URL]);

  const toggleSubject = (subjectName) => {
    setOpenSubjects((prev) => ({
      ...prev,
      [subjectName]: !prev[subjectName],
    }));
  };

  // --- Search Logic ---
  const filteredSubjects = useMemo(() => {
    if (!searchTerm) return allSubjects;
    const lowerCaseSearch = searchTerm.toLowerCase();

    return allSubjects
      .map((subject) => {
        const subjectMatch = subject.name.toLowerCase().includes(lowerCaseSearch);
        const filteredUnits = subject.units.filter((unit) =>
          unit.title.toLowerCase().includes(lowerCaseSearch)
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

  return (
    <div className="min-h-screen text-gray-100 p-4 sm:p-6 relative">
      {/* Background */}
      <div
        className="absolute top-0 left-0 -z-10 h-full w-full 
        bg-gradient-to-br from-[#050505] via-[#0a0a0a] to-[#1a1a1a]
        bg-[radial-gradient(#ffffff1a_1px,transparent_1px)]
        bg-[size:22px_22px] animate-bgMove"
      />

      {/*  Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 
        text-gray-200 rounded-lg text-sm shadow-md transition-all mb-4"
      >
        <IoIosArrowBack className="w-4 h-4" />
        <span>Back</span>
      </button>

      {/*  Main Content */}
      <div className="max-w-4xl mx-auto relative">
        {/* Heading */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col sm:flex-row items-center justify-center mb-3 md:mb-10 gap-4"
        >
          <h1 className="text-4xl font-extrabold text-center bg-gradient-to-r from-purple-400 to-sky-400 text-transparent bg-clip-text">
            Previous Year Questions (PYQs)
          </h1>
          <div className="w-[70px]" />
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="relative mb-8"
        >
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search subjects or PYQs (e.g., 'DSA' or 'OOPS')"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-3 pl-12 pr-4 bg-gray-800 border border-gray-700 
            rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 
            transition shadow-lg"
          />
        </motion.div>

        {/* Subject Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {filteredSubjects.length > 0 ? (
            filteredSubjects.map((subject) => (
              <motion.div
                key={subject.name}
                variants={itemVariants}
                className="bg-gray-900 rounded-xl shadow-2xl overflow-hidden 
                border border-gray-700 hover:shadow-purple-500/10 transition"
              >
                {/* Subject Header */}
                <div
                  onClick={() => toggleSubject(subject.name)}
                  className="flex items-center gap-4 cursor-pointer p-4 hover:bg-gray-800/80 transition duration-200"
                >
                  <FaFolder className="text-yellow-400 text-3xl flex-shrink-0" />
                  <h2 className="text-xl font-semibold text-white">{subject.name}</h2>
                  <span className="ml-auto text-gray-400 text-lg">
                    {openSubjects[subject.name] ? "▲" : "▼"}
                  </span>
                </div>

                {/* PYQs inside subject */}
                <AnimatePresence initial={false}>
                  {openSubjects[subject.name] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      {subject.units.map((unit, uidx) => (
                        <a
                          key={uidx}
                          href={unit.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 pl-5 lg:pl-10 bg-gray-800/50 hover:bg-gray-700/80 
                          transition border-b border-gray-700 last:border-b-0"
                        >
                          <FaFileAlt className="text-sky-400" />
                          <span className="text-gray-200 font-medium hover:text-white">
                            {unit.title}
                          </span>
                          <span className="ml-auto text-sm text-purple-400 hover:text-purple-300">
                            Open PYQ
                          </span>
                        </a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-500 mt-10 p-4 bg-gray-900 rounded-lg border border-gray-700"
            >
              {searchTerm
                ? `No results found for "${searchTerm}". Try a different term.`
                : "No PYQs available in the system."}
            </motion.p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
