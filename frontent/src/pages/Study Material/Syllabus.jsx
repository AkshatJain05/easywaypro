import { useState } from "react";
import { FaBook, FaUniversity, FaFileAlt, FaExternalLinkAlt ,FaArrowLeft} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function SyllabusLinks() {
  const [activeTab, setActiveTab] = useState("semester");
  const navigate = useNavigate();

  const semesterLinks = [
    {
      name: "AKTU B.Tech Syllabus (All Branches)",
      url: "https://aktu.ac.in/syllabus.html",
    },
  ];

  const gateLinks = [
    {
      name: "GATE 2026 Official Syllabus",
      url: "https://gate2026.iitg.ac.in/exam-papers-and-syllabus.html",
    },
  ];

  return (
    <div className="min-h-screen py-5 px-6 sm:px-12 lg:px-24">
        <button
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-1 px-3 py-1.5 mb-8
                           bg-gray-800 hover:bg-gray-700 text-gray-200 
                           rounded-lg text-sm shadow-md transition-all cursor-pointer"
                >
                  <FaArrowLeft className="text-sm" />
                  <span>Back</span>
                </button>
      {/* Title */}
      <h1 className="text-4xl font-bold text-center text-cyan-300 mb-6">
        📘 B.Tech & GATE Syllabus Resources
      </h1>
      <p className="text-center text-gray-500 mb-10 max-w-2xl mx-auto">
        Find official syllabus links for semester exams (AKTU, NIT, SASTRA, GIET,
        GITAM) and GATE exam preparation in one place.
      </p>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <button
          onClick={() => setActiveTab("semester")}
          className={`px-6 py-2 rounded-l-xl font-medium flex items-center gap-2 ${
            activeTab === "semester"
              ? "bg-indigo-600 text-white"
              : "bg-white border text-indigo-600"
          }`}
        >
          <FaUniversity /> Semester
        </button>
        <button
          onClick={() => setActiveTab("gate")}
          className={`px-6 py-2 rounded-r-xl font-medium flex items-center gap-2 ${
            activeTab === "gate"
              ? "bg-indigo-600 text-white"
              : "bg-white border text-indigo-600"
          }`}
        >
          <FaBook /> GATE
        </button>
      </div>

      {/* Links Section */}
      <div className="bg-gradient-to-br from-gray-950 to-black border-1 border-gray-600 shadow-lg rounded-2xl p-6">
        {activeTab === "semester" ? (
          <ul className="space-y-4">
            {semesterLinks.map((link, idx) => (
              <li key={idx}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-400 hover:underline"
                >
                  <FaFileAlt className="text-gray-200" />
                  {link.name}
                  <FaExternalLinkAlt className="ml-2 text-sm" />
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="space-y-4">
            {gateLinks.map((link, idx) => (
              <li key={idx}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-400 hover:underline"
                >
                  <FaFileAlt className="text-gray-200" />
                  {link.name}
                  <FaExternalLinkAlt className="ml-2 text-sm" />
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  );
}
