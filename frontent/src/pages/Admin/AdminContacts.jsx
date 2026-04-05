import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaTrash, FaSearch, FaRegEnvelope, FaCopy, 
  FaClock, FaUser, FaChevronRight 
} from "react-icons/fa";
import Loading from "../../component/Loading";
import toast from "react-hot-toast";

export default function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/contacts`);
      // Sort: Latest message first
      const sortedData = (res.data || []).sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setContacts(sortedData);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchContacts(); }, []);

  // Real-time filtering
  const filtered = useMemo(() => {
    return contacts.filter(c => 
      c.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.message?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [contacts, searchTerm]);

  const deleteContact = async (id) => {
    if (!window.confirm("Permanently delete this message?")) return;
    try {
      await axios.delete(`${API_URL}/contacts/${id}`);
      setContacts(prev => prev.filter(c => c._id !== id));
      toast.success("Message deleted");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const copyEmail = (email) => {
    navigator.clipboard.writeText(email);
    toast.success("Email copied");
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-10 px-4 md:px-0">
      
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-white uppercase">Inquiries</h1>
          <p className="text-[10px] text-blue-500 font-black tracking-[0.2em] uppercase">User Submissions</p>
        </div>
        <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/10">
          <p className="text-[9px] font-black text-white/60 uppercase tracking-widest">Inbox Count</p>
          <p className="text-xl font-black text-white leading-none">{contacts.length}</p>
        </div>
      </div>

      {/* ── Search Bar ── */}
      <div className="relative">
        <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" />
        <input 
          type="text" 
          placeholder="Search by sender, email, or keywords..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#0d0d12] border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-sm text-white outline-none focus:border-blue-500/20 transition-all"
        />
      </div>

      {/* ── List / Table ── */}
      <div className=" border border-white/20 rounded-[1rem] overflow-hidden shadow-2xl">
        {/* Table Header (Desktop) */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-4 bg-white/[0.02] border-b border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
          <div className="col-span-3">Sender Details</div>
          <div className="col-span-6">Message Preview</div>
          <div className="col-span-3 text-right">Actions</div>
        </div>

        <div className="divide-y divide-white/30">
          <AnimatePresence>
            {filtered.map((contact) => {
              const isNew = new Date().getTime() - new Date(contact.createdAt).getTime() < 86400000;
              
              return (
                <motion.div 
                  layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  key={contact._id}
                  className="flex flex-col md:grid md:grid-cols-12 gap-4 px-6 md:px-8 py-6 items-start md:items-center hover:bg-white/[0.01] transition-colors group relative"
                >
                  {/* Sender Info */}
                  <div className="col-span-3 flex items-center gap-4 w-full min-w-0">
                    <div className="w-10 h-10 shrink-0 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-500">
                      <FaUser size={14} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-white/90 truncate">{contact.name}</p>
                        {isNew && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />}
                      </div>
                      <button 
                        onClick={() => copyEmail(contact.email)}
                        className="text-[12px] text-white/60 hover:text-blue-400 flex items-center gap-1 mt-0.5 transition-colors"
                      >
                        {contact.email} <FaCopy size={8} />
                      </button>
                    </div>
                  </div>

                  {/* Message Content */}
                  <div className="col-span-6 w-full">
                    <p className="text-xs text-white/70 leading-relaxed italic line-clamp-2 md:line-clamp-none">
                      "{contact.message}"
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-[9px] font-mono text-white/50 uppercase tracking-tighter">
                      <FaClock size={10} /> {new Date(contact.createdAt).toLocaleString()}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="col-span-3 flex justify-end gap-2 w-full md:w-auto pt-4 md:pt-0 border-t border-white/5 md:border-none">
                    <button 
                      onClick={() => deleteContact(contact._id)}
                      className="flex items-center gap-2 px-4 py-2 md:p-2.5 rounded-xl text-red-500/50 md:text-white/10 hover:text-red-500 hover:bg-red-500/10 transition-all md:opacity-0 md:group-hover:opacity-100"
                    >
                      <FaTrash size={14} />
                      <span className="md:hidden text-xs font-bold uppercase tracking-widest">Delete Thread</span>
                    </button>
                    <div className="hidden md:flex p-2.5 text-white/5 group-hover:hidden transition-opacity">
                      <FaChevronRight size={12}/>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="py-24 text-center">
              <FaRegEnvelope className="mx-auto text-white/5 mb-4" size={40} />
              <p className="text-white/20 font-black tracking-widest uppercase text-xs">No inquiries found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}