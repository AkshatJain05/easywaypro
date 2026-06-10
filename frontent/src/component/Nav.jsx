import { useState, useEffect } from "react";
import { FaBarsStaggered } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { NavLink, useLocation } from "react-router-dom";
import { FiHome, FiBookOpen, FiFileText, FiCalendar, FiCpu, FiMail } from "react-icons/fi";
import UserMenu from "./UserMenu";

const navList = [
  { name: "Home",           link: "/",              icon: FiHome },
  { name: "Courses",        link: "/courses",     icon: FiBookOpen },
  { name: "Study Material", link: "/study-material",icon: FiFileText },
  { name: "Task Planner",   link: "/task-planner",  icon: FiCalendar },
  { name: "Resume Builder", link: "/resume/dashboard",icon: FiFileText },
  { name: "AI Tools",       link: "/easyway-ai",    icon: FiCpu },
  { name: "Contact",        link: "/contact-us",    icon: FiMail },
];

function Nav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => { setOpen(false); }, [location]);

  // Prevent body scroll when sidebar open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 w-full z-[150] bg-[#030014]/70 backdrop-blur-2xl border-b border-white/8">
        <div className="max-w-7.5xl mx-auto flex items-center justify-between h-13 md:h-16 px-5 lg:px-8 text-white">

          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-1 select-none">
            <span className="text-[25px] md:text-[30px] font-black tracking-tighter bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent">
              Easyway
            </span>
            <span className="text-white text-[25px] md:text-[30px] font-extrabold tracking-tighter ml-0.5">Pro</span>
          </NavLink>

          {/* Desktop links */}
          <div className="hidden xl:flex items-center gap-0.5 bg-white/[0.03] border border-white/6 p-1 rounded-full">
            {navList.map((item) => (
              <NavLink
                key={item.link}
                to={item.link}
                className={({ isActive }) =>
                  `px-5 py-2 text-[11px] font-bold uppercase tracking-widest rounded-full transition-all duration-200 ${
                    isActive
                      ? "text-white bg-white/10"
                      : "text-slate-500 hover:text-white hover:bg-white/5"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <UserMenu />
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="xl:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/8 text-white transition-colors"
            >
              <FaBarsStaggered size={16} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Sidebar ── */}
      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[140] bg-black/70 backdrop-blur-sm transition-opacity duration-300 xl:hidden ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-[300px] z-[160] flex flex-col transition-transform duration-300 ease-in-out xl:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ background: "linear-gradient(160deg, #0a0a14 0%, #07070f 100%)" }}
      >
        {/* Decorative glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-0 w-32 h-32 bg-cyan-600/8 rounded-full blur-3xl pointer-events-none" />

        {/* Sidebar header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-5 border-b border-white/6 relative">
          <NavLink to="/" className="select-none">
            <span className="text-lg font-black tracking-tighter bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent">
              Easyway
            </span>
            <span className="text-white text-lg font-extrabold tracking-tighter ml-0.5">Pro</span>
          </NavLink>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 border border-white/8 flex items-center justify-center text-slate-400 hover:text-white transition-all"
          >
            <RxCross2 size={15} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-4 py-5 space-y-1 overflow-y-auto">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 px-3 mb-3">
            Navigation
          </p>
          {navList.map((item, i) => (
            <NavLink
              key={item.link}
              to={item.link}
              style={{ animationDelay: `${i * 40}ms` }}
              className={({ isActive }) =>
                `group flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-500/20 to-cyan-500/10 text-white border border-indigo-500/20"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                      isActive
                        ? "bg-gradient-to-br from-indigo-500 to-cyan-500 text-white shadow-md shadow-indigo-900/40"
                        : "bg-white/5 text-slate-500 group-hover:bg-white/8 group-hover:text-slate-300"
                    }`}
                  >
                    <item.icon size={14} />
                  </div>
                  <span className="tracking-tight">{item.name}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer strip */}
        <div className="px-6 py-5 border-t border-white/6">
          <p className="text-[10px] text-slate-600 text-center">
            © 2025 Easyway Pro · All rights reserved
          </p>
        </div>
      </aside>

      <div className="h-16" />
    </>
  );
}

export default Nav;