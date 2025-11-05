import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import Loading from "../../component/Loading";
import {
  FaSearch,
  FaUserCircle,
  FaChevronRight,
  FaTimes,
  FaExternalLinkAlt,
} from "react-icons/fa";

// --- 1. MODAL COMPONENT ---
const UserDetailsModal = ({ user, onClose }) => {
  const DetailItem = ({ label, value }) => (
    <p className="mb-1">
      <span className="text-gray-400 font-medium mr-2">{label}:</span>
      <span className="text-gray-100 font-semibold">{value || "-"}</span>
    </p>
  );

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-gray-900 border border-emerald-600/50 p-6 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.3)] max-w-sm w-full relative transform transition-all scale-100 animate-fade-in">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-emerald-400 transition"
        >
          <FaTimes className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-emerald-400 mb-6 border-b border-gray-700 pb-2 flex items-center">
          <FaUserCircle className="text-3xl mr-3 text-emerald-500" />{" "}
          {user.name}
        </h2>

        <div className="space-y-3">
          <DetailItem label="Email" value={user.email} />
          <DetailItem label="Phone" value={user.phone || "Not provided"} />
          <DetailItem label="Role" value={user.role || "User"} />
          <DetailItem label="Course" value={user.Course} />
          <DetailItem label="Year" value={user.YearOfStudy} />
          <DetailItem label="Branch" value={user.BranchName} />
          <DetailItem
            label="Created On"
            value={new Date(user.createdAt).toLocaleDateString()}
          />
        </div>
      </div>
    </div>
  );
};

// --- 2. MAIN USERS COMPONENT ---
export default function Users() {
  const [userCount, setUserCount] = useState(0);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  const closeModal = useCallback(() => setSelectedUser(null), []);
  const handleViewDetail = useCallback((user) => setSelectedUser(user), []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [countRes, usersRes] = await Promise.all([
          axios.get(`${API_URL}/admin/users/count`),
          axios.get(`${API_URL}/admin/users?limit=1000`),
        ]);
        setUserCount(countRes.data.count);
        setUsers(usersRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [API_URL]);

  const filteredUsers = useMemo(() => {
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.phone?.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  if (loading) return <Loading />;

  return (
    <div className="p-4 md:p-8 min-h-screen text-gray-100">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-center bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
        User Dashboard
      </h1>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-center md:justify-between max-w-4xl mx-auto mb-8 space-y-4 md:space-y-0">
        <div className="bg-gray-950 border border-emerald-600/40 p-5 rounded-xl shadow-lg shadow-emerald-500/10 w-full md:w-56 text-center">
          <h2 className="text-lg font-semibold text-gray-300">Total Users</h2>
          <p className="text-3xl font-extrabold mt-1 text-emerald-400">
            {userCount}
          </p>
        </div>

        <div className="flex items-center bg-gray-950 border border-gray-700/60 rounded-xl px-4 py-3 w-full md:max-w-xs">
          <FaSearch className="text-emerald-400 mr-3" />
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none w-full placeholder-gray-500 text-gray-200 text-base"
          />
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:block bg-gray-950 border border-emerald-600/40 rounded-xl p-6 shadow-2xl overflow-x-auto max-w-6xl mx-auto">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-800 text-left uppercase text-gray-300">
              <th className="p-3 w-10">#</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Role</th>
              <th className="p-3 w-20">Created</th>
              <th className="p-3 w-16 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, idx) => (
              <tr
                key={user._id}
                className="border-b border-gray-800 hover:bg-gray-800/70 transition"
              >
                <td className="p-3">{idx + 1}</td>
                <td className="p-3 font-medium text-emerald-900">{user.name}</td>
                <td className="p-3 text-gray-300">{user.email}</td>
                <td className="p-3 text-gray-300">{user.phoneNo || "-"}</td>
                <td className="p-3 capitalize">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      user.role === "admin"
                        ? "bg-red-500/20 text-red-300"
                        : "bg-emerald-500/20 text-emerald-300"
                    }`}
                  >
                    {user.role || "user"}
                  </span>
                </td>
                <td className="p-3 text-xs text-gray-400">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => handleViewDetail(user)}
                    className="text-emerald-400 hover:text-emerald-300 transition"
                    title="View Details"
                  >
                    <FaExternalLinkAlt className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="md:hidden bg-gray-950 border border-emerald-600/40 rounded-xl shadow-xl overflow-hidden mt-4 divide-y divide-gray-800">
        <h2 className="text-xl font-bold p-4 text-gray-200">User List</h2>
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            onClick={() => handleViewDetail(user)}
            className="p-4 flex justify-between items-center hover:bg-gray-800/70 transition"
          >
            <div className="flex items-center min-w-0 flex-grow mr-4">
              <FaUserCircle className="text-3xl text-emerald-900 flex-shrink-0 mr-3" />
              <div className="min-w-0">
                <p className="text-base font-semibold text-white truncate">
                  {user.name}
                </p>
                <p className="text-sm text-gray-400 truncate">{user.email}</p>
                <p className="text-xs text-gray-500 truncate">
                  {user.phoneNo || "Not provided"}
                </p>
              </div>
            </div>
            <FaChevronRight className="w-4 h-4 text-gray-500" />
          </div>
        ))}
      </div>

      {selectedUser && (
        <UserDetailsModal user={selectedUser} onClose={closeModal} />
      )}
    </div>
  );
}
