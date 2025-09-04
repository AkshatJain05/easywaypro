import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrash, FaPlus } from "react-icons/fa";
import Loading from "../../component/Loading";

export default function ManageResources() {
  const [resources, setResources] = useState([]);
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [type, setType] = useState("notes");
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading , setFetchLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of resources per page

  const fetchResources = async () => {
    try {
      const res = await axios.get(`${API_URL}/resources`);
      setResources(res.data);
    } catch (err) {
      console.error(err);
    } finally{
        setFetchLoading(false)
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const addResource = async (e) => {
    e.preventDefault();
    if (!title || !link || !type || !subject) {
      alert("All fields are required");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_URL}/resources`, { title, link, type, subject });
      setTitle(""); setLink(""); setType("notes"); setSubject("");
      fetchResources();
    } catch (err) {
      console.error(err);
      alert("Failed to add resource");
    }
    setLoading(false);
  };

  const deleteResource = async (id) => {
    if (!window.confirm("Are you sure you want to delete this resource?")) return;
    try {
      await axios.delete(`${API_URL}/resources/${id}`);
      fetchResources();
    } catch (err) {
      console.error(err);
      alert("Failed to delete resource");
    }
  };

  // Pagination logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentResources = resources.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(resources.length / itemsPerPage);

  if(fetchLoading){
    return <Loading/>
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-white text-center mb-6">Manage Resources</h1>

      {/* Add Resource Form */}
      <form
        onSubmit={addResource}
        className="bg-gray-900 p-6 rounded-xl shadow-md mb-8 flex flex-col gap-4"
      >
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-2 rounded bg-gray-800 text-white focus:outline-none"
        />
        <input
          type="text"
          placeholder="Link (Drive or YouTube)"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="p-2 rounded bg-gray-800 text-white focus:outline-none"
        />
        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="p-2 rounded bg-gray-800 text-white focus:outline-none"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="p-2 rounded bg-gray-800 text-white focus:outline-none"
        >
          <option value="notes">Notes</option>
          <option value="pyq">PYQ</option>
          <option value="video">Video</option>
        </select>
        <button
          type="submit"
          disabled={loading}
          className="bg-yellow-400 text-gray-900 font-semibold py-2 px-4 rounded hover:bg-yellow-500 flex items-center justify-center gap-2"
        >
          <FaPlus /> {loading ? "Adding..." : "Add Resource"}
        </button>
      </form>

      {/* Resource List */}
      <div className="space-y-4">
        {currentResources.length > 0 ? currentResources.map((res) => (
          <div
            key={res._id}
            className="bg-gray-800 p-4 rounded-xl flex items-center justify-between hover:bg-gray-700 transition"
          >
            <div>
              <p className="text-white font-semibold">{res.title}</p>
              <p className="text-gray-400 text-sm">{res.subject} | {res.type}</p>
              <a
                href={res.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-400 text-sm hover:underline"
              >
                Open Link
              </a>
            </div>
            <button
              onClick={() => deleteResource(res._id)}
              className="text-red-500 hover:text-red-600"
            >
              <FaTrash size={20} />
            </button>
          </div>
        )) : (
          <p className="text-center text-gray-400">No resources added yet.</p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1 ? "bg-yellow-400 text-gray-900" : "bg-gray-700 text-white hover:bg-gray-600"
              }`}
            >
               {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
