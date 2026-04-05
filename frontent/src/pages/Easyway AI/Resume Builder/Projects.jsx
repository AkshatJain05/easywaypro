import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaTrash } from "react-icons/fa";

const Projects = ({ resumeData, updateResumeData }) => {
  //  Safe fallback
  const projects = resumeData?.projects || [];

  //  Add Project
  const handleAddProject = () => {
    const newProject = {
      id: Date.now() + Math.random(), // safer id
      name: "",
      technologies: "",
      link: "",
      points: [""], // better UX (auto one field)
    };

    updateResumeData("projects", [...projects, newProject]);
  };

  //  Remove Project
  const handleRemoveProject = (id) => {
    const updatedProjects = projects.filter((proj) => proj.id !== id);
    updateResumeData("projects", updatedProjects);
  };

  //  Handle Input Change
  const handleChange = (id, e) => {
    const { name, value } = e.target;

    const updatedProjects = projects.map((proj) =>
      proj.id === id ? { ...proj, [name]: value } : proj
    );

    updateResumeData("projects", updatedProjects);
  };

  //  Add Bullet Point
  const handleAddPoint = (projectId) => {
    const updatedProjects = projects.map((proj) =>
      proj.id === projectId
        ? { ...proj, points: [...(proj.points || []), ""] }
        : proj
    );

    updateResumeData("projects", updatedProjects);
  };

  //  Remove Bullet Point
  const handleRemovePoint = (projectId, index) => {
    const updatedProjects = projects.map((proj) =>
      proj.id === projectId
        ? {
            ...proj,
            points: (proj.points || []).filter((_, i) => i !== index),
          }
        : proj
    );

    updateResumeData("projects", updatedProjects);
  };

  //  Update Bullet Point
  const handlePointChange = (projectId, index, value) => {
    const updatedProjects = projects.map((proj) =>
      proj.id === projectId
        ? {
            ...proj,
            points: (proj.points || []).map((p, i) =>
              i === index ? value : p
            ),
          }
        : proj
    );

    updateResumeData("projects", updatedProjects);
  };

  return (
    <div className="space-y-6">
      {/* TITLE */}
      <h2 className="text-xl font-semibold bg-gradient-to-r from-indigo-500 to-blue-500 text-transparent bg-clip-text border-b border-gray-700 pb-2">
        Projects
      </h2>

      {/* PROJECT LIST */}
      <AnimatePresence>
        {projects.length === 0 && (
          <p className="text-gray-400 text-sm text-center">
            No projects added yet. Click "Add Project"
          </p>
        )}

        {projects.map((proj) => (
          <motion.div
            key={proj.id}
            layout
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -80 }}
            transition={{ duration: 0.3 }}
            className="p-4 sm:p-5 rounded-xl space-y-4 bg-gradient-to-br from-gray-950 to-black border border-gray-700 shadow-md relative"
          >
            {/* REMOVE BUTTON */}
            <button
              type="button"
              onClick={() => handleRemoveProject(proj.id)}
              className="absolute top-3 right-3 text-red-400 hover:text-red-600 transition"
            >
              <FaTrash />
            </button>

            {/* INPUTS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                name="name"
                placeholder="Project Name"
                value={proj.name}
                onChange={(e) => handleChange(proj.id, e)}
                className="md:col-span-2 w-full p-2.5 rounded-lg  border border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none text-white"
              />

              <input
                type="text"
                name="technologies"
                placeholder="Technologies (React, Node.js...)"
                value={proj.technologies}
                onChange={(e) => handleChange(proj.id, e)}
                className="w-full p-2.5 rounded-lg  border border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none text-white"
              />

              <input
                type="text"
                name="link"
                placeholder="Project Link"
                value={proj.link}
                onChange={(e) => handleChange(proj.id, e)}
                className="w-full p-2.5 rounded-lg  border border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none text-white"
              />
            </div>

            {/* POINTS */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-300">
                Project Highlights
              </h3>

              {(proj.points || []).map((point, index) => (
                <div
                  key={`${proj.id}-${index}`}
                  className="flex items-center gap-2"
                >
                  <span className="text-gray-500">•</span>

                  <input
                    type="text"
                    value={point}
                    onChange={(e) =>
                      handlePointChange(proj.id, index, e.target.value)
                    }
                    placeholder="Achievement / feature"
                    className="flex-1 p-2 rounded-lg  border border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none text-white"
                  />

                  <button
                    type="button"
                    onClick={() => handleRemovePoint(proj.id, index)}
                    className="text-red-400 hover:text-red-600 transition"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              ))}

              {/* ADD POINT */}
              <button
                type="button"
                onClick={() => handleAddPoint(proj.id)}
                className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition"
              >
                <FaPlus size={12} />
                Add Point
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* ADD PROJECT BUTTON */}
      <button
        type="button"
        onClick={handleAddProject}
        className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-md transition text-white font-medium"
      >
        <FaPlus />
        Add Project
      </button>
    </div>
  );
};

export default Projects;