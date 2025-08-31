import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout, fetchUser } from "../redux/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { MdLogin } from "react-icons/md";

export default function UserMenu() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, status } = useSelector((state) => state.auth); // use status

  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const btnRef = useRef(null);

  const initial = (user?.name || "U")[0].toUpperCase();

  const handleLoginBtn = () => {
    navigate("/login");
  };

  // Fetch user on mount
  useEffect(() => {
    if (status === "idle") dispatch(fetchUser());
  }, [dispatch, status]);

  // Close dropdown on outside click or ESC
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

  // 🔹 Show loading placeholder while fetching user
  if (status === "loading" || status === "idle") {
    return (
      <div className="flex h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
    );
  }

  // 🔹 Show login button if user is not logged in
  if (!user) {
    return (
        <>
      <button
        onClick={handleLoginBtn}
        className="hidden md:flex px-4 py-1.5 bg-slate-900 text-white font-semibold rounded-lg shadow-md hover:bg-slate-800 transition border-1 border-white"
      >
        Login
      </button>
      <button
        onClick={handleLoginBtn}
        className="md:hidden text-xl"
      >
        <MdLogin/>
      </button>
      </>
    );
  }

  // 🔹 User is logged in → show avatar + dropdown
  return (
    <div className="relative">
     <button
  ref={btnRef}
  onClick={() => setOpen((v) => !v)}
  className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full 
             bg-indigo-800 text-white font-semibold shadow hover:opacity-90 
             focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer overflow-hidden"
  title={user?.name}
>
  {user?.profilePhoto ? (
    <img
      src={user.profilePhoto}
      alt={user.name}
      className="h-full w-full object-cover"
    />
  ) : (
    <span className="text-sm sm:text-base">{initial}</span>
  )}
</button>

      {open && (
        <div
          ref={menuRef}
          className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-700 ring-1 ring-black/5 backdrop-blur"
        >
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">Signed in as</p>
            <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100 pt-1 cursor-pointer">
              {user?.name}
            </p>
          </div>

          <div className="py-1">
            <Link
              to="/profile"
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              Profile
            </Link>
            <button
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
              onClick={() => {
                setOpen(false);
                dispatch(logout());
                navigate("/");
              }}
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
