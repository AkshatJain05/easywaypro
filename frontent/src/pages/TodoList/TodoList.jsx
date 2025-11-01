import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  FaTrash,
  FaArrowLeft,
  FaCheckCircle,
  FaRegCircle,
  FaPlus,
  FaRedo,
  FaEdit,
  FaSave,
  FaSpinner,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import Loading from "../../component/Loading";

// ===================== Task Item Component =====================
const TaskItem = ({ task, toggleTask, deleteTask, editTask, loadingTask }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const [editDate, setEditDate] = useState(task.date || "");
  const [editTime, setEditTime] = useState(task.time || "");

  const isCompleted = task.completed;

  const handleSave = () => {
    if (!editText.trim())
      return toast.error("Task description cannot be empty!");
    editTask(task._id, editText, editDate, editTime);
    setIsEditing(false);
  };

  if (!isEditing)
    return (
      <motion.li
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.3 }}
        className={`flex flex-wrap sm:flex-nowrap justify-between items-start gap-4 p-4 rounded-2xl shadow-lg backdrop-blur-md ${
          isCompleted
            ? "bg-green-800/15 border border-green-700/50 hover:bg-green-800/30"
            : "bg-gray-800/20 border border-gray-700 hover:bg-gray-700/50"
        }`}
      >
        <div
          className="flex items-start sm:items-center gap-3 flex-grow cursor-pointer min-w-0"
          onClick={() => toggleTask(task._id)}
        >
          {loadingTask === task._id ? (
            <FaSpinner
              className="animate-spin text-indigo-400 flex-shrink-0 mt-1 sm:mt-0"
              size={20}
            />
          ) : isCompleted ? (
            <FaCheckCircle
              className="text-green-400 flex-shrink-0 mt-1 sm:mt-0"
              size={20}
            />
          ) : (
            <FaRegCircle
              className="text-indigo-400 flex-shrink-0 mt-1 sm:mt-0"
              size={20}
            />
          )}
          <div className="min-w-0">
            <p
              className={`text-base break-words whitespace-pre-wrap ${
                isCompleted
                  ? "text-green-200 font-light"
                  : "text-gray-200 font-medium"
              }`}
              style={{ wordBreak: "break-word" }}
            >
              {task.text}
            </p>
            {(task.date || task.time) && (
              <p
                className={`text-xs mt-1 ${
                  isCompleted ? "text-green-400/80" : "text-gray-400"
                }`}
              >
                {task.date && `📅 ${task.date}`}{" "}
                {task.time && `🕒 ${task.time}`}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-1 sm:gap-2 flex-shrink-0">
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              if (!isCompleted) setIsEditing(true);
            }}
            className={`p-1 rounded-full hover:bg-white/10 transition ${
              isCompleted
                ? "text-gray-600 cursor-not-allowed"
                : "text-indigo-400 hover:text-indigo-300"
            }`}
            whileHover={!isCompleted ? { scale: 1.1 } : {}}
          >
            <FaEdit size={16} />
          </motion.button>

          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              deleteTask(task._id);
            }}
            className="p-1 rounded-full hover:bg-white/10 text-red-500 hover:text-red-400 transition"
            whileHover={{ scale: 1.1 }}
          >
            <FaTrash size={16} />
          </motion.button>
        </div>
      </motion.li>
    );

  // --- Edit Mode ---
  return (
    <motion.li
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="p-4 rounded-2xl bg-gray-900/80 border border-indigo-500/50 space-y-3 shadow-lg backdrop-blur-md"
    >
      <input
        type="text"
        value={editText}
        onChange={(e) => setEditText(e.target.value)}
        className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-gray-100 focus:ring-2 focus:ring-indigo-500"
      />

      <div className="grid grid-cols-2 gap-3">
        <input
          type="date"
          value={editDate}
          onChange={(e) => setEditDate(e.target.value)}
          className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-gray-300 focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="time"
          value={editTime}
          onChange={(e) => setEditTime(e.target.value)}
          className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-gray-300 focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="flex justify-end gap-3">
        <motion.button
          onClick={handleSave}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2 text-sm"
          whileHover={{ scale: 1.05 }}
        >
          <FaSave /> Save
        </motion.button>
        <motion.button
          onClick={() => setIsEditing(false)}
          className="bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg px-4 py-2 text-sm"
          whileHover={{ scale: 1.05 }}
        >
          Cancel
        </motion.button>
      </div>
    </motion.li>
  );
};

// ===================== Main Todo Component =====================
export default function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingTask, setLoadingTask] = useState(null); // Track loading state for individual tasks
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/tasks`, {
        withCredentials: true,
      });
      setTasks(res.data);
    } catch {
      toast.error("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  const resetInputFields = useCallback(() => {
    setInput("");
    setDate("");
    setTime("");
  }, []);

  const addTask = async () => {
    if (!input.trim()) return toast.error("Please enter a task!");
    setLoadingTask("adding");
    try {
      const res = await axios.post(
        `${API_URL}/tasks`,
        { text: input, date, time },
        { withCredentials: true }
      );
      setTasks([...tasks, res.data]);
      resetInputFields();
      toast.success("Task added!");
    } catch {
      toast.error("Error adding task");
    } finally {
      setLoadingTask(null);
    }
  };

  const handleClearAll = () => {
    toast.custom((t) => (
      <div className="bg-gray-900 text-white px-6 py-4 rounded-xl shadow-2xl border border-gray-700 flex flex-col gap-3 animate-fade-in">
        <p className="text-sm font-medium">
          Are you sure you want to clear{" "}
          <span className="text-red-400 font-semibold">all tasks</span>?
        </p>
        <div className="flex justify-end gap-3 mt-1">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              toast("Cancelled — your tasks are safe ", { icon: "🛑" });
            }}
            className="px-3 py-1.5 text-sm bg-gray-700 rounded-lg hover:bg-gray-600 transition"
          >
            No
          </button>

          <button
            onClick={async () => {
              toast.dismiss(t.id);
              const loadingToast = toast.loading("Clearing all tasks... ");

              try {
                const { data } = await axios.delete(`${API_URL}/tasks/clear`, {
                  withCredentials: true,
                });

                await fetchTasks(); // refresh after clearing
                toast.dismiss(loadingToast);
                toast.success(
                  data.message || "✅ All tasks cleared successfully!"
                );
              } catch (error) {
                console.error("Error clearing tasks:", error);
                toast.dismiss(loadingToast);
                toast.error(
                  error.response?.data?.error ||
                    "Failed to clear tasks. Please try again."
                );
              }
            }}
            className="px-3 py-1.5 text-sm bg-red-600 rounded-lg hover:bg-red-500 transition font-medium"
          >
            Yes, Clear All
          </button>
        </div>
      </div>
    ));
  };

  const toggleTask = async (id) => {
    setLoadingTask(id);
    try {
      const res = await axios.put(
        `${API_URL}/tasks/${id}/toggle`,
        {},
        { withCredentials: true }
      );
      setTasks(tasks.map((t) => (t._id === id ? res.data : t)));
    } catch {
      toast.error("Error updating task");
    } finally {
      setLoadingTask(null);
    }
  };

  const editTask = async (id, text, date, time) => {
    try {
      const res = await axios.put(
        `${API_URL}/tasks/${id}/edit`,
        { text, date, time },
        { withCredentials: true }
      );
      setTasks(tasks.map((t) => (t._id === id ? res.data : t)));
    } catch {
      toast.error("Error editing task");
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/tasks/${id}`, { withCredentials: true });
      setTasks(tasks.filter((t) => t._id !== id));
    } catch {
      toast.error("Error deleting task");
    }
  };

  if (loading) return <Loading />;

  const activeTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);
  const progress =
    tasks.length > 0
      ? Math.round((completedTasks.length / tasks.length) * 100)
      : 0;

  return (
    <>
      <Toaster position="top-center" />
      <motion.button
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 z-20 flex items-center gap-2 px-3 py-2 bg-indigo-700 text-white rounded-full text-xs sm:text-sm shadow-lg hover:bg-indigo-600"
        whileHover={{ scale: 1.05 }}
      >
        <FaArrowLeft /> Back
      </motion.button>

      <div className="min-h-screen p-4 pt-16 sm:p-8">
        <div className="max-w-3xl mx-auto bg-gray-950 border border-gray-800 rounded-3xl shadow-2xl p-5 sm:p-8 text-gray-100">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-indigo-400 mb-2 tracking-wide">
            📋 Task Planner
          </h1>
          <p className="text-center mb-7 text-gray-400 px-5 text-sm">
            Plan your day, track your goals, and stay productive.
          </p>

          {/* Progress Section */}
          <motion.div
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-800 via-gray-900 to-black border border-gray-700 p-6 mb-10 shadow-[0_0_25px_rgba(99,102,241,0.3)]"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/20 via-purple-600/10 to-transparent blur-3xl opacity-40" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center justify-center relative">
                <svg className="w-28 h-28 transform -rotate-90">
                  <circle
                    cx="56"
                    cy="56"
                    r="50"
                    stroke="rgba(75,85,99,0.4)"
                    strokeWidth="8"
                    fill="none"
                  />
                  <motion.circle
                    cx="56"
                    cy="56"
                    r="50"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: 314, strokeDashoffset: 314 }}
                    animate={{ strokeDashoffset: 314 - (314 * progress) / 100 }}
                    transition={{ duration: 1 }}
                  />
                  <defs>
                    <linearGradient
                      id="gradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#6366F1" />
                      <stop offset="100%" stopColor="#A855F7" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute text-center">
                  <p className="text-3xl font-bold text-indigo-400">
                    {progress}%
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Complete</p>
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl md:text-2xl font-semibold text-indigo-300 mb-2">
                  Your Productivity Progress
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  {completedTasks.length} of {tasks.length} tasks completed 🎯
                </p>

                <div className="md:hidden mb-3">
                  <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                    <motion.div
                      className="h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                </div>

                <p className="text-sm text-gray-500 italic">
                  {progress === 100
                    ? "🌟 Excellent! You’ve conquered all your goals today!"
                    : progress >= 50
                    ? "🔥 You’re over halfway there—keep up the great work!"
                    : "🚀 Let’s crush more tasks and boost your streak!"}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Input Section */}
          <div className="bg-gray-900/20 p-4 rounded-xl border border-gray-700 mb-8 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <input
                type="text"
                placeholder="Add a task..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-grow px-3 py-2.5 rounded-lg bg-gray-900 border border-gray-700 text-gray-100 focus:ring-2 focus:ring-indigo-500 text-sm"
              />
              <div className="flex gap-3 sm:gap-2 sm:w-auto w-full">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="flex-1 sm:flex-none px-2 py-2.5 rounded-lg bg-gray-900 border border-gray-700 text-gray-300 focus:ring-2 focus:ring-indigo-500 text-sm"
                />
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="flex-1 sm:flex-none px-2 py-2.5 rounded-lg bg-gray-900 border border-gray-700 text-gray-300 focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
              <motion.button
                onClick={addTask}
                className="flex items-center justify-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-2 text-sm font-semibold"
                whileHover={{ scale: 1.05 }}
                disabled={loadingTask === "adding"}
              >
                {loadingTask === "adding" ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <>
                    <FaPlus /> Add
                  </>
                )}
              </motion.button>
              <motion.button
                onClick={handleClearAll}
                className="flex items-center justify-center gap-1 bg-gray-900 hover:bg-gray-600 text-gray-300 rounded-lg px-4 py-2 text-sm font-semibold"
                whileHover={{ scale: 1.05 }}
              >
                <FaRedo /> Clear All
              </motion.button>
            </div>
          </div>

          {/* Task Lists */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-indigo-300 mb-3">
              ⏳ Pending Tasks ({activeTasks.length})
            </h2>
            {activeTasks.length === 0 ? (
              <p className="text-gray-500 text-center py-6">
                🎉 All caught up!
              </p>
            ) : (
              <ul className="space-y-3 text-justify">
                <AnimatePresence>
                  {activeTasks.map((task) => (
                    <TaskItem
                      key={task._id}
                      task={task}
                      toggleTask={toggleTask}
                      deleteTask={deleteTask}
                      editTask={editTask}
                      loadingTask={loadingTask}
                    />
                  ))}
                </AnimatePresence>
              </ul>
            )}
          </section>

          {completedTasks.length > 0 && (
            <section className="mt-10">
              <h2 className="text-xl sm:text-2xl font-bold text-green-300 mb-3">
                ✅ Completed ({completedTasks.length})
              </h2>
              <ul className="space-y-3 text-justify">
                <AnimatePresence>
                  {completedTasks.map((task) => (
                    <TaskItem
                      key={task._id}
                      task={task}
                      toggleTask={toggleTask}
                      deleteTask={deleteTask}
                      editTask={editTask}
                      loadingTask={loadingTask}
                    />
                  ))}
                </AnimatePresence>
              </ul>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
