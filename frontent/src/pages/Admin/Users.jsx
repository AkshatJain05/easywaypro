import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import {
  FiSearch, FiX, FiChevronRight, FiUsers, FiShield, FiUser, 
  FiCalendar, FiMail, FiPhone, FiBook, FiLayers, FiHash,
  FiTrendingUp, FiDownload, FiEye
} from "react-icons/fi";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";
const initials = (name = "") => name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase() || "?";

const ROLE_STYLE = {
  admin: { label: "Admin", cls: "bg-blue-500/10 text-blue-400 border border-blue-500/20" },
  moderator: { label: "Mod", cls: "bg-purple-500/10 text-purple-400 border border-purple-500/20" },
  user: { label: "Student", cls: "bg-white/5 text-white/40 border border-white/10" },
};
const roleStyle = (r) => ROLE_STYLE[r?.toLowerCase()] || ROLE_STYLE.user;

// ─── Avatar Component ──────────────────────────────────────────────────────────
const Avatar = ({ name, size = "md" }) => {
  const sz = size === "lg" ? "w-12 h-12 md:w-16 md:h-16 text-lg md:text-xl" : size === "sm" ? "w-8 h-8 text-[10px]" : "w-10 h-10 text-xs";
  return (
    <div className={`${sz} bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl md:rounded-2xl flex items-center justify-center font-black text-white shrink-0 shadow-lg shadow-blue-900/20 select-none`}>
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
    className="bg-[#0d0d12] border border-white/[0.05] rounded-3xl p-5 md:p-6 flex items-center gap-4 md:gap-5 hover:border-blue-500/30 transition-all group relative overflow-hidden"
  >
    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 ${accent} group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-xl md:text-2xl font-black text-white tracking-tighter leading-none">{value}</p>
      <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] text-white/20 mt-1 md:mt-2">{label}</p>
    </div>
  </motion.div>
);

// ─── Detail Row ───────────────────────────────────────────────────────────────
const DetailRow = ({ icon, label, value }) => (
  <div className="flex items-center justify-between py-4 border-b border-white/[0.03] last:border-0 group">
    <div className="flex items-center gap-3">
      <span className="text-white/40 group-hover:text-blue-400 transition-colors">{icon}</span>
      <p className="text-[10px] font-black uppercase tracking-widest text-white/50">{label}</p>
    </div>
    <p className="text-xs font-bold text-white/70 text-right truncate ml-4">{value || "—"}</p>
  </div>
);

export default function Users() {
  const [users, setUsers] = useState([]);
  const [growthData, setGrowthData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [uRes, gRes] = await Promise.all([
          axios.get(`${API_URL}/admin/users?limit=1000`),
          axios.get(`${API_URL}/admin/stats/growth`)
        ]);
        setUsers(Array.isArray(uRes.data) ? uRes.data : []);
        setGrowthData(gRes.data.data || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [API_URL]);

  const stats = useMemo(() => {
    const total = users.length;
    const admins = users.filter(u => u.role?.toLowerCase() === "admin").length;
    const thisMonth = users.filter(u => {
      const d = new Date(u.createdAt);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;
    return { total, admins, regular: total - admins, thisMonth };
  }, [users]);

  const filtered = useMemo(() => {
    return users.filter(u => {
      const matchesRole = roleFilter === "all" || (u.role || "user").toLowerCase() === roleFilter;
      const q = search.toLowerCase();
      return matchesRole && (!q || u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q));
    });
  }, [users, search, roleFilter]);

  if (loading) return (
    <div className="min-h-screen bg-[#050508] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050508] text-white font-sans px-4 md:px-6 py-6 md:py-10 selection:bg-blue-500/30 overflow-x-hidden">
      <div className="fixed top-[-10%] left-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-blue-600/5 blur-[120px] pointer-events-none" />

      {/* ── Header ── */}
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-12 relative z-10">
        <div>
          <nav className="flex items-center gap-2 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-2 md:mb-3">
            <span>Admin</span> <span className="w-1 h-1 rounded-full bg-white/10" /> <span>Directory</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter">
            User <span className="text-blue-600">Database</span>
          </h1>
        </div>
        {/* <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.05] text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all">
          <FiDownload size={14} /> <span className="hidden sm:inline">Download Archive</span><span className="sm:hidden">Export</span>
        </button> */}
      </header>

      {/* ── Dashboard Stats ── */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-10 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2 bg-[#0d0d12] border border-white/[0.05] rounded-[24px] md:rounded-[32px] p-6 md:p-8 h-[280px] md:h-[340px] relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-4 md:mb-6 relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Growth Trend</p>
            <FiTrendingUp className="text-blue-500" />
          </div>
          <div className="h-full w-full absolute inset-0 pt-20 pb-4 md:pb-6 pr-4 md:pr-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" hide />
                <Tooltip contentStyle={{ backgroundColor: '#0d0d12', border: 'none', borderRadius: '12px', fontSize: '10px' }} />
                <Area type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={3} fill="url(#g)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 md:gap-4">
          <StatCard icon={<FiUsers size={18} />} label="Total" value={stats.total} accent="bg-blue-500/10 text-blue-500" />
          <StatCard icon={<FiTrendingUp size={18} />} label="Monthly" value={`+${stats.thisMonth}`} accent="bg-emerald-500/10 text-emerald-500" />
          <div className="hidden lg:block">
            <StatCard icon={<FiShield size={18} />} label="Privileged" value={stats.admins} accent="bg-purple-500/10 text-purple-500" />
          </div>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <section className="max-w-7xl mx-auto mb-6 md:mb-8 relative z-10">
        <div className="flex flex-col gap-4">
          <div className="relative group">
            <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text" placeholder="Search users..." value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-[#0d0d12] border border-white/[0.05] rounded-2xl py-4 pl-14 pr-6 text-sm text-white outline-none focus:border-blue-500/30 transition-all"
            />
          </div>
          <div className="flex bg-[#0d0d12] p-1 rounded-2xl border border-white/[0.05] self-start overflow-x-auto max-w-full hide-scrollbar">
            {["all", "admin", "student"].map(r => (
              <button
                key={r} onClick={() => setRoleFilter(r)}
                className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                  roleFilter === r ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-white/20 hover:text-white"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Table ── */}
      <main className="max-w-7xl mx-auto relative z-10">
        <div className="bg-[#060607] border border-white/[0.05] rounded-[24px] md:rounded-[32px] overflow-hidden shadow-2xl">
          <div className="w-full overflow-x-hidden"> {/* Strictly no X scroll */}
            <table className="w-full text-left border-collapse table-fixed">
              <thead>
                <tr className="border-b border-white/[0.03] bg-white/[0.01]">
                  <th className="px-4 md:px-8 py-5 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white/40 w-[60%] md:w-[35%]">Identity</th>
                  <th className="px-4 md:px-8 py-5 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hidden md:table-cell">Access</th>
                  <th className="px-4 md:px-8 py-5 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white/40 w-[30%] md:w-[25%]">Contact</th>
                  <th className="px-4 md:px-8 py-5 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hidden md:table-cell">Registered</th>
                  <th className="px-4 md:px-8 py-5 w-[10%]"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user, idx) => (
                  <motion.tr
                    key={user._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="group border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors cursor-pointer"
                    onClick={() => setSelectedUser(user)}
                  >
                    <td className="px-2 md:px-8 py-4 md:py-5">
                      <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                        <Avatar name={user.name} size="sm" />
                        <div className="min-w-0">
                          <p className="text-xs md:text-sm font-bold text-white/80 group-hover:text-white truncate">{user.name}</p>
                          <p className="text-[9px] md:text-[10px] text-white/50 font-mono mt-0.5 truncate">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 hidden md:table-cell">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${roleStyle(user.role).cls}`}>
                        {roleStyle(user.role).label}
                      </span>
                    </td>
                    <td className="px-4 md:px-8 py-5">
                      <p className="text-[10px] md:text-xs text-white/50 truncate">{user.phoneNo || "—"}</p>
                    </td>
                    <td className="px-8 py-5 hidden md:table-cell">
                      <p className="text-[10px] font-mono text-white/50">{fmt(user.createdAt)}</p>
                    </td>
                    <td className="px-4 md:px-8 py-5 text-right">
                       <button className="p-2  rounded-lg bg-white/[0.03] text-white/40 group-hover:text-blue-500 group-hover:bg-blue-500/10 transition-all relative right-4">
                          <FiEye size={14} className="md:hidden" />
                          <FiChevronRight size={16} className="hidden md:block" />
                       </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* ── Modal (Keep existing logic, adjusted for mobile spacing) ── */}
      <AnimatePresence>
        {selectedUser && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#050508]/95 backdrop-blur-xl z-[60]"
              onClick={() => setSelectedUser(null)}
            />
            <motion.div
              initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }}
              className="fixed inset-x-0 bottom-0 md:inset-0 z-[70] flex items-end md:items-center justify-center p-0 md:p-4 pointer-events-none"
            >
              <div className="bg-[#0d0d12] border-t md:border border-white/[0.08] rounded-t-[32px] md:rounded-[40px] w-full max-w-lg overflow-hidden pointer-events-auto shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="relative h-24 md:h-32 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
                  <button onClick={() => setSelectedUser(null)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/20 flex items-center justify-center text-white/50"><FiX /></button>
                </div>
                <div className="px-6 md:px-10 pb-10">
                  <div className="-translate-y-10 flex items-end gap-4">
                    <Avatar name={selectedUser.name} size="lg" />
                    <div className="pb-2 min-w-0">
                      <h2 className="text-xl md:text-2xl font-black tracking-tight truncate">{selectedUser.name}</h2>
                      <span className={`inline-block mt-1 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${roleStyle(selectedUser.role).cls}`}>
                        {roleStyle(selectedUser.role).label}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <DetailRow icon={<FiMail size={14}/>} label="Email" value={selectedUser.email} />
                    <DetailRow icon={<FiPhone size={14}/>} label="Phone" value={selectedUser.phoneNo} />
                    <DetailRow icon={<FiBook size={14}/>} label="Course" value={selectedUser.Course} />
                    <DetailRow icon={<FiLayers size={14}/>} label="Branch" value={selectedUser.BranchName} />
                    <DetailRow icon={<FiCalendar size={14}/>} label="Joined" value={fmt(selectedUser.createdAt)} />
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