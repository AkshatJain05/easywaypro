import { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus, FaTrash, FaCheckCircle, FaRegCircle, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Loading from "../../component/Loading";
import { motion, AnimatePresence } from "framer-motion";

export default function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  // Fetch tasks
  useEffect(() => {
    axios.get(`${API_URL}/tasks`).then((res) => {
      setTasks(res.data);
      setLoading(false);
    });
  }, []);

  // Add Task
  const addTask = async () => {
    if (!input.trim()) return;
    const res = await axios.post(`${API_URL}/tasks`, { text: input });
    setTasks([...tasks, res.data]);
    setInput("");
  };

  // Toggle Task
  const toggleTask = async (id) => {
    const res = await axios.put(`${API_URL}/tasks/${id}`);
    setTasks(tasks.map((t) => (t._id === id ? res.data : t)));
  };

  // Delete Task
  const deleteTask = async (id) => {
    await axios.delete(`${API_URL}/tasks/${id}`);
    setTasks(tasks.filter((t) => t._id !== id));
  };

  if (loading) return <Loading />;

  return (
    <>
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 px-3 py-2 m-2
                   bg-gray-800 hover:bg-gray-700 text-gray-200 
                   rounded-lg text-sm shadow-md transition-all transform hover:-translate-y-0.5"
      >
        <FaArrowLeft className="text-sm" />
        <span>Back</span>
      </button>

      <div className="min-h-screen flex items-start justify-center p-4 md:p-6">
        <div className="w-full max-w-2xl bg-gradient-to-br from-slate-900 to-black border border-gray-700 backdrop-blur-xl rounded-2xl shadow-2xl p-6 text-gray-100">
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-2">Todo List</h1>
          <p className="p-2 text-sm md:text-base flex justify-center mb-6 text-center text-gray-400">
            Make learning simple with Easyway – organize your daily study tasks in one place.
          </p>

          {/* Input */}
          <div className="flex flex-col sm:flex-row gap-2 mb-6">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1 px-4 py-2 rounded-xl bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
            />
            <button
              onClick={addTask}
              className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl flex items-center justify-center transition-transform transform hover:scale-105"
            >
              <FaPlus />
            </button>
          </div>

          {/* Task List */}
          {tasks.length === 0 ? (
            <p className="text-center text-gray-400">No tasks found</p>
          ) : (
            <ul className="space-y-3">
              <AnimatePresence>
                {tasks.map((task) => (
                  <motion.li
                    key={task._id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    layout
                    className="flex items-center justify-between bg-gray-800/50 p-3 rounded-xl shadow-md hover:bg-gray-700 transition-colors"
                  >
                    <div
                      className="flex items-center gap-3 cursor-pointer select-none"
                      onClick={() => toggleTask(task._id)}
                    >
                      {task.completed ? (
                        <FaCheckCircle className="text-green-400 transition-transform transform hover:scale-110" />
                      ) : (
                        <FaRegCircle className="text-gray-400 transition-transform transform hover:scale-110" />
                      )}
                      <span
                        className={`transition-all duration-300 ${
                          task.completed ? "line-through text-gray-400" : "text-gray-100"
                        }`}
                      >
                        {task.text}
                      </span>
                    </div>
                    <button
                      onClick={() => deleteTask(task._id)}
                      className="text-red-400 hover:text-red-600 transition-colors transform hover:scale-110"
                    >
                      <FaTrash />
                    </button>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
