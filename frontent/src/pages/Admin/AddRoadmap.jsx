import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaTable,
  FaTimes,
  FaSave,
  FaListUl,
} from "react-icons/fa";
import toast from "react-hot-toast";

export default function RoadmapAdmin() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [activeTab, setActiveTab] = useState("add");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [months, setMonths] = useState([
    { month: "", steps: [{ day: "", topic: "", details: [""] }] },
  ]);
  const [loading, setLoading] = useState(false);
  const [roadmaps, setRoadmaps] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);

  /* ------------------------------ Fetch Roadmaps ------------------------------ */
  const fetchRoadmaps = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/roadmap?page=${page}&limit=${limit}`,
        { withCredentials: true }
      );
      setRoadmaps(res.data.roadmaps || []);
      setTotal(res.data.count || 0);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load roadmaps");
    }
  };

  useEffect(() => {
    if (activeTab === "list") fetchRoadmaps();
  }, [page, activeTab]);

  /* ------------------------------ Add / Edit Submit ------------------------------ */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !title ||
      months.some((m) => !m.month || m.steps.some((s) => !s.day || !s.topic))
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        await axios.put(
          `${API_URL}/roadmap/${editingId}`,
          { title, description, months },
          { withCredentials: true }
        );
        toast.success("Roadmap updated successfully");
      } else {
        await axios.post(
          `${API_URL}/roadmap`,
          { title, description, months },
          { withCredentials: true }
        );
        toast.success("Roadmap added successfully");
      }
      resetForm();
      if (activeTab === "list") fetchRoadmaps();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save roadmap");
    }
    setLoading(false);
  };

  /* ------------------------------ Delete Roadmap ------------------------------ */
  const deleteRoadmap = async (id) => {
    if (!confirm("Delete this roadmap?")) return;
    try {
      await axios.delete(`${API_URL}/roadmap/${id}`, { withCredentials: true });
      toast.success("Roadmap deleted");
      fetchRoadmaps();
    } catch (err) {
      toast.error("Error deleting roadmap");
    }
  };

  /* ------------------------------ Edit Roadmap ------------------------------ */
  const handleEdit = (r) => {
    setActiveTab("add");
    setEditingId(r._id);
    setTitle(r.title);
    setDescription(r.description);
    setMonths(r.months);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setMonths([{ month: "", steps: [{ day: "", topic: "", details: [""] }] }]);
  };

  /* ------------------------------ Month/Step/Detail helpers ------------------------------ */
  const addMonth = () =>
    setMonths([
      ...months,
      { month: "", steps: [{ day: "", topic: "", details: [""] }] },
    ]);

  const removeMonth = (mi) => setMonths(months.filter((_, i) => i !== mi));

  const addStep = (mi) => {
    const newMonths = [...months];
    newMonths[mi].steps.push({ day: "", topic: "", details: [""] });
    setMonths(newMonths);
  };

  const removeStep = (mi, si) => {
    const newMonths = [...months];
    newMonths[mi].steps.splice(si, 1);
    setMonths(newMonths);
  };

  const addDetail = (mi, si) => {
    const newMonths = [...months];
    newMonths[mi].steps[si].details.push("");
    setMonths(newMonths);
  };

  const removeDetail = (mi, si, di) => {
    const newMonths = [...months];
    newMonths[mi].steps[si].details.splice(di, 1);
    setMonths(newMonths);
  };

  /* ------------------------------ UI ------------------------------ */
  return (
    <div className="min-h-screen  px-2 md:px-10 py-8 text-gray-100">
      <h1 className="text-2xl md:text-4xl font-extrabold text-center mb-4 md:mb-10 bg-gradient-to-r from-green-400 via-teal-400 to-lime-400 bg-clip-text text-transparent">
        ⚙️ Admin Roadmap Manager
      </h1>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-10 flex-wrap">
        <button
          onClick={() => setActiveTab("add")}
          className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all ${
            activeTab === "add"
              ? "bg-green-600 text-white"
              : "bg-gray-800 hover:bg-gray-700"
          }`}
        >
          <FaPlus /> Add / Edit Roadmap
        </button>
        <button
          onClick={() => setActiveTab("list")}
          className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all ${
            activeTab === "list"
              ? "bg-green-600 text-white"
              : "bg-gray-800 hover:bg-gray-700"
          }`}
        >
          <FaTable /> View All
        </button>
      </div>

      {/* Add / Edit Form */}
      {activeTab === "add" && (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-950 border border-gray-800 rounded-2xl p-4 space-y-6 shadow-lg shadow-green-500/10"
        >
          <h2 className="text-2xl font-bold text-green-400 mb-3">
            {editingId ? "✏️ Edit Roadmap" : "🧭 Add New Roadmap"}
          </h2>

          <div className="space-y-3">
            <input
              type="text"
              placeholder="Roadmap Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 bg-gray-900 rounded focus:ring-2 focus:ring-green-500 outline-none"
            />
            <textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 bg-gray-900 rounded focus:ring-2 focus:ring-green-500 outline-none"
              rows="3"
            />
          </div>

          {months.map((month, mi) => (
            <div
              key={mi}
              className="bg-gray-900 p-4 rounded-lg space-y-4 border border-gray-700"
            >
              <div className="flex justify-between items-center">
                <input
                  type="text"
                  placeholder={`Month ${mi + 1}`}
                  value={month.month}
                  onChange={(e) => {
                    const newMonths = [...months];
                    newMonths[mi].month = e.target.value;
                    setMonths(newMonths);
                  }}
                  className="p-3 bg-gray-800 w-full rounded focus:ring-2 focus:ring-green-500 outline-none"
                />
                {months.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMonth(mi)}
                    className="ml-3 text-red-500 hover:text-red-400"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>

              {month.steps.map((step, si) => (
                <div
                  key={si}
                  className="bg-gray-800 p-3 rounded-lg space-y-3 border border-gray-700"
                >
                  <div className="flex flex-col md:flex-row gap-3">
                    <input
                      type="text"
                      placeholder="Day"
                      value={step.day}
                      onChange={(e) => {
                        const newMonths = [...months];
                        newMonths[mi].steps[si].day = e.target.value;
                        setMonths(newMonths);
                      }}
                      className="flex-1 p-3 bg-gray-900 rounded focus:ring-2 focus:ring-green-500 outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Topic"
                      value={step.topic}
                      onChange={(e) => {
                        const newMonths = [...months];
                        newMonths[mi].steps[si].topic = e.target.value;
                        setMonths(newMonths);
                      }}
                      className="flex-1 p-3 bg-gray-900 rounded focus:ring-2 focus:ring-green-500 outline-none"
                    />
                    {month.steps.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeStep(mi, si)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>

                  {/*  Details Points */}
                  <div className="ml-0 sm:,ml-2 space-y-2">
                    {step.details.map((detail, di) => (
                      <div key={di} className="flex flex-col sm:flex-row sm:items-center gap-3 bg-gray-900/60 p-3 rounded-lg border border-gray-700">
                        <FaListUl className="text-green-400 flex-shrink-0" />
                        <input
                          type="text"
                          placeholder={`Point ${di + 1}`}
                          value={detail}
                          onChange={(e) => {
                            const newMonths = [...months];
                            newMonths[mi].steps[si].details[di] =
                              e.target.value;
                            setMonths(newMonths);
                          }}
                          className="flex-1 p-2 bg-gray-900 rounded focus:ring-2 focus:ring-green-500 outline-none"
                        />
                        {step.details.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeDetail(mi, si, di)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => addDetail(mi, si)}
                      className="text-green-400 hover:text-green-300 flex items-center gap-2 mt-1 text-sm"
                    >
                      <FaPlus /> Add Point
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => addStep(mi)}
                className="bg-green-700 hover:bg-green-800 text-white py-2 px-4 rounded shadow-md flex items-center gap-2"
              >
                <FaPlus /> Add Step
              </button>
            </div>
          ))}

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={addMonth}
              className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 rounded flex items-center gap-2 shadow-md"
            >
              <FaPlus /> Add Month
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded flex items-center gap-2 shadow-md"
            >
              {loading ? (
                "Processing..."
              ) : editingId ? (
                <>
                  <FaSave /> Update
                </>
              ) : (
                "Submit"
              )}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded flex items-center gap-2 shadow-md"
              >
                <FaTimes /> Cancel
              </button>
            )}
          </div>
        </form>
      )}

      {/* View All */}
      {activeTab === "list" && (
        <div className="bg-gray-950 border border-gray-800 rounded-2xl p-6 mt-6 shadow-lg shadow-green-500/10">
          <h2 className="text-2xl font-bold mb-6 text-green-400">
            📋 All Roadmaps
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-gray-300">
              <thead>
                <tr className="border-b border-gray-700 text-gray-400">
                  <th className="p-3 text-left">Title</th>
                  {/* <th className="p-3 text-left">Created</th> */}
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {roadmaps.length > 0 ? (
                  roadmaps.map((r) => (
                    <tr
                      key={r._id}
                      className="border-b border-gray-800 hover:bg-gray-800/60 transition"
                    >
                      <td className="p-3">{r.title}</td>
                      {/* <td className="p-3">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </td> */}
                      <td className="p-3 flex gap-4">
                        <button
                          onClick={() => handleEdit(r)}
                          className="text-blue-400 hover:text-blue-500"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => deleteRoadmap(r._id)}
                          className="text-red-400 hover:text-red-500"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-gray-500">
                      No roadmaps found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
