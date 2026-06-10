import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiTrash2, FiSearch, FiMail, FiCopy, 
  FiClock, FiUser, FiChevronRight, FiInbox, FiInbox as FiInboxOpen
} from "react-icons/fi";
import Loading from "../../component/Loading";
import toast from "react-hot-toast";

const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";
const fmtTime = (d) => d ? new Date(d).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "";

export default function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/contacts`);
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

  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return contacts.filter(c => 
      c.name?.toLowerCase().includes(q) || 
      c.email?.toLowerCase().includes(q) ||
      c.message?.toLowerCase().includes(q)
    );
  }, [contacts, searchTerm]);

  const deleteContact = async (id, e) => {
    e.stopPropagation(); // Stop drawer expansion event chain on action execution
    if (!window.confirm("Permanently delete this inquiry from backend database records?")) return;
    try {
      await axios.delete(`${API_URL}/contacts/${id}`);
      setContacts(prev => prev.filter(c => c._id !== id));
      if (selectedMessage?._id === id) setSelectedMessage(null);
      toast.success("Inquiry purged successfully");
    } catch (err) {
      toast.error("Purge sequence failed");
    }
  };

  const copyEmail = (email, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(email);
    toast.success("Email copied to clipboard");
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-[#050508] text-white px-4 md:px-8 py-6 md:py-10 selection:bg-blue-500/30 overflow-x-hidden relative">
      <div className="fixed top-[-10%] left-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-blue-600/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 relative z-10">
        
        {/* ── Header ── */}
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/[0.04] pb-6">
          <div>
            <nav className="flex items-center gap-2 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-1.5 md:mb-2">
              <span>Infrastructure Dashboard</span> <span className="w-1 h-1 rounded-full bg-white/10" /> <span>Communications Hub</span>
            </nav>
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase">
              Inquiries <span className="text-blue-600">Inbox</span>
            </h1>
          </div>
          <div className="bg-gradient-to-r from-black via-gray-950 to-black px-5 py-3 rounded-2xl border border-slate-700 flex items-center gap-4 self-start sm:self-auto">
            <div>
              <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.15em]">Active Registry</p>
              <p className="text-2xl font-black text-white leading-none mt-1">{contacts.length}</p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
              <FiInbox size={15} />
            </div>
          </div>
        </header>

        {/* ── Toolbar Search Panel ── */}
        <div className="relative group">
          <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-blue-500 transition-colors " size={16} />
          <input 
            type="text" 
            placeholder="Search payload metrics by sender identity, explicit string keywords..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black border-slate-700 rounded-2xl py-4 pl-14 pr-6 text-sm text-white outline-none focus:border-blue-500/30 transition-all placeholder:text-white/20 shadow-inner"
          />
        </div>

        {/* ── Infrastructure Data Representation ── */}
        <main className="bg-gradient-to-r from-black to-black border border-slate-700 rounded-[24px] md:rounded-[32px] overflow-hidden shadow-2xl">
          <div className="w-full overflow-x-hidden">
            <table className="w-full text-left border-collapse table-fixed">
              <thead>
                <tr className="border-b border-slate-800 bg-white/[0.01]">
                  <th className="px-5 md:px-8 py-4 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white/40 w-[85%] md:w-[30%]">Sender Reference</th>
                  <th className="px-6 py-4 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hidden md:table-cell md:w-[53%]">Message Metadata Context</th>
                  <th className="px-5 md:px-8 py-4 w-[15%] md:w-[17%] text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.02]">
                <AnimatePresence>
                  {filtered.map((contact) => {
                    const isNew = new Date().getTime() - new Date(contact.createdAt).getTime() < 86400000;
                    
                    return (
                      <motion.tr 
                        layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        key={contact._id}
                        onClick={() => setSelectedMessage(contact)}
                        className="group hover:bg-white/[0.01] transition-all cursor-pointer border-b border-slate-800"
                      >
                        {/* Column A: Sender Info Identity */}
                        <td className="px-5 md:px-8 py-5 vertical-align-middle">
                          <div className="flex items-center gap-3.5 overflow-hidden">
                            <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-blue-600/10 to-blue-800/5 border border-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform relative">
                              <FiUser size={14} />
                              {isNew && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-blue-500 ring-4 ring-[#050508] animate-pulse" />}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs md:text-sm font-bold text-white/80 group-hover:text-white truncate transition-colors">{contact.name}</p>
                              <button 
                                onClick={(e) => copyEmail(contact.email, e)}
                                className="text-[10px] md:text-xs font-mono text-white/40 hover:text-blue-400 flex items-center gap-1 mt-0.5 transition-colors group/btn"
                              >
                                <span className="truncate max-w-[140px] md:max-w-none">{contact.email}</span>
                                <FiCopy size={10} className="shrink-0 opacity-40 group-hover/btn:opacity-100 transition-opacity" />
                              </button>
                            </div>
                          </div>
                        </td>

                        {/* Column B: Message Context Body Frame (Desktop Only) */}
                        <td className="px-6 py-5 hidden md:table-cell vertical-align-middle">
                          <div className="max-w-full">
                            <p className="text-xs text-white/60 leading-relaxed truncate group-hover:text-white/90 transition-colors">
                              "{contact.message}"
                            </p>
                            <div className="flex items-center gap-2 mt-1.5 text-[9px] font-mono text-white/20 tracking-wider">
                              <FiClock size={10} /> 
                              <span>{fmtDate(contact.createdAt)}</span>
                              <span className="opacity-40">•</span>
                              <span>{fmtTime(contact.createdAt)}</span>
                            </div>
                          </div>
                        </td>

                        {/* Column C: Interactive Administrative Trigger Utilities */}
                        <td className="px-5 md:px-8 py-5 text-right vertical-align-middle">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={(e) => deleteContact(contact._id, e)}
                              className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.04] text-white/30 md:opacity-0 group-hover:opacity-100 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all cursor-pointer"
                              title="Purge Communication Data"
                            >
                              <FiTrash2 size={14} />
                            </button>
                            <div className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.04] text-white/20 group-hover:text-blue-400 group-hover:bg-blue-500/10 group-hover:border-blue-500/20 transition-all hidden md:block">
                              <FiChevronRight size={14} />
                            </div>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Empty Data Placeholder Layout Module */}
          {filtered.length === 0 && (
            <div className="py-24 text-center max-w-sm mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-center text-white/10 mx-auto mb-4">
                <FiMail size={24} />
              </div>
              <p className="text-sm font-bold text-white/80 tracking-tight">No Communications Cataloged</p>
              <p className="text-xs text-white/30 mt-1">There are no structural data threads matched against your filter token parameters.</p>
            </div>
          )}
        </main>
      </div>

      {/* ── Interactive Workspace Detail Sliding Sidebar Panel Drawer ── */}
      <AnimatePresence>
        {selectedMessage && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#050508]/80 backdrop-blur-md z-[60]"
              onClick={() => setSelectedMessage(null)}
            />
            <motion.div
              initial={{ 
                opacity: 0, 
                x: typeof window !== 'undefined' && window.innerWidth < 768 ? 0 : 120, 
                y: typeof window !== 'undefined' && window.innerWidth < 768 ? 120 : 0 
              }} 
              animate={{ opacity: 1, x: 0, y: 0 }} 
              exit={{ 
                opacity: 0, 
                y: typeof window !== 'undefined' && window.innerWidth < 768 ? 120 : 0, 
                x: typeof window !== 'undefined' && window.innerWidth < 768 ? 0 : 120 
              }}
              className="fixed inset-x-0 bottom-0 md:inset-y-0 md:right-0 md:left-auto z-[70] flex items-end md:items-stretch justify-center p-0 pointer-events-none"
            >
              <div className="bg-gradient-to-r from-slate-950 to-black border-t md:border-t-0 md:border-l border-white/[0.08] rounded-t-[32px] md:rounded-t-none w-full max-w-lg overflow-hidden pointer-events-auto shadow-2xl flex flex-col max-h-[92vh] md:max-h-screen">
                
                {/* Header Profile Title Panel */}
                <div className="p-6 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-transparent border-b border-white/[0.04] shrink-0 flex items-center justify-between">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-400 border border-blue-500/10 shrink-0">
                      <FiUser size={16} />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-base font-black tracking-tight text-white truncate">{selectedMessage.name}</h2>
                      <p className="text-[11px] font-mono text-white/40 truncate mt-0.5">{selectedMessage.email}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedMessage(null)} 
                    className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-white/40 hover:text-white transition-colors cursor-pointer shrink-0"
                  >
                    <FiChevronRight size={16} className="rotate-90 md:rotate-0" />
                  </button>
                </div>

                {/* Main Dynamic View Scroll Content Track */}
                <div className="p-6 overflow-y-auto space-y-6 flex-1 hide-scrollbar">
                  
                  {/* Meta Activity Spec Details Block */}
                  <div className="space-y-2">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30">Inquiry Telemetry</p>
                    <div className="bg-white/[0.01] border border-white/[0.04] p-4 rounded-2xl flex items-center gap-4 text-xs font-mono text-white/60">
                      <FiClock size={14} className="text-blue-500 shrink-0" />
                      <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                        <span className="text-white/80 font-bold">{fmtDate(selectedMessage.createdAt)}</span>
                        <span className="text-white/20">at</span>
                        <span className="text-white/80 font-bold">{fmtTime(selectedMessage.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Message Core Body Specification Workspace */}
                  <div className="space-y-2 flex-1">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30">Submission Text Content Payload</p>
                    <div className="bg-[#050508] border border-white/[0.06] p-5 rounded-2xl relative group">
                      <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap font-sans selection:bg-blue-600/40">
                        {selectedMessage.message}
                      </p>
                    </div>
                  </div>

                  {/* Actions Toolbox Footer Boundary Area */}
                  <div className="pt-4 border-t border-white/[0.04] flex gap-3">
                    <a 
                      href={`mailto:${selectedMessage.email}`}
                      className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-center py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-blue-600/10 flex items-center justify-center gap-2 p-1"
                    >
                      <FiMail size={12} />
                      Compose Email Response
                    </a>
                    <button 
                      onClick={(e) => deleteContact(selectedMessage._id, e)}
                      className="px-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl transition-all cursor-pointer"
                      title="Purge Communication Block"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>

                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}