import { FaTrash, FaPlus, FaLink, FaAward, FaExternalLinkAlt } from "react-icons/fa";
import { useState } from "react";

const Certifications = ({ resumeData, updateResumeData }) => {
  const certifications = resumeData?.certifications || [];
  const [cert, setCert] = useState({ title: "", link: "" });
  const [removing, setRemoving] = useState(null);

  const formatLink = (url) => {
    if (!url) return "";
    return url.startsWith("http") ? url : `https://${url}`;
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!cert.title.trim()) return;

    const newCert = {
      id: Date.now() + Math.random(),
      title: cert.title.trim(),
      link: cert.link.trim(),
    };

    updateResumeData("certifications", [...certifications, newCert]);
    setCert({ title: "", link: "" });
  };

  const handleRemove = (id) => {
    setRemoving(id);
    setTimeout(() => {
      const updated = certifications.filter((c) => c.id !== id);
      updateResumeData("certifications", updated);
      setRemoving(null);
    }, 250);
  };

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }} className="space-y-6">

      {/* HEADER */}
      <div className="flex items-center gap-3 pb-3" style={{ borderBottom: "1px solid rgba(99,102,241,0.2)" }}>
        <div
          className="flex items-center justify-center w-8 h-8 rounded-lg"
          style={{ background: "linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)" }}
        >
          <FaAward size={14} color="white" />
        </div>
        <div>
          <h2
            className="text-base font-semibold tracking-tight"
            style={{ background: "linear-gradient(90deg, #818cf8, #60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
          >
            Certifications & Achievements
          </h2>
          <p className="text-xs" style={{ color: "#6b7280", marginTop: "1px" }}>
            Add credentials that strengthen your profile
          </p>
        </div>
      </div>

      {/* FORM */}
      <form onSubmit={handleAdd} className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2.5">
          {/* Title Input */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="e.g. AWS Solutions Architect"
              value={cert.title}
              onChange={(e) => setCert((prev) => ({ ...prev, title: e.target.value }))}
              className="w-full text-sm"
              style={{
                padding: "10px 14px",
                borderRadius: "10px",
                border: cert.title ? "1.5px solid rgba(99,102,241,0.6)" : "1.5px solid rgba(75,85,99,0.5)",
                background: "rgba(17,24,39,0.6)",
                color: "#e5e7eb",
                outline: "none",
                transition: "border-color 0.2s, box-shadow 0.2s",
                backdropFilter: "blur(4px)",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "rgba(99,102,241,0.8)";
                e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = cert.title ? "rgba(99,102,241,0.6)" : "rgba(75,85,99,0.5)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Link Input */}
          <div className="flex-1 relative">
            <FaLink
              size={11}
              style={{
                position: "absolute",
                left: "13px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#6b7280",
                pointerEvents: "none",
              }}
            />
            <input
              type="url"
              placeholder="Certificate URL (optional)"
              value={cert.link}
              onChange={(e) => setCert((prev) => ({ ...prev, link: e.target.value }))}
              className="w-full text-sm"
              style={{
                padding: "10px 14px 10px 32px",
                borderRadius: "10px",
                border: "1.5px solid rgba(75,85,99,0.5)",
                background: "rgba(17,24,39,0.6)",
                color: "#e5e7eb",
                outline: "none",
                transition: "border-color 0.2s, box-shadow 0.2s",
                backdropFilter: "blur(4px)",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "rgba(99,102,241,0.8)";
                e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(75,85,99,0.5)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!cert.title.trim()}
            className="flex items-center gap-2 text-sm font-medium text-white"
            style={{
              padding: "9px 18px",
              borderRadius: "10px",
              background: cert.title.trim()
                ? "linear-gradient(135deg, #059669 0%, #10b981 100%)"
                : "rgba(55,65,81,0.6)",
              border: "none",
              cursor: cert.title.trim() ? "pointer" : "not-allowed",
              opacity: cert.title.trim() ? 1 : 0.5,
              transition: "opacity 0.2s, transform 0.1s, box-shadow 0.2s",
              boxShadow: cert.title.trim() ? "0 2px 12px rgba(16,185,129,0.25)" : "none",
            }}
            onMouseEnter={(e) => {
              if (cert.title.trim()) {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(16,185,129,0.35)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = cert.title.trim() ? "0 2px 12px rgba(16,185,129,0.25)" : "none";
            }}
          >
            <FaPlus size={11} />
            Add Certification
          </button>
        </div>
      </form>

      {/* EMPTY STATE */}
      {certifications.length === 0 && (
        <div
          className="flex flex-col items-center justify-center gap-3 py-8 rounded-xl"
          style={{ border: "1.5px dashed rgba(75,85,99,0.35)", background: "rgba(17,24,39,0.3)" }}
        >
          <div
            className="flex items-center justify-center w-10 h-10 rounded-full"
            style={{ background: "rgba(79,70,229,0.1)", border: "1px solid rgba(79,70,229,0.2)" }}
          >
            <FaAward size={16} style={{ color: "#818cf8" }} />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium" style={{ color: "#9ca3af" }}>No certifications yet</p>
            <p className="text-xs mt-1" style={{ color: "#6b7280" }}>Add your credentials to stand out</p>
          </div>
        </div>
      )}

      {/* LIST */}
      {certifications.length > 0 && (
        <ul className="space-y-2.5">
          {certifications.map((c, index) => (
            <li
              key={c.id}
              className="flex items-center justify-between gap-3"
              style={{
                padding: "12px 14px",
                borderRadius: "12px",
                border: "1.5px solid rgba(75,85,99,0.35)",
                background: "rgba(17,24,39,0.5)",
                backdropFilter: "blur(4px)",
                opacity: removing === c.id ? 0 : 1,
                transform: removing === c.id ? "translateX(8px)" : "translateX(0)",
                transition: "opacity 0.25s ease, transform 0.25s ease",
              }}
            >
              {/* Index Badge + Title */}
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-md text-xs font-bold"
                  style={{
                    background: "linear-gradient(135deg, rgba(79,70,229,0.3) 0%, rgba(59,130,246,0.3) 100%)",
                    border: "1px solid rgba(99,102,241,0.3)",
                    color: "#a5b4fc",
                    minWidth: "24px",
                  }}
                >
                  {index + 1}
                </span>

                <div className="min-w-0">
                  <span
                    className="text-sm font-medium block truncate"
                    style={{ color: "#e5e7eb" }}
                  >
                    {c.title}
                  </span>

                  {c.link && (
                    <a
                      href={formatLink(c.link)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-0.5"
                      style={{ color: "#818cf8", fontSize: "11px", textDecoration: "none" }}
                      onMouseEnter={(e) => e.currentTarget.style.textDecoration = "underline"}
                      onMouseLeave={(e) => e.currentTarget.style.textDecoration = "none"}
                    >
                      <FaExternalLinkAlt size={9} />
                      View credential
                    </a>
                  )}
                </div>
              </div>

              {/* Delete Button */}
              <button
                type="button"
                onClick={() => handleRemove(c.id)}
                title="Remove"
                className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-lg"
                style={{
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.15)",
                  color: "#f87171",
                  cursor: "pointer",
                  transition: "background 0.2s, border-color 0.2s, transform 0.1s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(239,68,68,0.18)";
                  e.currentTarget.style.borderColor = "rgba(239,68,68,0.4)";
                  e.currentTarget.style.transform = "scale(1.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(239,68,68,0.08)";
                  e.currentTarget.style.borderColor = "rgba(239,68,68,0.15)";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <FaTrash size={11} />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* COUNT FOOTER */}
      {certifications.length > 0 && (
        <p className="text-xs text-right" style={{ color: "#4b5563" }}>
          {certifications.length} certification{certifications.length !== 1 ? "s" : ""} added
        </p>
      )}
    </div>
  );
};

export default Certifications;