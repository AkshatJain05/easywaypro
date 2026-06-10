import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchCourse, clearCurrent } from "../../../redux/courseSlice";
import { updateProgress } from "../../../redux/purchaseSlice";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FiArrowLeft,
  FiMenu,
  FiX,
  FiPlay,
  FiCheckCircle,
  FiCircle,
  FiClock,
  FiAward,
  FiMessageCircle,
  FiVideo,
  FiEdit3,
  FiSave,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiBook,
  FiExternalLink,
  FiZap,
  FiLock,
  FiFileText,
  FiInfo,
  FiAlertCircle,
  FiList,
  FiDownload,
  FiLoader,
  FiCheck,
} from "react-icons/fi";
import { FiFolder } from "react-icons/fi"; // Resources ke liye Folder icon zyada dynamic lagega
import Loading from "../../../component/Loading";

const BASE_URL = import.meta.env.VITE_API_URL;

// ─── helpers ──────────────────────────────────────────────────
function toEmbed(url = "") {
  if (!url) return null;
  const yt = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/,
  );
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?rel=0`;
  if (url.includes("drive.google.com")) {
    const m = url.match(/[-\w]{25,}/);
    if (m) return `https://drive.google.com/file/d/${m[0]}/preview`;
  }
  return url;
}

// 1. SMART SANITIZATION ENGINE (Handles raw database strings safely)
const formatExternalLink = (url) => {
  if (!url) return "";

  const trimmedUrl = url.trim();

  // Agar link backend mock text hai jaise "link 1", "link2", toh link discard kar do
  if (trimmedUrl.toLowerCase().startsWith("link")) {
    return null;
  }

  // Agar real protocol missing hai to prefix insert karo
  return /^https?:\/\//i.test(trimmedUrl)
    ? trimmedUrl
    : `https://${trimmedUrl}`;
};

function fmtDate(d) {
  return new Date(d).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function fmtDuration(min) {
  if (!min) return null;
  if (min < 60) return `${min}m`;
  const h = Math.floor(min / 60),
    m = min % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

// ─── Certificate overlay ──────────────────────────────────────
function CertificateOverlay({ course, user, onClose }) {
  const ref = useRef();
  const handleDownload = () => {
    window.open(`${BASE_URL}/certificates/download/${course._id}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0c0c0e] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
          <h2 className="text-sm font-black text-white flex items-center gap-2">
            <FiAward size={16} className="text-amber-400" /> Certificate of
            Completion
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <FiX size={15} />
          </button>
        </div>
        {/* Certificate preview */}
        <div
          ref={ref}
          className="mx-6 my-5 rounded-xl overflow-hidden border border-amber-500/20 bg-gradient-to-br from-[#0f0e08] via-[#12100a] to-[#0a0a0f] p-8 text-center relative"
        >
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg,#f59e0b 0,#f59e0b 1px,transparent 0,transparent 50%)",
              backgroundSize: "20px 20px",
            }}
          />
          <div className="relative z-10">
            <div className="w-14 h-14 rounded-full bg-amber-500/20 border-2 border-amber-500/40 flex items-center justify-center mx-auto mb-4">
              <FiAward size={26} className="text-amber-400" />
            </div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-amber-500/70 mb-1">
              This certifies that
            </p>
            <h3 className="text-2xl font-black text-white mb-1">
              {user?.name || "Student"}
            </h3>
            <p className="text-[11px] text-slate-500 mb-4">
              has successfully completed
            </p>
            <h4 className="text-lg font-bold text-amber-300 mb-4 px-4">
              {course.title}
            </h4>
            <div className="flex items-center justify-center gap-6 text-[10px] text-slate-500">
              <span>
                Issued:{" "}
                {new Date().toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span className="w-px h-3 bg-slate-700" />
              <span>Easyway Pro</span>
            </div>
          </div>
        </div>
        <div className="px-6 pb-5 flex gap-3">
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-black text-sm font-black transition-all"
          >
            <FiDownload size={14} /> Download PDF
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/8 text-slate-400 hover:text-white text-sm font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Lesson row ───────────────────────────────────────────────
function LessonRow({ lesson, index, isActive, isCompleted, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-xl text-left transition-all border ${
        isActive
          ? "bg-orange-500/10 border-orange-500/20"
          : "hover:bg-white/4 border-transparent"
      }`}
    >
      <div
        className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
          isCompleted
            ? "bg-emerald-500/20"
            : isActive
              ? "bg-orange-500/20"
              : "bg-white/5"
        }`}
      >
        {isCompleted ? (
          <FiCheckCircle size={11} className="text-emerald-400" />
        ) : isActive ? (
          <FiPlay size={9} className="text-orange-400 translate-x-px" />
        ) : (
          <FiCircle size={11} className="text-slate-700" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={`text-[12px] font-semibold leading-snug ${
            isActive
              ? "text-orange-100"
              : isCompleted
                ? "text-slate-500"
                : "text-slate-300"
          }`}
        >
          {index + 1}. {lesson.title}
        </p>
        {lesson.duration > 0 && (
          <span className="flex items-center gap-1 text-[10px] text-slate-600 mt-0.5">
            <FiClock size={9} /> {fmtDuration(lesson.duration)}
          </span>
        )}
      </div>
    </button>
  );
}

// ─── Sidebar tabs ─────────────────────────────────────────────
const TABS = [
  { id: "lessons", icon: FiList, label: "Lessons" },
  { id: "notes", icon: FiEdit3, label: "Notes" },
  { id: "schedule", icon: FiCalendar, label: "Schedule" },
  { id: "info", icon: FiInfo, label: "Info" },
];

// ─── Pagination helper ────────────────────────────────────────
function usePaginate(items = [], perPage = 8) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(items.length / perPage);
  const slice = items.slice((page - 1) * perPage, page * perPage);
  const reset = useCallback(() => setPage(1), []);
  return { slice, page, setPage, totalPages, reset };
}

// ─── Main ─────────────────────────────────────────────────────
export default function CoursePlayerPage() {
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current: course, loading, error } = useSelector((s) => s.courses);
  const { user } = useSelector((s) => s.auth);

  const [currentLesson, setCurrentLesson] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("lessons");
  const [showCert, setShowCert] = useState(false);
  const [saving, setSaving] = useState(false);
  // Purane states ko chhede bina, yeh naya state register karein
  const [syncStatus, setSyncStatus] = useState("idle"); // 'idle' | 'saving' | 'saved'
  const [notes, setNotes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(`notes_${courseId}`) || "{}");
    } catch {
      return {};
    }
  });
  const [noteSaved, setNoteSaved] = useState(false);
  const noteRef = useRef(null);

  // Inside your main functional component:

  // Fetch
  useEffect(() => {
    if (courseId && courseId !== "undefined") dispatch(fetchCourse(courseId));
    return () => dispatch(clearCurrent());
  }, [courseId]);

  // Set first lesson
  useEffect(() => {
    if (course?.lessons?.length > 0 && !currentLesson) {
      const sorted = [...course.lessons].sort((a, b) => a.order - b.order);
      setCurrentLesson(sorted[0]);
    }
  }, [course]);

  // Body scroll lock on mobile
  useEffect(() => {
    if (window.innerWidth < 768)
      document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  // Sorted lessons
  const sortedLessons = useMemo(
    () => [...(course?.lessons || [])].sort((a, b) => a.order - b.order),
    [course?.lessons],
  );

  // Pagination for lessons sidebar
  const {
    slice: lessonPage,
    page: lPage,
    setPage: setLPage,
    totalPages: lTotal,
  } = usePaginate(sortedLessons, 8);

  // Progress computed from lesson.isCompleted flags (or completedLessons array)
  const completedIds = useMemo(() => {
    const fromPurchase = course?.purchase?.completedLessons || [];
    const fromLessons = sortedLessons
      .filter((l) => l.isCompleted)
      .map((l) => l._id);
    return [...new Set([...fromPurchase, ...fromLessons])];
  }, [course?.purchase?.completedLessons, sortedLessons]);

  const progress = useMemo(() => {
    if (!sortedLessons.length) return 0;
    return Math.round((completedIds.length / sortedLessons.length) * 100);
  }, [completedIds, sortedLessons]);

  const currentIdx = sortedLessons.findIndex(
    (l) => l._id === currentLesson?._id,
  );
  const isLessonDone = currentLesson
    ? completedIds.includes(currentLesson._id)
    : false;
  const hasPrev = currentIdx > 0;
  const hasNext = currentIdx < sortedLessons.length - 1;
  const certEnabled = progress >= 70 && course?.enableCertificate;

  // ── Mark complete ──
  const handleMarkComplete = async () => {
    if (!currentLesson || isLessonDone || saving) return;
    setSaving(true);
    const newCompleted = [...new Set([...completedIds, currentLesson._id])];
    const newProgress = Math.round(
      (newCompleted.length / sortedLessons.length) * 100,
    );
    try {
      await dispatch(
        updateProgress({
          courseId,
          lessonId: currentLesson._id,
          progress: newProgress,
        }),
      ).unwrap();
      toast.success("Lesson complete! 🎉");
      // re-fetch to sync
      dispatch(fetchCourse(courseId));
    } catch (e) {
      toast.error(e || "Failed to save progress");
    } finally {
      setSaving(false);
    }
  };

  // ── Notes (Axios Client Database Integration) ──
  const saveNote = async () => {
    if (!currentLesson) return;

    const textValue = noteRef.current?.value || "";
    const updated = { ...notes, [currentLesson._id]: textValue };

    // Aapka original local state implementation undisturbed rahega
    setNotes(updated);
    localStorage.setItem(`notes_${courseId}`, JSON.stringify(updated));

    // ── STEP A: TRIGGER NEW STATUS TO SAVING ──
    setSyncStatus("saving");

    try {
      // Axios call triggering via cookies pipeline
      await axios.post(`${import.meta.env.VITE_API_URL}/notes/save`, {
        courseId,
        lessonNotes: updated,
      });

      // ── STEP B: SUCCESS STATE ──
      setSyncStatus("saved");

      // Aapka purana fallback animation state (agar dependencies hain toh active rahega)
      setNoteSaved(true);

      // ── STEP C: RESET TIMEOUTS ──
      setTimeout(() => {
        setSyncStatus("idle");
        setNoteSaved(false); // Purane state ko bhi reset kar diya safely
      }, 2000);
    } catch (error) {
      console.error("Database cloud sync network crash:", error);
      setSyncStatus("idle"); // Network error par button wapas normal active ho jayega
    }
  };

  // ── Upcoming / past zoom ──
  const upcomingSessions = useMemo(
    () =>
      (course?.zoomSchedule || [])
        .filter((s) => new Date(s.date) > new Date())
        .sort((a, b) => new Date(a.date) - new Date(b.date)),
    [course?.zoomSchedule],
  );
  const pastSessions = useMemo(
    () =>
      (course?.zoomSchedule || [])
        .filter((s) => new Date(s.date) <= new Date())
        .sort((a, b) => new Date(b.date) - new Date(a.date)),
    [course?.zoomSchedule],
  );

  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // Ek page par maximum kitne past classes show karne hain

  // Total pages ki mathematical calculation (Safety backup lagaya hai agar array empty/null ho)
  const totalPages = Math.ceil((pastSessions?.length || 0) / itemsPerPage);

  // Index ranges calculation array chunking ke liye
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Is array data ko hum niche list items rendering loop mein map karenge
  const currentPastSessions = (pastSessions || []).slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  // Safe Page Change handler logic bounds validation ke saath
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // ── Guards ──
  if (loading)
    return (
      <div>
        <Loading />
      </div>
    );
  if (error)
    return (
      <div className="h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-sm mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="text-orange-500 text-sm hover:underline"
          >
            ← Go back
          </button>
        </div>
      </div>
    );
  if (!course) return null;

  if (!course.isPurchased)
    return (
      <div className="h-screen bg-[#050505] flex items-center justify-center px-4">
        <div className="text-center bg-[#0c0c0e] border border-white/8 rounded-2xl p-10 max-w-sm w-full">
          <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto mb-5">
            <FiLock size={24} className="text-orange-400" />
          </div>
          <h2 className="text-xl font-black text-white mb-2">
            Access Restricted
          </h2>
          <p className="text-slate-500 text-sm mb-6 leading-relaxed">
            Purchase this course to access all lessons.
          </p>
          <button
            onClick={() => navigate(`/courses/${courseId}`)}
            className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-400 active:scale-95 text-black font-black text-sm transition-all"
          >
            View Course
          </button>
        </div>
      </div>
    );

  const videoSrc = toEmbed(currentLesson?.videoUrl);

  return (
    <div className="h-screen flex flex-col bg-[#050505] text-slate-200 font-sans overflow-hidden">
      {/* ══ TOP BAR ══════════════════════════════════════════ */}
      <header className="h-14 shrink-0 border-b border-white/6 bg-[#07070d]/95 backdrop-blur-xl flex items-center justify-between px-3 sm:px-5 gap-3 z-30">
        {/* Left */}
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/8 flex items-center justify-center text-slate-400 hover:text-white transition-all shrink-0"
          >
            <FiArrowLeft size={15} />
          </button>
          <div className="hidden sm:block min-w-0">
            <p className="text-[12px] font-black text-white truncate leading-none max-w-[200px] lg:max-w-xs">
              {course.title}
            </p>
            <p className="text-[10px] text-slate-500 truncate max-w-[200px] lg:max-w-xs">
              {currentLesson?.title || "—"}
            </p>
          </div>
        </div>

        {/* Center progress pill */}
        <div className="hidden md:flex items-center gap-3 bg-white/4 border border-white/6 rounded-full px-4 py-1.5 shrink-0">
          <div className="w-28 h-1.5 bg-white/8 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[11px] font-black text-orange-400 tabular-nums">
            {progress}%
          </span>
          <span className="text-[10px] text-slate-600 tabular-nums">
            {completedIds.length}/{sortedLessons.length}
          </span>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => navigate("/learn/resource")} // Aapka naya resources portal path URL
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 text-[11px] font-bold transition-all duration-200 active:scale-[0.98]"
          >
            <FiFolder size={12} />
            <span>Resources</span>
          </button>

          {course.whatsappSupport && (
            <a
              href={`https://wa.me/${course.whatsappSupport}`}
              target="_blank"
              rel="noopener noreferrer"
              title="WhatsApp Support"
              className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center hover:bg-emerald-500/18 transition-all"
            >
              <FiMessageCircle size={14} />
            </a>
          )}
          {/* Certificate button — disabled below 70% */}
          <div className="relative group hidden sm:inline-block">
            <button
              type="button"
              // FIX: onClick direct state ko true karega, duplicate logic checks ki ab zaroorat nahi hai
              onClick={() => setShowCert(true)}
              // Button disable hoga agar 70% na ho, ya course data available na ho, ya instructor ne disable kiya ho
              disabled={!certEnabled || !course?.enableCertificate}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all border ${
                certEnabled && course?.enableCertificate
                  ? "bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/18 cursor-pointer"
                  : "bg-white/3 border-white/6 text-slate-600 cursor-not-allowed opacity-60"
              }`}
            >
              <FiAward size={12} />
              {certEnabled && course?.enableCertificate
                ? "Certificate"
                : `${progress}% / 70%`}
            </button>

            {/* ── CUSTOM HOVER POPUP (TOOLTIP) ── */}
            <div className="absolute top-full left-1/4 -translate-x-1/2 mb-2 w-52 p-2 bg-slate-950 border border-white/10 rounded-lg text-[10px] text-slate-400 text-center font-medium leading-relaxed shadow-xl pointer-events-none opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 z-50">
              {/* Case 1: Sub kuch unlocked hai */}
              {certEnabled &&
                course?.enableCertificate &&
                "View and Download Certificate"}

              {/* Case 2: Progress 70% se upar hai par instructor ne disable rakha hai */}
              {progress >= 70 && !course?.enableCertificate && (
                <span className="text-amber-500/90 block">
                  The instructor has not completed all topics yet. We’ll notify
                  you once the course is finished.
                </span>
              )}

              {/* Case 3: Progress hi 70% se kam hai */}
              {progress < 70 && `Complete 70% to unlock (${progress}%)`}

              {/* Tooltip Arrow */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-950"></div>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/8 flex items-center justify-center text-slate-400 hover:text-white transition-all"
          >
            {sidebarOpen ? <FiX size={15} /> : <FiMenu size={15} />}
          </button>
        </div>
      </header>

      {/* ══ BODY ══════════════════════════════════════════════ */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* MAIN */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Video */}
          <div className="flex-1 bg-black relative p-5 border-white">
            {videoSrc ? (
              <iframe
                key={currentLesson._id}
                src={videoSrc}
                className=" border-white w-full h-full"
                allow="autoplay; fullscreen"
                allowFullScreen
                title={currentLesson.title}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3 border-white">
                <div className="w-14 h-14 rounded-2xl bg-white/4 border border-white/6 flex items-center justify-center">
                  <FiPlay
                    size={22}
                    className="text-slate-700 translate-x-0.5"
                  />
                </div>
                <p className="text-slate-600 text-sm">
                  Select a lesson to begin
                </p>
              </div>
            )}
          </div>

          {/* Controls bar */}
          {currentLesson && (
            <div className="shrink-0 border-t border-white/6 bg-[#07070d] px-4 py-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-600">
                      Lesson {currentIdx + 1} / {sortedLessons.length}
                    </span>
                    {currentLesson.duration > 0 && (
                      <span className="flex items-center gap-1 text-[9px] text-slate-600">
                        <FiClock size={9} />{" "}
                        {fmtDuration(currentLesson.duration)}
                      </span>
                    )}
                    {isLessonDone && (
                      <span className="flex items-center gap-1 text-[9px] font-black text-emerald-400 bg-emerald-400/10 border border-emerald-400/15 px-2 py-0.5 rounded-full">
                        <FiCheckCircle size={8} /> Completed
                      </span>
                    )}
                  </div>
                  <h2 className="text-sm font-bold text-white mt-0.5 truncate">
                    {currentLesson.title}
                  </h2>
                  {currentLesson.description && (
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                      {currentLesson.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() =>
                      hasPrev && setCurrentLesson(sortedLessons[currentIdx - 1])
                    }
                    disabled={!hasPrev}
                    className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white/5 border border-white/8 text-[11px] font-bold text-slate-400 hover:text-white disabled:opacity-25 disabled:cursor-not-allowed transition-all"
                  >
                    <FiChevronLeft size={13} /> Prev
                  </button>

                  {/* ★ MARK COMPLETE BUTTON ★ */}
                  {!isLessonDone ? (
                    <button
                      onClick={handleMarkComplete}
                      disabled={saving}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold hover:bg-emerald-500/18 active:scale-95 disabled:opacity-50 transition-all"
                    >
                      {saving ? (
                        <>
                          <div className="w-3 h-3 border border-emerald-400 border-t-transparent rounded-full animate-spin" />{" "}
                          Saving…
                        </>
                      ) : (
                        <>
                          <FiCheckCircle size={13} /> Mark Complete
                        </>
                      )}
                    </button>
                  ) : hasNext ? (
                    <button
                      onClick={() =>
                        setCurrentLesson(sortedLessons[currentIdx + 1])
                      }
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-black text-[11px] font-black active:scale-95 transition-all"
                    >
                      Next <FiChevronRight size={13} />
                    </button>
                  ) : null}

                  {/* Certificate in controls — mobile visible */}
                  <button
                    onClick={() => certEnabled && setShowCert(true)}
                    disabled={!certEnabled}
                    title={
                      certEnabled
                        ? "View Certificate"
                        : `Need 70% (${progress}%)`
                    }
                    className={`sm:hidden flex items-center gap-1 px-3 py-2 rounded-xl text-[11px] font-bold border transition-all ${
                      certEnabled
                        ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                        : "bg-white/3 border-white/6 text-slate-600 opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <FiAward size={13} />
                  </button>

                  <button
                    onClick={() =>
                      hasNext && setCurrentLesson(sortedLessons[currentIdx + 1])
                    }
                    disabled={!hasNext}
                    className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white/5 border border-white/8 text-[11px] font-bold text-slate-400 hover:text-white disabled:opacity-25 disabled:cursor-not-allowed transition-all"
                  >
                    Next <FiChevronRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* ══ SIDEBAR ══════════════════════════════════════════ */}
        {/* Mobile backdrop */}
        {sidebarOpen && (
          <div
            className="md:hidden absolute inset-0 bg-black/60 backdrop-blur-sm z-10"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside
          className={`
          absolute md:relative top-0 right-0 h-full z-20
          w-[300px] xl:w-[360px] shrink-0
          border-l border-white/6 bg-[#07070d]
          flex flex-col overflow-hidden
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "translate-x-full"}
          ${!sidebarOpen ? "md:hidden" : "md:relative md:translate-x-0"}
        `}
        >
          {/* Progress summary */}
          <div className="px-4 pt-4 pb-3 border-b border-white/6 space-y-2.5 shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-600">
                Your Progress
              </span>
              <span className="text-[11px] font-black text-orange-400">
                {progress}%
              </span>
            </div>
            <div className="h-1.5 w-full bg-white/6 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-600">
              <span>
                {completedIds.length}/{sortedLessons.length} lessons done
              </span>
              {progress >= 100 && (
                <span className="text-emerald-400 font-black flex items-center gap-1">
                  <FiZap size={9} /> Complete!
                </span>
              )}
            </div>

            {/* Quick actions */}
            <div className="flex gap-1.5 flex-wrap pt-0.5">
              {course.zoomLink && (
                <a
                  href={course.zoomLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/15 text-blue-400 text-[10px] font-bold hover:bg-blue-500/18 transition-all"
                >
                  <FiVideo size={10} /> Live
                </a>
              )}
              {course.whatsappSupport && (
                <a
                  href={`https://wa.me/${course.whatsappSupport}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/15 text-emerald-400 text-[10px] font-bold hover:bg-emerald-500/18 transition-all"
                >
                  <FiMessageCircle size={10} /> Support
                </a>
              )}
              {/* Certificate pill — locked/unlocked */}
              <button
                onClick={() => certEnabled && setShowCert(true)}
                disabled={!certEnabled}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                  certEnabled
                    ? "bg-amber-500/10 border-amber-500/15 text-amber-400 hover:bg-amber-500/18 cursor-pointer"
                    : "bg-white/3 border-white/6 text-slate-600 cursor-not-allowed"
                }`}
              >
                <FiAward size={10} />
                {certEnabled ? "Certificate" : `${progress}%/70%`}
              </button>
            </div>
          </div>

          {/* Tab bar */}
          <div className="flex border-b border-white/6 shrink-0">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1 py-2.5 text-[10px] font-bold transition-all ${
                  activeTab === tab.id
                    ? "text-orange-400 border-b-2 border-orange-500 bg-orange-500/5"
                    : "text-slate-600 hover:text-slate-300"
                }`}
              >
                <tab.icon size={11} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto">
            {/* LESSONS TAB */}
            {activeTab === "lessons" && (
              <div className="flex flex-col h-full">
                <div className="p-2.5 space-y-1 flex-1">
                  {lessonPage.map((lesson) => {
                    const idx = sortedLessons.findIndex(
                      (l) => l._id === lesson._id,
                    );
                    return (
                      <LessonRow
                        key={lesson._id}
                        lesson={lesson}
                        index={idx}
                        isActive={currentLesson?._id === lesson._id}
                        isCompleted={completedIds.includes(lesson._id)}
                        onClick={() => setCurrentLesson(lesson)}
                      />
                    );
                  })}
                </div>
                {/* Pagination */}
                {lTotal > 1 && (
                  <div className="flex items-center justify-between px-4 py-3 border-t border-white/6 shrink-0">
                    <button
                      onClick={() => setLPage((p) => Math.max(p - 1, 1))}
                      disabled={lPage === 1}
                      className="w-7 h-7 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center text-slate-500 hover:text-white disabled:opacity-30 transition-all"
                    >
                      <FiChevronLeft size={13} />
                    </button>
                    <span className="text-[10px] font-bold text-slate-500">
                      {lPage} / {lTotal}
                    </span>
                    <button
                      onClick={() => setLPage((p) => Math.min(p + 1, lTotal))}
                      disabled={lPage === lTotal}
                      className="w-7 h-7 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center text-slate-500 hover:text-white disabled:opacity-30 transition-all"
                    >
                      <FiChevronRight size={13} />
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "notes" && (
              <div className="p-4 flex flex-col gap-3 h-full">
                {currentLesson ? (
                  <>
                    <div className="flex items-center justify-between">
                      <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-600">
                        Lesson {currentIdx + 1} Notes
                      </p>

                      {/* NEW INDEPENDENT SYNC CONTROLLER BUTTON */}
                      <button
                        onClick={saveNote}
                        disabled={syncStatus === "saving"} // Block multiple requests while uploading
                        className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-lg transition-all duration-300 active:scale-[0.97] disabled:opacity-70 ${
                          syncStatus === "saved"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 scale-105 shadow-md shadow-emerald-950/20"
                            : syncStatus === "saving"
                              ? "bg-blue-500/10 text-blue-400 border border-blue-500/30 cursor-wait"
                              : "bg-white/5 border border-white/8 text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/20"
                        }`}
                      >
                        {/* ── CONDITIONAL DYNAMIC ICONS ── */}
                        {syncStatus === "saving" && (
                          <FiLoader
                            size={11}
                            className="animate-spin text-blue-400"
                          />
                        )}
                        {syncStatus === "saved" && (
                          <FiCheck
                            size={11}
                            className="text-emerald-400 animate-[bounce_0.5s_ease-in-out]"
                          />
                        )}
                        {syncStatus === "idle" && <FiSave size={11} />}

                        {/* ── DYNAMIC ACTION TEXT LABELS ── */}
                        <span>
                          {syncStatus === "saving" && "Saving To Cloud..."}
                          {syncStatus === "saved" && "Saved Cloud ✓"}
                          {syncStatus === "idle" && "Save Note"}
                        </span>
                      </button>
                    </div>

                    <textarea
                      ref={noteRef}
                      key={currentLesson._id}
                      defaultValue={notes[currentLesson._id] || ""}
                      placeholder={`Write notes for "${currentLesson.title}"…`}
                      className="flex-1 w-full bg-white/4 border border-white/8 rounded-xl p-3 text-[12px] text-slate-300 placeholder-slate-700 resize-none focus:outline-none focus:border-blue-500/40 leading-relaxed min-h-[200px]"
                    />

                    <p className="text-[9px] text-slate-600 text-center font-medium tracking-wide">
                      {syncStatus === "saving" ? (
                        <span className="text-blue-500 animate-pulse">
                          Establishing encrypted remote database uplink...
                        </span>
                      ) : syncStatus === "saved" ? (
                        <span className="text-emerald-500">
                          Cloud database integrity handshake absolute.
                        </span>
                      ) : (
                        "⚡ Local storage caching & secure pipeline active"
                      )}
                    </p>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-32 gap-2">
                    <FiEdit3 size={18} className="text-slate-700" />
                    <p className="text-xs text-slate-600">
                      Pick a lesson first
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* SCHEDULE TAB */}
            {activeTab === "schedule" && (
              <div className="p-4 space-y-5">
                {upcomingSessions.length === 0 && pastSessions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-2">
                    <FiCalendar size={22} className="text-slate-700" />
                    <p className="text-xs text-slate-600 text-center">
                      No sessions scheduled.
                    </p>
                    {course.whatsappSupport && (
                      <a
                        href={`https://wa.me/${course.whatsappSupport}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-emerald-400 font-bold hover:text-emerald-300"
                      >
                        Ask on WhatsApp →
                      </a>
                    )}
                  </div>
                ) : (
                  <>
                    {/* ==========================================
      SECTION 1: UPCOMING SESSIONS MONITOR
     ========================================== */}
                    {upcomingSessions.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                            Upcoming Live Classes
                          </p>
                        </div>

                        <div className="space-y-3">
                          {upcomingSessions.map((s, i) => {
                            const validatedLink = formatExternalLink(s.link);

                            return (
                              <div
                                key={s._id || i}
                                className="group relative bg-gradient-to-br from-slate-900 via-slate-900/95 to-blue-950/20 border border-slate-800/80 hover:border-blue-500/30 rounded-2xl p-4 transition-all duration-300 shadow-xl shadow-black/10"
                              >
                                {/* Card Meta Content */}
                                <div className="flex items-start justify-between gap-4">
                                  <div className="space-y-1">
                                    <p className="text-[14px] font-bold text-slate-100 group-hover:text-white transition-colors">
                                      {s.title || "Live Interactive Session"}
                                    </p>
                                    <div className="text-[11px] font-medium text-slate-400 flex items-center flex-wrap gap-2">
                                      <span className="flex items-center gap-1.5 text-blue-400">
                                        <FiCalendar size={12} />{" "}
                                        {fmtDate(s.date)}
                                      </span>
                                      <span className="text-slate-700">•</span>
                                      <span className="flex items-center gap-1 text-slate-500">
                                        <FiClock size={11} />
                                        <span className="text-[10px] uppercase tracking-wider">
                                          Easyway Pro Live
                                        </span>
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* DYNAMIC ACTION ROW CONTEXT */}
                                {s.link && (
                                  <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-end">
                                    {validatedLink ? (
                                      /* VALID REAL LINK: Renders Professional Anchor Button */
                                      <a
                                        href={validatedLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-[11px] uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-900/20"
                                      >
                                        <FiVideo
                                          size={13}
                                          className="animate-bounce"
                                        />
                                        <span>Go To Class</span>
                                        <FiExternalLink
                                          size={11}
                                          className="opacity-70"
                                        />
                                      </a>
                                    ) : (
                                      /* DUMMY MOCK DATA: Renders Safe Disabled Alert Badge */
                                      <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-semibold px-4 py-2 rounded-xl">
                                        <FiAlertCircle size={13} />
                                        <span>Link Pending</span>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* ==========================================
      SECTION 2: PAST SESSIONS ARCHIVE (PAGINATED VIEW)
     ========================================== */}
                    {pastSessions.length > 0 && (
                      <div className="space-y-3 mt-6">
                        {/* Header Matrix with Live Page Index Counter */}
                        <div className="flex items-center justify-between pl-1">
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500/80">
                            Past Archive
                          </p>
                          {totalPages > 1 && (
                            <span className="text-[10px] text-slate-500 font-semibold tracking-wide">
                              PAGE {currentPage} OF {totalPages}
                            </span>
                          )}
                        </div>

                        {/* Render only current pages sliced data arrays */}
                        <div className="space-y-2.5">
                          {currentPastSessions.map((s, i) => (
                            <div
                              key={s._id || i}
                              className="bg-slate-900/40 border border-slate-900 rounded-xl p-3.5 flex items-center justify-between gap-4 opacity-75 hover:opacity-100 hover:border-slate-800/80 transition-all duration-200"
                            >
                              <div className="space-y-1">
                                <p className="text-[12px] font-semibold text-slate-400 line-clamp-1">
                                  {s.title || "Completed Session"}
                                </p>
                                <p className="text-[10px] text-slate-600 flex items-center gap-1.5">
                                  <FiCalendar size={11} /> {fmtDate(s.date)}
                                </p>
                              </div>

                              <div className="flex items-center gap-1.5 bg-slate-950/60 px-2.5 py-1 rounded-md border border-slate-800/40 text-[10px] font-medium text-slate-500">
                                <FiCheckCircle
                                  size={10}
                                  className="text-emerald-500/70"
                                />
                                <span>Concluded</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* ==========================================
          DYNAMIC INTERACTIVE PAGINATION CONTROLS BAR
         ========================================== */}
                        {totalPages > 1 && (
                          <div className="mt-5 pt-4 flex items-center justify-center gap-1.5 border-t border-slate-900/80">
                            {/* Previous Arrow Button */}
                            <button
                              onClick={() => handlePageChange(currentPage - 1)}
                              disabled={currentPage === 1}
                              className="p-2 rounded-xl border border-slate-800/80 bg-slate-900/40 text-slate-400 hover:text-white disabled:opacity-15 disabled:cursor-not-allowed hover:bg-slate-800/50 transition-all duration-150"
                            >
                              <FiChevronLeft size={14} />
                            </button>

                            {/* Symmetrical Numerical Navigation Pills */}
                            {Array.from({ length: totalPages }, (_, index) => {
                              const pageNumber = index + 1;
                              return (
                                <button
                                  key={pageNumber}
                                  onClick={() => handlePageChange(pageNumber)}
                                  className={`min-w-[28px] h-7 text-[11px] font-bold rounded-lg transition-all duration-150 ${
                                    currentPage === pageNumber
                                      ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30"
                                      : "border border-slate-800/60 bg-slate-900/20 text-slate-400 hover:bg-slate-800/60 hover:text-white"
                                  }`}
                                >
                                  {pageNumber}
                                </button>
                              );
                            })}

                            {/* Next Arrow Button */}
                            <button
                              onClick={() => handlePageChange(currentPage + 1)}
                              disabled={currentPage === totalPages}
                              className="p-2 rounded-xl border border-slate-800/80 bg-slate-900/40 text-slate-400 hover:text-white disabled:opacity-15 disabled:cursor-not-allowed hover:bg-slate-800/50 transition-all duration-150"
                            >
                              <FiChevronRight size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* INFO TAB */}
            {activeTab === "info" && (
              <div className="p-4 space-y-5">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-600 mb-2">
                    About
                  </p>
                  <p className="text-[12px] text-slate-400 leading-relaxed">
                    {course.shortDescription || course.description}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {course.level && (
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/5 border border-white/8 text-slate-400">
                      {course.level}
                    </span>
                  )}
                  {course.language && (
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/5 border border-white/8 text-slate-400">
                      {course.language}
                    </span>
                  )}
                  {course.category && (
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/15 text-orange-400">
                      {course.category}
                    </span>
                  )}
                  {course.totalDuration > 0 && (
                    <span className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/5 border border-white/8 text-slate-400">
                      <FiClock size={9} />{" "}
                      {fmtDuration(course.totalDuration * 60)}
                    </span>
                  )}
                  {course.validityDays && (
                    <span className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/5 border border-white/8 text-slate-400">
                      <FiCalendar size={9} /> {course.validityDays}d
                    </span>
                  )}
                </div>
                {course.instructor?.name && (
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-600 mb-2">
                      Instructor
                    </p>
                    <div className="flex items-center gap-3 bg-white/3 border border-white/6 rounded-xl p-3">
                      {course.instructor.photo ? (
                        <img
                          src={course.instructor.photo}
                          alt={course.instructor.name}
                          className="w-10 h-10 rounded-xl object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-black font-black text-base shrink-0">
                          {course.instructor.name[0]}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-[12px] font-bold text-white">
                          {course.instructor.name}
                        </p>
                        {course.instructor.bio && (
                          <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">
                            {course.instructor.bio}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {course.tags?.length > 0 && (
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-600 mb-2">
                      Topics
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {course.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-white/4 border border-white/6 text-slate-500"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {course.purchase?.expiresAt && (
                  <div className="bg-white/3 border border-white/6 rounded-xl p-3">
                    <p className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-600 mb-1">
                      Access Expires
                    </p>
                    <p className="text-[12px] font-bold text-slate-300">
                      {fmtDate(course.purchase.expiresAt)}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Certificate overlay */}
      {showCert && (
        <CertificateOverlay
          course={course}
          user={user}
          onClose={() => setShowCert(false)}
        />
      )}
    </div>
  );
}
