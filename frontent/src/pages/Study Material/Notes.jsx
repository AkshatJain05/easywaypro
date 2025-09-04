import { useState, useEffect } from "react";
import axios from "axios";
import { FaFolder, FaStickyNote } from "react-icons/fa";
import Loading from "../../component/Loading";

export default function Notes() {
  
  const [subjects, setSubjects] = useState([]);
  const [openSubjects, setOpenSubjects] = useState({});
  const [loading, setLoading] = useState(true);

  
const API_URL = import.meta.env.VITE_API_URL;

  // Fetch all notes from backend
  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/resources?type=notes`);
      const grouped = res.data.reduce((acc, note) => {
        const subject = note.subject || "General";
        if (!acc[subject]) acc[subject] = [];
        acc[subject].push(note);
        return acc;
      }, {});
      setSubjects(Object.keys(grouped).map(key => ({ name: key, units: grouped[key] })));
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const toggleSubject = (subjectName) => {
    setOpenSubjects(prev => ({ ...prev, [subjectName]: !prev[subjectName] }));
  };

  if (loading)
    return <Loading/>

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6 text-white">Notes</h1>

      <div className="space-y-4">
        {subjects.length > 0 ? subjects.map((subject, idx) => (
          <div key={idx} className="bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-700 hover:shadow-xl transition">
            <div
              onClick={() => toggleSubject(subject.name)}
              className="flex items-center gap-3 cursor-pointer p-4 hover:bg-gray-800 transition"
            >
              <FaFolder className="text-yellow-400 text-3xl" />
              <h2 className="text-xl font-semibold text-white">{subject.name}</h2>
              <span className="ml-auto text-gray-400 text-sm">{openSubjects[subject.name] ? "▲" : "▼"}</span>
            </div>

            <div className={`overflow-hidden transition-all duration-300 ${openSubjects[subject.name] ? "max-h-screen" : "max-h-0"}`}>
              {subject.units.map((unit, uidx) => (
                <a
                  key={uidx}
                  href={unit.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 pl-16 bg-gray-800 hover:bg-gray-700 transition border-b border-gray-700 rounded-b-lg last:border-b-0"
                >
                  <FaStickyNote className="text-yellow-400" />
                  <span className="text-gray-200 font-medium">{unit.title}</span>
                  <span className="ml-auto text-gray-400 text-sm">Open Note</span>
                </a>
              ))}
            </div>
          </div>
        )) : <p className="text-center text-gray-400 mt-10">No notes available.</p>}
      </div>
    </div>
  );
}
