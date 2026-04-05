import { useState, useEffect } from "react";
import { FaBarsStaggered } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { NavLink, useLocation } from "react-router-dom";
import UserMenu from "./UserMenu";

function Nav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const navList = [
    { name: "Home", link: "/" },
    { name: "Study Material", link: "/study-material" },
    { name: "Task Planner", link: "/task-planner" },
    { name: "Resume Builder", link: "/resume/dashboard" },
    { name: "AI Tools", link: "/easyway-ai" },
    { name: "Contact Us", link: "/contact-us" },
  ];

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [location]);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-[150] bg-[#030014]/70 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
        <div className="max-w-8xl  mx-auto flex items-center justify-between h-12 md:h-14 px-4 md:px-8 lg:px-16 text-white">
          {/* ── LOGO SECTION ── */}
          <NavLink to="/" className="flex items-center group relative">
            <div className="flex items-baseline gap-1">
              <h1 className="text-2xl md:text-3xl font-black  transition-all duration-300 group-hover:scale-[1.02]">
                <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500 bg-clip-text text-transparent animate-gradient-x">
                  Easyway
                </span>
                <span className="text-white ml-1 font-extrabold">Pro</span>
              </h1>
            </div>

            {/* Logo Underline Sparkle */}
            <div className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-500 group-hover:w-full opacity-50 shadow-[0_0_8px_#06b6d4]"></div>
          </NavLink>

          {/* ── DESKTOP MENU ── */}
          <div className="hidden xl:flex items-center gap-2 bg-white/[0.03] border border-white/5 p-1 rounded-full px-2">
            {navList.map((item, index) => (
              <NavLink
                key={index}
                to={item.link}
                className={({ isActive }) =>
                  `relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full group ${
                    isActive
                      ? "text-cyan-400 bg-white/5 shadow-[inset_0_0_12px_rgba(255,255,255,0.05)]"
                      : "text-gray-400 hover:text-white"
                  }`
                }
              >
                {item.name}
                {/* Subtle active dot */}
                <span
                  className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-400 transition-all duration-300 ${location.pathname === item.link ? "opacity-100" : "opacity-0"}`}
                ></span>
              </NavLink>
            ))}
          </div>

          {/* ── ACTION AREA ── */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <UserMenu />
            </div>

            <div className="flex gap-2 items-center justify-center">
              <div className="sm:hidden  border-b border-white/5 ">
                <UserMenu />
              </div>

              {/* Mobile Toggle */}
              <button
                onClick={() => setOpen(!open)}
                className="xl:hidden relative w-10 h-10 flex items-center justify-center text-xl transition-all active:scale-90"
              >
                {open ? (
                  <RxCross2 size={29} className="text-red-400" />
                ) : (
                  <FaBarsStaggered size={24} className="text-white" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── MOBILE SIDEBAR ── */}
      <div
        className={`fixed inset-0 z-[140] ${open ? "visible" : "invisible"} transition-all duration-300`}
      >
        {/* Backdrop with enhanced blur */}
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity duration-500 ${open ? "opacity-100" : "opacity-0"}`}
          onClick={() => setOpen(false)}
        />

        {/* Sidebar Content */}
        <div
          className={`absolute top-0 right-0 h-full w-[300px] border-l border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${open ? "translate-x-0" : "translate-x-full"}`}
          style={{
            background: "linear-gradient(180deg, #050508 0%, #0a0a14 100%)",
          }}
        >
          {/* Inner Glass Overlay */}
          <div className="absolute inset-0 bg-gray-950 pointer-events-none" />

          <div className="relative h-full flex flex-col p-6 pt-16">
            {/* Navigation Header */}
            <div className="mb-10 px-2">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">
                Main Menu
              </span>
              <div className="h-[1px] w-10 bg-indigo-500/40 mt-2" />
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-col gap-2.5">
              {navList.map((item, index) => (
                <NavLink
                  key={index}
                  to={item.link}
                  style={{
                    transitionDelay: open ? `${index * 60}ms` : "0ms",
                  }}
                  className={({ isActive }) =>
                    `group relative flex items-center justify-between p-4 rounded-2xl transition-all duration-500 ${
                      open
                        ? "translate-x-0 opacity-100"
                        : "translate-x-12 opacity-0"
                    } ${
                      isActive
                        ? "bg-white/[0.05] text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                        : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={`text-sm font-bold tracking-tight transition-transform duration-300 ${isActive ? "translate-x-1" : "group-hover:translate-x-2"}`}
                      >
                        {item.name}
                      </span>

                      {/* Active Glow Indicator */}
                      {isActive && (
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_12px_#818cf8]" />
                          {/* Vertical line indicator */}
                          <div className="absolute left-0 w-1 h-6 bg-indigo-500 rounded-full shadow-[0_0_15px_#6366f1]" />
                        </div>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Professional Footer Card */}
            <div
              className={`mt-auto pb-6 transition-all duration-700 delay-300 ${open ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
            >
              <div className="p-5 rounded-3xl   text-center group/footer hover:bg-white/[0.04] transition-colors">
                <p className="text-[10px] uppercase tracking-[0.4em] text-slate-400 font-black mb-1 group-hover/footer:text-indigo-400 transition-colors">
                  Easyway Pro
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="h-12 md:h-14"></div>
    </>
  );
}

export default Nav;
