import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaTimes,
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
  const [roadmaps, setRoadmaps] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // ------------------------ Fetch Roadmaps ------------------------
  const fetchRoadmaps = async () => {
    setFetching(true);
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
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (activeTab === "list") fetchRoadmaps();
  }, [page, activeTab]);

  // ------------------------ Add / Edit Submit ------------------------
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
    } finally {
      setLoading(false);
    }
  };

  // ------------------------ Delete Roadmap ------------------------
  const deleteRoadmap = async (id) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2 text-sm">
          <p>Are you sure you want to delete this roadmap?</p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                setDeleting(true);
                try {
                  await axios.delete(`${API_URL}/roadmap/${id}`, {
                    withCredentials: true,
                  });
                  toast.success("Roadmap deleted");
                  fetchRoadmaps();
                } catch (err) {
                  toast.error("Error deleting roadmap");
                } finally {
                  setDeleting(false);
                }
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: 4000 }
    );
  };

  // ------------------------ Edit Roadmap ------------------------
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

  // ------------------------ Month / Step / Detail ------------------------
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

  // ------------------------ UI ------------------------
  return (
    <div className="min-h-screen px-2 md:px-10 py-8 text-gray-100 relative">
      {(fetching || deleting || loading) && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-2xl z-50">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-400"></div>
            <p className="text-green-400 font-semibold">
              {deleting
                ? "Deleting..."
                : loading
                ? "Saving..."
                : "Loading..."}
            </p>
          </div>
        </div>
      )}

      <h1 className="text-2xl md:text-4xl font-extrabold text-center mb-6 bg-gradient-to-r from-green-400 via-teal-400 to-lime-400 bg-clip-text text-transparent">
        ⚙️ Admin Roadmap Manager
      </h1>

      {/* Tabs */}
      <div className="flex justify-center mb-6 gap-2 flex-wrap">
        <button
          onClick={() => {
            setActiveTab("add");
            resetForm();
          }}
          className={`px-4 py-2 rounded-md ${
            activeTab === "add"
              ? "bg-green-600"
              : "bg-gray-800 hover:bg-gray-700"
          }`}
        >
          <FaPlus className="inline mr-2" /> Add Roadmap
        </button>
        <button
          onClick={() => setActiveTab("list")}
          className={`px-4 py-2 rounded-md ${
            activeTab === "list"
              ? "bg-green-600"
              : "bg-gray-800 hover:bg-gray-700"
          }`}
        >
          <FaListUl className="inline mr-2" /> View Roadmaps
        </button>
      </div>

      {/* Add/Edit Form */}
      {activeTab === "add" && (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-950 border border-gray-800 rounded-2xl p-4 space-y-6 shadow-lg shadow-green-500/10"
        >
          <div>
            <label className="block mb-2">Title</label>
            <input
              type="text"
              className="w-full p-2 rounded-md bg-gray-800 border border-gray-700"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-2">Description</label>
            <textarea
              className="w-full p-2 rounded-md bg-gray-800 border border-gray-700"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Months */}
          {months.map((month, mi) => (
            <div
              key={mi}
              className="border border-gray-700 rounded-md p-4 bg-gray-900 mb-4"
            >
              <div className="flex justify-between items-center mb-2">
                <input
                  type="text"
                  placeholder="Month"
                  value={month.month}
                  onChange={(e) => {
                    const newMonths = [...months];
                    newMonths[mi].month = e.target.value;
                    setMonths(newMonths);
                  }}
                  className="p-2 rounded-md bg-gray-800 border border-gray-700 w-1/2"
                />
                <button
                  type="button"
                  onClick={() => removeMonth(mi)}
                  className="text-red-400 hover:text-red-500"
                >
                  <FaTimes />
                </button>
              </div>

              {/* Steps */}
              {month.steps.map((step, si) => (
                <div
                  key={si}
                  className="border-t border-gray-700 pt-3 mt-3 space-y-2"
                >
                  <div className="flex flex-col sm:flex-row justify-between gap-2 sm:items-center">
                    <div className="flex flex-col sm:flex-row gap-2 w-full">
                      <input
                        type="text"
                        placeholder="Day"
                        value={step.day}
                        onChange={(e) => {
                          const newMonths = [...months];
                          newMonths[mi].steps[si].day = e.target.value;
                          setMonths(newMonths);
                        }}
                        className="p-2 rounded-md bg-gray-800 border border-gray-700 sm:w-24 w-full"
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
                        className="p-2 rounded-md bg-gray-800 border border-gray-700 flex-1"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeStep(mi, si)}
                      className="text-red-400 hover:text-red-500 self-end sm:self-auto"
                    >
                      <FaTrash />
                    </button>
                  </div>

                  {step.details.map((detail, di) => (
                    <div key={di} className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="Detail"
                        value={detail}
                        onChange={(e) => {
                          const newMonths = [...months];
                          newMonths[mi].steps[si].details[di] =
                            e.target.value;
                          setMonths(newMonths);
                        }}
                        className="p-2 rounded-md bg-gray-800 border border-gray-700 flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => removeDetail(mi, si, di)}
                        className="text-red-400 hover:text-red-500"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addDetail(mi, si)}
                    className="text-green-400 hover:text-green-500 text-sm"
                  >
                    + Add Detail
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => addStep(mi)}
                className="text-green-400 hover:text-green-500 text-sm mt-2"
              >
                + Add Step
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addMonth}
            className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-md w-full sm:w-auto"
          >
            + Add Month
          </button>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center mt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-green-700 hover:bg-green-800 px-4 py-2 rounded-md text-white font-semibold w-full sm:w-auto"
            >
              {editingId ? "Update Roadmap" : "Save Roadmap"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md text-white font-semibold w-full sm:w-auto"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      )}

      {/* List */}
      {activeTab === "list" && (
        <div className="bg-gray-950 border border-gray-800 rounded-2xl p-6 mt-6 shadow-lg shadow-green-500/10 overflow-x-auto">
          <table className="min-w-full border border-gray-800 text-sm md:text-base">
            <thead>
              <tr className="bg-gray-800 text-left">
                <th className="p-3 border-b border-gray-700">Title</th>
                <th className="p-3 border-b border-gray-700 hidden sm:table-cell text-center">
                  Description
                </th>
                <th className="p-3 border-b border-gray-700 hidden sm:table-cell">
                  Months
                </th>
                <th className="p-3 border-b border-gray-700 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {roadmaps.map((r) => (
                <tr
                  key={r._id}
                  className="border-b border-gray-800 hover:bg-gray-900/50"
                >
                  <td className="p-3 font-semibold">{r.title}</td>
                  <td className="p-3 hidden sm:table-cell text-justify px-8 text-gray-400">
                    {r.description}
                  </td>
                  <td className="p-3 hidden sm:table-cell text-center">
                    {r.months?.length}
                  </td>
                  <td className="p-3 text-center flex justify-center gap-2">
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
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4 text-sm sm:text-base">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-md disabled:opacity-50"
            >
              Prev
            </button>
            <p>
              Page {page} of {Math.ceil(total / limit) || 1}
            </p>
            <button
              disabled={page >= Math.ceil(total / limit)}
              onClick={() => setPage(page + 1)}
              className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
