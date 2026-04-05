import { useState } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";

const Skills = ({ resumeData, updateResumeData }) => {
  const skills = resumeData?.skills || [];

  const [currentSkill, setCurrentSkill] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Programming Language");
  const [newCategory, setNewCategory] = useState("");

  const [categories, setCategories] = useState([
    "Programming Language",
    "Frameworks & Libraries",
    "Databases",
    "DevOps & Tools",
    "Soft Skills",
  ]);

  //  Add Skill
  const handleAddSkill = (e) => {
    if ((e.key === "Enter" || e.key === ",") && currentSkill.trim()) {
      e.preventDefault();

      const newSkills = currentSkill
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => ({
          id: Date.now() + Math.random(),
          category: selectedCategory,
          value: s,
        }));

      updateResumeData("skills", [...skills, ...newSkills]);
      setCurrentSkill("");
    }
  };

  //  Remove Skill
  const handleRemoveSkill = (id) => {
    const updated = skills.filter((s) => s.id !== id);
    updateResumeData("skills", updated);
  };

  //  Add Category
  const handleAddCategory = () => {
    const cat = newCategory.trim();

    if (cat && !categories.includes(cat)) {
      setCategories((prev) => [...prev, cat]);
      setSelectedCategory(cat);
    }

    setNewCategory("");
  };

  //  Group Skills
  const groupedSkills = skills.reduce((acc, s) => {
    if (!s?.category || !s?.value) return acc;
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* TITLE */}
      <h2 className="text-xl font-semibold bg-gradient-to-r from-indigo-500 to-blue-500 text-transparent bg-clip-text border-b border-gray-700 pb-2">
        Skills
      </h2>

      {/* CATEGORY SELECTOR */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 text-xs sm:text-sm rounded-full font-medium transition ${
              selectedCategory === cat
                ? "bg-indigo-600 text-white shadow"
                : "bg-gray-900 text-gray-300 border border-gray-700 hover:bg-gray-800"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ADD CATEGORY */}
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Add new category"
          className="flex-1 p-2.5 rounded-lg  border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none"
        />
        <button
          type="button"
          onClick={handleAddCategory}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition"
        >
          <FaPlus size={12} />
          Add
        </button>
      </div>

      {/* SKILL INPUT */}
      <input
        type="text"
        value={currentSkill}
        onChange={(e) => setCurrentSkill(e.target.value)}
        onKeyDown={handleAddSkill}
        placeholder={`Add ${selectedCategory} (press Enter or comma)`}
        className="w-full p-3 rounded-lg  border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none"
      />

      {/* EMPTY STATE */}
      {skills.length === 0 && (
        <p className="text-gray-400 text-sm text-center">
          No skills added yet.
        </p>
      )}

      {/* SKILLS DISPLAY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(groupedSkills).map(([category, skillList]) => (
          <div
            key={category}
            className="p-4 rounded-xl  border border-gray-700 shadow-sm"
          >
            <h3 className="font-semibold text-gray-200 border-b border-gray-700 pb-1 mb-2 text-sm">
              {category}
            </h3>

            <div className="flex flex-wrap gap-2">
              {skillList.map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-center gap-1 px-3 py-1 rounded-full text-xs sm:text-sm bg-indigo-900/40 text-indigo-300 border border-indigo-700 hover:scale-105 transition"
                >
                  {skill.value}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill.id)}
                    className="ml-1 text-red-400 hover:text-red-600"
                  >
                    <FaTimes size={10} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skills;