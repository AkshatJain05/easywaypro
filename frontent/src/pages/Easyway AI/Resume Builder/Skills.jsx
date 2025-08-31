import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FaTimes, FaPlus } from "react-icons/fa";

const Skills = ({ resumeData, setResumeData }) => {
  const [currentSkill, setCurrentSkill] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Programming");
  const [newCategory, setNewCategory] = useState("");

  // Default IT-focused categories
  const [categories, setCategories] = useState([
    "Programming Language",
    "Frameworks & Libraries",
    "Databases",
    "DevOps & Tools",
    "Soft Skills",
  ]);

  const handleAddSkill = (e) => {
    if ((e.key === "Enter" || e.key === ",") && currentSkill.trim() !== "") {
      e.preventDefault();
      const skillText = currentSkill.trim();

      // Prevent duplicates across all categories
      const alreadyExists = Object.values(resumeData.skills).some((arr) =>
        arr.includes(skillText)
      );
      if (!alreadyExists) {
        setResumeData((prev) => ({
          ...prev,
          skills: {
            ...prev.skills,
            [selectedCategory]: [
              ...(prev.skills[selectedCategory] || []),
              skillText,
            ],
          },
        }));
      }
      setCurrentSkill("");
    }
  };

  const handleRemoveSkill = (category, skillToRemove) => {
    setResumeData((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: prev.skills[category].filter(
          (skill) => skill !== skillToRemove
        ),
      },
    }));
  };

  // Add new category
  const handleAddCategory = () => {
    const cat = newCategory.trim();
    if (cat && !categories.includes(cat)) {
      setCategories((prev) => [...prev, cat]);
      setResumeData((prev) => ({
        ...prev,
        skills: {
          ...prev.skills,
          [cat]: [],
        },
      }));
      setSelectedCategory(cat);
    }
    setNewCategory("");
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
        Skills
      </h2>

      <div className="p-4 border rounded-lg dark:border-gray-600 space-y-4 bg-gray-50 dark:bg-gray-800/40">
        {/* Category Selector */}
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white shadow"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Add New Category */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Add new category (e.g. Cloud, Security)"
            className="flex-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <button
            onClick={handleAddCategory}
            className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            <FaPlus />
          </button>
        </div>

        {/* Skills Display */}
        {categories.map(
          (cat) =>
            resumeData.skills[cat]?.length > 0 && (
              <div key={cat}>
                <h3 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300 border-b border-gray-300 dark:border-gray-600 pb-1">
                  {cat}
                </h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  <AnimatePresence>
                    {resumeData.skills[cat].map((skill) => (
                      <motion.div
                        key={skill}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="flex items-center bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 rounded-full px-3 py-1 text-sm font-medium shadow-sm"
                      >
                        <span>{skill}</span>
                        <button
                          onClick={() => handleRemoveSkill(cat, skill)}
                          className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                          aria-label={`Remove ${skill}`}
                        >
                          <FaTimes size={12} />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )
        )}

        {/* Input for adding skill */}
        <input
          type="text"
          value={currentSkill}
          onChange={(e) => setCurrentSkill(e.target.value)}
          onKeyDown={handleAddSkill}
          placeholder={`Add a ${selectedCategory} skill and press Enter`}
          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};

export default Skills;
