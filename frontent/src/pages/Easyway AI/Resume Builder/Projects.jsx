import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaTrash } from "react-icons/fa";

const Projects = ({ resumeData, updateResumeData }) => {
  const handleAddProject = () => {
    const newProject = {
      id: Date.now(),
      name: "",
      technologies: "",
      link: "",
      points: [],
    };
    const updatedProjects = [...resumeData.projects, newProject];
    updateResumeData("projects", updatedProjects);
  };

  const handleRemoveProject = (id) => {
    const updatedProjects = resumeData.projects.filter((proj) => proj.id !== id);
    updateResumeData("projects", updatedProjects);
  };

  const handleChange = (id, e) => {
    const { name, value } = e.target;
    const updatedProjects = resumeData.projects.map((proj) =>
      proj.id === id ? { ...proj, [name]: value } : proj
    );
    updateResumeData("projects", updatedProjects);
  };

  const handleAddPoint = (projectId) => {
    const updatedProjects = resumeData.projects.map((proj) =>
      proj.id === projectId ? { ...proj, points: [...proj.points, ""] } : proj
    );
    updateResumeData("projects", updatedProjects);
  };

  const handleRemovePoint = (projectId, index) => {
    const updatedProjects = resumeData.projects.map((proj) =>
      proj.id === projectId
        ? { ...proj, points: proj.points.filter((_, i) => i !== index) }
        : proj
    );
    updateResumeData("projects", updatedProjects);
  };

  const handlePointChange = (projectId, index, value) => {
    const updatedProjects = resumeData.projects.map((proj) =>
      proj.id === projectId
        ? {
            ...proj,
            points: proj.points.map((p, i) => (i === index ? value : p)),
          }
        : proj
    );
    updateResumeData("projects", updatedProjects);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold bg-gradient-to-br from-gray-950 to-black text-gray-800 dark:text-white border-b pb-2 dark:border-gray-600">
        Projects
      </h2>
      <AnimatePresence>
        {resumeData.projects.map((proj) => (
          <motion.div
            key={proj.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100, transition: { duration: 0.3 } }}
            className="p-4  rounded-lg space-y-3 bg-gradient-to-br from-gray-950 to-black  relative border-1 border-gray-700"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Project Name"
                value={proj.name}
                onChange={(e) => handleChange(proj.id, e)}
                className="md:col-span-2 w-full p-2 border-1 rounded border-gray-700"
              />
              <input
                type="text"
                name="technologies"
                placeholder="Technologies Used (e.g., React, Node.js)"
                value={proj.technologies}
                onChange={(e) => handleChange(proj.id, e)}
                className="w-full p-2 border-1 rounded border-gray-700"
              />
              <input
                type="text"
                name="link"
                placeholder="Project Link (GitHub / Live Demo)"
                value={proj.link}
                onChange={(e) => handleChange(proj.id, e)}
                className="w-full p-2 border-1 rounded border-gray-700"
              />
            </div>

            {/* Bullet Points */}
            <div className="space-y-2">
              <h3 className="font-medium text-gray-700 dark:text-gray-300">Project Highlights</h3>
              {proj.points.map((point, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="text-gray-500">•</span>
                  <input
                    type="text"
                    value={point}
                    onChange={(e) => handlePointChange(proj.id, index, e.target.value)}
                    placeholder="Add a highlight / achievement"
                    className="flex-1 p-2 border rounded border-gray-700"
                  />
                  <button
                    onClick={() => handleRemovePoint(proj.id, index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => handleAddPoint(proj.id)}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
              >
                <FaPlus size={12} />
                <span>Add Point</span>
              </button>
            </div>

            <button
              onClick={() => handleRemoveProject(proj.id)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition-colors"
              aria-label="Remove project entry"
            >
              <FaTrash />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
      <button
        onClick={handleAddProject}
        className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
      >
        <FaPlus />
        <span>Add Project</span>
      </button>
    </div>
  );
};

export default Projects;
