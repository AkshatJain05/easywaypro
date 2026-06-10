import { useState, useEffect } from "react"
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "../../src/redux/authSlice"

import {
  FaBook, FaUsers, FaFileAlt, FaEnvelope,
  FaBars, FaTimes, FaLayerGroup
} from "react-icons/fa"

import { MdQuiz } from "react-icons/md"

import {
  HiOutlineShoppingBag,
  HiOutlineCalendar,
  HiOutlineBadgeCheck,
  HiOutlineLogout,
  HiOutlineAcademicCap,
  HiOutlineExternalLink,
} from "react-icons/hi"

import { motion, AnimatePresence } from "framer-motion"
import UserMenu from "./UserMenu"

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector(s => s.auth)

  const userRole = user?.role?.toLowerCase() || "teacher"

  useEffect(() => {
    if (pathname === "/admin" || pathname === "/admin/") {
      navigate(userRole === "admin" ? "/admin/users" : "/admin/courses", { replace: true })
    }
  }, [pathname, navigate, userRole])

  const handleLogout = () => {
    dispatch(logout())
    navigate("/")
  }

  const navigationGroups = [
    {
      groupName: "Overview",
      items: [
        { name: "Dashboard", path: "/admin/revenue", icon: FaLayerGroup, allowedRoles: ["admin"] },
        { name: "Users", path: "/admin/users", icon: FaUsers, allowedRoles: ["admin"] },
      ]
    },
    {
      groupName: "Core",
      items: [
        { name: "Courses", path: "/admin/courses", icon: HiOutlineAcademicCap },
        { name: "Purchases", path: "/admin/purchases", icon: HiOutlineShoppingBag, allowedRoles: ["admin"] },
        { name: "Attendance", path: "/admin/attendance", icon: HiOutlineCalendar },
        { name: "Certificates", path: "/admin/certificates", icon: HiOutlineBadgeCheck, allowedRoles: ["admin"] },
      ]
    },
    {
      groupName: "Tools",
      items: [
        { name: "Roadmap", path: "/admin/add-roadmap", icon: FaBook },
        { name: "Resources", path: "/admin/manage-resource", icon: FaFileAlt },
        { name: "Quiz", path: "/admin/create-quiz", icon: MdQuiz },
        { name: "Docs", path: "/admin/docs", icon: FaBook },
        { name: "Contacts", path: "/admin/contacts", icon: FaEnvelope, allowedRoles: ["admin"] },
      ]
    }
  ]

  const allLinks = navigationGroups.flatMap(g => g.items)
  const activeLink = allLinks.find(l => pathname.startsWith(l.path))
  const activeLinkName = activeLink?.name || "Workspace"

  // Build breadcrumb segments from pathname
  const segments = pathname.replace("/admin/", "").split("/").filter(Boolean)
  const crumbs = ["Admin", ...segments.map(s => s.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()))]

  return (
    <div className="flex h-screen w-screen bg-gradient-to-r from-black via-gray-950 to-black text-zinc-100 overflow-hidden font-sans antialiased">

      {/* ── Sidebar ── */}
      <aside
        className={`fixed inset-y-0 left-0 md:relative z-50 w-70 h-full flex flex-col shrink-0
          bg-gradient-to-t from-black via-gray-950 to-black border-r border-white/[0.05]
          transition-transform duration-200 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >

        {/* Brand block */}
        <div className="px-4 py-4 border-b border-white/[0.05] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            {/* Logo mark */}
            <div className="relative w-7 h-7 flex-shrink-0">
              <div className="absolute inset-0 bg-amber-500 rounded-lg opacity-20 blur-md" />
              <div className="relative w-7 h-7 bg-amber-500 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-black font-black text-[11px] tracking-tighter">EW</span>
              </div>
            </div>
            <div>
              <p className="text-[13px] font-bold text-white tracking-wide">Easyway Pro</p>
              <p className="text-[12px] text-zinc-500 uppercase tracking-widest font-medium">
                {userRole === "admin" ? "Admin" : "Faculty"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden w-7 h-7 flex items-center justify-center rounded-md text-zinc-500 hover:text-zinc-200 transition-colors"
          >
            <FaTimes size={12} />
          </button>
        </div>

        {/* User identity */}
        <div className="px-3 py-2.5 border-b border-white/[0.04] shrink-0">
          <UserMenu />
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-5 scrollbar-none">
          {navigationGroups.map((group) => {
            const visibleItems = group.items.filter(
              link => !link.allowedRoles || link.allowedRoles.includes(userRole)
            )
            if (visibleItems.length === 0) return null

            return (
              <div key={group.groupName}>
                {/* Group label with amber tick */}
                <div className="flex items-center gap-2 px-2 mb-1.5">
                  <div className="w-1 h-1 rounded-full bg-amber-500/60" />
                  <span className="text-[12px] font-bold text-zinc-500 uppercase tracking-widest">
                    {group.groupName}
                  </span>
                </div>

                <div className="space-y-0.5">
                  {visibleItems.map((link) => {
                    const isActive = pathname.startsWith(link.path)
                    return (
                      <NavLink
                        key={link.path}
                        to={link.path}
                        onClick={() => setSidebarOpen(false)}
                        className={`relative flex items-center gap-2.5 px-3 py-2 rounded-lg text-md transition-all group
                          ${isActive
                            ? "text-white bg-white/[0.05]"
                            : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.03]"
                          }`}
                      >
                        {/* Active bar */}
                        {isActive && (
                          <motion.div
                            layoutId="activeBar"
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-amber-500 rounded-r-full"
                            transition={{ type: "spring", stiffness: 500, damping: 40 }}
                          />
                        )}

                        <link.icon className={`text-sm flex-shrink-0 transition-colors ${
                          isActive ? "text-amber-400" : "text-zinc-600 group-hover:text-zinc-400"
                        }`} />
                        <span className={`font-medium tracking-tight ${isActive ? "text-white" : ""}`}>
                          {link.name}
                        </span>
                      </NavLink>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-white/[0.05] shrink-0 space-y-2">
          {/* User row */}
          <div className="flex items-center gap-2.5 px-1">
            <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
              <span className="text-amber-400 font-bold text-[12px]">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-medium text-zinc-300 truncate">{user?.name || "Faculty Member"}</p>
              <p className="text-[12px] text-zinc-600 uppercase tracking-wider font-medium">{user?.role || "teacher"}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/5 border border-transparent hover:border-red-500/10 transition-all text-md font-medium cursor-pointer"
          >
            <HiOutlineLogout size={13} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* ── Main canvas ── */}
      <div className="flex-1 flex flex-col min-w-0 h-full bg-[#060608]">

        {/* Header */}
        <header className="flex items-center justify-between px-5 py-3 border-b border-white/[0.05] shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/[0.06] text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.03] md:hidden transition-all"
            >
              <FaBars size={11} />
            </button>

            {/* Breadcrumb */}
            <div className="hidden sm:flex items-center gap-1.5">
              {crumbs.map((crumb, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  {i > 0 && <span className="text-zinc-700 text-xs">/</span>}
                  <span className={`text-lg font-medium ${
                    i === crumbs.length - 1 ? "text-zinc-200" : "text-zinc-600"
                  }`}>
                    {crumb}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <NavLink
              to="/"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-zinc-400 hover:text-white hover:bg-white/[0.05] hover:border-white/10 text-xs font-medium transition-all group"
            >
              <span>View site</span>
              <HiOutlineExternalLink size={11} className="group-hover:translate-x-px group-hover:-translate-y-px transition-transform" />
            </NavLink>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto scrollbar-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12, ease: "easeOut" }}
              className="p-4 md:p-6 w-full max-w-[1400px] mx-auto"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}