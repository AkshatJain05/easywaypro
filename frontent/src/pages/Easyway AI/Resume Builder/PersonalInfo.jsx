import {
  FaUser, FaBriefcase, FaEnvelope, FaPhone,
  FaMapMarkerAlt, FaLinkedin, FaGithub, FaGlobe,
} from "react-icons/fa";

const baseInput = (hasValue) => ({
  width: "100%",
  padding: "10px 14px 10px 32px",
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

const Field = ({ icon: Icon, type = "text", name, placeholder, value, onChange }) => (
  <div style={{ position: "relative" }}>
    <Icon
      size={11}
      style={{
        position: "absolute", left: "13px", top: "50%",
        transform: "translateY(-50%)", color: "#6b7280", pointerEvents: "none", zIndex: 1,
      }}
    />
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={baseInput(!!value)}
      onFocus={focusOn}
      onBlur={(e) => focusOff(e, !!value)}
    />
  </div>
);

const PersonalInfo = ({ resumeData, updateResumeData }) => {
  const info = resumeData?.personalInfo || {};

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateResumeData("personalInfo", { ...info, [name]: value });
  };

  const filled = Object.values(info).filter(Boolean).length;
  const total = 8;
  const pct = Math.round((Math.min(filled, total) / total) * 100);

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }} className="space-y-5">

      {/* HEADER */}
      <div className="flex items-center gap-3 pb-3" style={{ borderBottom: "1px solid rgba(99,102,241,0.2)" }}>
        <div
          className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)" }}
        >
          <FaUser size={13} color="white" />
        </div>
        <div className="flex-1 min-w-0">
          <h2
            className="text-base font-semibold tracking-tight"
            style={{ background: "linear-gradient(90deg, #818cf8, #60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
          >
            Personal Information
          </h2>
          <p className="text-xs" style={{ color: "#6b7280", marginTop: "1px" }}>
            Your contact details and professional identity
          </p>
        </div>

        {/* Completion badge */}
        {/* <div className="flex-shrink-0 flex items-center gap-2">
          <div style={{ width: "48px", height: "4px", borderRadius: "99px", background: "rgba(75,85,99,0.4)", overflow: "hidden" }}>
            <div style={{ width: `${pct}%`, height: "100%", borderRadius: "99px", background: "linear-gradient(90deg, #4f46e5, #3b82f6)", transition: "width 0.4s ease" }} />
          </div>
          <span className="text-xs font-medium" style={{ color: pct === 100 ? "#34d399" : "#818cf8", minWidth: "30px", textAlign: "right" }}>
            {pct}%
          </span>
        </div> */}
      </div>

      {/* IDENTITY ROW */}
      <div>
        <p className="text-xs font-medium mb-2" style={{ color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em" }}>Identity</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field icon={FaUser}      name="name"   placeholder="Full Name"           value={info.name  || ""}  onChange={handleChange} />
          <Field icon={FaBriefcase} name="title"  placeholder="Professional Title"  value={info.title || ""}  onChange={handleChange} />
        </div>
      </div>

      {/* CONTACT ROW */}
      <div>
        <p className="text-xs font-medium mb-2" style={{ color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em" }}>Contact</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field icon={FaEnvelope}     type="email" name="email"   placeholder="Email address"       value={info.email   || ""} onChange={handleChange} />
          <Field icon={FaPhone}        type="tel"   name="phone"   placeholder="Phone number"        value={info.phone   || ""} onChange={handleChange} />
          <Field icon={FaMapMarkerAlt}              name="address" placeholder="City, State / Remote" value={info.address || ""} onChange={handleChange} />
        </div>
      </div>

      {/* LINKS ROW */}
      <div>
        <p className="text-xs font-medium mb-2" style={{ color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em" }}>Links</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field icon={FaLinkedin} name="linkedin"  placeholder="linkedin.com/in/username"  value={info.linkedin  || ""} onChange={handleChange} />
          <Field icon={FaGithub}   name="github"    placeholder="github.com/username"       value={info.github   || ""} onChange={handleChange} />
          <Field icon={FaGlobe}    name="portfolio" placeholder="yourportfolio.com"         value={info.portfolio|| ""} onChange={handleChange} />
        </div>
      </div>

      {/* SUMMARY */}
      <div>
        <p className="text-xs font-medium mb-2" style={{ color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em" }}>Summary</p>
        <div style={{ position: "relative" }}>
          <textarea
            name="summary"
            placeholder="Write a 2–3 sentence professional summary or career objective..."
            rows={4}
            value={info.summary || ""}
            onChange={handleChange}
            style={{
              ...baseInput(!!info.summary),
              paddingLeft: "14px",
              resize: "none",
              lineHeight: "1.6",
            }}
            onFocus={focusOn}
            onBlur={(e) => focusOff(e, !!info.summary)}
          />
          <p className="text-right text-xs mt-1" style={{ color: "#4b5563" }}>
            {info.summary?.length > 0
              ? `${info.summary.length} chars`
              : "Tip: keep it under 300 characters for best results"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;