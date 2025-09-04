import React, { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../../component/Loading";

export default function Users() {
  const [userCount, setUserCount] = useState(0);
  const [users, setUsers] = useState([]);
  const [loading,setLoading] =useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get total users count
        const countRes = await axios.get("http://localhost:8000/api/admin/users/count");
        setUserCount(countRes.data.count);

        // Get all users
        const usersRes = await axios.get("http://localhost:8000/api/admin/users");
        setUsers(usersRes.data);
      } catch (err) {
        console.error(err);
      } finally{ 
        setLoading(false)
      }
    };
    fetchData();
  }, []);

  if(loading){
    return <Loading/>
  }
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Users</h1>

      {/* Total Users Card */}
      <div className="bg-gray-800 p-4 rounded shadow w-full md:w-48 mb-6">
        <h2 className="text-xl font-semibold">Total Users</h2>
        <p className="text-3xl font-bold mt-2">{userCount}</p>
      </div>

      {/* Users Table */}
      <div className="bg-gray-800 p-4 rounded shadow overflow-auto">
        <table className="min-w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-600">
              <th className="p-2">#</th>
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Role</th>
              <th className="p-2">Course</th>
              <th className="p-2">Year</th>
              <th className="p-2">Branch</th>
              <th className="p-2">Created At</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr key={user._id} className="border-b border-gray-700 hover:bg-gray-700">
                <td className="p-2">{idx + 1}</td>
                <td className="p-2">{user.name}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.role || "user"}</td>
                <td className="p-2">{user.Course || "-"}</td>
                <td className="p-2">{user.YearOfStudy || "-"}</td>
                <td className="p-2">{user.BranchName || "-"}</td>
                <td className="p-2">{new Date(user.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
