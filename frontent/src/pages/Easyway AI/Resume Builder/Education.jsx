import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaTrash } from 'react-icons/fa';

const Education = ({ resumeData, setResumeData }) => {
  const handleAddEducation = () => {
    setResumeData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: Date.now(),
          school: '',
          degree: '',
          startDate: '',
          endDate: '',
          marks: '', // Marks field is present
        },
      ],
    }));
  };

  const handleRemoveEducation = (id) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }));
  };

  const handleChange = (id, e) => {
    const { name, value } = e.target;
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.map((edu) =>
        edu.id === id ? { ...edu, [name]: value } : edu
      ),
    }));
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white border-b pb-2 dark:border-gray-600">
        Education
      </h2>
      <AnimatePresence>
        {resumeData.education.map((edu) => (
          <motion.div
            key={edu.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100, transition: { duration: 0.3 } }}
            className="p-4 border rounded-lg space-y-3 bg-gray-50 dark:bg-gray-700/50 dark:border-gray-600 relative"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="school"
                placeholder="School/University"
                value={edu.school}
                onChange={(e) => handleChange(edu.id, e)}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <input
                type="text"
                name="degree"
                placeholder="Degree/Certificate"
                value={edu.degree}
                onChange={(e) => handleChange(edu.id, e)}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <input
                type="text"
                name="startDate"
                placeholder="Start Date (e.g., Sept 2020)"
                value={edu.startDate}
                onChange={(e) => handleChange(edu.id, e)}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <input
                type="text"
                name="endDate"
                placeholder="End Date (e.g., May 2024)"
                value={edu.endDate}
                onChange={(e) => handleChange(edu.id, e)}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              {/* This is the Marks/GPA input. There is no Location input. */}
              <input
                type="text"
                name="marks"
                placeholder="Marks/GPA (e.g., CGPA: 8.5/10)"
                value={edu.marks}
                onChange={(e) => handleChange(edu.id, e)}
                className="md:col-span-2 w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <button
              onClick={() => handleRemoveEducation(edu.id)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition-colors"
              aria-label="Remove education entry"
            >
              <FaTrash />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
      <button
        onClick={handleAddEducation}
        className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
      >
        <FaPlus />
        <span>Add Education</span>
      </button>
    </div>
  );
};

export default Education;