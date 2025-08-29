import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { FaEdit } from "react-icons/fa";
import defaultPhoto from "../assets/photo.png";
import Loading from "./Loading";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateLoading , setUpdateLoading] = useState(false);

  // Fetch profile from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get("http://localhost:8000/api/auth/profile", {
          withCredentials: true,
        });
        setUser(data);
        setFormData(data);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Input change (for text fields)
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // File change (for photo)
  const handleFileChange = (e) => {
    setFormData({ ...formData, profilePhoto: e.target.files[0] });
  };

  // Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateLoading(true)
    try {
      const formDataToSend = new FormData();
      for (let key in formData) {
        formDataToSend.append(key, formData[key]);
      }

      const { data } = await axios.put(
        "http://localhost:8000/api/auth/profile",
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      setUser(data);
      toast.success("Profile updated successfully");
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-4xl mx-auto px-6 py-30">
      {/* Profile Card */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-1 shadow-lg">
        <div className="bg-black rounded-3xl p-6 relative">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            {/* Profile Photo */}
            <img
              src={
                user?.profilePhoto
                  ? user?.profilePhoto
                  : defaultPhoto
              }
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-indigo-200 shadow-md object-cover"
            />

            {/* User Info */}
            <div className="flex-1 space-y-2">
              <h2 className="text-3xl font-bold text-gray-500">{user?.name}</h2>
              <p className="text-gray-400">{user?.email}</p>
              <p className="text-gray-400">📞 {user?.phoneNo}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-300 mt-3">
                <p>
                  <span className="font-semibold">College:</span>{" "}
                  {user?.CollegeName}
                </p>
                <p>
                  <span className="font-semibold">Course:</span>{" "}
                  {user?.Course}
                </p>
                <p>
                  <span className="font-semibold">Branch:</span>{" "}
                  {user?.BranchName}
                </p>
                <p>
                  <span className="font-semibold">Year:</span>{" "}
                  {user?.YearOfStudy}
                </p>
              </div>
            </div>

            {/* Edit Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="absolute top-4 right-4 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 p-2 rounded-full"
            >
              <FaEdit size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-slate-950 backdrop-blur-md w-[90%] sm:w-[500px] max-h-[90vh] 
                   overflow-y-auto p-6 rounded-2xl shadow-2xl relative top-6"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>

              <h2 className="text-2xl font-bold mb-5 text-gray-500 text-center">
                Edit Profile
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { label: "Name", name: "name", type: "text" },
                  { label: "Phone Number", name: "phoneNo", type: "text" },
                  { label: "College Name", name: "CollegeName", type: "text" },
                  { label: "Course", name: "Course", type: "text" },
                  { label: "Branch Name", name: "BranchName", type: "text" },
                  { label: "Year of Study", name: "YearOfStudy", type: "number" },
                ].map((field, idx) => (
                  <div key={idx}>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-2 rounded-lg 
                           focus:ring-2 focus:ring-indigo-400 outline-none"
                    />
                  </div>
                ))}

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Profile Photo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full border border-gray-300 p-2 rounded-lg 
                           focus:ring-2 focus:ring-indigo-400 outline-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-gray-900 rounded-lg hover:bg-gray-800 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                    disabled={updateLoading}
                  >
                    {updateLoading ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
