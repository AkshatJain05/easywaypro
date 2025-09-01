import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaTrash } from "react-icons/fa";

const Experience = ({ resumeData, updateResumeData }) => {
  const handleAddExperience = () => {
    const newExp = {
      id: Date.now(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
    };
    updateResumeData("experience", [...resumeData.experience, newExp]);
  };

  const handleRemoveExperience = (id) => {
    updateResumeData(
      "experience",
      resumeData.experience.filter((exp) => exp.id !== id)
    );
  };

  const handleChange = (id, e) => {
    const { name, value } = e.target;
    updateResumeData(
      "experience",
      resumeData.experience.map((exp) =>
        exp.id === id ? { ...exp, [name]: value } : exp
      )
    );
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl  font-semibold text-gray-800 dark:text-white border-b pb-2 dark:border-gray-600">
        Work Experience
      </h2>

      <AnimatePresence>
        {resumeData.experience.map((exp) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100, transition: { duration: 0.3 } }}
            className="p-4 border rounded-lg space-y-3 bg-gradient-to-br from-gray-950 to-black dark:border-gray-600 relative"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="company"
                placeholder="Company Name"
                value={exp.company}
                onChange={(e) => handleChange(exp.id, e)}
                className="w-full p-2 border rounded  dark:border-gray-600 dark:text-white"
              />
              <input
                type="text"
                name="position"
                placeholder="Position / Role"
                value={exp.position}
                onChange={(e) => handleChange(exp.id, e)}
                className="w-full p-2 border rounded  dark:border-gray-600 dark:text-white"
              />
              <input
                type="text"
                name="startDate"
                placeholder="Start Date (e.g., Jan 2022)"
                value={exp.startDate}
                onChange={(e) => handleChange(exp.id, e)}
                className="w-full p-2 border rounded  dark:border-gray-600 dark:text-white"
              />
              <input
                type="text"
                name="endDate"
                placeholder="End Date (e.g., Dec 2023 / Present)"
                value={exp.endDate}
                onChange={(e) => handleChange(exp.id, e)}
                className="w-full p-2 border rounded  dark:border-gray-600 dark:text-white"
              />
              <textarea
                name="description"
                placeholder="Description of your role and achievements"
                rows="3"
                value={exp.description}
                onChange={(e) => handleChange(exp.id, e)}
                className="md:col-span-2 w-full p-2 border rounded dark:border-gray-600 dark:text-white"
              />
            </div>

            <button
              onClick={() => handleRemoveExperience(exp.id)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition-colors"
              aria-label="Remove experience entry"
            >
              <FaTrash />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      <button
        onClick={handleAddExperience}
        className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
      >
        <FaPlus />
        <span>Add Experience</span>
      </button>
    </div>
  );
};

export default Experience;
