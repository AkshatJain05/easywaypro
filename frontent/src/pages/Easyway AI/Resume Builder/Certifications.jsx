import { FaTrash, FaPlus, FaLink } from "react-icons/fa";
import { useState } from "react";

const Certifications = ({ resumeData, updateResumeData }) => {
  // Safe fallback
  const certifications = resumeData?.certifications || [];

  const [cert, setCert] = useState({ title: "", link: "" });

  //  Format link (fix double https bug)
  const formatLink = (url) => {
    if (!url) return "";
    return url.startsWith("http") ? url : `https://${url}`;
  };

  // Add Certification
  const handleAdd = (e) => {
    e.preventDefault();

    if (!cert.title.trim()) return;

    const newCert = {
      id: Date.now() + Math.random(), // safer id
      title: cert.title.trim(),
      link: cert.link.trim(),
    };

    updateResumeData("certifications", [...certifications, newCert]);

    setCert({ title: "", link: "" }); // reset
  };

  // Remove Certification
  const handleRemove = (id) => {
    const updated = certifications.filter((c) => c.id !== id);
    updateResumeData("certifications", updated);
  };

  return (
    <div className="space-y-6">
      {/* TITLE */}
      <h2 className="text-xl font-semibold bg-gradient-to-r from-indigo-500 to-blue-500 text-transparent bg-clip-text border-b border-gray-700 pb-2">
        Certifications / Achievements
      </h2>

      {/* FORM */}
      <form
        onSubmit={handleAdd}
        className="flex flex-col sm:flex-row gap-3"
      >
        <input
          type="text"
          placeholder="Certificate Title"
          value={cert.title}
          onChange={(e) =>
            setCert((prev) => ({ ...prev, title: e.target.value }))
          }
          className="flex-1 p-2.5 rounded-lg  border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none"
        />

        <input
          type="url"
          placeholder="Certificate Link (optional)"
          value={cert.link}
          onChange={(e) =>
            setCert((prev) => ({ ...prev, link: e.target.value }))
          }
          className="flex-1 p-2.5 rounded-lg  border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none"
        />

        <button
          type="submit"
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition text-white font-medium shadow-md"
        >
          <FaPlus size={12} />
          Add
        </button>
      </form>

      {/* EMPTY STATE */}
      {certifications.length === 0 && (
        <p className="text-gray-400 text-sm text-center">
          No certifications added yet.
        </p>
      )}

      {/* LIST */}
      <ul className="space-y-3">
        {certifications.map((c) => (
          <li
            key={c.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg  border border-gray-700 shadow-sm"
          >
            {/* LEFT */}
            <div className="text-sm text-gray-200">
              <span className="font-medium">{c.title}</span>

              {c.link && (
                <a
                  href={formatLink(c.link)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 inline-flex items-center gap-1 text-indigo-400 hover:underline"
                >
                  <FaLink size={10} />
                  View
                </a>
              )}
            </div>

            {/* DELETE */}
            <button
              type="button"
              onClick={() => handleRemove(c.id)}
              className="text-red-400 hover:text-red-600 transition self-end sm:self-auto"
              title="Remove Certification"
            >
              <FaTrash />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Certifications;