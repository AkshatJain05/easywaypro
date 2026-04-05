import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout, fetchUser } from "../redux/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { MdLogin, MdLogout, MdPerson, MdCardMembership } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

export default function UserMenu() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, status } = useSelector((state) => state.auth);

  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const btnRef = useRef(null);

  const initial = (user?.name || "U")[0].toUpperCase();

  useEffect(() => {
    if (status === "idle") dispatch(fetchUser());
  }, [dispatch, status]);

  useEffect(() => {
    const handleClick = (e) => {
      if (!menuRef.current || !btnRef.current) return;
      if (!menuRef.current.contains(e.target) && !btnRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const handleKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  if (status === "loading" || status === "idle") {
    return (
      <div className="h-9 w-9 rounded-full bg-slate-800 animate-pulse border border-white/5"></div>
    );
  }

  // ── LOGGED OUT STATE ──
  if (!user) {
    return (
      <div className="flex items-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/login")}
          className="hidden md:flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-900 to-indigo-700 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-lg shadow-blue-500/20 hover:brightness-110 transition-all"
        >
          Login
        </motion.button>
        <button
          onClick={() => navigate("/login")}
          className="md:hidden p-2 text-cyan-100 active:scale-90 transition-transform"
        >
          <MdLogin size={25} />
        </button>
      </div>
    );
  }

  // ── LOGGED IN STATE ──
  return (
    <div className="relative">
      <motion.button
        ref={btnRef}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((v) => !v)}
        className="relative group flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 p-[2px] shadow-lg shadow-cyan-500/10 cursor-pointer overflow-hidden"
      >
        <div className="h-full w-full rounded-full bg-slate-950 flex items-center justify-center overflow-hidden">
          {user?.profilePhoto ? (
            <img src={user.profilePhoto} alt={user.name} className="h-full w-full object-cover" />
          ) : (
            <span className="text-sm font-bold text-white">{initial}</span>
          )}
        </div>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            className="absolute z-[200] right-0 mt-3 w-64 rounded-2xl bg-slate-950/98 border border-white/10 shadow-2xl backdrop-blur-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/5 bg-white/[0.02]">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Account</p>
              <p className="truncate text-sm font-bold text-white mt-1 group cursor-default">
                {user?.name}
              </p>
              <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              <MenuLink to="/profile" icon={<MdPerson size={18} />} label="My Profile" onClick={() => setOpen(false)} />
              <MenuLink to="/certificates" icon={<MdCardMembership size={18} />} label="Certificates" onClick={() => setOpen(false)} />
              
              <div className="my-2 border-t border-white/5" />
              
              <button
                onClick={() => {
                  setOpen(false);
                  dispatch(logout());
                  navigate("/");
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer"
              >
                <MdLogout size={18} />
                <span>Logout Session</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper component for menu links
function MenuLink({ to, icon, label, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all"
    >
      <span className="text-slate-500">{icon}</span>
      {label}
    </Link>
  );
}