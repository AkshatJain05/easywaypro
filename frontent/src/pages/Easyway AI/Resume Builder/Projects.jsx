import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaTrash, FaFolderOpen, FaTools, FaLink, FaLightbulb } from "react-icons/fa";

const baseInput = (hasValue) => ({
  width: "100%",
  padding: "10px 14px",
  borderRadius: "10px",
  border: hasValue ? "1.5px solid rgba(99,102,241,0.5)" : "1.5px solid rgba(75,85,99,0.45)",
  background: "rgba(17,24,39,0.6)",
  color: "#e5e7eb",
  outline: "none",
  fontSize: "13.5px",
  backdropFilter: "blur(4px)",
  transition: "border-color 0.2s, box-shadow 0.2s",
  fontFamily: "'Inter', 'Segoe UI', sans-serif",
});

const focusOn = (e) => {
  e.target.style.borderColor = "rgba(99,102,241,0.8)";
  e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12)";
};

const focusOff = (e, hasValue) => {
  e.target.style.borderColor = hasValue ? "rgba(99,102,241,0.5)" : "rgba(75,85,99,0.45)";
  e.target.style.boxShadow = "none";
};

const IconInput = ({ icon: Icon, name, placeholder, value, onChange, colSpan }) => (
  <div className={colSpan ? "md:col-span-2" : ""} style={{ position: "relative" }}>
    {Icon && (
      <Icon size={11} style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", color: "#6b7280", pointerEvents: "none", zIndex: 1 }} />
    )}
    <input
      type="text"
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={{ ...baseInput(!!value), paddingLeft: Icon ? "32px" : "14px" }}
      onFocus={focusOn}
      onBlur={(e) => focusOff(e, !!value)}
    />
  </div>
);

const Projects = ({ resumeData, updateResumeData }) => {
  const projects = resumeData?.projects || [];

  const handleAddProject = () => {
    updateResumeData("projects", [
      ...projects,
      { id: Date.now() + Math.random(), name: "", technologies: "", link: "", points: [""] },
    ]);
  };

  const handleRemoveProject = (id) => {
    updateResumeData("projects", projects.filter((p) => p.id !== id));
  };

  const handleChange = (id, e) => {
    const { name, value } = e.target;
    updateResumeData("projects", projects.map((p) => p.id === id ? { ...p, [name]: value } : p));
  };

  const handleAddPoint = (id) => {
    updateResumeData("projects", projects.map((p) => p.id === id ? { ...p, points: [...(p.points || []), ""] } : p));
  };

  const handleRemovePoint = (id, index) => {
    updateResumeData("projects", projects.map((p) =>
      p.id === id ? { ...p, points: (p.points || []).filter((_, i) => i !== index) } : p
    ));
  };

  const handlePointChange = (id, index, value) => {
    updateResumeData("projects", projects.map((p) =>
      p.id === id ? { ...p, points: (p.points || []).map((pt, i) => i === index ? value : pt) } : p
    ));
  };

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }} className="space-y-5">

      {/* HEADER */}
      <div className="flex items-center gap-3 pb-3" style={{ borderBottom: "1px solid rgba(99,102,241,0.2)" }}>
        <div className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)" }}>
          <FaFolderOpen size={13} color="white" />
        </div>
        <div>
          <h2 className="text-base font-semibold tracking-tight"
            style={{ background: "linear-gradient(90deg, #818cf8, #60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Projects
          </h2>
          <p className="text-xs" style={{ color: "#6b7280", marginTop: "1px" }}>Showcase your best work with key highlights</p>
        </div>
      </div>

      {/* EMPTY STATE */}
      <AnimatePresence>
        {projects.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center gap-3 py-8 rounded-xl"
            style={{ border: "1.5px dashed rgba(75,85,99,0.35)", background: "rgba(17,24,39,0.3)" }}>
            <div className="flex items-center justify-center w-10 h-10 rounded-full"
              style={{ background: "rgba(79,70,229,0.1)", border: "1px solid rgba(79,70,229,0.2)" }}>
              <FaFolderOpen size={16} style={{ color: "#818cf8" }} />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium" style={{ color: "#9ca3af" }}>No projects added yet</p>
              <p className="text-xs mt-1" style={{ color: "#6b7280" }}>Add projects to demonstrate your skills</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PROJECT CARDS */}
      <AnimatePresence>
        {projects.map((proj, index) => (
          <motion.div
            key={proj.id}
            layout
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -40, transition: { duration: 0.25 } }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{
              padding: "16px",
              borderRadius: "14px",
              border: "1.5px solid rgba(75,85,99,0.35)",
              background: "rgba(17,24,39,0.5)",
              backdropFilter: "blur(4px)",
            }}
          >
            {/* Card Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="flex items-center justify-center w-6 h-6 rounded-md text-xs font-bold flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, rgba(79,70,229,0.3), rgba(59,130,246,0.3))", border: "1px solid rgba(99,102,241,0.3)", color: "#a5b4fc", minWidth: "24px" }}>
                  {index + 1}
                </span>
                <span className="text-sm font-medium truncate" style={{ color: proj.name ? "#e5e7eb" : "#6b7280" }}>
                  {proj.name || "New Project"}
                </span>
                {proj.technologies && (
                  <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0 hidden sm:inline-block"
                    style={{ background: "rgba(99,102,241,0.12)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.2)", maxWidth: "140px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {proj.technologies}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleRemoveProject(proj.id)}
                aria-label="Remove project"
                className="flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0 ml-2"
                style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", color: "#f87171", cursor: "pointer", transition: "background 0.2s, border-color 0.2s, transform 0.1s" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.18)"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.4)"; e.currentTarget.style.transform = "scale(1.08)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.15)"; e.currentTarget.style.transform = "scale(1)"; }}
              >
                <FaTrash size={11} />
              </button>
            </div>

            {/* FIELDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <IconInput name="name" placeholder="Project Name" value={proj.name} onChange={(e) => handleChange(proj.id, e)} colSpan />
              <IconInput icon={FaTools} name="technologies" placeholder="Technologies (React, Node.js…)" value={proj.technologies} onChange={(e) => handleChange(proj.id, e)} />
              <IconInput icon={FaLink}  name="link"         placeholder="Project link or GitHub URL"    value={proj.link}         onChange={(e) => handleChange(proj.id, e)} />
            </div>

            {/* HIGHLIGHTS */}
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <FaLightbulb size={10} style={{ color: "#818cf8" }} />
                <p className="text-xs font-medium" style={{ color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Highlights
                </p>
                <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: "rgba(99,102,241,0.1)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.2)" }}>
                  {(proj.points || []).filter(Boolean).length}
                </span>
              </div>

              <div className="space-y-2">
                <AnimatePresence>
                  {(proj.points || []).map((point, i) => (
                    <motion.div
                      key={`${proj.id}-${i}`}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0, transition: { duration: 0.2 } }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-2"
                    >
                      <span style={{ color: "#4f46e5", fontSize: "16px", lineHeight: 1, flexShrink: 0 }}>•</span>

                      <input
                        type="text"
                        value={point}
                        onChange={(e) => handlePointChange(proj.id, i, e.target.value)}
                        placeholder={`Highlight ${i + 1} — e.g. Reduced load time by 40%`}
                        style={{ ...baseInput(!!point), flex: 1 }}
                        onFocus={focusOn}
                        onBlur={(e) => focusOff(e, !!point)}
                      />

                      <button
                        type="button"
                        onClick={() => handleRemovePoint(proj.id, i)}
                        aria-label="Remove highlight"
                        className="flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0"
                        style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", color: "#f87171", cursor: "pointer", transition: "background 0.2s, transform 0.1s" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.18)"; e.currentTarget.style.transform = "scale(1.08)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; e.currentTarget.style.transform = "scale(1)"; }}
                      >
                        <FaTrash size={10} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Add highlight */}
                <button
                  type="button"
                  onClick={() => handleAddPoint(proj.id)}
                  className="flex items-center gap-1.5 text-xs font-medium mt-1"
                  style={{ color: "#818cf8", background: "none", border: "none", cursor: "pointer", padding: "4px 0", transition: "color 0.2s" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "#a5b4fc"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "#818cf8"}
                >
                  <FaPlus size={9} />
                  Add highlight
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* ADD PROJECT */}
      <button
        type="button"
        onClick={handleAddProject}
        className="flex items-center gap-2 text-sm font-medium w-full justify-center"
        style={{ padding: "10px 18px", borderRadius: "10px", border: "1.5px dashed rgba(99,102,241,0.35)", background: "rgba(79,70,229,0.05)", color: "#818cf8", cursor: "pointer", transition: "background 0.2s, border-color 0.2s, transform 0.1s" }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(79,70,229,0.12)"; e.currentTarget.style.borderColor = "rgba(99,102,241,0.6)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(79,70,229,0.05)"; e.currentTarget.style.borderColor = "rgba(99,102,241,0.35)"; e.currentTarget.style.transform = "translateY(0)"; }}
      >
        <FaPlus size={11} />
        Add Project
      </button>

      {/* FOOTER COUNT */}
      {projects.length > 0 && (
        <p className="text-xs text-right" style={{ color: "#4b5563" }}>
          {projects.length} project{projects.length !== 1 ? "s" : ""} added
        </p>
      )}
    </div>
  );
};

export default Projects;