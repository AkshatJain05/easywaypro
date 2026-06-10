import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaTrash, FaGraduationCap, FaCalendarAlt, FaStar } from "react-icons/fa";

const inputStyle = (hasValue) => ({
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

const InputField = ({ icon: Icon, name, placeholder, value, onChange, colSpan }) => (
  <div className={colSpan ? "md:col-span-2" : ""} style={{ position: "relative" }}>
    {Icon && (
      <Icon
        size={11}
        style={{
          position: "absolute",
          left: "13px",
          top: "50%",
          transform: "translateY(-50%)",
          color: "#6b7280",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
    )}
    <input
      type="text"
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={{
        ...inputStyle(!!value),
        paddingLeft: Icon ? "32px" : "14px",
      }}
      onFocus={(e) => {
        e.target.style.borderColor = "rgba(99,102,241,0.8)";
        e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12)";
      }}
      onBlur={(e) => {
        e.target.style.borderColor = value ? "rgba(99,102,241,0.5)" : "rgba(75,85,99,0.45)";
        e.target.style.boxShadow = "none";
      }}
    />
  </div>
);

const Education = ({ resumeData, updateResumeData }) => {
  const education = resumeData?.education || [];

  const handleAddEducation = () => {
    const newEdu = {
      id: Date.now(),
      school: "",
      degree: "",
      startDate: "",
      endDate: "",
      marks: "",
    };
    updateResumeData("education", [...education, newEdu]);
  };

  const handleRemoveEducation = (id) => {
    updateResumeData("education", education.filter((edu) => edu.id !== id));
  };

  const handleChange = (id, e) => {
    const { name, value } = e.target;
    updateResumeData(
      "education",
      education.map((edu) => (edu.id === id ? { ...edu, [name]: value } : edu))
    );
  };

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }} className="space-y-5">

      {/* HEADER */}
      <div className="flex items-center gap-3 pb-3" style={{ borderBottom: "1px solid rgba(99,102,241,0.2)" }}>
        <div
          className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)" }}
        >
          <FaGraduationCap size={14} color="white" />
        </div>
        <div>
          <h2
            className="text-base font-semibold tracking-tight"
            style={{
              background: "linear-gradient(90deg, #818cf8, #60a5fa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Education
          </h2>
          <p className="text-xs" style={{ color: "#6b7280", marginTop: "1px" }}>
            List your academic background, latest first
          </p>
        </div>
      </div>

      {/* EMPTY STATE */}
      <AnimatePresence>
        {education.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center gap-3 py-8 rounded-xl"
            style={{ border: "1.5px dashed rgba(75,85,99,0.35)", background: "rgba(17,24,39,0.3)" }}
          >
            <div
              className="flex items-center justify-center w-10 h-10 rounded-full"
              style={{ background: "rgba(79,70,229,0.1)", border: "1px solid rgba(79,70,229,0.2)" }}
            >
              <FaGraduationCap size={16} style={{ color: "#818cf8" }} />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium" style={{ color: "#9ca3af" }}>No education added yet</p>
              <p className="text-xs mt-1" style={{ color: "#6b7280" }}>Add your degrees and academic history</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* EDUCATION CARDS */}
      <AnimatePresence>
        {education.map((edu, index) => (
          <motion.div
            key={edu.id}
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
              position: "relative",
            }}
          >
            {/* Card Header Row */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <span
                  className="flex items-center justify-center w-6 h-6 rounded-md text-xs font-bold flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg, rgba(79,70,229,0.3), rgba(59,130,246,0.3))",
                    border: "1px solid rgba(99,102,241,0.3)",
                    color: "#a5b4fc",
                    minWidth: "24px",
                  }}
                >
                  {index + 1}
                </span>
                <span className="text-sm font-medium" style={{ color: edu.school ? "#e5e7eb" : "#6b7280" }}>
                  {edu.school || "New Entry"}
                </span>
                {edu.degree && (
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(99,102,241,0.12)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.2)" }}>
                    {edu.degree}
                  </span>
                )}
              </div>

              <button
                onClick={() => handleRemoveEducation(edu.id)}
                aria-label="Remove education entry"
                className="flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0"
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
            </div>

            {/* FIELDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <InputField
                name="school"
                placeholder="School / University"
                value={edu.school}
                onChange={(e) => handleChange(edu.id, e)}
              />
              <InputField
                name="degree"
                placeholder="Degree / Certificate"
                value={edu.degree}
                onChange={(e) => handleChange(edu.id, e)}
              />
              <InputField
                icon={FaCalendarAlt}
                name="startDate"
                placeholder="Start (e.g. Sept 2020)"
                value={edu.startDate}
                onChange={(e) => handleChange(edu.id, e)}
              />
              <InputField
                icon={FaCalendarAlt}
                name="endDate"
                placeholder="End (e.g. May 2024)"
                value={edu.endDate}
                onChange={(e) => handleChange(edu.id, e)}
              />
              <InputField
                icon={FaStar}
                name="marks"
                placeholder="GPA / Marks (e.g. CGPA: 8.5/10)"
                value={edu.marks}
                onChange={(e) => handleChange(edu.id, e)}
                colSpan
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* ADD BUTTON */}
      <button
        onClick={handleAddEducation}
        className="flex items-center gap-2 text-sm font-medium w-full justify-center"
        style={{
          padding: "10px 18px",
          borderRadius: "10px",
          border: "1.5px dashed rgba(99,102,241,0.35)",
          background: "rgba(79,70,229,0.05)",
          color: "#818cf8",
          cursor: "pointer",
          transition: "background 0.2s, border-color 0.2s, transform 0.1s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(79,70,229,0.12)";
          e.currentTarget.style.borderColor = "rgba(99,102,241,0.6)";
          e.currentTarget.style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(79,70,229,0.05)";
          e.currentTarget.style.borderColor = "rgba(99,102,241,0.35)";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        <FaPlus size={11} />
        Add Education
      </button>

      {/* COUNT FOOTER */}
      {education.length > 0 && (
        <p className="text-xs text-right" style={{ color: "#4b5563" }}>
          {education.length} entr{education.length !== 1 ? "ies" : "y"} added
        </p>
      )}
    </div>
  );
};

export default Education;