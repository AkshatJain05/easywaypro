import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaTrash, FaPlus, FaSearch, FaExternalLinkAlt, 
  FaFileAlt, FaVideo, FaChevronRight 
} from "react-icons/fa";
import Loading from "../../component/Loading";

export default function ManageResources() {
  const [resources, setResources] = useState([]);
  const [form, setForm] = useState({ title: "", link: "", type: "notes", subject: "" });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchResources = async () => {
    try {
      const res = await axios.get(`${API_URL}/resources`);
      setResources(Array.isArray(res.data) ? res.data : []);
    } catch (err) { console.error(err); }
    finally { setFetchLoading(false); }
  };

  useEffect(() => { fetchResources(); }, []);

  const filtered = useMemo(() => {
    return resources.filter(res => {
      const q = searchTerm.toLowerCase();
      const matchesSearch = res.title?.toLowerCase().includes(q) || res.subject?.toLowerCase().includes(q);
      const matchesType = activeFilter === "all" || res.type === activeFilter;
      return matchesSearch && matchesType;
    });
  }, [resources, searchTerm, activeFilter]);

  const addResource = async (e) => {
    e.preventDefault();
    if (!form.title || !form.link || !form.subject) return alert("Fill all fields");
    setLoading(true);
    try {
      await axios.post(`${API_URL}/resources`, form);
      setForm({ title: "", link: "", type: "notes", subject: "" });
      fetchResources();
    } catch (err) { alert("Error adding"); }
    setLoading(false);
  };

  const deleteResource = async (id) => {
    if (!window.confirm("Delete this entry?")) return;
    try {
      await axios.delete(`${API_URL}/resources/${id}`);
      fetchResources();
    } catch (err) { alert("Delete failed"); }
  };

  if (fetchLoading) return <Loading />;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-10 px-4 md:px-0 overflow-x-hidden">
      
      {/* ── Quick Add Form ── */}
      <div className="bg-[#0d0d12] border border-white/5 rounded-3xl p-5 md:p-6 shadow-xl">
        <h1 className="text-xl font-black tracking-tighter mb-4">RESOURCES</h1>
        <form onSubmit={addResource} className="flex flex-col lg:flex-row gap-3">
          <input 
            type="text" placeholder="Title" value={form.title}
            onChange={e => setForm({...form, title: e.target.value})}
            className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500/50"
          />
          <div className="flex gap-3">
            <input 
              type="text" placeholder="Subject" value={form.subject}
              onChange={e => setForm({...form, subject: e.target.value})}
              className="flex-1 lg:w-40 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500/50"
            />
            <select 
              value={form.type} onChange={e => setForm({...form, type: e.target.value})}
              className="w-28 bg-white/[0.03] border border-white/10 rounded-xl px-2 py-3 text-sm outline-none text-white/50"
            >
              <option value="notes">Notes</option>
              <option value="pyq">PYQ</option>
              <option value="video">Video</option>
            </select>
          </div>
          <input 
            type="text" placeholder="URL Link" value={form.link}
            onChange={e => setForm({...form, link: e.target.value})}
            className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500/50"
          />
          <button 
            type="submit" disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl px-6 py-3 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {loading ? "..." : <><FaPlus size={12}/> ADD</>}
          </button>
        </form>
      </div>

      {/* ── Search & Filters ── */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-[#0d0d12] border border-white/5 rounded-2xl p-2 md:p-3">
        <div className="relative flex-1 w-full">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
          <input 
            type="text" placeholder="Search resources..." value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-transparent pl-12 pr-4 py-2 text-sm outline-none placeholder:text-white/20"
          />
        </div>
        <div className="flex gap-1 bg-white/5 p-1 rounded-xl w-full md:w-auto overflow-x-auto hide-scrollbar">
          {['all', 'notes', 'pyq', 'video'].map(f => (
            <button 
              key={f} onClick={() => setActiveFilter(f)}
              className={`flex-1 md:flex-none px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                activeFilter === f ? "bg-white text-black" : "text-white/30 hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table / List ── */}
      <div className=" border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
        {/* Table Header (Hidden on Mobile) */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-4 bg-white/[0.02] border-b border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
          <div className="col-span-5">Content</div>
          <div className="col-span-3">Subject</div>
          <div className="col-span-2 text-center">Type</div>
          <div className="col-span-2 text-right">Action</div>
        </div>

        <div className="divide-y divide-white/[0.03]">
          <AnimatePresence>
            {filtered.map((res) => (
              <motion.div 
                layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                key={res._id}
                className="flex flex-col md:grid md:grid-cols-12 gap-4 px-6 md:px-8 py-5 items-start md:items-center hover:bg-white/[0.01] transition-colors group relative"
              >
                {/* Title Section */}
                <div className="col-span-5 flex items-center gap-4 w-full min-w-0">
                  <div className={`shrink-0 p-3 rounded-xl bg-white/5 ${res.type === 'video' ? 'text-red-500/50' : 'text-blue-500/50'}`}>
                    {res.type === 'video' ? <FaVideo size={14}/> : <FaFileAlt size={14}/>}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-white/80 group-hover:text-white transition-colors truncate">
                      {res.title}
                    </p>
                    <a href={res.link} target="_blank" rel="noreferrer" className="text-[10px] text-blue-500/60 hover:text-blue-400 flex items-center gap-1 mt-0.5">
                      Open Resource <FaExternalLinkAlt size={8}/>
                    </a>
                  </div>
                </div>

                {/* Subject Section */}
                <div className="col-span-3 md:block flex justify-between w-full md:w-auto">
                  <span className="md:hidden text-[9px] font-black uppercase text-white/20">Subject</span>
                  <span className="text-xs font-medium text-white/50">{res.subject}</span>
                </div>

                {/* Type Badge */}
                <div className="col-span-2 flex md:justify-center w-full md:w-auto justify-between">
                  <span className="md:hidden text-[9px] font-black uppercase text-white/20">Category</span>
                  <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-white/10 text-white/40 bg-white/5">
                    {res.type}
                  </span>
                </div>

                {/* Actions */}
                <div className="col-span-2 flex justify-end gap-2 w-full md:w-auto pt-2 md:pt-0 border-t border-white/5 md:border-none">
                  <button 
                    onClick={() => deleteResource(res._id)}
                    className="flex items-center gap-2 px-4 py-2 md:p-2.5 rounded-xl text-red-500/50 md:text-white/10 hover:text-red-500 hover:bg-red-500/10 transition-all md:opacity-0 md:group-hover:opacity-100"
                  >
                    <FaTrash size={14} />
                    <span className="md:hidden text-xs font-bold">Remove Resource</span>
                  </button>
                  <div className="hidden md:flex p-2.5 text-white/5 group-hover:hidden">
                    <FaChevronRight size={12}/>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}