import { useEffect, useState, useCallback, useRef } from "react";
import { FiCalendar, FiClock } from "react-icons/fi";
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
            ? "bg-green-900/15 border border-green-700/50 hover:bg-green-800/20"
            : "bg-gray-800/20 border border-gray-700 hover:bg-gray-800/50"
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
              className={`text-base break-words pl-1 whitespace-pre-wrap ${
                isCompleted
                  ? "text-green-100 font-light"
                  : "text-gray-100 font-medium"
              }`}
              style={{ wordBreak: "break-word" }}
            >
              {task.text}
            </p>
            {(task.date || task.time) && (
              <p
                className={`flex items-center gap-3 text-xs mt-2 px-2 py-1  rounded-lg w-fit backdrop-blur-sm
    ${
      isCompleted
        ? "text-green-200/80 bg-green-500/10"
        : "text-gray-200 bg-white/5 hover:bg-white/10"
    }
    transition-all duration-200`}
              >
                {task.date && (
                  <span className="flex text-xs items-center gap-1">
                    <FiCalendar size={11} />
                    {task.date}
                  </span>
                )}

                {task.date && task.time && (
                  <span className="w-[1px] h-3 bg-gray-500/30" />
                )}

                {task.time && (
                  <span className="flex text-xs items-center gap-1">
                    <FiClock size={11} />
                    {task.time}
                  </span>
                )}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-1 sm:gap-2 flex-shrink-0 ml-auto">
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

  return (
    <motion.li
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="py-4 rounded-2xl bg-gray-900/40 border border-indigo-500/50 space-y-3 shadow-lg backdrop-blur-md"
    >
      <input
        type="text"
        value={editText}
        onChange={(e) => setEditText(e.target.value)}
        className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-600 text-gray-100 focus:ring-2 focus:ring-indigo-500"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input
          type="date"
          value={editDate}
          onChange={(e) => setEditDate(e.target.value)}
          className="px-3 py-2 rounded-lg bg-gray-900 placeholder-gray-400 border border-gray-600 text-gray-300 focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="time"
          value={editTime}
          onChange={(e) => setEditTime(e.target.value)}
          className="px-3 py-2 rounded-lg bg-gray-900 border placeholder-gray-400 border-gray-600 text-gray-300 focus:ring-2 focus:ring-indigo-500"
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
  const [loadingTask, setLoadingTask] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  // Track tasks that have already fired a notification during this session
  const notifiedTasks = useRef(new Set());

  // --- Notification System ---
  useEffect(() => {
    // Request permission on mount
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    const checkReminders = setInterval(() => {
      const now = new Date();
      const currentLocalTime = now.toTimeString().slice(0, 5); // "HH:MM"
      const currentLocalDate = now.toISOString().split("T")[0]; // "YYYY-MM-DD"

      tasks.forEach((task) => {
        if (
          !task.completed &&
          task.date === currentLocalDate &&
          task.time === currentLocalTime
        ) {
          if (!notifiedTasks.current.has(task._id)) {
            // Browser Notification
            if (Notification.permission === "granted") {
              new Notification("Task Reminder", {
                body: task.text,
                icon: "/favicon.ico", // Replace with your logo path
              });
            }
            // In-app Toast
            toast(task.text, { icon: "🔔", duration: 6000 });
            notifiedTasks.current.add(task._id);
          }
        }
      });
    }, 30000); // Check every 30 seconds

    return () => clearInterval(checkReminders);
  }, [tasks]);

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
        { withCredentials: true },
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
              toast("Cancelled", { icon: "🛑" });
            }}
            className="px-3 py-1.5 text-sm bg-gray-700 rounded-lg hover:bg-gray-600 transition"
          >
            No
          </button>

          <button
            onClick={async () => {
              toast.dismiss(t.id);
              const loadingToast = toast.loading("Clearing...");
              try {
                const { data } = await axios.delete(`${API_URL}/tasks/clear`, {
                  withCredentials: true,
                });
                await fetchTasks();
                toast.dismiss(loadingToast);
                toast.success(data.message || "Cleared!");
              } catch (error) {
                toast.dismiss(loadingToast);
                toast.error("Failed to clear.");
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
        { withCredentials: true },
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
        { withCredentials: true },
      );
      setTasks(tasks.map((t) => (t._id === id ? res.data : t)));
      // Reset notification tracking for this task if it was edited
      notifiedTasks.current.delete(id);
    } catch {
      toast.error("Error editing task");
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/tasks/${id}`, { withCredentials: true });
      setTasks(tasks.filter((t) => t._id !== id));
      notifiedTasks.current.delete(id);
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

      <div className="min-h-screen p-0 sm:pt-16 sm:p-4">
        <div className="max-w-4xl mx-auto bg-gray-950 border border-gray-800 sm:rounded-2xl shadow-2xl p-5 sm:p-8 text-gray-100">
          <h1 className="text-3xl sm:text-4xl font-bold text-center mb-3 tracking-tight">
            <span className="inline-flex items-center gap-2">
              📋
              <span className="bg-gradient-to-r from-sky-300 via-indigo-200 to-purple-400 bg-clip-text text-transparent">
                Task Planner
              </span>
            </span>
            <div className="mt-2 mx-auto w-20 h-[2px] bg-gradient-to-r from-sky-400 to-purple-400 rounded-full" />
          </h1>

          <p className="text-center mb-7 text-gray-200 px-5 text-sm">
            Plan your day, track your goals, and stay productive.
          </p>

          {/* Progress Section */}
          <motion.div
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-950 to-black border border-gray-700 p-6 mb-10 shadow-[0_0_25px_rgba(99,102,241,0.3)]"
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
                  <p className="text-3xl font-bold text-indigo-100">
                    {progress}%
                  </p>
                  <p className="text-xs text-gray-200 mt-1">Complete</p>
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl md:text-2xl font-semibold text-cyan-200 mb-2">
                  Your Productivity Progress
                </h3>
                <p className="text-gray-200 text-sm mb-4">
                  {completedTasks.length} of {tasks.length} tasks completed 🎯
                </p>
                <p className="text-sm text-gray-300 italic">
                  {progress === 100
                    ? "🌟 Excellent! You’ve conquered all your goals!"
                    : progress >= 50
                      ? "🔥 You’re over halfway there!"
                      : "🚀 Let’s crush more tasks!"}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Input Section - Responsive Fixes */}
          <div className="bg-gray-950 p-4 rounded-xl border border-gray-700 mb-8 shadow-lg">
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Add a task..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-gray-950 border border-gray-700 text-gray-200 focus:ring-2 focus:ring-indigo-500 text-sm"
              />
              <div className="flex flex-wrap md:flex-nowrap gap-3 items-center">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="flex-1 min-w-[120px] px-2 py-2.5 rounded-lg bg-gray-950 border border-gray-700 text-gray-200 focus:ring-2 focus:ring-indigo-500 text-sm"
                />
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="flex-1 min-w-[100px] px-2 py-2.5 rounded-lg bg-gray-950 border border-gray-700 text-gray-200 focus:ring-2 focus:ring-indigo-500 text-sm"
                />
                <div className="flex gap-2 w-full md:w-auto">
                  <motion.button
                    onClick={addTask}
                    className="flex-1 md:flex-none flex items-center justify-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-2.5 text-sm font-semibold"
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
                    className="flex-1 md:flex-none flex items-center justify-center gap-1 bg-gray-950 hover:bg-gray-700 text-gray-300 rounded-lg px-4 py-2.5 text-sm font-semibold border border-gray-700"
                    whileHover={{ scale: 1.05 }}
                  >
                    <FaRedo /> Clear
                  </motion.button>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Tasks */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-cyan-300 mb-3">
              ⏳ Pending ({activeTasks.length})
            </h2>
            {activeTasks.length === 0 ? (
              <p className="text-gray-200 text-center py-6">
                🎉 All caught up!
              </p>
            ) : (
              <ul className="space-y-3">
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

          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <section className="mt-10">
              <h2 className="text-xl sm:text-2xl font-bold text-green-300 mb-3">
                ✅ Completed ({completedTasks.length})
              </h2>
              <ul className="space-y-3">
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
