import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { memo, useMemo } from "react";
import axios from "axios";
import {
  FiEdit3, FiTrash2, FiCopy, FiPlus, FiCheck,
  FiSearch, FiClock, FiFileText, FiX, FiZap,
  FiLayers, FiTrendingUp, FiStar, FiMoreVertical,
  FiExternalLink, FiAlertTriangle,
} from "react-icons/fi";
import Loading from "../../../component/Loading";
import { toast } from "react-hot-toast";

const MAX_RESUMES = 5;

const fmt = (d) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });



/* ─────────────────────────────────────────────
   Dummy Generator (fallback data)
───────────────────────────────────────────── */
const getDummyData = (title) => {
  const names = ["Akshat Jain", "Ansh", "Aayush", "Arish"];
  const roles = ["Frontend Dev", "Backend Dev", "Full Stack Dev", "UI Designer"];
  const skills = ["React", "Node", "MongoDB", "Tailwind", "JS"];

  return {
    name: title || names[Math.floor(Math.random() * names.length)],
    role: roles[Math.floor(Math.random() * roles.length)],
    skills: skills.sort(() => 0.5 - Math.random()).slice(0, 4),
  };
};

/* ─────────────────────────────────────────────
   Resume Thumbnail (Improved)
───────────────────────────────────────────── */
const ResumeThumbnail = memo(({ title = "" }) => {
  const data = useMemo(() => getDummyData(title), [title]);

  const initials = useMemo(() => {
    return data.name
      .split(" ")
      .slice(0, 2)
      .map((w) => w?.[0]?.toUpperCase() || "")
      .join("") || "RE";
  }, [data.name]);

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden
      bg-gradient-to-br from-slate-900 via-[#0f172a] to-slate-950
      group">

      {/* top accent */}
      <div className="absolute top-0 left-0 right-0 h-[3px]
        bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-400" />

      {/* content */}
      <div className="absolute inset-0 p-4 pt-5 flex flex-col gap-2">

        {/* HEADER */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full
            bg-gradient-to-br from-violet-500 to-blue-500
            flex items-center justify-center text-[10px] font-bold text-white shadow-md">
            {initials}
          </div>

          <div className="flex flex-col gap-1 flex-1">
            <div className="text-[10px] text-white font-semibold truncate">
              {data.name}
            </div>
            <div className="text-[8px] text-slate-400 truncate">
              {data.role}
            </div>
          </div>
        </div>

        <div className="h-px bg-white/10 my-1" />

        {/* EXPERIENCE SECTION */}
        <div className="flex flex-col gap-1.5">
          <div className="h-[4px] w-1/3 bg-violet-400/40 rounded-full" />
          <div className="h-[3px] bg-white/10 rounded-full w-full" />
          <div className="h-[3px] bg-white/10 rounded-full w-4/5" />
          <div className="h-[3px] bg-white/10 rounded-full w-3/5" />
        </div>

        {/* EDUCATION SECTION */}
        <div className="flex flex-col gap-1.5">
          <div className="h-[4px] w-1/4 bg-blue-400/40 rounded-full" />
          <div className="h-[3px] bg-white/10 rounded-full w-full" />
          <div className="h-[3px] bg-white/10 rounded-full w-2/3" />
        </div>

        {/* SKILLS */}
        <div className="flex flex-wrap gap-1 mt-auto">
          {data.skills.map((skill, i) => (
            <span
              key={i}
              className="text-[7px] px-2 py-[2px] rounded-full
                bg-violet-500/15 text-violet-300 border border-violet-500/20"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100
        transition duration-300 bg-gradient-to-t from-violet-600/10 via-transparent to-transparent" />

      {/* bottom fade */}
      <div className="absolute inset-0
        bg-gradient-to-t from-[#020617]/80 via-transparent to-transparent" />
    </div>
  );
});

// export default ResumeThumbnail;

/* ─────────────────────────────────────────────
   Stat chip
───────────────────────────────────────────── */
const Chip = ({ icon: Icon, value, label, cls }) => (
  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold ${cls}`}>
    <Icon size={12} className="shrink-0" />
    <span className="tabular-nums">{value}</span>
    <span className="text-current opacity-50 font-normal hidden sm:inline">{label}</span>
  </div>
);

/* ─────────────────────────────────────────────
   Card overflow menu
───────────────────────────────────────────── */
const OverflowMenu = ({ onOpen, onEdit, onDuplicate, onDelete, isDuplicating }) => {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const items = [
    { icon: FiExternalLink, label: "Open", fn: onOpen },
    { icon: FiEdit3,        label: "Rename", fn: onEdit },
    { icon: FiCopy,         label: isDuplicating ? "Duplicating…" : "Duplicate", fn: onDuplicate, disabled: isDuplicating },
    { icon: FiTrash2,       label: "Delete", fn: onDelete, danger: true },
  ];
  return (
    <div className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/8 transition-all"
        aria-label="More options"
      >
        <FiMoreVertical size={14} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={close} />
          <div className="absolute right-0 top-9 z-20 w-38 bg-slate-900/95 backdrop-blur-sm
            border border-white/10 rounded-xl shadow-2xl shadow-black/60 overflow-hidden py-1 min-w-[140px]">
            {items.map(({ icon: Icon, label, fn, danger, disabled }) => (
              <button
                key={label}
                disabled={disabled}
                onClick={(e) => { e.stopPropagation(); close(); fn?.(); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium transition-colors
                  ${danger ? "text-red-400 hover:bg-red-500/10" : "text-slate-300 hover:bg-white/5"}
                  disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                <Icon size={12} />
                {label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────
   Resume card
───────────────────────────────────────────── */
const ResumeCard = ({
  resume, animDelay,
  editingId, editingTitle, duplicatingId,
  setEditingId, setEditingTitle,
  onOpen, onDuplicate, onDelete, onSaveTitle,
}) => {
  const isEditing    = editingId    === resume._id;
  const isDuplicating = duplicatingId === resume._id;

  return (
    <article
      className="group flex flex-col bg-gradient-to-br from-gray-950 to-gray-950 border border- mx-2 md:mx-0 border-cyan-900 rounded-2xl overflow-hidden
        hover:border-violet-500/35 hover:shadow-xl hover:shadow-violet-950/40
        hover:-translate-y-1 transition-all duration-300 opacity-0 animate-[fadeUp_0.4s_ease_both]"
      style={{ animationDelay: animDelay }}
    >
      {/* ── thumbnail ── */}
      <div
        role="button"
        tabIndex={0}
        onClick={onOpen}
        onKeyDown={(e) => e.key === "Enter" && onOpen()}
        aria-label={`Open ${resume.title || "resume"}`}
        className="relative h-40 cursor-pointer overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
      >
        <ResumeThumbnail title={resume.title} />
        {/* hover pill */}
        <div className="absolute inset-0 flex items-center justify-center
          opacity-0 group-hover:opacity-100
          transition-opacity duration-200">
          <span className="flex items-center gap-1.5 px-4 py-2 rounded-xl
            bg-gray-800 backdrop-blur-sm border border-white/15
            text-xs font-semibold text-white
            translate-y-2 group-hover:translate-y-0 transition-transform duration-200">
            <FiExternalLink size={11} />
            Open Editor
          </span>
        </div>
      </div>

      {/* ── body ── */}
      <div className="flex flex-col flex-1 p-4 gap-3   border-t-1 border-gray-400 ">
        {/* title */}
        {isEditing ? (
          <div className="flex gap-2 items-center">
            <input
              autoFocus
              value={editingTitle}
              onChange={(e) => setEditingTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onSaveTitle();
                if (e.key === "Escape") setEditingId(null);
              }}
              className="flex-1 min-w-0 bg-white/5 border border-violet-500/50 rounded-lg
                px-3 py-1.5 text-sm text-white outline-none
                focus:border-violet-400 focus:ring-2 focus:ring-violet-500/15 transition-all"
            />
            <button onClick={onSaveTitle}
              className="shrink-0 p-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 rounded-lg transition-colors">
              <FiCheck size={13} />
            </button>
            <button onClick={() => setEditingId(null)}
              className="shrink-0 p-1.5 bg-white/5 hover:bg-white/10 text-slate-500 rounded-lg transition-colors">
              <FiX size={13} />
            </button>
          </div>
        ) : (
          <div className="flex items-start justify-between gap-2">
            <button onClick={onOpen}
              className="flex-1 min-w-0 text-left text-sm font-semibold text-slate-100
                hover:text-violet-300 transition-colors line-clamp-2 leading-snug">
              {resume.title || "Untitled Resume"}
            </button>
            <OverflowMenu
              onOpen={onOpen}
              onEdit={() => { setEditingId(resume._id); setEditingTitle(resume.title); }}
              onDuplicate={onDuplicate}
              onDelete={onDelete}
              isDuplicating={isDuplicating}
            />
          </div>
        )}

        {/* date */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <FiClock size={10} />
          Edited {fmt(resume.updatedAt)}
        </div>

        {/* actions */}
        <div className="flex gap-2 mt-auto pt-3 border-t border-white/5">
          <button onClick={onOpen}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl
              bg-violet-600 hover:bg-violet-500 active:scale-[0.97]
              text-xs font-semibold text-white transition-all">
            <FiExternalLink size={11} />
            Edit
          </button>
          <button onClick={onDuplicate} disabled={isDuplicating}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl
              bg-white/5 hover:bg-white/9 active:scale-[0.97]
              text-xs font-semibold text-slate-400 hover:text-slate-200
              border border-white/6 transition-all disabled:opacity-40">
            <FiCopy size={11} />
            {isDuplicating ? "…" : "Copy"}
          </button>
          <button onClick={onDelete}
            className="flex items-center justify-center px-2.5 py-2 rounded-xl
              bg-white/5 hover:bg-red-500/12 active:scale-[0.97]
              text-slate-600 hover:text-red-400
              border border-white/6 transition-all">
            <FiTrash2 size={12} />
          </button>
        </div>
      </div>
    </article>
  );
};

/* ─────────────────────────────────────────────
   Create modal
───────────────────────────────────────────── */
const CreateModal = ({ onClose, onCreate }) => {
  const [title, setTitle] = useState("");
  const submit = () => title.trim() && onCreate(title.trim());
  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#0c1018] border border-white/10 rounded-2xl
        shadow-2xl shadow-black/80 animate-[modalPop_0.28s_cubic-bezier(.16,1,.3,1)_both]">
        <div className="flex items-start justify-between px-6 pt-6 pb-5">
          <div>
            <h2 className="text-lg font-bold text-white">Create New Resume</h2>
            <p className="text-xs text-slate-500 mt-0.5">Give your resume a memorable name</p>
          </div>
          <button onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-slate-200 hover:bg-white/6 rounded-xl transition-all mt-0.5">
            <FiX size={16} />
          </button>
        </div>
        <div className="px-6 pb-6">
          <input
            autoFocus
            type="text"
            placeholder="e.g. Senior Engineer — Google 2025"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            className="w-full bg-white/4 border border-white/10 rounded-xl px-4 py-3
              text-sm text-white placeholder:text-slate-600 outline-none
              focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/15
              transition-all mb-2"
          />
          <p className="text-[11px] text-slate-600 mb-5">
            Tip: Include role + company for easy lookup later
          </p>
          <div className="flex gap-3">
            <button onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold
                bg-white/5 hover:bg-white/8 text-slate-300 transition-colors border border-white/6">
              Cancel
            </button>
            <button onClick={submit} disabled={!title.trim()}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold
                bg-gradient-to-r from-violet-600 to-blue-600
                hover:from-violet-500 hover:to-blue-500
                text-white active:scale-[0.98] transition-all
                disabled:opacity-40 disabled:cursor-not-allowed
                shadow-lg shadow-violet-900/30">
              Create Resume
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Dashboard root
───────────────────────────────────────────── */
const ResumeDashboard = () => {
  const [resumes,         setResumes]         = useState([]);
  const [filteredResumes, setFilteredResumes] = useState([]);
  const [search,          setSearch]          = useState("");
  const [showModal,       setShowModal]       = useState(false);
  const [editingId,       setEditingId]       = useState(null);
  const [editingTitle,    setEditingTitle]    = useState("");
  const [loading,         setLoading]         = useState(true);
  const [limitBanner,     setLimitBanner]     = useState(false);
  const [duplicatingId,   setDuplicatingId]   = useState(null);

  const navigate  = useNavigate();
  const API_URL   = import.meta.env.VITE_API_URL;

  /* data */
  const fetchResumes = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_URL}/resumes`);
      setResumes(data);
    } catch {
      toast.error("Failed to load resumes");
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => { fetchResumes(); }, [fetchResumes]);

  useEffect(() => {
    const q = search.toLowerCase();
    setFilteredResumes(resumes.filter((r) => r.title?.toLowerCase().includes(q)));
  }, [search, resumes]);

  /* guards */
  const atLimit = () => {
    if (resumes.length >= MAX_RESUMES) { setLimitBanner(true); return true; }
    return false;
  };

  /* actions */
  const handleCreate = async (title) => {
    if (atLimit()) return;
    try {
      const { data } = await axios.post(`${API_URL}/resumes`, { title });
      setShowModal(false);
      navigate(`/editor/${data._id}`);
    } catch { toast.error("Failed to create resume"); }
  };

  const handleDuplicate = async (id) => {
    if (atLimit()) return;
    setDuplicatingId(id);
    try {
      await axios.post(`${API_URL}/resumes/duplicate/${id}`);
      await fetchResumes();
      toast.success("Resume duplicated!");
    } catch { toast.error("Failed to duplicate"); }
    finally { setDuplicatingId(null); }
  };

  const handleDelete = (id, title) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3 min-w-[200px]">
          <div>
            <p className="text-sm font-semibold text-slate-900">Delete this resume?</p>
            <p className="text-xs text-slate-800 mt-0.5 truncate max-w-[180px]">"{title || "Untitled"}"</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => toast.dismiss(t.id)}
              className="flex-1 px-3 py-1.5 text-xs font-medium bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors">
              Keep
            </button>
            <button
              onClick={async () => {
                try {
                  await axios.delete(`${API_URL}/resumes/${id}`);
                  await fetchResumes();
                  toast.success("Resume deleted");
                } catch { toast.error("Failed to delete"); }
                toast.dismiss(t.id);
              }}
              className="flex-1 px-3 py-1.5 text-xs font-medium bg-red-600 hover:bg-red-500 rounded-lg text-white transition-colors">
              Delete
            </button>
          </div>
        </div>
      ),
      { duration: 6000 }
    );
  };

  const handleUpdateTitle = async (id) => {
    if (!editingTitle.trim()) return;
    try {
      await axios.put(`${API_URL}/resumes/${id}`, { title: editingTitle });
      setEditingId(null);
      await fetchResumes();
    } catch { toast.error("Failed to rename"); }
  };

  if (loading) return <Loading />;

  const slotPct  = Math.round((resumes.length / MAX_RESUMES) * 100);
  const isEmpty  = filteredResumes.length === 0;
  const underCap = resumes.length < MAX_RESUMES;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .rdb { font-family: 'Plus Jakarta Sans', sans-serif; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes modalPop {
          from { opacity: 0; transform: scale(0.93) translateY(20px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);    }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(14px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0);    }
        }
      `}</style>

      <div className="rdb min-h-screen bg-black text-slate-100 selection:bg-violet-500/30">

        {/* ambient glows */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="absolute -top-32 -left-16 w-[480px] h-[480px] rounded-full bg-violet-600/7 blur-[130px]" />
          <div className="absolute top-1/2 -right-32 w-[380px] h-[380px] rounded-full bg-blue-600/6 blur-[100px]" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

          {/* ══════════ HEADER ══════════ */}
          <header className="mb-10 lg:mb-12 opacity-0 animate-[fadeUp_0.5s_ease_0.05s_both]">

            {/* top row */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5 mb-7">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-violet-600/20 border border-violet-500/25 flex items-center justify-center">
                    <FiLayers size={13} className="text-violet-400" />
                  </div>
                  <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-violet-400/80">
                    Resume Builder
                  </span>
                </div>
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-none mb-2">
                  My Resumes
                </h1>
                <p className="text-sm text-slate-500">
                  Build and manage your professional resumes in one place
                </p>
              </div>

              {/* stat chips */}
              <div className="flex items-center gap-2 flex-wrap">
                <Chip icon={FiFileText}    value={`${resumes.length}/${MAX_RESUMES}`} label="resumes"
                  cls="text-violet-300 border-violet-500/20 bg-violet-500/8" />
                <Chip icon={FiTrendingUp}  value={resumes.length} label="active"
                  cls="text-blue-300 border-blue-500/20 bg-blue-500/8" />
                <Chip icon={FiStar}        value={MAX_RESUMES - resumes.length} label="slots left"
                  cls="text-emerald-300 border-emerald-500/20 bg-emerald-500/8" />
              </div>
            </div>

            {/* search + create */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 group">
                <FiSearch size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500
                    group-focus-within:text-violet-400 transition-colors pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search resumes…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-9 py-2.5 bg-slate-950 border border-white/8 rounded-xl
                    text-sm text-slate-200 placeholder:text-slate-600 outline-none
                    focus:border-violet-500/50 focus:bg-white/5 focus:ring-2 focus:ring-violet-500/10
                    transition-all"
                />
                {search && (
                  <button onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2
                      text-slate-600 hover:text-slate-300 transition-colors">
                    <FiX size={13} />
                  </button>
                )}
              </div>
              <button
                onClick={() => !atLimit() && setShowModal(true)}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl whitespace-nowrap
                  bg-gradient-to-r from-violet-600 to-blue-600
                  hover:from-violet-500 hover:to-blue-500 active:scale-[0.97]
                  text-sm font-semibold text-white
                  shadow-lg shadow-violet-900/30 border border-violet-500/25 transition-all">
                <FiPlus size={15} strokeWidth={2.5} />
                New Resume
              </button>
            </div>

            {/* slot bar */}
            <div className="mt-4 flex items-center gap-3">
              <div className="flex-1 h-[3px] bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${slotPct}%`,
                    background: slotPct >= 80
                      ? "linear-gradient(90deg,#f59e0b,#ef4444)"
                      : "linear-gradient(90deg,#7c3aed,#3b82f6)",
                  }}
                />
              </div>
              <span className="shrink-0 text-[11px] font-medium text-slate-600 tabular-nums">
                {resumes.length} / {MAX_RESUMES} slots used
              </span>
            </div>
          </header>

          {/* ══════════ GRID ══════════ */}
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center min-h-[340px]
              rounded-2xl border border-dashed border-white/8 bg-white/2 text-center px-6 py-16
              opacity-0 animate-[fadeUp_0.4s_ease_0.2s_both]">
              <div className="w-14 h-14 rounded-2xl bg-white/4 border border-white/8 flex items-center justify-center mb-4">
                <FiFileText size={22} className="text-slate-600" />
              </div>
              <h3 className="text-base font-semibold text-slate-300 mb-1">
                {search ? "No matches found" : "No resumes yet"}
              </h3>
              <p className="text-sm text-slate-600 mb-6 max-w-xs">
                {search
                  ? `Nothing matched "${search}". Try another keyword.`
                  : "Start building your first resume and land your dream job."}
              </p>
              {!search && (
                <button
                  onClick={() => !atLimit() && setShowModal(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl
                    bg-gradient-to-r from-violet-600 to-blue-600
                    hover:from-violet-500 hover:to-blue-500 active:scale-[0.97]
                    text-sm font-semibold text-white
                    shadow-lg shadow-violet-900/30 transition-all">
                  <FiZap size={14} />
                  Create Your First Resume
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">

              {/* ghost "add" card */}
              {underCap && !search && (
                <button
                  onClick={() => setShowModal(true)}
                  className="group flex flex-col items-center justify-center gap-3
                    min-h-[280px] rounded-2xl border-2 border-dashed border-white/8
                    hover:border-violet-500/35 hover:bg-violet-500/4
                    text-slate-600 hover:text-violet-400
                    transition-all duration-300 bg-gray-950 mx-2 md:mx-0
                    opacity-0 animate-[fadeUp_0.4s_ease_0.1s_both]">
                  <div className="w-11 h-11 rounded-xl border-2 border-dashed border-current
                    flex items-center justify-center
                    group-hover:scale-110 transition-transform duration-300">
                    <FiPlus size={18} />
                  </div>
                  <span className="text-xs font-semibold tracking-wide">New Resume</span>
                </button>
              )}

              {filteredResumes.map((resume, i) => (
                <ResumeCard
                  key={resume._id}
                  resume={resume}
                  animDelay={`${(i + (underCap && !search ? 1 : 0)) * 55}ms`}
                  editingId={editingId}
                  editingTitle={editingTitle}
                  duplicatingId={duplicatingId}
                  setEditingId={setEditingId}
                  setEditingTitle={setEditingTitle}
                  onOpen={() => navigate(`/editor/${resume._id}`)}
                  onDuplicate={() => handleDuplicate(resume._id)}
                  onDelete={() => handleDelete(resume._id, resume.title)}
                  onSaveTitle={() => handleUpdateTitle(resume._id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* ══ Modals / Banners ══ */}
        {showModal && (
          <CreateModal onClose={() => setShowModal(false)} onCreate={handleCreate} />
        )}

        {limitBanner && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] w-full max-w-sm px-4
            animate-[slideUp_0.3s_cubic-bezier(.16,1,.3,1)_both]">
            <div className="flex items-center justify-between gap-3
              bg-amber-950/80 border border-amber-500/25 backdrop-blur-md
              px-4 py-3.5 rounded-2xl shadow-xl shadow-black/40">
              <div className="flex items-center gap-2.5 text-amber-200">
                <FiAlertTriangle size={14} className="text-amber-400 shrink-0" />
                <p className="text-sm font-medium">Max {MAX_RESUMES} resumes reached</p>
              </div>
              <button onClick={() => setLimitBanner(false)} className="text-amber-500 hover:text-amber-300 transition-colors">
                <FiX size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ResumeDashboard;