import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { 
  MdOutlineLibraryBooks, MdAdd, MdEdit, MdSave, MdDelete, 
  MdVisibility, MdOutlineFormatListBulleted, MdCode, 
  MdCheckCircleOutline, MdImage, MdChevronLeft, MdChevronRight, MdSearch, MdFilterList
} from "react-icons/md"; 
import { BiParagraph } from "react-icons/bi";
import { FiUploadCloud, FiX, FiCheckCircle, FiLoader } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";

// Environment
const API_URL = import.meta.env.VITE_API_URL || "";
const CODE_STYLE = oneDark;

// Fixed Tailwind string interpolation spinner bug
const Spinner = ({ size = "md" }) => {
  const sizeClasses = size === "sm" ? "w-4 h-4 border-2" : "w-6 h-6 border-4";
  return (
    <div className={`${sizeClasses} inline-block border-t-sky-500 border-gray-700 rounded-full animate-spin`} />
  );
};

/* ------------------------- DocList Component ------------------------- */
function DocList({ docs, loading, selectedDocId, onSelect, onDelete, deletingId, setViewMode }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Search and Filter logic inside Document Registry Dashboard Index
  const filteredDocs = useMemo(() => {
    if (!searchTerm.trim()) return docs;
    const term = searchTerm.toLowerCase();
    return docs.filter(d => 
      (d.subject || "").toLowerCase().includes(term) || 
      (d.description || "").toLowerCase().includes(term)
    );
  }, [docs, searchTerm]);

  const totalPages = Math.ceil(filteredDocs.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDocs = filteredDocs.slice(indexOfFirstItem, indexOfLastItem);

  // Auto adjusting page overflow constraints
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [filteredDocs.length, totalPages, currentPage]);

  if (loading) {
    return (
      <div className="text-center text-gray-400 py-20 flex flex-col items-center justify-center gap-3 bg-black/20 rounded-2xl border border-white/[0.03]">
        <Spinner />
        <span className="font-mono text-xs text-gray-500 uppercase tracking-widest">Hydrating File Registry...</span>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Search and Filters Strip Bar Control Board */}
      <div className="flex items-center gap-3 bg-black/40 p-3 rounded-2xl border border-slate-700 w-full max-w-md">
        <MdSearch className="text-gray-500 flex-shrink-0" size={18} />
        <input 
          type="text" 
          placeholder="Filter documents by subject or keyword..." 
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          className="w-full bg-transparent text-xs text-white focus:outline-none  font-mono"
        />
        {searchTerm && (
          <button onClick={() => setSearchTerm("")} className="text-gray-500 hover:text-white transition">
            <FiX size={14} />
          </button>
        )}
      </div>

      {filteredDocs.length === 0 ? (
        <div className="text-center text-gray-500 py-12 bg-black/20 rounded-xl border border-dashed border-slate-700 font-mono text-xs">
          No matching documents found in target query index.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentDocs.map((d) => (
              <div
                key={d._id || d.tempId}
                className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between group bg-[#0a0618]/40 hover:bg-white/[0.01] shadow-xl relative overflow-hidden ${
                  selectedDocId === d._id 
                    ? "border-sky-500/50 shadow-[inset_0_0_20px_rgba(14,165,233,0.05)]" 
                    : "border-white/[0.04] hover:border-sky-500/30"
                }`}
              >
                <div className="min-w-0 mb-4">
                  <h3 className="font-bold text-gray-200 text-sm line-clamp-1 flex items-center gap-2 group-hover:text-white transition">
                    <MdOutlineLibraryBooks className="text-sky-400 flex-shrink-0" size={16} />
                    {d.subject || "Untitled Configuration"}
                  </h3>
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed text-justify">
                    {d.description || "No description brief metadata specified."}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-white/[0.03] pt-3.5 gap-2 mt-auto">
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => { onSelect(d); setViewMode("editor"); }}
                      className="px-2.5 py-1.5 rounded-xl bg-sky-500/15 border border-sky-500/20 text-sky-400 hover:bg-sky-500 hover:text-black font-semibold text-[11px] transition duration-200 flex items-center gap-1"
                    >
                      <MdEdit size={12} /> Refactor
                    </button>
                    <button
                      onClick={() => { onSelect(d); setViewMode("editor"); }}
                      className="px-2.5 py-1.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-gray-400 hover:text-white font-medium text-[11px] transition duration-200"
                    >
                      Inspect
                    </button>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (deletingId === d._id) return;
                      onDelete(d._id);
                    }}
                    disabled={deletingId === d._id}
                    className="text-gray-500 hover:text-rose-400 p-2 rounded-xl bg-slate-700 border border-white/[0.04] hover:border-rose-500/20 transition duration-200 disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
                    title="Purge Document"
                  >
                    {deletingId === d._id ? <Spinner size="sm" /> : <MdDelete size={14} />}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Managed Client Pagination Node Matrix Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4 select-none font-mono">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className="p-2 rounded-lg border border-white/[0.05] bg-[#0c081d] text-gray-400 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition"
              >
                <MdChevronLeft size={16} />
              </button>
              
              <div className="flex gap-1 text-xs">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg font-bold transition ${
                      currentPage === page
                        ? "bg-sky-500 text-black shadow-lg shadow-sky-500/10"
                        : "border border-white/[0.04] bg-[#0c081d] text-gray-400 hover:text-white hover:border-white/10"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                className="p-2 rounded-lg border border-white/[0.05] bg-[#0c081d] text-gray-400 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition"
              >
                <MdChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* --------------------- Main AdminPanel Component --------------------- */
export default function AdminPanel() {
  const [docs, setDocs] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  
  // Question editor state
  const [questionDraft, setQuestionDraft] = useState({ title: "", Q: "", ans: [], });
  const [ansType, setAnsType] = useState("paragraph");
  const [codeLanguage, setCodeLanguage] = useState("javascript");
  const [ansContent, setAnsContent] = useState("");
  
  // Image states for Answers
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null); 
  const [previewImageUrl, setPreviewImageUrl] = useState("");
  
  // UI state
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("list"); 
  
  // Operation states
  const [isSaving, setIsSaving] = useState(false);
  const [isAddingAnswer, setIsAddingAnswer] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);
  
  // Editing support
  const [editingIndex, setEditingIndex] = useState(null);

  /* ---------------------- Fetch Documents ---------------------- */
  const fetchDocs = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_URL}/docs`);
      setDocs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load documents.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocs();
  }, [fetchDocs]);

  /* ---------------------- Image Upload To Cloudinary Handler ---------------------- */
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreviewImageUrl(URL.createObjectURL(file));
    setUploadingImage(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const { data } = await axios.post(`${API_URL}/docs/upload-image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadedImage(data.image); 
      toast.success("Image attached successfully!");
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      toast.error("Image cloud upload failed.");
      setPreviewImageUrl("");
      setUploadedImage(null);
    } finally {
      setUploadingImage(false);
    }
  };

  const removeSelectedImage = () => {
    setUploadedImage(null);
    setPreviewImageUrl("");
    toast.success("Image attachment cleared.");
  };

  /* ---------------------- Create New Document ---------------------- */
  const handleCreateNew = () => {
    setSelectedDoc({ subject: "", description: "", questions: [] });
    setQuestionDraft({ title: "", Q: "", ans: [] });
    setAnsContent("");
    removeSelectedImage();
    setPreview(false);
    setViewMode("editor");
    setEditingIndex(null);
  };

  /* ---------------------- Delete Document ---------------------- */
  const deleteDoc = async (id) => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this document?")) {
      toast("Deletion cancelled.");
      return;
    }
    setIsDeleting(id);
    try {
      await axios.delete(`${API_URL}/docs/${id}`);
      toast.success("Document deleted.");
      await fetchDocs();
      if (selectedDoc?._id === id) {
        setSelectedDoc(null);
        setViewMode("list");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete document.");
    } finally {
      setIsDeleting(null);
    }
  };

  /* ---------------------- Save Document (create / update) ---------------------- */
  const saveDoc = async () => {
    if (!selectedDoc) return toast.error("No document to save");
    if (!selectedDoc.subject || !selectedDoc.subject.trim()) {
      return toast.error("Subject is required before saving!");
    }
    setIsSaving(true);
    try {
      if (selectedDoc._id) {
        await axios.put(`${API_URL}/docs/${selectedDoc._id}`, selectedDoc);
        toast.success("Document updated successfully!");
      } else {
        await axios.post(`${API_URL}/docs`, selectedDoc);
        toast.success("Document created successfully!");
      }
      await fetchDocs();
      setViewMode("list");
      setSelectedDoc(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save document.");
    } finally {
      setIsSaving(false);
    }
  };

  /* ---------------------- Answer / Question Handlers ---------------------- */
  const addAnswerPart = () => {
    if (!ansContent.trim() && !uploadedImage) {
      return toast.error("Enter answer content or upload an image first!");
    }
    setIsAddingAnswer(true);
    const answerObject = { type: ansType, image: uploadedImage };

    if (ansType === "points") {
      answerObject.content = ansContent
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);
    } else if (ansType === "code") {
      answerObject.content = ansContent;
      answerObject.language = codeLanguage;
    } else {
      answerObject.content = ansContent;
    }

    setQuestionDraft((prev) => ({ ...prev, ans: [...prev.ans, answerObject] }));
    setAnsContent("");
    removeSelectedImage();
    setIsAddingAnswer(false);
    toast.success("Answer block appended!");
  };

  const commitQuestionToDoc = () => {
    if (editingIndex !== null) {
      updateQuestionInDoc();
      return;
    }
    if (!questionDraft.title.trim() || !questionDraft.Q.trim() || questionDraft.ans.length === 0) {
      return toast.error("Question must have a title, body, and at least one answer part!");
    }
    setSelectedDoc((prev) => {
      const prevQuestions = Array.isArray(prev?.questions) ? prev.questions : [];
      return { ...prev, questions: [...prevQuestions, questionDraft] };
    });
    setQuestionDraft({ title: "", Q: "", ans: [] });
    toast.success("Question committed to document!");
  };

  const updateQuestionInDoc = () => {
    if (editingIndex === null) return;
    setSelectedDoc((prev) => {
      const questions = Array.isArray(prev.questions) ? [...prev.questions] : [];
      questions[editingIndex] = questionDraft;
      return { ...prev, questions };
    });
    setQuestionDraft({ title: "", Q: "", ans: [] });
    setEditingIndex(null);
    toast.success("Question structural update complete!");
  };

  const loadQuestionForEdit = (q, index) => {
    setQuestionDraft(JSON.parse(JSON.stringify(q)));
    setEditingIndex(index);
    setViewMode("editor");
    setPreview(false);
    window.scrollTo({ top: 220, behavior: "smooth" });
  };

  const removeQuestionFromDoc = (index) => {
    setSelectedDoc((prev) => {
      const questions = Array.isArray(prev.questions) ? [...prev.questions] : [];
      questions.splice(index, 1);
      return { ...prev, questions };
    });
    toast.success("Question removed from doc pipeline.");
  };

  const cancelEdit = () => {
    setQuestionDraft({ title: "", Q: "", ans: [] });
    setEditingIndex(null);
    toast("Edit context cancelled.");
  };

  const removeAnswerPartFromDraft = (index) => {
    setQuestionDraft((prev) => {
      const ans = [...prev.ans];
      ans.splice(index, 1);
      return { ...prev, ans };
    });
    toast.success("Answer section deleted.");
  };

  const handleSelectDoc = (doc) => {
    setSelectedDoc(JSON.parse(JSON.stringify(doc)));
    setViewMode("editor");
    setPreview(false);
    setQuestionDraft({ title: "", Q: "", ans: [] });
    setEditingIndex(null);
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [filterTopic, setFilterTopic] = useState("all");
  const topics = Array.from(
    new Set((selectedDoc?.questions || []).map((q) => q.title).filter(Boolean))
  );
  
  const filteredQuestions = (selectedDoc?.questions || []).filter((q) => {
    const matchesSearch = searchTerm.trim() === "" || (q.title || "").toLowerCase().includes(searchTerm.toLowerCase()) || (q.Q || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTopic = filterTopic === "all" || q.title === filterTopic;
    return matchesSearch && matchesTopic;
  });

  return (
    <div className="min-h-screen text-gray-200 font-sans p-3 sm:p-6 border-slate-900 bg-[#040209]">
      <Toaster position="top-right" reverseOrder={false} />
      
      {/* Studio Banner Header Component Control Board */}
      <header className="max-w-7xl mx-auto mb-6 p-4 sm:p-5 rounded-2xl bg-gray-950  shadow-2xl border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-base sm:text-lg font-black text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs">📝</span>
            Documentation Content Panel
          </h1>
          
          <div className="flex gap-2 flex-wrap select-none">
            <button 
              onClick={() => { setViewMode("list"); setSelectedDoc(null); }} 
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${ 
                viewMode === "list" 
                  ? "bg-sky-500 text-black shadow-lg shadow-sky-500/10" 
                  : "bg-white/[0.02] border border-white/[0.06] text-gray-400 hover:text-white" 
              }`} 
            >
              <MdOutlineLibraryBooks size={14} /> Manage Docs
            </button>
            <button 
              onClick={handleCreateNew} 
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${ 
                viewMode === "editor" && !selectedDoc?._id 
                  ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/10" 
                  : "bg-white/[0.02] border border-white/[0.06] text-gray-400 hover:text-white" 
              }`} 
            >
              <MdAdd size={14} /> Create New
            </button>
          </div>
        </div>
      </header>

      {/* Main Studio Display Workbench Frame */}
      <div className="max-w-7xl mx-auto backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-slate-900 shadow-2xl">
        
        {/* VIEW 1: MASTER REPOSITORY FILE LOOKUPS LIST INDEX */}
        {viewMode === "list" && (
          <div className="space-y-5 animate-fade-in">
            <div className="border-b border-slate-800 pb-2">
              <h2 className="text-xs font-mono font-bold text-gray-500 tracking-widest uppercase">
                Active Master Registry Manifests
              </h2>
            </div>
            <DocList
              docs={docs} 
              loading={loading} 
              selectedDocId={selectedDoc?._id} 
              onSelect={handleSelectDoc} 
              onDelete={deleteDoc} 
              deletingId={isDeleting} 
              setViewMode={setViewMode} 
            />
          </div>
        )}

        {/* VIEW 2 & 3: ADVANCED DOCK SPLIT WORKSPACE PANEL */}
        {viewMode === "editor" && selectedDoc && (
          <div className="animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 mb-5 border-b border-slate-900 gap-4">
              <div>
                <h2 className="text-sm font-bold text-sky-400 flex items-center gap-1.5 font-mono uppercase tracking-wider">
                  <MdEdit size={16} /> 
                  {selectedDoc._id ? "Edit Document File Architecture" : "Initialize Master Template File"}
                </h2>
                {selectedDoc.subject && (
                  <p className="text-[11px] font-mono text-gray-500 mt-0.5 max-w-sm truncate">
                    Focused: <span className="text-gray-300">{selectedDoc.subject}</span>
                  </p>
                )}
              </div>
              
              <button 
                onClick={() => setPreview((p) => !p)} 
                className="px-3 py-1.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-gray-300 text-xs font-semibold hover:border-sky-500/30 hover:text-sky-400 transition-all flex items-center gap-1.5 self-start sm:self-auto"
              >
                {preview ? <MdEdit size={12} /> : <MdVisibility size={12} />}
                {preview ? "Back to Workspace Editor" : "Immersive Live Preview Frame"}
              </button>
            </div>

            {!preview ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left Column Stack Sandbox Controls Input Workspace */}
                <div className="lg:col-span-7 space-y-5">
                  
                  {/* Master Configuration Global Description Blocks Meta */}
                  <div className="bg-black/30 p-4 rounded-xl border border-slate-900 space-y-3 shadow-lg">
                    <span className="block text-[10px] font-mono font-bold text-gray-500 tracking-wider uppercase">Document Configuration Meta Info</span>
                    <input 
                      type="text" 
                      placeholder="Subject Heading Context Mapping (e.g., React Lifecycle)" 
                      value={selectedDoc.subject} 
                      onChange={(e) => setSelectedDoc((prev) => ({ ...prev, subject: e.target.value }))} 
                      className="w-full p-2.5 text-xs rounded-lg bg-zinc-950 border border-slate-800 focus:border-sky-500/40 focus:outline-none text-white  font-mono" 
                    />
                    <textarea 
                      placeholder="Comprehensive structural meta summary conceptual statements summary details info details metadata description data context..." 
                      value={selectedDoc.description} 
                      onChange={(e) => setSelectedDoc((prev) => ({ ...prev, description: e.target.value }))} 
                      className="w-full p-2.5 text-xs rounded-lg bg-zinc-950 border border-slate-800 focus:border-sky-500/40 focus:outline-none text-white leading-relaxed" 
                      rows={2} 
                    />
                  </div>

                  {/* Schema Forge Component Question Input Builder Window */}
                  <div className="bg-[#03060d]/50 p-4 rounded-xl border border-slate-900 space-y-3 shadow-2xl relative">
                    <div className="flex items-center justify-between border-b border-white/[0.03] pb-2">
                      <h3 className="text-xs font-bold text-green-400 flex items-center gap-1 font-mono uppercase tracking-wider">
                        <MdAdd size={14} /> 
                        {editingIndex !== null ? "🔧 Modify Staged Matrix Element Index" : "💎 Forge Element Segment Input"}
                      </h3>
                      {editingIndex !== null && (
                        <span className="text-[9px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded uppercase">
                          Editing Position #{editingIndex + 1}
                        </span>
                      )}
                    </div>

                    <input 
                      type="text" 
                      placeholder="Component Header Title Heading Group" 
                      value={questionDraft.title} 
                      onChange={(e) => setQuestionDraft((prev) => ({ ...prev, title: e.target.value }))} 
                      className="w-full p-2.5 text-xs rounded-lg bg-zinc-950 border border-slate-800 focus:border-sky-500/40 focus:outline-none text-white" 
                    />
                    <textarea 
                      placeholder="Explicit problem specifications logic statement / text description data context (Q)" 
                      value={questionDraft.Q} 
                      onChange={(e) => setQuestionDraft((prev) => ({ ...prev, Q: e.target.value }))} 
                      className="w-full p-2.5 text-xs rounded-lg bg-zinc-950 border border-slate-800 focus:border-sky-500/40 focus:outline-none text-white leading-relaxed" 
                      rows={2} 
                    />

                    {/* Multi-Format Sub Answer Item Processing Arrays Blocks Row Fields */}
                    <div className="bg-zinc-950/70 p-3.5 border border-slate-900 rounded-xl space-y-3">
                      <div className="flex gap-2 flex-wrap items-center">
                        <select 
                          value={ansType} 
                          onChange={(e) => setAnsType(e.target.value)} 
                          className="bg-black border border-slate-800 rounded-lg p-1.5 px-2 text-[11px] text-gray-300 focus:outline-none focus:border-sky-500/40 cursor-pointer font-mono" 
                        >
                          <option value="paragraph">Paragraph Content Unit</option>
                          <option value="points">Line Item Point Matrix</option>
                          <option value="code">Syntax Code Output Engine</option>
                        </select>

                        {ansType === "code" && (
                          <select 
                            value={codeLanguage} 
                            onChange={(e) => setCodeLanguage(e.target.value)} 
                            className="bg-black border border-slate-800 rounded-lg p-1.5 px-2 text-[11px] text-gray-300 focus:outline-none cursor-pointer font-mono" 
                          >
                            <option value="javascript">JavaScript</option>
                            <option value="typescript">TypeScript</option>
                            <option value="css">CSS Framework</option>
                            <option value="html">HTML Engine</option>
                            <option value="jsx">React JSX</option>
                            <option value="python">Python Script</option>
                            <option value="sql">SQL Query</option>
                            <option value="bash">Terminal Bash</option>
                          </select>
                        )}
                      </div>

                      <div className="relative rounded-xl overflow-hidden border border-slate-800 shadow-inner">
                        <textarea 
                          placeholder={ansType === "points" ? "Separate rows clean via carriage return item line breaks...\nRow Line Element 1\nRow Line Element 2" : "Write block raw text content strings or runtime execution command properties..."} 
                          value={ansContent} 
                          onChange={(e) => setAnsContent(e.target.value)} 
                          className="w-full p-3 bg-black/40 text-xs font-mono focus:outline-none text-gray-200 min-h-[100px]" 
                          rows={4} 
                        />
                      </div>

                      {/* Integrated Cloudinary Asset System Image Engine Modules Frame Layout */}
                      <div className="pt-1">
                        {!previewImageUrl ? (
                          <label className="flex items-center gap-2 justify-center border border-dashed border-slate-800 hover:border-sky-500/30 bg-black/30 p-2.5 rounded-xl cursor-pointer transition duration-200">
                            <FiUploadCloud className="text-gray-500" size={14} />
                            <span className="text-[11px] font-mono text-gray-500">Inject Graphic payload asset</span>
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                          </label>
                        ) : (
                          <div className="flex items-center gap-3 border border-white/[0.05] rounded-xl bg-black p-2 text-xs">
                            <div className="relative w-10 h-10 rounded border border-white/10 overflow-hidden bg-zinc-950 flex-shrink-0">
                              <img src={previewImageUrl} alt="Preview asset sync stream" className="w-full h-full object-cover" />
                              {uploadingImage && (
                                <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                                  <FiLoader className="animate-spin text-sky-400" size={12} />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0 font-mono">
                              <p className="text-[10px] text-gray-400 truncate">
                                {uploadingImage ? "Syncing streams..." : "Image matched into payload pipeline buffer."}
                              </p>
                              {!uploadingImage && uploadedImage && (
                                <span className="text-[9px] text-emerald-400 flex items-center gap-1 mt-0.5">
                                  <FiCheckCircle size={10} /> Cloudinary Node Mapped
                                </span>
                              )}
                            </div>
                            {!uploadingImage && (
                              <button type="button" onClick={removeSelectedImage} className="p-1.5 text-gray-500 hover:text-rose-400 transition">
                                <FiX size={14} />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Staging Array Local Workspace Actions Buttons */}
                    <div className="flex gap-2 justify-between flex-wrap items-center pt-1">
                      <div className="flex gap-2">
                        <button 
                          onClick={addAnswerPart} 
                          disabled={isAddingAnswer || uploadingImage} 
                          className="px-3.5 py-2 bg-sky-500 hover:bg-sky-600 disabled:bg-sky-500/20 text-black font-black text-xs uppercase tracking-wide rounded-xl transition flex items-center gap-1 shadow-md" 
                        >
                          {isAddingAnswer ? <Spinner size="sm" /> : <MdAdd size={12} />} Append Block Unit
                        </button>
                        <button 
                          onClick={() => { setAnsContent(""); removeSelectedImage(); }} 
                          className="px-3 py-1.5 bg-white/[0.02] border border-white/[0.05] text-gray-400 hover:text-white rounded-xl text-xs transition"
                        >
                          Reset Inputs
                        </button>
                      </div>

                      {editingIndex !== null && (
                        <button 
                          onClick={cancelEdit} 
                          className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 text-xs font-semibold rounded-xl transition-all"
                        >
                          Cancel Target Edit
                        </button>
                      )}
                    </div>

                    {/* Staged Temporary Local Answers Components Elements Queue Lists Buffer Tracker */}
                    <div className="mt-3 pt-3 border-t border-white/[0.03] space-y-1.5">
                      <span className="block text-[10px] font-mono font-bold tracking-widest uppercase text-gray-500">Staged Block Elements Buffer Matrix ({questionDraft.ans.length})</span>
                      {questionDraft.ans.map((a, idx) => (
                        <div key={idx} className="bg-white/[0.01] border border-white/[0.04] p-2.5 rounded-xl flex justify-between items-center gap-3 text-xs font-mono animate-fade-in">
                          <div className="text-xs flex items-center flex-wrap gap-2 min-w-0">
                            <span className="flex items-center gap-1 text-sky-400 font-bold uppercase text-[10px] bg-sky-500/5 px-1.5 py-0.5 rounded border border-sky-500/10">
                              {a.type === "paragraph" && <BiParagraph size={10} />}
                              {a.type === "points" && <MdOutlineFormatListBulleted size={10} />}
                              {a.type === "code" && <MdCode size={10} />}
                              {a.type}
                            </span>
                            <span className="truncate max-w-[180px] sm:max-w-xs text-gray-400 text-[11px]">
                              {Array.isArray(a.content) ? a.content.join(" // ") : a.content || "[Graphical Payload Node Only Data]"}
                            </span>
                            {a.image?.url && (
                              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/5 text-emerald-400 text-[9px] border border-emerald-500/10 font-bold">
                                <MdImage size={10} /> MEDIA BOUND
                              </span>
                            )}
                          </div>
                          <button onClick={() => removeAnswerPartFromDraft(idx)} className="text-gray-500 hover:text-rose-400 transition flex-shrink-0">
                            <FiX size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Master Inject Structural Blueprint Control Button Row Handler */}
                  <button 
                    onClick={commitQuestionToDoc} 
                    className="w-full px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-black text-xs uppercase tracking-widest rounded-xl hover:opacity-95 transition-all flex justify-center items-center gap-1.5 shadow-xl shadow-emerald-500/5" 
                  >
                    <MdCheckCircleOutline size={15} /> 
                    {editingIndex !== null ? "Update Element Unit Parameters Context" : "Push Input Configuration to Temporary Array Stack"}
                  </button>

                </div>

                {/* Right Column Canvas Sticky Console: Committed Structural Array Maps Dashboard List View */}
                <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-4">
                  <div className="p-4 bg-[#0a0618]/40 rounded-2xl border border-white/[0.04] space-y-4 shadow-2xl">
                    <div className="border-b border-white/[0.03] pb-2">
                      <h3 className="text-[10px] font-mono tracking-widest text-gray-500 uppercase font-black">
                        Temporary Blueprint Stack Layout ({selectedDoc.questions?.length || 0})
                      </h3>
                    </div>

                    {(!selectedDoc.questions || selectedDoc.questions.length === 0) ? (
                      <div className="text-center py-16 border border-dashed border-white/[0.03] rounded-xl bg-black/10">
                        <p className="text-[11px] font-mono text-gray-600 max-w-[180px] mx-auto leading-relaxed">
                          No schema properties currently assigned to manifest map pipeline tracking buffers.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                        {selectedDoc.questions.map((q, i) => (
                          <div 
                            key={i} 
                            className={`p-3 border rounded-xl transition-all duration-300 flex justify-between items-center gap-4 ${
                              editingIndex === i 
                                ? "border-amber-500/40 bg-amber-500/[0.01] shadow-[inset_0_0_15px_rgba(245,158,11,0.02)]" 
                                : "border-white/[0.03] bg-white/[0.01] hover:border-white/[0.08]"
                            }`}
                          >
                            <div className="min-w-0 flex-1">
                              <h4 className="font-bold text-gray-200 text-xs truncate">
                                <span className="text-gray-600 font-mono text-[10px] mr-0.5">[{i + 1}]</span> {q.title}
                              </h4>
                              <p className="text-[10px] font-mono text-gray-500 truncate mt-0.5">{q.Q}</p>
                            </div>
                            <div className="flex gap-1 flex-shrink-0">
                              <button 
                                onClick={() => loadQuestionForEdit(q, i)} 
                                className={`p-1.5 rounded-lg transition ${editingIndex === i ? "text-amber-400 bg-amber-400/10" : "text-gray-500 hover:text-sky-400 hover:bg-white/5"}`}
                                title="Edit Node Segment Elements Instance"
                              >
                                <MdEdit size={14} />
                              </button>
                              <button 
                                onClick={() => removeQuestionFromDoc(i)} 
                                className="p-1.5 rounded-lg text-gray-500 hover:text-rose-400 hover:bg-white/5 transition"
                              >
                                <MdDelete size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* DB Production Push Target Trigger Layout Button Wrapper */}
                    <div className="pt-3 border-t border-white/[0.03]">
                      <button 
                        onClick={saveDoc} 
                        disabled={isSaving} 
                        className="w-full py-2.5 bg-sky-500 hover:bg-sky-600 text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all disabled:opacity-40 flex items-center justify-center gap-1.5 shadow-xl shadow-sky-500/5" 
                      >
                        {isSaving ? <Spinner size="sm" /> : <MdSave size={14} />} 
                        {isSaving ? "Synchronizing matrices..." : selectedDoc._id ? "Commit Overridden Master Changes" : "Deploy Master Production Blueprint"}
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              
              /* IMMERSIVE LIVE VIEW PREVIEW SCREEN CANVAS CONTROLLER */
              <div className="space-y-5 max-w-5xl mx-auto animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-zinc-950/40 p-2.5 rounded-2xl border border-white/[0.04]">
                  <div className="w-full sm:w-1/2 flex items-center gap-2 p-2 px-3 rounded-xl bg-zinc-950 border border-white/[0.05]">
                    <MdSearch className="text-gray-600" size={14} />
                    <input 
                      type="text" 
                      placeholder="Filter questions within this document..." 
                      value={searchTerm} 
                      onChange={(e) => setSearchTerm(e.target.value)} 
                      className="w-full bg-transparent text-xs text-white focus:outline-none font-mono" 
                    />
                  </div>
                  <div className="w-full sm:w-1/4 flex items-center gap-2 p-2 px-3 rounded-xl bg-zinc-950 border border-white/[0.05]">
                    <MdFilterList className="text-gray-600" size={14} />
                    <select 
                      value={filterTopic} 
                      onChange={(e) => setFilterTopic(e.target.value)} 
                      className="w-full bg-transparent text-xs text-gray-400 focus:outline-none cursor-pointer font-mono" 
                    >
                      <option value="all">Display All Topic Tree Maps</option>
                      {topics.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pl-3 border-l-2 border-sky-400/50">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-sky-500/60 font-bold">Immersive Environment Preview Frame</span>
                  <h2 className="text-lg font-black text-white tracking-tight break-words mt-0.5">{selectedDoc.subject || "Untitled Document Framework Structural Layout Instance Container"}</h2>
                </div>

                {selectedDoc.description && (
                  <p className="text-xs text-gray-400 leading-relaxed text-justify break-words border-b border-white/[0.03] pb-4 px-1">
                    {selectedDoc.description}
                  </p>
                )}

                <div className="flex flex-col gap-4">
                  {filteredQuestions.length === 0 ? (
                    <p className="text-center py-10 font-mono text-xs text-gray-500">No logs configuration strings matched specifications bounds inside indices lookup.</p>
                  ) : (
                    filteredQuestions.map((q, i) => (
                      <div key={i} className="border border-white/[0.04] rounded-2xl p-4 sm:p-5 bg-[#030109] shadow-2xl space-y-4 hover:border-white/[0.08] transition duration-300">
                        <div>
                          <span className="text-[9px] font-mono tracking-widest uppercase text-sky-400/70 font-black">UNIT CLUSTER MATRIX MODULE #{i + 1}</span>
                          <h3 className="text-sm font-bold text-gray-200 mt-0.5 break-words">{q.title}</h3>
                        </div>
                        
                        <p className="text-xs text-gray-400 text-justify bg-white/[0.01] border border-white/[0.02] p-3 rounded-xl pl-3 leading-relaxed">{q.Q}</p>
                        
                        <div className="flex flex-col gap-3.5">
                          {q.ans.map((a, j) => (
                            <div key={j} className="space-y-2.5">
                              {a.type === "code" ? (
                                <div className="relative rounded-2xl overflow-hidden border border-white/[0.05] shadow-2xl w-full mx-auto">
                                  <div className="flex items-center justify-between bg-black/60 px-3 py-1.5 border-b border-white/[0.03]">
                                    <div className="flex space-x-1">
                                      <span className="w-1.5 h-1.5 bg-red-500/20 rounded-full" />
                                      <span className="w-1.5 h-1.5 bg-amber-500/20 rounded-full" />
                                      <span className="w-1.5 h-1.5 bg-emerald-500/20 rounded-full" />
                                    </div>
                                    <span className="text-[9px] text-gray-500 font-mono tracking-widest uppercase">{a.language || "Code"} Block</span>
                                  </div>
                                  <div className="text-xs font-mono">
                                    <SyntaxHighlighter 
                                      language={a.language || "javascript"} 
                                      style={CODE_STYLE} 
                                      customStyle={{ background: "#000000", padding: "1rem", fontSize: "0.75rem", margin: 0, lineHeight: "1.5" }} 
                                    >
                                      {a.content}
                                    </SyntaxHighlighter>
                                  </div>
                                </div>
                              ) : Array.isArray(a.content) ? (
                                <ul className="space-y-1.5 bg-zinc-950/40 border border-white/[0.04] rounded-xl p-3.5 w-full">
                                  {a.content.map((p, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-xs text-gray-300 text-justify break-words">
                                      <span className="flex-none mt-1.5 w-1 h-1 rounded-full bg-sky-500/50" />
                                      {p}
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                a.content && (
                                  <div className="bg-zinc-950/40 border border-white/[0.04] rounded-xl p-3 w-full">
                                    <p className="text-xs text-gray-300 text-justify leading-relaxed break-words">
                                      <span className="text-amber-400 font-bold font-mono mr-1">ANS.</span>{a.content}
                                    </p>
                                  </div>
                                )
                              )}

                              {/* Asset Rendering Image Node Payload Box */}
                              {a.image?.url && (
                                <div className="w-full relative rounded-2xl border border-white/[0.05] bg-[#07040f]/10 p-2 shadow-2xl">
                                  <div className="relative z-10 w-full rounded-xl overflow-hidden bg-black/40 border border-white/[0.02] flex items-center justify-center p-2">
                                    <img 
                                      src={a.image.url} 
                                      alt="Render illustrative structural context target matrix display link" 
                                      className="w-auto h-auto max-w-full max-h-[350px] object-contain block rounded-lg" 
                                      loading="lazy" 
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}





































































//backup Code

// import React, { useState, useEffect, useCallback } from "react";
// import axios from "axios";
// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
// import {
//   MdOutlineLibraryBooks,
//   MdAdd,
//   MdEdit,
//   MdSave,
//   MdDelete,
//   MdVisibility,
//   MdOutlineFormatListBulleted,
//   MdCode,
//   MdCheckCircleOutline,
// } from "react-icons/md";
// import { BiParagraph } from "react-icons/bi";
// import toast, { Toaster } from "react-hot-toast";

// // Environment
// const API_URL = import.meta.env.VITE_API_URL || "";
// const CODE_STYLE = oneDark;

// const Spinner = ({ size = 6 }) => (
//   <div
//     className={`inline-block w-${size} h-${size} border-4 border-t-sky-500 border-gray-700 rounded-full animate-spin`}
//   />
// );

// /* ------------------------- DocList Component ------------------------- */
// function DocList({
//   docs,
//   loading,
//   selectedDocId,
//   onSelect,
//   onDelete,
//   deletingId,
// }) {
//   return (
//     <div className="w-full h-full overflow-y-auto">
//       {loading ? (
//         <p className="text-center text-gray-400 py-10 flex items-center justify-center">
//           <Spinner /> Loading documents...
//         </p>
//       ) : (
//         <div className="space-y-3">
//           {docs.length === 0 && (
//             <p className="text-center text-gray-500 text-sm py-4">
//               No documents found.
//             </p>
//           )}

//           {docs.map((d) => (
//             <div
//               key={d._id || d.tempId}
//               className={`p-3 rounded-lg cursor-pointer border transition duration-150 flex justify-between items-start ${
//                 selectedDocId === d._id
//                   ? "border-sky-500 bg-[#0f172a] shadow-inner"
//                   : "border-[#334155] hover:border-sky-500 hover:bg-[#253245]"
//               }`}
//               onClick={() => onSelect(d)}
//             >
//               <div>
//                 <h3 className="font-semibold text-sky-300 text-base line-clamp-1 flex items-center">
//                   <MdOutlineLibraryBooks className="mr-2 text-yellow-400" />
//                   {d.subject || "Untitled"}
//                 </h3>
//                 <p className="text-xs text-gray-400 mt-1 line-clamp-2">
//                   {d.description}
//                 </p>
//               </div>

//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   if (deletingId === d._id) return;
//                   onDelete(d._id);
//                 }}
//                 disabled={deletingId === d._id}
//                 className="text-red-400 hover:text-red-500 text-lg p-1 ml-2 rounded-full hover:bg-[#334155] disabled:opacity-50 disabled:cursor-not-allowed"
//                 title="Delete Document"
//               >
//                 {deletingId === d._id ? <Spinner /> : <MdDelete />}
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// /* --------------------- Main AdminPanel Component --------------------- */
// export default function AdminPanel() {
//   const [docs, setDocs] = useState([]);
//   const [selectedDoc, setSelectedDoc] = useState(null);

//   // Question editor state
//   const [questionDraft, setQuestionDraft] = useState({
//     title: "",
//     Q: "",
//     ans: [],
//   });
//   const [ansType, setAnsType] = useState("paragraph");
//   const [codeLanguage, setCodeLanguage] = useState("javascript");
//   const [ansContent, setAnsContent] = useState("");

//   // UI state
//   const [preview, setPreview] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [viewMode, setViewMode] = useState("list");

//   // operation states
//   const [isSaving, setIsSaving] = useState(false);
//   const [isAddingAnswer, setIsAddingAnswer] = useState(false);
//   const [isDeleting, setIsDeleting] = useState(null);

//   // Editing support
//   const [editingIndex, setEditingIndex] = useState(null);

//   /* ---------------------- Fetch Documents ---------------------- */
//   const fetchDocs = useCallback(async () => {
//     try {
//       setLoading(true);
//       const { data } = await axios.get(`${API_URL}/docs`);
//       setDocs(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to load documents.");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchDocs();
//   }, [fetchDocs]);

//   /* ---------------------- Create New Document (local only) ---------------------- */
//   const handleCreateNew = () => {
//     setSelectedDoc({ subject: "", description: "", questions: [] });
//     setQuestionDraft({ title: "", Q: "", ans: [] });
//     setAnsContent("");
//     setPreview(false);
//     setViewMode("editor");
//     setEditingIndex(null);
//   };

//   /* ---------------------- Delete Document ---------------------- */
//   const deleteDoc = async (id) => {
//     if (!id) return;
//     if (!window.confirm("Are you sure you want to delete this document?")) {
//       toast("Deletion cancelled.");
//       return;
//     }

//     const promise = axios.delete(`${API_URL}/docs/${id}`);
//     toast.promise(promise, {
//       loading: "Deleting document...",
//       success: async () => {
//         // refresh list after deletion
//         await fetchDocs();
//         if (selectedDoc?._id === id) {
//           setSelectedDoc({ subject: "", description: "", questions: [] });
//           setViewMode("editor");
//         }
//         setIsDeleting(null);
//         return "Document deleted.";
//       },
//       error: "Failed to delete document.",
//     });

//     try {
//       setIsDeleting(id);
//       await promise;
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setIsDeleting(null);
//     }
//   };

//   /* ---------------------- Save Document (create / update) ---------------------- */
//   const saveDoc = async () => {
//     if (!selectedDoc) return toast.error("No document to save");
//     if (!selectedDoc.subject || !selectedDoc.subject.trim()) {
//       return toast.error("Subject is required before saving!");
//     }

//     setIsSaving(true);
//     try {
//       let promise;
//       if (selectedDoc._id) {
//         promise = axios.put(`${API_URL}/docs/${selectedDoc._id}`, selectedDoc);
//       } else {
//         promise = axios.post(`${API_URL}/docs`, selectedDoc);
//       }

//       await toast.promise(promise, {
//         loading: selectedDoc._id
//           ? "Updating document..."
//           : "Creating document...",
//         success: async (res) => {
//           await fetchDocs();
//           // after create, set selected doc to null to show list OR use returned doc
//           setViewMode("list");
//           setSelectedDoc(null);
//           return selectedDoc._id
//             ? "Doc updated successfully!"
//             : "Doc created successfully!";
//         },
//         error: "Failed to save document.",
//       });
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   /* ---------------------- Answer / Question Handlers ---------------------- */
//   const addAnswerPart = () => {
//     if (!ansContent.trim()) return toast.error("Enter answer content first");

//     setIsAddingAnswer(true);

//     // build answer object
//     const answerObject = { type: ansType };
//     if (ansType === "points") {
//       answerObject.content = ansContent
//         .split("\n")
//         .map((l) => l.trim())
//         .filter(Boolean);
//     } else if (ansType === "code") {
//       answerObject.content = ansContent;
//       answerObject.language = codeLanguage;
//     } else {
//       answerObject.content = ansContent;
//     }

//     // update draft question immutably
//     setQuestionDraft((prev) => ({ ...prev, ans: [...prev.ans, answerObject] }));
//     setAnsContent("");
//     setIsAddingAnswer(false);
//     toast.success("Answer part added!");
//   };

//   const commitQuestionToDoc = () => {
//     // if editingIndex is set, do update instead
//     if (editingIndex !== null) {
//       updateQuestionInDoc();
//       return;
//     }

//     if (
//       !questionDraft.title.trim() ||
//       !questionDraft.Q.trim() ||
//       questionDraft.ans.length === 0
//     ) {
//       return toast.error(
//         "Question must have a title, body, and at least one answer part!"
//       );
//     }

//     setSelectedDoc((prev) => {
//       const prevQuestions = Array.isArray(prev?.questions)
//         ? prev.questions
//         : [];
//       return { ...prev, questions: [...prevQuestions, questionDraft] };
//     });

//     setQuestionDraft({ title: "", Q: "", ans: [] });
//     toast.success("Question committed to document!");
//   };

//   const updateQuestionInDoc = () => {
//     if (editingIndex === null) return;

//     setSelectedDoc((prev) => {
//       const questions = Array.isArray(prev.questions)
//         ? [...prev.questions]
//         : [];
//       // replace at index
//       questions[editingIndex] = questionDraft;
//       return { ...prev, questions };
//     });

//     setQuestionDraft({ title: "", Q: "", ans: [] });
//     setEditingIndex(null);
//     toast.success("Question updated successfully!");
//   };

//   const loadQuestionForEdit = (q, index) => {
//     setQuestionDraft(JSON.parse(JSON.stringify(q)));
//     setEditingIndex(index);
//     // ensure editor visible
//     setViewMode("editor");
//     setPreview(false);
//   };

//   const removeQuestionFromDoc = (index) => {
//     setSelectedDoc((prev) => {
//       const questions = Array.isArray(prev.questions)
//         ? [...prev.questions]
//         : [];
//       questions.splice(index, 1);
//       return { ...prev, questions };
//     });
//     toast("Question removed from doc.", { icon: "🗑️" });
//   };

//   const cancelEdit = () => {
//     setQuestionDraft({ title: "", Q: "", ans: [] });
//     setEditingIndex(null);
//     toast("Edit cancelled.");
//   };

//   const removeAnswerPartFromDraft = (index) => {
//     setQuestionDraft((prev) => {
//       const ans = [...prev.ans];
//       ans.splice(index, 1);
//       return { ...prev, ans };
//     });
//     toast("Answer part removed.");
//   };

//   /* ---------------------- UI helper: select doc ---------------------- */
//   const handleSelectDoc = (doc) => {
//     // ensure a copy to avoid accidental mutation
//     setSelectedDoc(JSON.parse(JSON.stringify(doc)));
//     setViewMode("editor");
//     setPreview(false);
//     setQuestionDraft({ title: "", Q: "", ans: [] });
//     setEditingIndex(null);
//   };

//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterTopic, setFilterTopic] = useState("all");
//   const topics = Array.from(
//     new Set((selectedDoc?.questions || []).map((q) => q.title).filter(Boolean))
//   );
//   const filteredQuestions = (selectedDoc?.questions || []).filter((q) => {
//     const matchesSearch =
//       searchTerm.trim() === "" ||
//       (q.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (q.Q || "").toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesTopic = filterTopic === "all" || q.title === filterTopic;
//     return matchesSearch && matchesTopic;
//   });

//   /* ---------------------- Render ---------------------- */
//   return (
//     <div className="min-h-screen text-gray-200 font-sans p-4 sm:p-6">
//       {/* <Toaster position="top-right" reverseOrder={false} /> */}

//       <header className="max-w-7xl mx-auto mb-6 p-4 rounded-xl bg-[#01040a] shadow-2xl border border-[#334155]">
//         <h1 className="text-2xl font-extrabold text-white mb-4">
//           📝 Documentation CMS
//         </h1>
//         <div className="flex gap-4 flex-wrap">
//           <button
//             onClick={() => setViewMode("list")}
//             className={`px-1 py-2 rounded-lg font-semibold transition flex items-center ${
//               viewMode === "list"
//                 ? "bg-sky-600 text-white shadow-lg"
//                 : "bg-gray-700 hover:bg-gray-600"
//             }`}
//           >
//             <MdOutlineLibraryBooks className="mr-2 text-xl" /> Manage Docs
//           </button>

//           <button
//             onClick={handleCreateNew}
//             className={`px-4 py-2 rounded-lg font-semibold transition flex items-center ${
//               viewMode === "editor" && !selectedDoc?._id
//                 ? "bg-green-600 text-white shadow-lg"
//                 : "bg-gray-700 hover:bg-gray-600"
//             }`}
//           >
//             <MdAdd className="mr-2 text-xl" /> Create New
//           </button>

//           {selectedDoc?._id && viewMode === "editor" && (
//             <div className="px-4 py-2 rounded-lg font-semibold transition bg-sky-600 text-white shadow-lg flex items-center">
//               <MdEdit className="mr-2 text-xl" /> Editing:{" "}
//               {selectedDoc.subject || "Untitled"}
//             </div>
//           )}
//         </div>
//       </header>

//       <div className="max-w-7xl mx-auto bg-[#040109] p-5 rounded-xl border border-[#334155] shadow-2xl">
//         {viewMode === "list" && (
//           <div>
//             <h2 className="text-2xl font-bold text-sky-400 mb-4 border-b border-[#334155] pb-2">
//               All Documents
//             </h2>
//             <DocList
//               docs={docs}
//               loading={loading}
//               selectedDocId={selectedDoc?._id}
//               onSelect={handleSelectDoc}
//               onDelete={deleteDoc}
//               deletingId={isDeleting}
//             />
//           </div>
//         )}

//         {viewMode === "editor" && selectedDoc && (
//           <>
//             <div className="flex items-center justify-between mb-5 border-b border-[#334155] pb-3">
//               <h2 className="text-2xl font-bold text-sky-400 flex items-center">
//                 <MdEdit className="mr-2" />{" "}
//                 {selectedDoc._id ? "Edit Document" : "New Document"}
//               </h2>

//               <button
//                 onClick={() => setPreview((p) => !p)}
//                 className="px-2 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-sm font-semibold transition shadow-md flex items-center"
//               >
//                 {!preview ? (
//                   <MdVisibility className="mr-1 text-lg" />
//                 ) : (
//                   <MdEdit className="mr-2 text-lg" />
//                 )}
//                 {preview ? "Editor" : "Preview"}
//               </button>
//             </div>

//             {!preview ? (
//               <div className="space-y-6">
//                 <div className="bg-[#01040a] p-4 rounded-lg border border-[#334155]">
//                   <h3 className="text-sm font-semibold text-gray-400 mb-2">
//                     Document Details
//                   </h3>
//                   <input
//                     type="text"
//                     placeholder="Subject (e.g., React Hooks)"
//                     value={selectedDoc.subject}
//                     onChange={(e) =>
//                       setSelectedDoc((prev) => ({
//                         ...prev,
//                         subject: e.target.value,
//                       }))
//                     }
//                     className="w-full mb-3 p-3 rounded-lg bg-[#080f1b] border border-[#334155] focus:border-sky-500 text-base"
//                   />
//                   <textarea
//                     placeholder="Description"
//                     value={selectedDoc.description}
//                     onChange={(e) =>
//                       setSelectedDoc((prev) => ({
//                         ...prev,
//                         description: e.target.value,
//                       }))
//                     }
//                     className="w-full p-3 rounded-lg bg-[#080f1b] border border-[#334155] focus:border-sky-500 text-base"
//                     rows={3}
//                   />
//                 </div>

//                 {/* Question Editor */}
//                 <div className="bg-[#03060d] p-4 rounded-lg border border-[#334155]">
//                   <h3 className="text-lg font-semibold text-green-400 mb-3 border-b border-[#334155] pb-2 flex items-center">
//                     <MdAdd className="mr-1 text-xl" />{" "}
//                     {editingIndex !== null
//                       ? "Edit Question"
//                       : "Add New Question"}
//                   </h3>

//                   <input
//                     type="text"
//                     placeholder="Question Title"
//                     value={questionDraft.title}
//                     onChange={(e) =>
//                       setQuestionDraft((prev) => ({
//                         ...prev,
//                         title: e.target.value,
//                       }))
//                     }
//                     className="w-full mb-3 p-3 rounded-lg bg-[#080f1b] border border-[#334155]"
//                   />

//                   <textarea
//                     placeholder="Question body (Q)"
//                     value={questionDraft.Q}
//                     onChange={(e) =>
//                       setQuestionDraft((prev) => ({
//                         ...prev,
//                         Q: e.target.value,
//                       }))
//                     }
//                     className="w-full mb-3 p-3 rounded-lg bg-[#080f1b] border border-[#334155]"
//                     rows={2}
//                   />

//                   <div className="mb-3">
//                     <div className="flex gap-4 flex-wrap mb-3">
//                       <select
//                         value={ansType}
//                         onChange={(e) => setAnsType(e.target.value)}
//                         className="bg-[#080f1b] border border-[#334155] rounded-lg p-2 text-sm flex-shrink-0"
//                       >
//                         <option value="paragraph">Paragraph</option>
//                         <option value="points">Points (One per line)</option>
//                         <option value="code">Code Block</option>
//                       </select>

//                       {ansType === "code" && (
//                         <select
//                           value={codeLanguage}
//                           onChange={(e) => setCodeLanguage(e.target.value)}
//                           className="bg-[#080f1b] border border-[#334155] rounded-lg p-2 text-sm flex-shrink-0"
//                         >
//                           <option value="javascript">JavaScript</option>
//                           <option value="typescript">TypeScript</option>
//                           <option value="css">CSS</option>
//                           <option value="html">HTML</option>
//                           <option value="jsx">JSX</option>
//                           <option value="python">Python</option>
//                           <option value="sql">SQL</option>
//                           <option value="java">Java</option>
//                           <option value="c">C</option>
//                           <option value="cpp">C++</option>
//                           <option value="bash">Shell/Bash</option>
//                         </select>
//                       )}
//                     </div>

//                     <div className="relative rounded-lg overflow-hidden border border-[#444] shadow-xl mb-3">
//                       <div className="flex items-center bg-[#010003] px-3 py-2 border-b border-[#444]">
//                         <div className="flex space-x-1.5">
//                           <span className="w-3 h-3 bg-red-500 rounded-full" />
//                           <span className="w-3 h-3 bg-yellow-500 rounded-full" />
//                           <span className="w-3 h-3 bg-green-500 rounded-full" />
//                         </div>
//                         <span className="ml-auto text-xs text-gray-400 font-mono">
//                           {ansType === "code" ? codeLanguage : ansType}
//                         </span>
//                       </div>

//                       <textarea
//                         placeholder={
//                           ansType === "points"
//                             ? "Enter points, one per line."
//                             : "Answer content (code or text)"
//                         }
//                         value={ansContent}
//                         onChange={(e) => setAnsContent(e.target.value)}
//                         className="w-full p-4 rounded-b-lg bg-black border-none text-sm resize-none font-mono focus:outline-none"
//                         rows={8}
//                       />
//                     </div>
//                   </div>

//                   <div className="flex gap-3">
//                     <button
//                       onClick={addAnswerPart}
//                       disabled={isAddingAnswer}
//                       className="px-4 py-2 bg-sky-600 rounded-lg hover:bg-sky-700 text-sm font-semibold transition shadow-md flex items-center disabled:opacity-50 disabled:cursor-wait"
//                     >
//                       {isAddingAnswer ? (
//                         <Spinner />
//                       ) : (
//                         <MdAdd className="mr-1 text-lg" />
//                       )}
//                       Add Answer Part
//                     </button>

//                     <button
//                       onClick={() => {
//                         setAnsContent("");
//                       }}
//                       className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 text-sm font-semibold transition shadow-md"
//                     >
//                       Clear
//                     </button>

//                     {editingIndex !== null && (
//                       <button
//                         onClick={cancelEdit}
//                         className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 text-sm font-semibold transition shadow-md"
//                       >
//                         Cancel Edit
//                       </button>
//                     )}
//                   </div>

//                   <div className="mt-4 space-y-2 border-t border-[#334155] pt-4">
//                     <h4 className="text-sm font-semibold text-gray-400">
//                       Answer Parts ({questionDraft.ans.length})
//                     </h4>

//                     {questionDraft.ans.map((a, idx) => (
//                       <div
//                         key={idx}
//                         className="bg-[#1e293b] border border-[#334155] p-2 rounded-lg flex justify-between items-center"
//                       >
//                         <p className="text-xs flex items-center">
//                           {a.type === "paragraph" && (
//                             <BiParagraph className="mr-1 text-base text-sky-400" />
//                           )}
//                           {a.type === "points" && (
//                             <MdOutlineFormatListBulleted className="mr-1 text-base text-sky-400" />
//                           )}
//                           {a.type === "code" && (
//                             <MdCode className="mr-1 text-base text-sky-400" />
//                           )}

//                           <span className="font-semibold mr-2">
//                             [{a.type.toUpperCase()}]
//                           </span>

//                           {Array.isArray(a.content)
//                             ? a.content.join(" / ")
//                             : (a.content || "").substring(0, 120) +
//                               ((a.content || "").length > 120 ? "..." : "")}

//                           {a.language && (
//                             <span className="text-xs text-gray-500 ml-2">
//                               ({a.language})
//                             </span>
//                           )}
//                         </p>

//                         <div className="flex items-center gap-2">
//                           <button
//                             onClick={() => removeAnswerPartFromDraft(idx)}
//                             className="text-red-400 hover:text-red-500 text-lg p-1"
//                           >
//                             <MdDelete />
//                           </button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                   <button
//                     onClick={commitQuestionToDoc}
//                     className="w-full mt-4 px-4 py-2.5 bg-green-600 rounded-lg hover:bg-green-700 font-bold transition shadow-lg flex justify-center items-center"
//                   >
//                     <MdCheckCircleOutline className="mr-1 text-xl" />{" "}
//                     {editingIndex !== null
//                       ? "Update Question"
//                       : "Commit Question to Doc"}
//                   </button>
//                 </div>

//                 {/* Existing Questions */}
//                 <div className="space-y-3 p-4 bg-[#02060f] rounded-lg border border-[#334155]">
//                   <h3 className="text-lg font-semibold text-yellow-400 border-b border-[#334155] pb-2">
//                     Doc Questions ({selectedDoc.questions?.length || 0})
//                   </h3>

//                   {(selectedDoc.questions || []).map((q, i) => (
//                     <div
//                       key={i}
//                       className="p-3 border border-[#334155] rounded-lg bg-[#1e293b] flex justify-between items-start"
//                     >
//                       <div>
//                         <h4 className="text-yellow-400 font-semibold text-base">
//                           {i + 1}. {q.title}
//                         </h4>
//                         <p className="text-xs opacity-70 mt-1">{q.Q}</p>
//                       </div>

//                       <div className="flex gap-2">
//                         <button
//                           onClick={() => loadQuestionForEdit(q, i)}
//                           className="text-sky-400 hover:text-sky-500 text-lg p-1"
//                           title="Edit Question"
//                         >
//                           <MdEdit />
//                         </button>

//                         <button
//                           onClick={() => removeQuestionFromDoc(i)}
//                           className="text-red-400 hover:text-red-500 text-lg p-1"
//                         >
//                           <MdDelete />
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 <div className="mt-8 text-center border-t border-[#334155] pt-5">
//                   <button
//                     onClick={saveDoc}
//                     disabled={isSaving}
//                     className="px-8 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 font-bold text-lg transition shadow-2xl flex items-center justify-center mx-auto disabled:opacity-50 disabled:cursor-wait"
//                   >
//                     {isSaving ? (
//                       <Spinner />
//                     ) : (
//                       <MdSave className="mr-2 text-xl" />
//                     )}
//                     {isSaving
//                       ? selectedDoc._id
//                         ? "Updating..."
//                         : "Saving..."
//                       : selectedDoc._id
//                       ? "Update Document"
//                       : "Save Document"}
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               /* Preview Mode */
//               /* Preview Mode */
//               <div className="space-y-6">
//                 {/* Search & Filter Controls */}
//                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//                   <input
//                     type="text"
//                     placeholder="Search questions..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="w-full sm:w-1/2 p-3 rounded-lg bg-[#080f1b] border border-[#334155] text-sm"
//                   />
//                   <select
//                     value={filterTopic}
//                     onChange={(e) => setFilterTopic(e.target.value)}
//                     className="w-full sm:w-1/4 p-3 rounded-lg bg-[#080f1b] border border-[#334155] text-sm"
//                   >
//                     <option value="all">All Topics</option>
//                     {topics.map((t) => (
//                       <option key={t} value={t}>
//                         {t}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <h2 className="text-2xl sm:text-3xl font-bold text-sky-400 mb-3 break-words text-center sm:text-left">
//                   {selectedDoc.subject}
//                 </h2>

//                 <p className="text-sm sm:text-base mb-5 opacity-80 border-b border-[#334155] pb-4 leading-relaxed sm:text-left break-words text-justify">
//                   {selectedDoc.description}
//                 </p>

//                 {(!selectedDoc.questions ||
//                   selectedDoc.questions.length === 0) && (
//                   <p className="italic text-gray-500 text-center">
//                     No questions to preview.
//                   </p>
//                 )}

//                 <div className="flex flex-col gap-8">
//                   {(filteredQuestions || []).length === 0 ? (
//                     <p className="text-center text-gray-400">
//                       No questions match your search / filter.
//                     </p>
//                   ) : (
//                     (filteredQuestions || []).map((q, i) => (
//                       <div
//                         key={i}
//                         className="border border-[#334155] rounded-xl p-4 sm:p-6 bg-[#02050c] shadow-lg hover:shadow-sky-900/40 transition-all"
//                       >
//                         <h3 className="text-lg sm:text-xl font-semibold text-yellow-400 mb-2 break-words">
//                           {q.title}
//                         </h3>
//                         <p className="text-xs sm:text-sm mb-3 text-gray-400 italic break-words text-justify">
//                           {q.Q}
//                         </p>

//                         <div className="flex flex-col gap-4">
//                           {q.ans.map((a, j) => (
//                             <div key={j} className="mb-3">
//                               {a.type === "code" ? (
//                                 <div className="relative rounded-lg overflow-hidden border border-[#444] shadow-xl">
//                                   <div className="flex items-center justify-between bg-[#030000] px-3 py-2 border-b border-[#444]">
//                                     <div className="flex space-x-1.5">
//                                       <span className="w-3 h-3 bg-red-500 rounded-full" />
//                                       <span className="w-3 h-3 bg-yellow-500 rounded-full" />
//                                       <span className="w-3 h-3 bg-green-500 rounded-full" />
//                                     </div>
//                                     <span className="text-xs text-gray-400 font-mono truncate max-w-[100px] sm:max-w-none">
//                                       {a.language || "Code"}
//                                     </span>
//                                   </div>

//                                   <div className="overflow-x-auto">
//                                     <SyntaxHighlighter
//                                       language={a.language || "javascript"}
//                                       style={CODE_STYLE}
//                                       customStyle={{
//                                         background: "#000000",
//                                         padding: "1rem",
//                                         fontSize: "0.8rem",
//                                         margin: 0,
//                                       }}
//                                     >
//                                       {a.content}
//                                     </SyntaxHighlighter>
//                                   </div>
//                                 </div>
//                               ) : Array.isArray(a.content) ? (
//                                 <ul className="list-disc list-inside text-sm sm:text-base pl-4 text-gray-300 space-y-1 text-justify">
//                                   {a.content.map((p, idx) => (
//                                     <li
//                                       key={idx}
//                                       className="marker:text-sky-400 break-words"
//                                     >
//                                       {p}
//                                     </li>
//                                   ))}
//                                 </ul>
//                               ) : (
//                                 <p className="text-sm sm:text-base opacity-90 p-2 bg-[#1e293b] rounded-md break-words leading-relaxed text-justify">
//                                   {a.content}
//                                 </p>
//                               )}
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     ))
//                   )}
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// }
