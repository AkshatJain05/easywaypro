import { useState } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";

const Skills = ({ resumeData, updateResumeData }) => {
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

  // Add skill as {category, value}
  const handleAddSkill = (e) => {
    if ((e.key === "Enter" || e.key === ",") && currentSkill.trim() !== "") {
      e.preventDefault();
      const newSkills = currentSkill
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => ({ category: selectedCategory, value: s }));

      updateResumeData("skills", [...(resumeData.skills || []), ...newSkills]);
      setCurrentSkill("");
    }
  };

  // Remove skill
  const handleRemoveSkill = (skillToRemove) => {
    const updatedSkills = (resumeData.skills || []).filter(
      (s) => !(s.category === skillToRemove.category && s.value === skillToRemove.value)
    );
    updateResumeData("skills", updatedSkills);
  };

  // Add new category
  const handleAddCategory = () => {
    const cat = newCategory.trim();
    if (cat && !categories.includes(cat)) {
      setCategories([...categories, cat]);
      setSelectedCategory(cat);
    }
    setNewCategory("");
  };

  // Group skills for display
  const groupedSkills = {};
  (resumeData.skills || []).forEach((s) => {
    if (!groupedSkills[s.category]) groupedSkills[s.category] = [];
    groupedSkills[s.category].push(s.value);
  });

  return (
    <div className="space-y-6 bg-gradient-to-br from-gray-950 to-black">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Skills</h2>

      {/* Category Selector */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === cat
                ? "bg-blue-600 text-white shadow"
                : "bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Add New Category */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Add new category"
          className="flex-1 p-2 border rounded  dark:border-gray-600 dark:text-white"
        />
        <button
          onClick={handleAddCategory}
          className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-700 flex items-center gap-1"
        >
           Add
        </button>
      </div>

      {/* Skill Input */}
      <input
        type="text"
        value={currentSkill}
        onChange={(e) => setCurrentSkill(e.target.value)}
        onKeyDown={handleAddSkill}
        placeholder={`Add ${selectedCategory} skills (comma-separated)`}
        className="w-full p-3 border rounded  dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500"
      />

      {/* Skills Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(groupedSkills).map(([category, skillList]) => (
          <div
            key={category}
            className="p-4 border rounded-lg  dark:border-gray-600 shadow-sm"
          >
            <h3 className="font-semibold mb-2 text-gray-700 dark:text-gray-300 border-b pb-1">
              {category}
            </h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {skillList.map((skill, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-sm hover:scale-105 transition-transform"
                >
                  {skill}
                  <button
                    onClick={() => handleRemoveSkill({ category, value: skill })}
                  >
                    <FaTimes size={12} />
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
