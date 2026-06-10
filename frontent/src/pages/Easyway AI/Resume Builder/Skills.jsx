import { useState } from "react";
import { FaPlus, FaTimes, FaCode, FaTag } from "react-icons/fa";

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

// Deterministic soft color per category
const categoryColor = (name) => {
  const palette = [
    // Indigo
    { bg: "rgba(99, 102, 241, 0.12)", border: "rgba(99, 102, 241, 0.3)", text: "#a5b4fc", dot: "#818cf8" },
    // Emerald
    { bg: "rgba(16, 185, 129, 0.1)",  border: "rgba(16, 185, 129, 0.3)", text: "#6ee7b7", dot: "#34d399" },
    // Amber
    { bg: "rgba(245, 158, 11, 0.1)",  border: "rgba(245, 158, 11, 0.3)", text: "#fcd34d", dot: "#fbbf24" },
    // Replaced Red with a sophisticated Cyan/Teal
    { bg: "rgba(6, 182, 212, 0.1)",   border: "rgba(6, 182, 212, 0.3)",  text: "#67e8f9", dot: "#22d3ee" },
    // Blue
    { bg: "rgba(59, 130, 246, 0.1)",  border: "rgba(59, 130, 246, 0.3)", text: "#93c5fd", dot: "#60a5fa" },
    // Violet
    { bg: "rgba(168, 85, 247, 0.1)",  border: "rgba(168, 85, 247, 0.3)", text: "#d8b4fe", dot: "#c084fc" },
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return palette[Math.abs(hash) % palette.length];
};

const Skills = ({ resumeData, updateResumeData }) => {
  const skills = resumeData?.skills || [];
  const [currentSkill, setCurrentSkill] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Programming Languages");
  const [newCategory, setNewCategory] = useState("");
  const [categories, setCategories] = useState([
    "Programming Languages",
    "Frameworks & Libraries",
    "Databases",
    "DevOps & Tools",
    "Soft Skills",
  ]);

  const handleAddSkill = (e) => {
    if ((e.key === "Enter" || e.key === ",") && currentSkill.trim()) {
      e.preventDefault();
      const newSkills = currentSkill
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => ({ id: Date.now() + Math.random(), category: selectedCategory, value: s }));
      updateResumeData("skills", [...skills, ...newSkills]);
      setCurrentSkill("");
    }
  };

  const handleRemoveSkill = (id) => {
    updateResumeData("skills", skills.filter((s) => s.id !== id));
  };

  const handleAddCategory = () => {
    const cat = newCategory.trim();
    if (cat && !categories.includes(cat)) {
      setCategories((prev) => [...prev, cat]);
      setSelectedCategory(cat);
    }
    setNewCategory("");
  };

  const groupedSkills = skills.reduce((acc, s) => {
    if (!s?.category || !s?.value) return acc;
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }} className="space-y-5">

      {/* HEADER */}
      <div className="flex items-center gap-3 pb-3" style={{ borderBottom: "1px solid rgba(99,102,241,0.2)" }}>
        <div className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)" }}>
          <FaCode size={13} color="white" />
        </div>
        <div className="flex-1">
          <h2 className="text-base font-semibold tracking-tight"
            style={{ background: "linear-gradient(90deg, #818cf8, #60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Skills
          </h2>
          <p className="text-xs" style={{ color: "#6b7280", marginTop: "1px" }}>
            Select a category, then type skills and press Enter
          </p>
        </div>
        {skills.length > 0 && (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0"
            style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.25)", color: "#818cf8" }}>
            {skills.length} skill{skills.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* CATEGORY PILLS */}
      <div>
        <p className="text-xs font-medium mb-2" style={{ color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Category
        </p>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const active = selectedCategory === cat;
            const clr = categoryColor(cat);
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: "5px 12px",
                  borderRadius: "99px",
                  fontSize: "12px",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  border: active ? `1.5px solid ${clr.dot}` : "1.5px solid rgba(75,85,99,0.4)",
                  background: active ? clr.bg : "rgba(17,24,39,0.4)",
                  color: active ? clr.text : "#9ca3af",
                  boxShadow: active ? `0 0 0 3px ${clr.bg}` : "none",
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* ADD CATEGORY */}
      <div className="flex gap-2">
        <div style={{ position: "relative", flex: 1 }}>
          <FaTag size={10} style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", color: "#6b7280", pointerEvents: "none" }} />
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
            placeholder="New category name"
            style={{ ...baseInput(!!newCategory), paddingLeft: "32px" }}
            onFocus={focusOn}
            onBlur={(e) => focusOff(e, !!newCategory)}
          />
        </div>
        <button
          type="button"
          onClick={handleAddCategory}
          disabled={!newCategory.trim()}
          style={{
            padding: "10px 16px",
            borderRadius: "10px",
            background: newCategory.trim() ? "linear-gradient(135deg, #059669, #10b981)" : "rgba(55,65,81,0.6)",
            border: "none",
            color: "white",
            fontSize: "13px",
            fontWeight: 500,
            cursor: newCategory.trim() ? "pointer" : "not-allowed",
            opacity: newCategory.trim() ? 1 : 0.5,
            transition: "opacity 0.2s, transform 0.1s",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            whiteSpace: "nowrap",
            boxShadow: newCategory.trim() ? "0 2px 10px rgba(16,185,129,0.2)" : "none",
          }}
          onMouseEnter={(e) => { if (newCategory.trim()) e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
        >
          <FaPlus size={10} /> Add
        </button>
      </div>

      {/* SKILL INPUT */}
      <div style={{ position: "relative" }}>
        {(() => { const clr = categoryColor(selectedCategory); return (
          <span style={{
            position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)",
            fontSize: "11px", fontWeight: 600, color: clr.dot, pointerEvents: "none", zIndex: 1,
            background: clr.bg, border: `1px solid ${clr.border}`, padding: "2px 7px", borderRadius: "99px",
          }}>
            {selectedCategory}
          </span>
        );})()}
        <input
          type="text"
          value={currentSkill}
          onChange={(e) => setCurrentSkill(e.target.value)}
          onKeyDown={handleAddSkill}
          placeholder="Type a skill, press Enter or comma to add…"
          style={{
            ...baseInput(!!currentSkill),
            paddingLeft: `${selectedCategory.length * 7 + 28}px`,
          }}
          onFocus={focusOn}
          onBlur={(e) => focusOff(e, !!currentSkill)}
        />
      </div>

      {/* EMPTY STATE */}
      {skills.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 py-8 rounded-xl"
          style={{ border: "1.5px dashed rgba(75,85,99,0.35)", background: "rgba(17,24,39,0.3)" }}>
          <div className="flex items-center justify-center w-10 h-10 rounded-full"
            style={{ background: "rgba(79,70,229,0.1)", border: "1px solid rgba(79,70,229,0.2)" }}>
            <FaCode size={16} style={{ color: "#818cf8" }} />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium" style={{ color: "#9ca3af" }}>No skills added yet</p>
            <p className="text-xs mt-1" style={{ color: "#6b7280" }}>Pick a category above and start typing</p>
          </div>
        </div>
      )}

      {/* SKILLS GRID */}
      {Object.keys(groupedSkills).length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.entries(groupedSkills).map(([category, skillList]) => {
            const clr = categoryColor(category);
            return (
              <div key={category}
                style={{
                  padding: "14px",
                  borderRadius: "12px",
                  border: `1.5px solid ${clr.border}`,
                  background: clr.bg,
                  backdropFilter: "blur(4px)",
                }}
              >
                {/* Category header */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold" style={{ color: clr.text, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                    {category}
                  </span>
                  <span className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                    style={{ background: "rgba(0,0,0,0.25)", color: clr.text }}>
                    {skillList.length}
                  </span>
                </div>

                {/* Skill tags */}
                <div className="flex flex-wrap gap-1.5">
                  {skillList.map((skill) => (
                    <span
                      key={skill.id}
                      className="flex items-center gap-1.5 text-xs font-medium"
                      style={{
                        padding: "4px 10px",
                        borderRadius: "99px",
                        background: "rgba(0,0,0,0.3)",
                        border: `1px solid ${clr.border}`,
                        color: clr.text,
                        transition: "transform 0.15s",
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.04)"}
                      onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                    >
                      {skill.value}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill.id)}
                        style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: clr.text, opacity: 0.6, display: "flex", alignItems: "center", transition: "opacity 0.15s" }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = "1"}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = "0.6"}
                      >
                        <FaTimes size={9} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FOOTER */}
      {skills.length > 0 && (
        <p className="text-xs text-right" style={{ color: "#4b5563" }}>
          {skills.length} skill{skills.length !== 1 ? "s" : ""} across {Object.keys(groupedSkills).length} categor{Object.keys(groupedSkills).length !== 1 ? "ies" : "y"}
        </p>
      )}
    </div>
  );
};

export default Skills;