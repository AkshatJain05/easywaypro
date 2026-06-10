import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import {
  FiSearch,
  FiX,
  FiChevronRight,
  FiUsers,
  FiShield,
  FiUser,
  FiCalendar,
  FiMail,
  FiPhone,
  FiBook,
  FiLayers,
  FiTrendingUp,
  FiClock,
  FiCheck,
  FiAlertCircle,
  FiLock,
  FiChevronLeft,
} from "react-icons/fi";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";
const fmtTime = (d) =>
  d
    ? new Date(d).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";
const initials = (name = "") =>
  name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase() || "?";

const ROLE_STYLE = {
  admin: {
    label: "Admin",
    cls: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  },
  teacher: {
    label: "Teacher",
    cls: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  },
  moderator: {
    label: "Mod",
    cls: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
  },
  user: {
    label: "Student",
    cls: "bg-white/5 text-white/40 border border-white/10",
  },
};
const roleStyle = (r) => ROLE_STYLE[r?.toLowerCase()] || ROLE_STYLE.user;

// ─── Avatar Component ──────────────────────────────────────────────────────────
const Avatar = ({ name, size = "md" }) => {
  const sz =
    size === "lg"
      ? "w-12 h-12 md:w-16 md:h-16 text-lg md:text-xl"
      : size === "sm"
        ? "w-8 h-8 text-[10px]"
        : "w-10 h-10 text-xs";
  return (
    <div
      className={`${sz} bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl md:rounded-2xl flex items-center justify-center font-black text-white shrink-0 shadow-lg shadow-blue-900/20 select-none`}
    >
      {initials(name)}
    </div>
  );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ icon, label, value, accent, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="bg-gradient-to-b from-gray-950 to-black border border-slate-800 rounded-3xl p-5 md:p-6 flex items-center gap-4 md:gap-5 hover:border-blue-500/30 transition-all group relative overflow-hidden"
  >
    <div
      className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 ${accent} group-hover:scale-110 transition-transform`}
    >
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-xl md:text-2xl font-black text-white tracking-tighter leading-none">
        {value}
      </p>
      <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] text-white/20 mt-1 md:mt-2">
        {label}
      </p>
    </div>
  </motion.div>
);

// ─── Detail Row ───────────────────────────────────────────────────────────────
const DetailRow = ({ icon, label, value }) => (
  <div className="flex items-center justify-between py-3.5 border-b border-white/[0.03] last:border-0 group">
    <div className="flex items-center gap-3 min-w-0">
      <span className="text-white/40 group-hover:text-blue-400 transition-colors shrink-0">
        {icon}
      </span>
      <p className="text-[10px] font-black uppercase tracking-widest text-white/50 truncate">
        {label}
      </p>
    </div>
    <p className="text-xs font-bold text-white/70 text-right truncate ml-4 max-w-[65%]">
      {value || "—"}
    </p>
  </div>
);

export default function Users() {
  const [users, setUsers] = useState([]);
  const [growthData, setGrowthData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [mutatingId, setMutatingId] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Adjust this as needed

  const [targetRole, setTargetRole] = useState(null);
  const [adminPassword, setAdminPassword] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;

  const showNotification = (msg, isError = false) => {
    setToastMsg({ text: msg, error: isError });
    setTimeout(() => setToastMsg(null), 4000);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [uRes, gRes] = await Promise.all([
          axios.get(`${API_URL}/admin/users?limit=1000`),
          axios.get(`${API_URL}/admin/stats/growth`),
        ]);
        setUsers(Array.isArray(uRes.data) ? uRes.data : []);
        setGrowthData(gRes.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [API_URL]);

  // Executed on secure confirmation button trigger
  const processSecureRoleChange = async (e) => {
    e.preventDefault();
    if (!adminPassword.trim()) {
      showNotification("Security validation password required", true);
      return;
    }

    setMutatingId(selectedUser._id);
    try {
      // Passes chosen target role along with confirmation payload boundary
      await axios.patch(`${API_URL}/admin/users/${selectedUser._id}/role`, {
        role: targetRole,
        password: adminPassword,
      });

      setUsers((prev) =>
        prev.map((u) =>
          u._id === selectedUser._id ? { ...u, role: targetRole } : u,
        ),
      );
      setSelectedUser((prev) => ({ ...prev, role: targetRole }));
      showNotification(
        `Identity successfully updated to [${targetRole}] privilege level`,
      );

      // Clean verification inputs state tracking
      setTargetRole(null);
      setAdminPassword("");
    } catch (err) {
      console.error(err);
      showNotification(
        err.response?.data?.message || "Verification failed / Invalid password",
        true,
      );
    } finally {
      setMutatingId(null);
    }
  };

  const stats = useMemo(() => {
    const total = users.length;
    const admins = users.filter(
      (u) => u.role?.toLowerCase() === "admin",
    ).length;
    const teachers = users.filter(
      (u) => u.role?.toLowerCase() === "teacher",
    ).length;
    const thisMonth = users.filter((u) => {
      const d = new Date(u.createdAt);
      const now = new Date();
      return (
        d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      );
    }).length;
    return { total, admins, teachers, thisMonth };
  }, [users]);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const currentRole = (u.role || "user").toLowerCase();
      const activeFilter = roleFilter === "student" ? "user" : roleFilter;
      const matchesRole =
        roleFilter === "all" ||
        currentRole === activeFilter ||
        (roleFilter === "student" && currentRole === "student");
      const q = search.toLowerCase();
      return (
        matchesRole &&
        (!q ||
          u.name?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q))
      );
    });
  }, [users, search, roleFilter]);

  // Reset page when filter/search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, roleFilter]);

  // Paginated Data
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-transparent text-white font-sans px-3 md:px-6 py-6 md:py-10 selection:bg-blue-500/30 overflow-x-hidden relative">
      <div className="fixed top-[-10%] left-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-blue-600/5 blur-[120px] pointer-events-none" />

      {/* ── Action Alerts ── */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2.5 px-4 py-3 rounded-xl border backdrop-blur-md text-xs font-semibold ${
              toastMsg.error
                ? "bg-red-500/10 border-red-500/20 text-red-400"
                : "bg-blue-500/10 border-blue-500/20 text-blue-400"
            }`}
          >
            {toastMsg.error ? (
              <FiAlertCircle size={14} />
            ) : (
              <FiCheck size={14} />
            )}
            <span>{toastMsg.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Header ── */}
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-12 relative z-10">
        <div>
          <nav className="flex items-center gap-2 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-2 md:mb-3">
            <span>Admin Dashboard</span>{" "}
            <span className="w-1 h-1 rounded-full bg-white/10" />{" "}
            <span>Accounts</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-black">
            User <span className="text-blue-600">Infrastructure</span>
          </h1>
        </div>
      </header>

      {/* ── Dashboard Stats ── */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2 bg-gradient-to-b from-gray-950 to-black border border-slate-800 rounded-[24px] md:rounded-[32px] p-6 md:p-8 h-[200px] md:h-[340px] relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-4 md:mb-6 relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
              System Entry Metrics
            </p>
            <FiTrendingUp className="text-blue-500" />
          </div>
          <div className="h-full w-full absolute inset-0 pt-16 pb-4 md:pb-6 pr-4 md:pr-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" hide />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0d0d12",
                    border: "1px solid rgba(255,255,255,0.05)",
                    borderRadius: "16px",
                    fontSize: "10px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  fill="url(#g)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 md:gap-4">
          <StatCard
            icon={<FiUsers size={18} />}
            label="Total Records"
            value={stats.total}
            accent="bg-blue-500/10 text-blue-500"
          />
          <StatCard
            icon={<FiTrendingUp size={18} />}
            label="Monthly Influx"
            value={`+${stats.thisMonth}`}
            accent="bg-emerald-500/10 text-emerald-500"
          />
          <div className="hidden lg:block">
            <StatCard
              icon={<FiShield size={18} />}
              label="Faculty Accounts"
              value={stats.teachers}
              accent="bg-purple-500/10 text-purple-500"
            />
          </div>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <section className="max-w-7xl mx-auto mb-6 md:mb-8 relative z-10">
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 group">
            <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Search accounts parameter profile..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-black border border-slate-900 rounded-2xl py-3.5 pl-14 pr-6 text-sm text-white outline-none focus:border-blue-500/30 transition-all placeholder:text-white/20"
            />
          </div>
          <div className="flex bg-black p-1 rounded-2xl border border-slate-900 overflow-x-auto hide-scrollbar shrink-0 self-start sm:self-auto">
            {["all", "admin", "teacher", "student"].map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-4 md:px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                  roleFilter === r
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                    : "text-white/20 hover:text-white"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto relative z-10 ">
        <div className="bg-gradient-to-r from-black via-gray-950 to-black border border-white/[0.05] rounded-[24px] md:rounded-[32px] overflow-hidden shadow-2xl">
          <div className="w-full overflow-x-hidden">
            <table className="w-full text-left border-collapse table-fixed">
              <thead>
                <tr className="border-b border-white/[0.03] bg-white/[0.01]">
                  <th className="px-5 py-4.5 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white/40 w-[85%] md:w-[35%]">
                    Identity Details
                  </th>
                  <th className="px-6 py-4.5 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hidden md:table-cell md:w-[15%]">
                    Clearance Role
                  </th>
                  <th className="px-6 py-4.5 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hidden md:table-cell md:w-[25%]">
                    Telemetry (Last Activity)
                  </th>
                  <th className="px-6 py-4.5 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hidden md:table-cell md:w-[18%]">
                    Contact Profile
                  </th>
                  <th className="px-5 py-4.5 w-[15%] md:w-[7%]"></th>
                </tr>
              </thead>

              <tbody>
                {paginatedData.map((user) => (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="group border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedUser(user);
                      setTargetRole(null);
                    }}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3.5 overflow-hidden">
                        <Avatar name={user.name} size="sm" />
                        <div className="min-w-0">
                          <p className="text-xs md:text-sm font-bold text-white/80 group-hover:text-white truncate transition-colors">
                            {user.name}
                          </p>
                          <p className="text-[9px] md:text-[10px] text-white/40 font-mono mt-0.5 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span
                        className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg inline-block ${roleStyle(user.role).cls}`}
                      >
                        {roleStyle(user.role).label}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="text-[10px] md:text-xs font-mono text-white/50 flex flex-col gap-0.5">
                        <span>
                          {user.lastLogin
                            ? fmt(user.lastLogin)
                            : fmt(user.createdAt)}
                        </span>
                        <span className="text-[9px] text-white/20">
                          {user.lastLogin
                            ? fmtTime(user.lastLogin)
                            : "System Activation"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <p className="text-[11px] font-mono text-white/40 truncate">
                        {user.phoneNo || "—"}
                      </p>
                    </td>
                    <td className="px-3 py-4 text-right">
                      <button className="p-1 rounded-xl bg-white/[0.02] border border-white/[0.04] text-white/30 group-hover:text-blue-500 group-hover:bg-blue-500/10 group-hover:border-blue-500/20 transition-all">
                        <FiChevronRight size={15} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-white/[0.03]">
              <p className="text-[10px] font-black uppercase text-white/20">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.04] disabled:opacity-30"
                >
                  <FiChevronLeft size={14} />
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.04] disabled:opacity-30"
                >
                  <FiChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ── Control Sidebar Panel Drawer ── */}
      <AnimatePresence>
        {selectedUser && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#050508]/80 backdrop-blur-md z-[60]"
              onClick={() => setSelectedUser(null)}
            />
            <motion.div
              initial={{
                opacity: 0,
                x:
                  typeof window !== "undefined" && window.innerWidth < 768
                    ? 0
                    : 120,
                y:
                  typeof window !== "undefined" && window.innerWidth < 768
                    ? 120
                    : 0,
              }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{
                opacity: 0,
                y:
                  typeof window !== "undefined" && window.innerWidth < 768
                    ? 120
                    : 0,
                x:
                  typeof window !== "undefined" && window.innerWidth < 768
                    ? 0
                    : 120,
              }}
              className="fixed inset-x-0 bottom-0 md:inset-y-0 md:right-0 md:left-auto z-[70] flex items-end md:items-stretch justify-center p-0 pointer-events-none"
            >
              <div className="bg-[#0b0b0f] border-t md:border-t-0 md:border-l border-white/[0.08] rounded-t-[32px] md:rounded-t-none w-full max-w-md overflow-hidden pointer-events-auto shadow-2xl flex flex-col max-h-[92vh] md:max-h-screen">
                {/* Header Summary Profile Section */}
                <div className="relative p-6 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-transparent border-b border-white/[0.04] shrink-0 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar name={selectedUser.name} size="md" />
                    <div className="min-w-0">
                      <h2 className="text-base md:text-lg font-black tracking-tight truncate pr-4">
                        {selectedUser.name}
                      </h2>
                      <span
                        className={`inline-block mt-1 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${roleStyle(selectedUser.role).cls}`}
                      >
                        {roleStyle(selectedUser.role).label}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-white/40 hover:text-white"
                  >
                    <FiX size={14} />
                  </button>
                </div>

                {/* Body Details Card Container */}
                <div className="p-6 overflow-y-auto space-y-6 flex-1 hide-scrollbar">
                  {/* Category Card A: Base specifications */}
                  <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 mb-2.5">
                      User Specifications
                    </p>
                    <div className="bg-white/[0.01] border border-white/[0.04] px-4 py-1 rounded-2xl">
                      <DetailRow
                        icon={<FiMail size={13} />}
                        label="Email Address"
                        value={selectedUser.email}
                      />
                      <DetailRow
                        icon={<FiPhone size={13} />}
                        label="Phone Boundary"
                        value={selectedUser.phoneNo}
                      />
                      <DetailRow
                        icon={<FiBook size={13} />}
                        label="Assigned Course"
                        value={selectedUser.Course}
                      />
                      <DetailRow
                        icon={<FiLayers size={13} />}
                        label="Department Branch"
                        value={selectedUser.BranchName}
                      />
                    </div>
                  </div>

                  {/* Category Card B: Tracking telemetry */}
                  <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 mb-2.5">
                      Activity Infrastructure
                    </p>
                    <div className="bg-white/[0.01] border border-white/[0.04] px-4 py-1 rounded-2xl">
                      <DetailRow
                        icon={<FiCalendar size={13} />}
                        label="Registration Stamp"
                        value={fmt(selectedUser.createdAt)}
                      />
                      <DetailRow
                        icon={<FiClock size={13} />}
                        label="Last Verified Connection"
                        value={
                          selectedUser.lastLogin
                            ? `${fmt(selectedUser.lastLogin)} — ${fmtTime(selectedUser.lastLogin)}`
                            : "No Activity Traces"
                        }
                      />
                    </div>
                  </div>

                  {/* Administrative Protected Modifications Desk */}
                  <div className="space-y-3 pt-2">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
                        Modify Security Group Permissions
                      </p>
                      <p className="text-[11px] text-white/40 mt-0.5">
                        Select a destination authority node target level below.
                      </p>
                    </div>

                    {/* Stage A: Target Option Selectors Grid */}
                    <div className="grid grid-cols-3 gap-2 bg-white/[0.01] p-1.5 rounded-2xl border border-white/[0.03]">
                      {[
                        { id: "user", txt: "student" },
                        { id: "teacher", txt: "teacher" },
                        { id: "admin", txt: "admin" },
                      ].map((opt) => {
                        const isCurrent =
                          (selectedUser.role || "user").toLowerCase() ===
                          opt.id;
                        const isChosenToMutate = targetRole === opt.id;

                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => {
                              if (!isCurrent) {
                                setTargetRole(opt.id);
                                setAdminPassword(""); // Flush previous password text configurations
                              }
                            }}
                            className={`py-2.5 px-1 rounded-xl text-[9px] font-black uppercase tracking-wider border transition-all flex flex-col items-center justify-center gap-1.5 ${
                              isCurrent
                                ? "bg-white/[0.02] border-white/10 text-white/30 cursor-not-allowed opacity-50"
                                : isChosenToMutate
                                  ? "bg-blue-600/10 border-blue-500/50 text-blue-400 font-bold shadow-sm shadow-blue-500/5"
                                  : "bg-[#0d0d12] border-white/[0.04] text-white/50 hover:text-white hover:border-white/10 cursor-pointer"
                            }`}
                          >
                            <span>{opt.txt}</span>
                            {isCurrent && (
                              <span className="text-[8px] tracking-normal normal-case opacity-40 font-medium">
                                (Current)
                              </span>
                            )}
                            {isChosenToMutate && (
                              <FiCheck size={10} className="stroke-[3]" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Stage B: Animated Password Verification Block Form Dropdown */}
                    <AnimatePresence>
                      {targetRole && (
                        <motion.form
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          onSubmit={processSecureRoleChange}
                          className="space-y-2.5 overflow-hidden pt-1"
                        >
                          <div className="relative">
                            <FiLock
                              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20"
                              size={13}
                            />
                            <input
                              type="password"
                              required
                              placeholder="Confirm root master password..."
                              value={adminPassword}
                              onChange={(e) => setAdminPassword(e.target.value)}
                              className="w-full bg-[#050508] border border-white/[0.08] focus:border-blue-500/40 rounded-xl py-3 pl-11 pr-4 text-xs text-white outline-none transition-all placeholder:text-white/20"
                            />
                          </div>

                          <div className="flex gap-2">
                            <button
                              type="submit"
                              disabled={mutatingId !== null}
                              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center min-h-[36px]"
                            >
                              {mutatingId ? (
                                <div className="w-3.5 h-3.5 border border-white border-t-transparent rounded-full animate-spin" />
                              ) : (
                                "Authorize Structural Sync"
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => setTargetRole(null)}
                              className="px-4 bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] text-white/50 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </motion.form>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
