import  { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { FaBook, FaUsers, FaFileAlt, FaEnvelope, FaBars, FaTimes } from "react-icons/fa";
import UserMenu from "./UserMenu";


export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const links = [
    { name: "Add Roadmap", icon: <FaBook />, path: "/admin/add-roadmap" },
    { name: "Manage Resources", icon: <FaFileAlt />, path: "/admin/manage-resource" },
    { name: "Manage Contacts", icon: <FaEnvelope />, path: "/admin/contacts" },
    { name: "Users", icon: <FaUsers />, path: "/admin/users" },
  ];

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed md:relative z-20 bg-gray-800 w-64 p-4 space-y-6 h-full transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-64 md:translate-x-0"
        }`}
      >
        <h1 className="text-2xl font-bold text-center mb-6">Admin Panel</h1>
        <UserMenu/>
        <nav className="space-y-3">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded hover:bg-gray-700 transition ${
                  isActive ? "bg-gray-700" : ""
                }`
              }
              onClick={() => setSidebarOpen(false)} // close sidebar on mobile click
            >
              {link.icon} <span>{link.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar for mobile */}
        <div className="flex items-center justify-between bg-gray-800 p-4 md:hidden">
          <h2 className="text-xl font-bold">Admin Panel</h2>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white focus:outline-none text-2xl"
          >
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Page Content */}
        <div className="p-6 overflow-auto flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
