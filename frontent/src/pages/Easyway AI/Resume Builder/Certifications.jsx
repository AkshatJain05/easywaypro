import { useState } from "react";

const Certifications = ({ resumeData, setResumeData }) => {
  const [cert, setCert] = useState({ title: "", link: "" });

  const handleAdd = (e) => {
    e.preventDefault();
    if (cert.title.trim() !== "") {
      setResumeData((prev) => ({
        ...prev,
        certifications: [...prev.certifications, cert],
      }));
      setCert({ title: "", link: "" }); // reset
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white border-b pb-2">
        Certifications / Achievements
      </h2>

      {/* Inputs + Button */}
      <div className="flex flex-col md:flex-row gap-2">
        <input
          type="text"
          placeholder="Certificate Title"
          value={cert.title}
          onChange={(e) => setCert({ ...cert, title: e.target.value })}
          className="flex-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <input
          type="url"
          placeholder="Certificate Link"
          value={cert.link}
          onChange={(e) => setCert({ ...cert, link: e.target.value })}
          className="flex-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Add
        </button>
      </div>

      {/* Preview list */}
      <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
        {resumeData.certifications?.map((c, i) => (
          <li key={i} className="text-sm">
            <span className="font-medium">{c.title}</span>
            {c.link && (
              <a
                href={c.link}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
              >
                View
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Certifications;
