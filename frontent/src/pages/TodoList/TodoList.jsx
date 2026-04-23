import { useEffect, useState, useCallback, useMemo } from "react";
import {
  FiCalendar,
  FiClock,
  FiPlus,
  FiTrash2,
  FiCheck,
  FiActivity,
  FiBell,
  FiSun,
  FiMoon,
  FiCoffee,
  FiCheckCircle,
  FiTarget,
  FiZap,
  FiBox,
  FiGrid,
  FiTrash,
  FiX,
  FiAward,
  FiEdit3,
  FiMap,
  FiChevronLeft,
  FiChevronRight,
  FiSave,
} from "react-icons/fi";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import Loading from "../../component/Loading";

// ─── Constants ────────────────────────────────────────────────────────────────
const PAGE_SIZE = 6;
const INDIGO = "#6366f1";
const AMBER = "#f59e0b";
const EMERALD = "#10b981";
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// ─── Real weekly data ─────────────────────────────────────────────────────────
// Reads task.date (YYYY-MM-DD) and buckets into current Sun–Sat week
function buildWeeklyData(tasks) {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay()); // rewind to Sunday
  weekStart.setHours(0, 0, 0, 0);

  // dayIndex 0=Sun … 6=Sat
  const map = Array.from({ length: 7 }, () => ({ added: 0, completed: 0 }));

  tasks.forEach((t) => {
    if (!t.date) return;
    // Parse YYYY-MM-DD without timezone shift
    const [y, m, d] = t.date.split("-").map(Number);
    const taskDate = new Date(y, m - 1, d);
    const diffMs = taskDate - weekStart;
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffDays < 0 || diffDays > 6) return; // outside this week
    const dayIdx = taskDate.getDay();
    map[dayIdx].added += 1;
    if (t.completed) map[dayIdx].completed += 1;
  });

  return DAY_NAMES.map((name, i) => ({
    day: name,
    added: map[i].added,
    completed: map[i].completed,
  }));
}

// ─── Radial Progress ──────────────────────────────────────────────────────────
const RadialProgress = ({ value = 0, color = INDIGO, size = 90 }) => {
  const r = 36,
    cx = 48,
    cy = 48;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <svg width={size} height={size} viewBox="0 0 96 96" className="shrink-0">
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.04)"
        strokeWidth="7"
      />
      <motion.circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.4, ease: "easeOut" }}
        style={{ transformOrigin: "center", transform: "rotate(-90deg)" }}
      />
      <text
        x="48"
        y="45"
        textAnchor="middle"
        fill="white"
        fontSize="16"
        fontWeight="700"
      >
        {value}
      </text>
      <text
        x="48"
        y="58"
        textAnchor="middle"
        fill="rgba(255,255,255,0.28)"
        fontSize="9"
      >
        %
      </text>
    </svg>
  );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ icon, label, value, accent }) => (
  <div className="bg-[#111120] border border-white/[0.06] rounded-2xl p-4 flex items-center gap-3 hover:border-white/10 transition-all min-w-0">
    <div
      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${accent}`}
    >
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-xl font-black text-white leading-none">{value}</p>
      <p className="text-[9px] font-bold uppercase tracking-widest text-white/25 mt-0.5 truncate">
        {label}
      </p>
    </div>
  </div>
);

// ─── Chart Tooltip ────────────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1a1a2e] border border-white/10 rounded-xl px-3 py-2 text-xs shadow-xl">
      <p className="text-white/40 mb-1 font-bold">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-bold">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

// ─── Pagination ───────────────────────────────────────────────────────────────
const Pagination = ({ page, total, pageSize, onChange }) => {
  const pages = Math.ceil(total / pageSize);
  if (pages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-1.5 mt-5 flex-wrap">
      <button
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.06] disabled:opacity-25 hover:bg-white/[0.08] transition"
      >
        <FiChevronLeft size={13} />
      </button>
      {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          onClick={() => onChange(n)}
          className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
            page === n
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
              : "bg-white/[0.04] text-white/30 hover:text-white border border-white/[0.05] hover:bg-white/[0.08]"
          }`}
        >
          {n}
        </button>
      ))}
      <button
        disabled={page === pages}
        onClick={() => onChange(page + 1)}
        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.06] disabled:opacity-25 hover:bg-white/[0.08] transition"
      >
        <FiChevronRight size={13} />
      </button>
    </div>
  );
};

// ─── Task Form Modal ──────────────────────────────────────────────────────────
const TaskFormModal = ({ onClose, onSubmit, initial = null }) => {
  const [text, setText] = useState(initial?.text || "");
  const [date, setDate] = useState(initial?.date || "");
  const [time, setTime] = useState(initial?.time || "");
  const isEdit = !!initial;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return toast.error("Objective required");
    onSubmit({ text, date, time });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      <motion.div
        initial={{ y: 32, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 32, opacity: 0 }}
        transition={{ type: "spring", damping: 26, stiffness: 300 }}
        className="fixed inset-x-0 bottom-0 sm:inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-6 sm:pb-0"
      >
        <div className="bg-[#0f0f1e] border border-white/[0.08] rounded-t-3xl sm:rounded-3xl p-6 w-full max-w-md shadow-2xl">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              {isEdit ? (
                <FiEdit3 className="text-indigo-400" size={14} />
              ) : (
                <FiPlus className="text-indigo-400" size={14} />
              )}
              <span className="text-xs font-black uppercase tracking-widest text-white">
                {isEdit ? "Edit task" : "New task"}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/5 rounded-lg transition"
            >
              <FiX size={13} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              autoFocus
              placeholder="Describe your objective…"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/[0.06] rounded-2xl px-4 py-3.5 text-sm text-white placeholder-white/20 focus:border-indigo-500/50 outline-none transition"
            />
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <FiCalendar
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none"
                  size={12}
                />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-2xl pl-9 pr-3 py-3.5 text-xs text-white outline-none focus:border-indigo-500/50 transition"
                />
              </div>
              <div className="relative">
                <FiClock
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none"
                  size={12}
                />
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-2xl pl-9 pr-3 py-3.5 text-xs text-white outline-none focus:border-indigo-500/50 transition"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl text-sm transition-all active:scale-[0.98] shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
            >
              {isEdit ? (
                <>
                  <FiSave size={14} /> Save changes
                </>
              ) : (
                <>
                  <FiPlus size={14} /> Deploy task
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </>
  );
};

// ─── Visual Roadmap ───────────────────────────────────────────────────────────
const VisualRoadmap = ({
  tasks,
  onToggle,
  onDelete,
  onEdit,
  page,
  onPageChange,
  actionLoading,
}) => {
  const start = (page - 1) * PAGE_SIZE;
  const sliced = tasks.slice(start, start + PAGE_SIZE);

  const isLoading = (type, id) =>
    actionLoading.type === type && actionLoading.id === id;

  return (
    <div>
      <div className="relative">
        <div className="absolute left-5 top-2 bottom-2 w-px bg-gradient-to-b from-indigo-500/50 via-indigo-500/15 to-transparent hidden sm:block pointer-events-none" />

        <div className="space-y-3">
          {sliced.map((task, idx) => {
            const gIdx = start + idx;

            return (
              <motion.div
                key={task._id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.055 }}
                className="relative sm:pl-14 group"
              >
                {/* DESKTOP TOGGLE */}
                <button
                  onClick={() => onToggle(task._id)}
                  disabled={actionLoading.id === task._id}
                  className={`absolute left-0 top-4 w-10 h-10 hidden sm:flex items-center justify-center rounded-full border-2 transition-all duration-300 z-10 ${
                    task.completed
                      ? "bg-green-700 border-indigo-400 shadow-[0_0_14px_rgba(99,102,241,0.45)]"
                      : "bg-[#08080f] border-white/10 hover:border-indigo-400/60"
                  }`}
                >
                  {isLoading("toggle", task._id) ? (
                    <Spinner size={16} />
                  ) : task.completed ? (
                    <FiCheck size={15} className="text-white font-bold" />
                  ) : (
                    <span className="text-[9px] font-black text-white/20">
                      {gIdx + 1}
                    </span>
                  )}
                </button>

                {/* Connector */}
                <div className="absolute left-10 top-[1.4rem] w-4 h-px bg-white/[0.05] hidden sm:block" />

                {/* Card */}
                <div
                  className={`rounded-2xl border p-4 transition-all duration-200 ${
                    task.completed
                      ? "bg-indigo-500/[0.03] border-indigo-500/10"
                      : "bg-[#111120] border-white/[0.06] hover:border-indigo-500/20"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* MOBILE TOGGLE */}
                    <button
                      onClick={() => onToggle(task._id)}
                      disabled={actionLoading.id === task._id}
                      className={`sm:hidden mt-1 w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${
                        task.completed
                          ? "bg-green-700 border-indigo-400"
                          : "border-white/20 hover:border-indigo-400"
                      }`}
                    >
                      {isLoading("toggle", task._id) ? (
                        <Spinner size={10} />
                      ) : (
                        task.completed && (
                          <FiCheck size={8} className="text-white font-bold" />
                        )
                      )}
                    </button>

                    {/* TEXT */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-[8px] font-black text-white/50 uppercase">
                          #{gIdx + 1}
                        </span>

                        {task.completed && (
                          <span className="text-[9px] font-black text-white bg-green-700 px-1.5 py-0.5 rounded-full border border-indigo-500/20">
                            Done
                          </span>
                        )}
                      </div>

                      <p
                        className={`text-sm font-semibold leading-snug break-words ${
                          task.completed
                            ? "line-through text-gray-400"
                            : "text-white"
                        }`}
                      >
                        {task.text}
                      </p>

                      {(task.date || task.time) && (
                        <div className="flex flex-wrap gap-3 mt-2">
                          {task.date && (
                            <span className="flex items-center gap-1 text-[10px] text-white/50 font-mono">
                              <FiCalendar size={8} className="text-blue-400" />{" "}
                              {task.date}
                            </span>
                          )}
                          {task.time && (
                            <span className="flex items-center gap-1 text-[10px] text-white/50 font-mono">
                              <FiClock size={8} className="text-blue-400" />{" "}
                              {task.time}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex items-center gap-1 shrink-0">
                      {/* EDIT */}
                      <button
                        onClick={() => onEdit(task)}
                        disabled={actionLoading.id === task._id}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-white/60 hover:text-indigo-400 hover:bg-indigo-500/10 transition"
                      >
                        {isLoading("edit", task._id) ? (
                          <Spinner size={12} />
                        ) : (
                          <FiEdit3 size={13} />
                        )}
                      </button>

                      {/* DELETE */}
                      <button
                        onClick={() => onDelete(task._id)}
                        disabled={actionLoading.id === task._id}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-white/60 hover:text-rose-400 hover:bg-rose-500/10 transition"
                      >
                        {isLoading("delete", task._id) ? (
                          <Spinner size={12} />
                        ) : (
                          <FiTrash2 size={13} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <Pagination
        page={page}
        total={tasks.length}
        pageSize={PAGE_SIZE}
        onChange={onPageChange}
      />
    </div>
  );
};

// ─── Empty State ──────────────────────────────────────────────────────────────
const EmptyState = ({ onAdd }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex flex-col items-center justify-center py-16 gap-4"
  >
    <div className="w-14 h-14 rounded-3xl bg-indigo-500/10 border border-indigo-500/10 flex items-center justify-center">
      <FiBox className="text-indigo-400" size={20} />
    </div>
    <div className="text-center px-4">
      <p className="text-white font-bold mb-1">No tasks yet</p>
      <p className="text-white/25 text-sm">
        Deploy your first objective to get started.
      </p>
    </div>
    <button
      onClick={onAdd}
      className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
    >
      <FiPlus size={13} /> Add task
    </button>
  </motion.div>
);

const Spinner = ({ size = 16 }) => (
  <div
    className="animate-spin rounded-full border-2 border-white/20 border-t-white"
    style={{ width: size, height: size }}
  />
);

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function EasyWayPro() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({
    type: null,
    id: null,
  });
  const [activeTab, setActiveTab] = useState("roadmap");
  const [filter, setFilter] = useState("all");
  const [showNotif, setShowNotif] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [roadmapPage, setRoadmapPage] = useState(1);
  const [gridPage, setGridPage] = useState(1);

  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const fetchTasks = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/tasks`, {
        withCredentials: true,
      });
      setTasks(
        Array.isArray(res.data)
          ? res.data.map((t) => ({
              ...t,
              notifiedBefore: false,
              notifiedExact: false,
            }))
          : [],
      );
    } catch {
      toast.error("Sync failure");
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  //  Request browser notification permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  const stats = useMemo(() => {
    const completed = tasks.filter((t) => t.completed).length;
    return {
      total: tasks.length,
      pending: tasks.length - completed,
      completed,
      progress: tasks.length ? Math.round((completed / tasks.length) * 100) : 0,
    };
  }, [tasks]);

  // ── Real weekly data ──
  const weeklyData = useMemo(() => buildWeeklyData(tasks), [tasks]);

  const pieData = useMemo(
    () => [
      { name: "Completed", value: stats.completed, fill: INDIGO },
      { name: "Pending", value: stats.pending, fill: AMBER },
    ],
    [stats],
  );

  const filteredTasks = useMemo(() => {
    const base = [...tasks].sort(
      (a, b) => Number(a.completed) - Number(b.completed),
    );
    if (filter === "pending") return base.filter((t) => !t.completed);
    if (filter === "done") return base.filter((t) => t.completed);
    return base;
  }, [tasks, filter]);

  const timetablePeriods = useMemo(
    () =>
      [
        {
          id: "morning",
          label: "Morning",
          icon: <FiSun size={13} className="text-amber-400" />,
          check: (h) => h >= 5 && h < 12,
        },
        {
          id: "afternoon",
          label: "Afternoon",
          icon: <FiCoffee size={13} className="text-sky-400" />,
          check: (h) => h >= 12 && h < 17,
        },
        {
          id: "evening",
          label: "Evening",
          icon: <FiMoon size={13} className="text-violet-400" />,
          check: (h) => h >= 17 || h < 5,
        },
      ].map((p) => ({
        ...p,
        items: filteredTasks.filter((t) =>
          p.check(parseInt(t.time?.split(":")[0] ?? 0)),
        ),
      })),
    [filteredTasks],
  );

  //  Notification helper
  const notifyUser = (title, body) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, { body });
    }
    toast.success(body);
  };

  const addTask = async ({ text, date, time }) => {
    try {
      const res = await axios.post(
        `${API_URL}/tasks`,
        { text, date, time },
        { withCredentials: true },
      );
      setTasks((prev) => [res.data, ...prev]);
      setShowForm(false);
      toast.success("Task deployed ");
    } catch {
      toast.error("Server error");
    }
  };

  const saveEdit = async ({ text, date, time }) => {
    try {
      setActionLoading({ type: "edit", id: editTask._id });

      const res = await axios.put(
        `${API_URL}/tasks/${editTask._id}/edit`,
        { text, date, time },
        { withCredentials: true },
      );

      setTasks((prev) =>
        prev.map((t) => (t._id === editTask._id ? res.data : t)),
      );

      setEditTask(null);
      toast.success("Task updated");
    } catch {
      toast.error("Update failed");
    } finally {
      setActionLoading({ type: null, id: null });
    }
  };

  const toggleTask = async (id) => {
    try {
      setActionLoading({ type: "toggle", id });

      const res = await axios.put(
        `${API_URL}/tasks/${id}/toggle`,
        {},
        { withCredentials: true },
      );

      setTasks((prev) => prev.map((t) => (t._id === id ? res.data : t)));

      if (res.data.completed) {
        toast.success("Achievement unlocked! 🏆");
      }
    } catch {
      toast.error("Update failed");
    } finally {
      setActionLoading({ type: null, id: null });
    }
  };

  const deleteTask = async (id) => {
    try {
      setActionLoading({ type: "delete", id });

      await axios.delete(`${API_URL}/tasks/${id}`, {
        withCredentials: true,
      });

      setTasks((prev) => prev.filter((t) => t._id !== id));
      toast.success("Task removed");
    } catch {
      toast.error("Delete failed");
    } finally {
      setActionLoading({ type: null, id: null });
    }
  };

  const clearAll = async () => {
    try {
      setActionLoading({ type: "clear", id: null });

      await axios.delete(`${API_URL}/tasks/clear`, {
        withCredentials: true,
      });

      setTasks([]);
      setConfirmClear(false);
      toast.success("Workspace cleared");
    } catch {
      toast.error("Action forbidden");
    } finally {
      setActionLoading({ type: null, id: null });
    }
  };

  //  Auto task reminder system
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();

      tasks.forEach((task) => {
        if (!task.date || !task.time || task.completed) return;

        const taskDateTime = new Date(`${task.date}T${task.time}`);
        const diff = (taskDateTime - now) / 60000;

        //  10 min before
        if (diff > 0 && diff <= 10 && !task.notifiedBefore) {
          notifyUser("Upcoming Task ⏰", `${task.text} in 10 minutes`);
          task.notifiedBefore = true;
        }

        //  exact time
        if (diff <= 0 && diff > -1 && !task.notifiedExact) {
          notifyUser("Task Time ", `${task.text} is due now`);
          task.notifiedExact = true;
        }
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [tasks]);

  useEffect(() => {
    setRoadmapPage(1);
    setGridPage(1);
  }, [filter, activeTab]);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-[#08080f] text-white font-sans selection:bg-indigo-500/25">
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#13131f",
            color: "#e2e8f0",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "14px",
            fontSize: "13px",
          },
        }}
      />

      {/* ── Overlays ── */}
      <AnimatePresence>
        {showNotif && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setShowNotif(false)}
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed top-0 right-0 h-full w-[min(20rem,100vw)] bg-[#0f0f1e] border-l border-white/[0.06] z-50 flex flex-col"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
                <span className="text-xs font-black text-white uppercase tracking-widest">
                  Pending tasks
                </span>
                <button
                  onClick={() => setShowNotif(false)}
                  className="p-1.5 hover:bg-white/5 rounded-lg"
                >
                  <FiX size={13} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {tasks.filter((t) => !t.completed).length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-3 opacity-20">
                    <FiCheckCircle size={26} />
                    <p className="text-xs font-bold uppercase tracking-widest">
                      All clear
                    </p>
                  </div>
                ) : (
                  tasks
                    .filter((t) => !t.completed)
                    .map((t) => (
                      <div
                        key={t._id}
                        className="p-3.5 bg-white/[0.02] border border-white/[0.05] rounded-xl"
                      >
                        <p className="text-xs text-white font-semibold leading-snug">
                          {t.text}
                        </p>
                        {(t.date || t.time) && (
                          <p className="text-[9px] text-white/20 font-mono mt-1.5">
                            {t.date} {t.time}
                          </p>
                        )}
                      </div>
                    ))
                )}
              </div>
            </motion.aside>
          </>
        )}

        {confirmClear && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setConfirmClear(false)}
            />
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: "spring", damping: 24, stiffness: 300 }}
              className="fixed inset-0 z-50 flex items-center justify-center px-4"
            >
              <div className="bg-[#0f0f1e] border border-white/[0.08] rounded-3xl p-7 w-full max-w-sm shadow-2xl">
                <div className="w-11 h-11 bg-rose-500/10 rounded-2xl flex items-center justify-center mb-4">
                  <FiTrash className="text-rose-400" size={18} />
                </div>
                <h3 className="text-white font-black text-lg mb-1.5">
                  Clear all tasks?
                </h3>
                <p className="text-white/30 text-sm mb-6">
                  This permanently deletes all data.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setConfirmClear(false)}
                    className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm font-bold hover:bg-white/5 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={clearAll}
                    disabled={actionLoading.type === "clear"}
                    className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white text-sm font-bold transition flex items-center justify-center disabled:opacity-60"
                  >
                    {actionLoading.type === "clear" ? (
                      <Spinner size={16} />
                    ) : (
                      "Delete all"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}

        {showForm && (
          <TaskFormModal
            onClose={() => setShowForm(false)}
            onSubmit={addTask}
          />
        )}
        {editTask && (
          <TaskFormModal
            onClose={() => setEditTask(null)}
            onSubmit={saveEdit}
            initial={editTask}
          />
        )}
      </AnimatePresence>

      {/* ── Page ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-6 gap-3 flex-wrap">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/30 shrink-0">
              <FiTarget className="text-white" size={15} />
            </div>
            <div className="min-w-0">
              <h1 className="text-base font-black text-white leading-none truncate">
                Task <span className="text-indigo-400">Planner</span>
              </h1>
              <p className="text-[8px] text-white/50 font-bold uppercase tracking-widest mt-0.5">
                Dashboard
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowNotif(true)}
              className="relative w-9 h-9 flex items-center justify-center bg-white/[0.03] border border-white/[0.06] rounded-xl hover:bg-white/[0.06] transition"
            >
              <FiBell size={14} />
              {stats.pending > 0 && (
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-indigo-400 rounded-full" />
              )}
            </button>
            <button
              onClick={() => setConfirmClear(true)}
              className="w-9 h-9 flex items-center justify-center bg-rose-500/[0.05] border border-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500/10 transition"
            >
              <FiTrash size={13} />
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
            >
              <FiPlus size={13} />{" "}
              <span className="hidden xs:inline">New task</span>
            </button>
          </div>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          <div className="col-span-2 sm:col-span-1 bg-[#111120] border border-white/[0.06] rounded-2xl p-4 flex items-center gap-3">
            <RadialProgress value={stats.progress} color={INDIGO} />
            <div>
              <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest">
                Progress
              </p>
              <p className="text-2xl font-black text-white mt-0.5">
                {stats.progress}%
              </p>
              <p className="text-[9px] text-white/40 mt-1">
                {stats.completed}/{stats.total} done
              </p>
            </div>
          </div>
          <StatCard
            icon={<FiActivity size={15} />}
            label="Total"
            value={stats.total}
            accent="bg-sky-500/15 text-sky-400"
          />
          <StatCard
            icon={<FiZap size={15} />}
            label="Active"
            value={stats.pending}
            accent="bg-amber-500/15 text-amber-400"
          />
          <StatCard
            icon={<FiAward size={15} />}
            label="Completed"
            value={stats.completed}
            accent="bg-emerald-500/15 text-emerald-400"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* ── Weekly Activity (real data) ── */}
          <div className="lg:col-span-2 bg-[#111120] border border-white/[0.06] rounded-2xl p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-white/25">
                  This week's activity
                </p>
                <p className="text-[9px] text-white/15 mt-0.5">
                  Based on task due dates (Sun – Sat)
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="flex items-center gap-1.5 text-[9px] text-white/30">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" />{" "}
                  Added
                </span>
                <span className="flex items-center gap-1.5 text-[9px] text-white/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />{" "}
                  Done
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={148}>
              <AreaChart
                data={weeklyData}
                margin={{ top: 4, right: 4, bottom: 0, left: -26 }}
              >
                <defs>
                  <linearGradient id="gAdded" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={INDIGO} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={INDIGO} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gDone" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={EMERALD} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={EMERALD} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.04)"
                />
                <XAxis
                  dataKey="day"
                  tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="added"
                  name="Added"
                  stroke={INDIGO}
                  strokeWidth={2}
                  fill="url(#gAdded)"
                  dot={false}
                  activeDot={{ r: 4, fill: INDIGO }}
                />
                <Area
                  type="monotone"
                  dataKey="completed"
                  name="Completed"
                  stroke={EMERALD}
                  strokeWidth={2}
                  fill="url(#gDone)"
                  dot={false}
                  activeDot={{ r: 4, fill: EMERALD }}
                />
              </AreaChart>
            </ResponsiveContainer>
            {weeklyData.every((d) => d.added === 0) && (
              <p className="text-[10px] text-white/15 text-center mt-2">
                Assign dates to tasks to see weekly activity
              </p>
            )}
          </div>

          {/* Pie */}
          <div className="bg-[#111120] border border-white/[0.06] rounded-2xl p-5 flex flex-col">
            <p className="text-[9px] font-black uppercase tracking-widest text-white/25 mb-3">
              Distribution
            </p>

            {stats.total === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-[10px] text-white/15">No tasks yet</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={4}
                    stroke="none"
                    isAnimationActive
                    animationDuration={600}
                    // label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  />

                  <Tooltip content={<ChartTooltip />} />

                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ marginTop: 6 }}
                    formatter={(v) => (
                      <span className="text-[10px] text-white/40">{v}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Tab + Filter bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-5">
          <div className="flex bg-[#111120] border border-white/[0.06] p-1 rounded-2xl gap-0.5 overflow-x-auto">
            {[
              { id: "roadmap", label: "Roadmap", icon: <FiMap size={11} /> },
              {
                id: "timetable",
                label: "Timetable",
                icon: <FiZap size={11} />,
              },
              { id: "grid", label: "Data grid", icon: <FiGrid size={11} /> },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                  activeTab === t.id
                    ? "bg-blue-600 text-white shadow-lg shadow-indigo-600/20"
                    : "text-white/50 hover:text-white"
                }`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>
          <div className="flex bg-[#111120] border border-white/[0.06] p-1 rounded-xl self-start sm:self-auto">
            {["all", "pending", "done"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                  filter === f
                    ? "bg-white/10 text-white"
                    : "text-white/25 hover:text-white"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Views */}
        <AnimatePresence mode="wait">
          {activeTab === "roadmap" && (
            <motion.div
              key="roadmap"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {filteredTasks.length === 0 ? (
                <EmptyState onAdd={() => setShowForm(true)} />
              ) : (
                <VisualRoadmap
                  tasks={filteredTasks}
                  onToggle={toggleTask}
                  onDelete={deleteTask}
                  onEdit={setEditTask}
                  page={roadmapPage}
                  onPageChange={setRoadmapPage}
                  actionLoading={actionLoading}
                />
              )}
            </motion.div>
          )}

          {activeTab === "timetable" && (
            <motion.div
              key="timetable"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              {timetablePeriods.map((period) => (
                <div
                  key={period.id}
                  className="bg-[#111120] border border-white/[0.06] rounded-2xl p-5"
                >
                  <div className="flex items-center gap-2 pb-4 mb-4 border-b border-white/[0.04]">
                    {period.icon}
                    <span className="text-xs font-black text-white uppercase tracking-wider">
                      {period.label}
                    </span>
                    <span className="ml-auto text-[9px] font-black text-white/40 bg-white/[0.03] px-2 py-0.5 rounded-full">
                      {period.items.length}
                    </span>
                  </div>
                  <div className="space-y-2.5">
                    {period.items.length === 0 ? (
                      <p className="text-[10px] text-white/50 text-center py-6">
                        No tasks
                      </p>
                    ) : (
                      period.items.map((t) => (
                        <div
                          key={t._id}
                          className={`p-3.5 rounded-xl border group ${t.completed ? "border-indigo-500/10 bg-indigo-500/[0.02]" : "border-white/[0.04] hover:border-white/10"}`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[9px] font-mono text-indigo-400">
                              {t.time || "--:--"}
                            </span>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                              <button
                                onClick={() => setEditTask(t)}
                                className="text-white/40 hover:text-indigo-400 transition"
                              >
                                <FiEdit3 size={14} />
                              </button>
                              {t.completed && (
                                <FiCheckCircle
                                  size={10}
                                  className="text-indigo-400"
                                />
                              )}
                            </div>
                          </div>
                          <p
                            className={`text-xs font-semibold leading-snug break-words ${t.completed ? "line-through text-white/40" : "text-white"}`}
                          >
                            {t.text}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === "grid" && (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {filteredTasks.length === 0 ? (
                <EmptyState onAdd={() => setShowForm(true)} />
              ) : (
                <>
                  <div className=" border border-white/[0.06] rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[520px] text-left">
                        <thead>
                          <tr className="border-b border-white/50">
                            {["#", "✓", "Objective", "Date", "Time", ""].map(
                              (h, i) => (
                                <th
                                  key={i}
                                  className="px-4 py-3.5 text-[8px] font-black uppercase tracking-widest text-white/70 whitespace-nowrap"
                                >
                                  {h}
                                </th>
                              ),
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {filteredTasks
                            .slice(
                              (gridPage - 1) * PAGE_SIZE,
                              gridPage * PAGE_SIZE,
                            )
                            .map((t, i) => {
                              const gIdx = (gridPage - 1) * PAGE_SIZE + i;
                              return (
                                <motion.tr
                                  key={t._id}
                                  initial={{ opacity: 0, x: -4 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.03 }}
                                  className={`border-b border-white/[0.03] group transition-colors ${t.completed ? "bg-indigo-500/[0.01]" : "hover:bg-white/[0.01]"}`}
                                >
                                  <td className="px-4 py-3.5 text-[10px] font-mono text-white/50 w-8">
                                    {gIdx + 1}
                                  </td>
                                  <td className="px-4 py-3.5 w-10">
                                    <button
                                      onClick={() => toggleTask(t._id)}
                                      className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                                        t.completed
                                          ? "border-indigo-500 bg-green-900 text-indigo-400"
                                          : "border-white/10 text-white/50 hover:border-indigo-500/40"
                                      }`}
                                    >
                                      {actionLoading.type === "toggle" &&
                                      actionLoading.id === t._id ? (
                                        <Spinner size={12} />
                                      ) : (
                                        <FiCheck size={15} />
                                      )}
                                    </button>
                                  </td>
                                  <td
                                    className={`px-4 py-3.5 text-sm font-semibold max-w-[140px] sm:max-w-xs truncate ${t.completed ? "line-through text-white/30" : "text-white"}`}
                                  >
                                    {t.text}
                                  </td>
                                  <td className="px-4 py-3.5 text-[13px] font-mono text-white/50 whitespace-nowrap">
                                    {t.date || "—"}
                                  </td>
                                  <td className="px-4 py-3.5 text-[13px] font-mono text-white/50 whitespace-nowrap">
                                    {t.time || "—"}
                                  </td>
                                  <td className="px-4 py-3.5 w-16">
                                    <div className="flex items-center gap-1  transition">
                                      <button
                                        onClick={() => setEditTask(t)}
                                        className="w-6 h-6 flex items-center justify-center rounded-lg text-white/50 hover:text-indigo-400 hover:bg-indigo-500/10 transition"
                                      >
                                        <FiEdit3 size={13} />
                                      </button>
                                      <button
                                        onClick={() => deleteTask(t._id)}
                                        className="w-6 h-6 flex items-center justify-center rounded-lg text-white/550 hover:text-rose-400 hover:bg-rose-500/10 transition"
                                      >
                                        <FiTrash2 size={13} />
                                      </button>
                                    </div>
                                  </td>
                                </motion.tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <Pagination
                    page={gridPage}
                    total={filteredTasks.length}
                    pageSize={PAGE_SIZE}
                    onChange={setGridPage}
                  />
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
