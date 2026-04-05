import { useState, useEffect } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import { 
  FaBook, FaUsers, FaFileAlt, FaEnvelope, 
  FaBars, FaTimes, FaBookOpen, FaLayerGroup 
} from "react-icons/fa";
import { MdQuiz, MdDashboard } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import UserMenu from "./UserMenu";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // 1. Default First User: Redirect to Users on initial load
  useEffect(() => {
    if (pathname === "/admin" || pathname === "/admin/") {
      navigate("/admin/users");
    }
  }, [pathname, navigate]);

  const links = [
    { name: "Users Database", icon: <FaUsers />, path: "/admin/users" },
    { name: "Add Roadmap", icon: <FaBook />, path: "/admin/add-roadmap" },
    { name: "Manage Resources", icon: <FaFileAlt />, path: "/admin/manage-resource" },
    { name: "Create Quiz", icon: <MdQuiz />, path: "/admin/create-quiz" },
    { name: "Manage Docs", icon: <FaBookOpen />, path: "/admin/docs" },
    { name: "Inquiries", icon: <FaEnvelope />, path: "/admin/contacts" },
  ];

  return (
    <div className="flex h-screen bg-[#050508] text-white overflow-hidden font-sans">
      {/* Background Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-600/10 blur-[100px] pointer-events-none" />

      {/* Sidebar */}
      <aside
        className={`fixed md:relative z-50 w-72 h-full transition-all duration-500 ease-in-out border-r border-white/5 
          backdrop-blur-xl bg-slate-950/40 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-72 md:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full p-6">
          {/* Logo Section */}
          <div className="flex items-center gap-3 px-2 mb-10">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <FaLayerGroup className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tighter leading-none">ADMIN</h1>
              <p className="text-[10px] text-blue-500 font-black tracking-[0.2em] uppercase">Control Panel</p>
            </div>
          </div>

          <div className="mb-8 px-2">
            <UserMenu />
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-4 px-2">Management</p>
            {links.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `relative flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group overflow-hidden ${
                    isActive 
                    ? "text-white bg-blue-600/10 border border-blue-500/20 shadow-inner" 
                    : "text-white/40 hover:text-white hover:bg-white/5"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className={`text-lg transition-colors ${isActive ? "text-blue-500" : "group-hover:text-blue-400"}`}>
                      {link.icon}
                    </span>
                    <span className="text-sm font-bold tracking-tight">{link.name}</span>
                    
                    {/* Active Indicator Line */}
                    {isActive && (
                      <motion.div 
                        layoutId="activePill"
                        className="absolute left-0 w-1 h-6 bg-blue-600 rounded-r-full"
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="pt-6 border-t border-white/5">
            <p className="text-[9px] text-center text-white/60 font-mono italic uppercase">Easyway Pro</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* Top bar (Mobile Only) */}
        <header className="flex items-center justify-between px-6 py-4 bg-slate-950/50 backdrop-blur-md border-b border-white/5 md:hidden relative z-40">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <FaLayerGroup size={14} />
             </div>
             <span className="font-black tracking-tighter text-sm uppercase">Easyway Admin</span>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl text-white outline-none active:scale-90 transition-transform"
          >
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="p-4 md:p-8 lg:p-10"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}