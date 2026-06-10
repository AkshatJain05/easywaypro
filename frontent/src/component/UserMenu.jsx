import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout, fetchUser } from "../redux/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { MdLogout, MdPerson, MdCardMembership } from "react-icons/md";
import { FiLayout, FiBook, FiAward } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function UserMenu() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, status } = useSelector((state) => state.auth);

  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const btnRef = useRef(null);

  // 1. Fetch user only if idle
  useEffect(() => {
    if (status === "idle") dispatch(fetchUser());
  }, [dispatch, status]);

  // 2. Efficient Event Handling
  const closeMenu = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return; // Only add listener when menu is open

    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target) && !btnRef.current.contains(e.target)) {
        closeMenu();
      }
    };
    const handleKey = (e) => e.key === "Escape" && closeMenu();

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open, closeMenu]);

  const initial = useMemo(() => (user?.name || "U")[0].toUpperCase(), [user?.name]);

  if (status === "loading" || status === "idle") {
    return <div className="h-9 w-9 rounded-full bg-slate-800 animate-pulse border border-white/5" />;
  }

  if (!user) {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        onClick={() => navigate("/login")}
        className="px-5 py-2 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-slate-200 transition-all"
      >
        Login
      </motion.button>
    );
  }

  return (
    <div className="relative">
      <motion.button
        ref={btnRef}
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center justify-center h-9 w-9 rounded-full bg-gradient-to-tr from-amber-500 to-orange-400 p-[2px]"
      >
        <div className="h-full w-full rounded-full bg-black flex items-center justify-center overflow-hidden">
          {user?.profilePhoto ? (
            <img src={user.profilePhoto} alt={user.name} className="h-full w-full object-cover" />
          ) : (
            <span className="text-xs font-bold text-white">{initial}</span>
          )}
        </div>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className="absolute z-[200] right-0 mt-3 w-64 rounded-2xl bg-black border border-slate-700 shadow-2xl overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-white/5 bg-white/[0.02]">
              <p className="text-sm font-bold text-white truncate">{user?.name}</p>
              <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
            </div>

            <div className="p-2">
              <MenuLink to="/dashboard" icon={<FiLayout />} label="Dashboard" onClick={closeMenu} />
              <MenuLink to="/my-courses" icon={<FiBook />} label="My Courses" onClick={closeMenu} />
              <MenuLink to="/certificates" icon={<MdCardMembership />} label="Certificates" onClick={closeMenu} />
              <div className="my-2 border-t border-white/5" />
              <MenuLink to="/profile" icon={<MdPerson />} label="Edit Profile" onClick={closeMenu} />
              <button
                onClick={() => { dispatch(logout()); closeMenu(); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-red-400 hover:bg-red-500/5 rounded-xl transition-all"
              >
                <MdLogout size={16} /> Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const MenuLink = React.memo(({ to, icon, label, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
  >
    <span className="text-slate-600">{icon}</span>
    {label}
  </Link>
));