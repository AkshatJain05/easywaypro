import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  createCourse,
  updateCourse,
  fetchAdminCourses,
} from "../../../redux/courseSlice.js";
import toast from "react-hot-toast";
import {
  HiOutlineArrowLeft,
  HiOutlinePlus,
  HiOutlineTrash,
  HiChevronLeft,
  HiChevronRight,
} from "react-icons/hi";
import {
  FiBook,
  FiDollarSign,
  FiUser,
  FiTv,
  FiRadio,
  FiImage,
  FiEye,
  FiClock,
  FiVideo,
} from "react-icons/fi";

const INITIAL = {
  title: "",
  shortDescription: "",
  description: "",
  price: "",
  discountPrice: "",
  thumbnail: "",
  category: "",
  level: "Beginner",
  language: "English",
  totalDuration: "",
  validityDays: 365,
  isPublished: false,
  enableCertificate: false,
  instructor: { name: "", bio: "", photo: "" },
  whatsappSupport: "",
  zoomLink: "",
  zoomSchedule: [],
  lessons: [],
};

export default function AdminCourseForm() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { adminCourses } = useSelector((s) => s.courses);
  const [form, setForm] = useState(INITIAL);
  const [saving, setSaving] = useState(false);
  const isEdit = Boolean(id);

  // Local Curriculum Pagination Sub-States
  const [lessonPage, setLessonPage] = useState(1);
  const lessonsPerPage = 5;

  // Active testing video anchor tracker state
  const [previewVideoUrl, setPreviewVideoUrl] = useState(null);
  useEffect(() => {
    if (isEdit) {
      if (adminCourses.length === 0) dispatch(fetchAdminCourses());
      const existing = adminCourses.find((c) => c._id === id);

      if (existing) {
        // Create a sanitized version of the existing data
        const sanitizedData = {
          ...INITIAL,
          ...existing,
          // Ensure nested fields are not null
          instructor: {
            ...INITIAL.instructor,
            ...(existing.instructor || {}),
          },
          lessons: existing.lessons || [],
          // Force strings for inputs that might come back as null from DB
          zoomLink: existing.zoomLink || "",
          thumbnail: existing.thumbnail || "",
          shortDescription: existing.shortDescription || "",
          whatsappSupport: existing.whatsappSupport || "",
          // Handle zoomSchedule if it exists
          zoomSchedule: (existing.zoomSchedule || []).map((s) => ({
            ...s,
            title: s.title || "",
            link: s.link || "",
          })),
        };

        setForm(sanitizedData);
      }
    }
  }, [id, adminCourses, isEdit, dispatch]);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));
  const setInstructor = (key, val) =>
    setForm((f) => ({ ...f, instructor: { ...f.instructor, [key]: val } }));

  // Helper calculation to normalize raw inputs into standard embed links
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return "";
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}`
      : url;
  };

  const addZoomSession = () => {
    setForm((f) => ({
      ...f,
      zoomSchedule: [...f.zoomSchedule, { title: "", date: "", link: "" }],
    }));
  };

  const updateZoomSession = (index, key, val) => {
    setForm((f) => {
      const updated = [...f.zoomSchedule];
      updated[index] = { ...updated[index], [key]: val };
      return { ...f, zoomSchedule: updated };
    });
  };

  const removeZoomSession = (index) => {
    setForm((f) => ({
      ...f,
      zoomSchedule: f.zoomSchedule.filter((_, i) => i !== index),
    }));
  };

  // Lesson Management Engine Hooks
  const addLesson = () => {
    setForm((f) => {
      const nextIndex = f.lessons.length;
      const updatedLessons = [
        ...f.lessons,
        {
          title: "",
          videoUrl: "",
          duration: "",
          description: "",
          order: nextIndex,
        },
      ];
      const nextTotalPages = Math.ceil(updatedLessons.length / lessonsPerPage);
      if (nextTotalPages > lessonPage) {
        setLessonPage(nextTotalPages);
      }
      return { ...f, lessons: updatedLessons };
    });
  };

  const updateLesson = (absoluteIndex, key, val) =>
    setForm((f) => {
      const lessons = [...f.lessons];
      lessons[absoluteIndex] = { ...lessons[absoluteIndex], [key]: val };
      return { ...f, lessons };
    });

  const removeLesson = (absoluteIndex) => {
    setForm((f) => {
      const remainingLessons = f.lessons.filter(
        (_, idx) => idx !== absoluteIndex,
      );
      const reorderedLessons = remainingLessons.map((l, idx) => ({
        ...l,
        order: idx,
      }));
      const validTotalPages =
        Math.ceil(reorderedLessons.length / lessonsPerPage) || 1;
      if (lessonPage > validTotalPages) {
        setLessonPage(validTotalPages);
      }
      return { ...f, lessons: reorderedLessons };
    });
  };

  // Memoized Sub-Syllabus Array Calculations
  const lessonTotalPages = useMemo(
    () => Math.ceil(form.lessons.length / lessonsPerPage) || 1,
    [form.lessons],
  );

  const paginatedLessons = useMemo(() => {
    const offsetStart = (lessonPage - 1) * lessonsPerPage;
    return form.lessons
      .slice(offsetStart, offsetStart + lessonsPerPage)
      .map((lesson, localIdx) => ({
        lesson,
        absoluteIndex: offsetStart + localIdx,
      }));
  }, [form.lessons, lessonPage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.price || !form.description.trim()) {
      return toast.error(
        "Course Title, Base Price, and Details Description are mandatory fields",
      );
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        discountPrice: form.discountPrice
          ? Number(form.discountPrice)
          : undefined,
        totalDuration: Number(form.totalDuration) || 0,
        validityDays: Number(form.validityDays) || 365,
      };
      if (isEdit) {
        await dispatch(updateCourse({ id, data: payload })).unwrap();
        toast.success("Course workspace deployed smoothly");
      } else {
        await dispatch(createCourse(payload)).unwrap();
        toast.success("New blueprint indexing deployed live");
      }
      navigate("/admin/courses");
    } catch (err) {
      toast.error(err || "Failed to dispatch cloud ledger synchronization");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-2 md:p-4 text-slate-100 antialiased selection:bg-orange-500/30">
      {/* Top Controls Action Row */}
      <button
        type="button"
        onClick={() => navigate("/admin/courses")}
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-xs font-semibold uppercase tracking-wider mb-5 transition-colors group bg-black border border-slate-800/80 px-3 py-2 rounded-lg backdrop-blur-md"
      >
        <HiOutlineArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
        <span>Back to Assets Directory</span>
      </button>

      {/* Grid Hub Framework */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Configuration Panel Wrapper */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-5">
          <Section
            title="Basic Asset Core Settings"
            icon={<FiBook className="text-blue-400 w-4 h-4" />}
          >
            <div className="space-y-4">
              <Field label="Course Title Target *">
                <input
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  className="w-full bg-gray-950 border border-slate-800 focus:border-orange-500/50 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none transition-all placeholder:text-slate-700 shadow-inner"
                  placeholder="e.g., Enterprise Production MERN Architecture"
                  required
                />
              </Field>

              <Field label="Listing Grid Preview Deck Summary">
                <input
                  value={form.shortDescription}
                  onChange={(e) => set("shortDescription", e.target.value)}
                  className="w-full bg-gray-950 border border-slate-800 focus:border-orange-500/50 rounded-lg px-3.5 py-2 text-xs md:text-sm text-white focus:outline-none transition-all placeholder:text-slate-700 shadow-inner"
                  placeholder="One-liner descriptor visible inside course cards..."
                />
              </Field>

              <Field label="Comprehensive Portfolio Syllabus *">
                <textarea
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  className="w-full bg-gray-950 border border-slate-800 focus:border-orange-500/50 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none transition-all shadow-inner min-h-[90px]"
                  rows={3}
                  placeholder="Detailed markdown parameters detailing structures, concepts, constraints, environments..."
                  required
                />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Thumbnail Asset Uniform Source Web Link">
                  <input
                    value={form.thumbnail}
                    onChange={(e) => set("thumbnail", e.target.value)}
                    className="w-full bg-gray-950 border border-slate-800 focus:border-orange-500/50 rounded-lg px-3.5 py-2 text-xs md:text-sm text-white focus:outline-none transition-all placeholder:text-slate-700 shadow-inner"
                    placeholder="https://images.unsplash.com/..."
                  />
                </Field>
                <Field label="Tech Category Filter Tag">
                  <input
                    value={form.category}
                    onChange={(e) => set("category", e.target.value)}
                    className="w-full bg-gray-950 border border-slate-800 focus:border-orange-500/50 rounded-lg px-3.5 py-2 text-xs md:text-sm text-white focus:outline-none transition-all placeholder:text-slate-700"
                    placeholder="e.g., Web Development"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field label="Difficulty Tier">
                  <select
                    value={form.level}
                    onChange={(e) => set("level", e.target.value)}
                    className="w-full bg-gray-950 border border-slate-800 focus:border-orange-500/50 rounded-lg px-3 py-2 text-xs md:text-sm text-slate-300 focus:outline-none shadow-inner cursor-pointer"
                  >
                    {["Beginner", "Intermediate", "Advanced"].map((t) => (
                      <option
                        key={t}
                        value={t}
                        className="bg-gray-950 text-white"
                      >
                        {t}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Instruction Dialect">
                  <input
                    value={form.language}
                    onChange={(e) => set("language", e.target.value)}
                    className="w-full bg-gray-950 border border-slate-800 focus:border-orange-500/50 rounded-lg px-3.5 py-2 text-xs md:text-sm text-white focus:outline-none shadow-inner"
                  />
                </Field>
                <Field label="Syllabus Hours Index">
                  <input
                    type="number"
                    min="0"
                    value={form.totalDuration}
                    onChange={(e) => set("totalDuration", e.target.value)}
                    className="w-full bg-gray-950 border border-slate-800 focus:border-orange-500/50 rounded-lg px-3.5 py-2 text-xs md:text-sm text-white focus:outline-none font-mono shadow-inner"
                  />
                </Field>
              </div>
            </div>
          </Section>

          <Section
            title="Financial Parameters & Token Validation Bounds"
            icon={<FiDollarSign className="text-orange-400 w-4 h-4" />}
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Base Price Tag Valuation (₹) *">
                <input
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                  className="w-full bg-gray-950 border border-slate-800 focus:border-orange-500/50 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none font-mono shadow-inner"
                  placeholder="1999"
                  required
                />
              </Field>
              <Field label="Discount Offer Price (₹)">
                <input
                  type="number"
                  min="0"
                  value={form.discountPrice}
                  onChange={(e) => set("discountPrice", e.target.value)}
                  className="w-full bg-gray-950 border border-slate-800 focus:border-orange-500/50 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none font-mono shadow-inner"
                  placeholder="1199"
                />
              </Field>
              <Field label="Lifecycle Pass Validity (Days)">
                <input
                  type="number"
                  min="1"
                  value={form.validityDays}
                  onChange={(e) => set("validityDays", e.target.value)}
                  className="w-full bg-gray-950 border border-slate-800 focus:border-orange-500/50 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none font-mono shadow-inner"
                />
              </Field>
            </div>
          </Section>

          <Section
            title="Instructor Mapping Coordinates"
            icon={<FiUser className="text-emerald-400 w-4 h-4" />}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Lead Instructor Identity *">
                <input
                  value={form.instructor.name}
                  onChange={(e) => setInstructor("name", e.target.value)}
                  className="w-full bg-gray-950 border border-slate-800 focus:border-orange-500/50 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none shadow-inner"
                  placeholder="Instructor name"
                  required
                />
              </Field>
              <Field label="Avatar Vector Asset Link">
                <input
                  value={form.instructor.photo}
                  onChange={(e) => setInstructor("photo", e.target.value)}
                  className="w-full bg-gray-950 border border-slate-800 focus:border-orange-500/50 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none placeholder:text-slate-700 shadow-inner"
                  placeholder="https://..."
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Professional Credentials Narrative">
                  <textarea
                    value={form.instructor.bio}
                    onChange={(e) => setInstructor("bio", e.target.value)}
                    className="w-full bg-gray-950 border border-slate-800 focus:border-orange-500/50 rounded-lg px-3.5 py-2 text-xs text-slate-300 focus:outline-none min-h-[50px] resize-none shadow-inner"
                    rows={2}
                    placeholder="Brief summary of industrial history backgrounds..."
                  />
                </Field>
              </div>
            </div>
          </Section>

          <Section
            title="Instant Communications Bridge Links"
            icon={<FiRadio className="text-purple-400 w-4 h-4" />}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="WhatsApp Pipeline Target Contact">
                <input
                  value={form.whatsappSupport}
                  onChange={(e) => set("whatsappSupport", e.target.value)}
                  className="w-full bg-gray-950 border border-slate-800 focus:border-orange-500/50 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none font-mono shadow-inner"
                  placeholder="91XXXXXXXXXX"
                />
              </Field>
              <Field label="Direct Zoom Stream Conference Sync Path">
                <input
                  value={form.zoomLink}
                  onChange={(e) => set("zoomLink", e.target.value)}
                  className="w-full bg-gray-950 border border-slate-800 focus:border-orange-500/50 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none placeholder:text-slate-700 shadow-inner"
                  placeholder="https://zoom.us/j/..."
                />
              </Field>
            </div>
          </Section>

          {/* Interactive Toggle Control Strip */}
          <div className="flex items-center justify-between  bg-gradient-to-r from-slate-950 to-black border border-slate-800 rounded-xl p-4 shadow-xl backdrop-blur-md">
            <div className="leading-tight">
              <p className="font-bold text-xs uppercase tracking-wider text-slate-200">
                Visibility Matrix Status
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Toggle course discovery visibility across dynamic routing search
                portals
              </p>
            </div>

            <button
              type="button"
              onClick={() => set("isPublished", !form.isPublished)}
              className={`relative w-12 h-6 rounded-full transition-all border border-white/5 shadow-inner ${form.isPublished ? "bg-orange-500 shadow-orange-500/20" : "bg-slate-800"}`}
            >
              <span
                className={`absolute top-0.5 w-4.5 h-4.5 rounded-md bg-white shadow-md transition-all ${form.isPublished ? "left-6.5" : "left-1"}`}
              />
            </button>
          </div>
          {/* Certificate Toggle Control Strip */}
          <div className="flex items-center justify-between bg-gradient-to-r from-slate-950 to-black border border-slate-800 rounded-xl p-4 shadow-xl backdrop-blur-md mt-4">
            <div className="leading-tight">
              <p className="font-bold text-xs uppercase tracking-wider text-slate-200">
                Digital Certification Engine
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Toggle automatic certificate issuance for eligible students
              </p>
            </div>
            <button
              type="button"
              onClick={() => set("enableCertificate", !form.enableCertificate)}
              className={`relative w-12 h-6 rounded-full transition-all border border-white/5 shadow-inner ${form.enableCertificate ? "bg-emerald-600 shadow-emerald-500/20" : "bg-slate-800"}`}
            >
              <span
                className={`absolute top-0.5 w-4.5 h-4.5 rounded-md bg-white shadow-md transition-all ${form.enableCertificate ? "left-6.5" : "left-1"}`}
              />
            </button>
          </div>

          {/* Operations Core Action Footer */}
          <div className="flex flex-col sm:flex-row gap-3  bg-gradient-to-r from-slate-950 to-black p-3 rounded-xl border border-slate-800/80 backdrop-blur-md">
            <button
              type="button"
              onClick={() => navigate("/admin/courses")}
              className="w-full sm:flex-1 py-2.5 text-slate-400 hover:text-white bg-slate-950 border border-slate-800 rounded-lg text-xs font-bold uppercase tracking-widest transition-all active:scale-95"
            >
              Cancel Configurations
            </button>
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:flex-1 py-2.5 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs uppercase tracking-widest rounded-lg transition-all shadow-lg shadow-orange-500/10 active:scale-95 inline-flex items-center justify-center gap-2 disabled:opacity-40"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isEdit ? (
                "Push Modifications"
              ) : (
                "Commit New Unit Entry"
              )}
            </button>
          </div>
        </form>

        {/* Right Side: Interactive Client Display Panel Realtime Simulation Space */}
        <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-4">
          {/* Card Simulation Component */}
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-xl group">
            <div className="flex items-center gap-2 p-3 border-b border-slate-900 bg-gradient-to-b from-gray-950 to-black text-slate-400">
              <FiEye size={13} className="text-orange-400 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                Live Student Deck Card Preview
              </span>
            </div>

            <div className="aspect-video w-full bg-gradient-to-b from-gray-950 to-black relative flex items-center justify-center border-b border-slate-900/60 overflow-hidden">
              {form.thumbnail ? (
                <img
                  src={form.thumbnail}
                  alt="Live course card monitor"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              ) : (
                <div className="text-center p-4 flex flex-col items-center text-slate-700">
                  <FiImage size={32} className="stroke-[1.2] mb-1.5" />
                  <span className="text-[11px] uppercase tracking-wider font-semibold">
                    Asset Link Awaiting Ingest
                  </span>
                </div>
              )}
              <span className="absolute top-2.5 right-2.5 text-[9px] bg-orange-600 border border-orange-400/30 text-white font-extrabold px-2 py-0.5 rounded uppercase tracking-widest shadow-md">
                {form.level}
              </span>
            </div>

            <div className="p-4 space-y-3.5 bg-gradient-to-b from-gray-950 to-black">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider font-mono">
                  {form.category || "Unassigned Field Stream"}
                </span>
                <h4 className="text-base font-bold text-white truncate leading-tight">
                  {form.title || "Untitled Course Stream Blueprint"}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-2 min-h-[32px] leading-relaxed">
                  {form.shortDescription ||
                    "Provide system inputs to examine dynamic layout bounding text cards..."}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-900/60 pt-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-black text-white font-mono">
                    ₹
                    {(
                      Number(form.discountPrice) ||
                      Number(form.price) ||
                      0
                    ).toLocaleString("en-IN")}
                  </span>
                  {form.discountPrice && form.price && (
                    <span className="text-xs text-slate-600 line-through font-mono">
                      ₹{Number(form.price).toLocaleString("en-IN")}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 bg-slate-950 px-2 py-0.5 border border-slate-900 rounded-md">
                  <FiClock size={12} />
                  <span>{form.totalDuration || 0} Hours</span>
                </div>
              </div>
            </div>
          </div>

          {/* Curriculum Node Management Component */}
          <div className="bg-gradient-to-b from-gray-950 to-black border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
            {/* Header Section */}
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-4">
              <div className="flex items-center gap-2">
                <FiTv className="text-cyan-400 w-4 h-4" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200">
                  Curriculum Units ({form.lessons.length})
                </h3>
              </div>
              <button
                type="button"
                onClick={addLesson}
                className="inline-flex items-center gap-1 text-[10px] bg-orange-600/10 border border-orange-500/20 text-orange-400 px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider hover:bg-orange-600 hover:text-white transition-all"
              >
                <HiOutlinePlus className="stroke-[3]" /> Add Unit
              </button>
            </div>

            {form.lessons.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded-xl bg-slate-950/20">
                <FiVideo className="w-8 h-8 mx-auto text-slate-700 mb-2" />
                <p className="text-xs font-semibold text-slate-500 uppercase">
                  Curriculum is empty
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {paginatedLessons.map(({ lesson, absoluteIndex }) => (
                  <div
                    key={absoluteIndex}
                    className="bg-gradient-to-b from-gray-950 to-black border border-slate-800/60 p-4 rounded-xl shadow-inner transition-all hover:border-slate-700"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded">
                        UNIT #{(absoluteIndex + 1).toString().padStart(2, "0")}
                      </span>
                      <div className="flex gap-2">
                        {/* <button type="button" onClick={() => setPreviewVideoUrl(previewVideoUrl === lesson.videoUrl ? null : lesson.videoUrl)} 
                className={`text-[10px] px-2 py-1 rounded border transition-colors ${previewVideoUrl === lesson.videoUrl ? "bg-orange-500/20 border-orange-500 text-orange-400" : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600"}`}>
                {previewVideoUrl === lesson.videoUrl ? "Hide Preview" : "Preview"}
              </button> */}
                        <button
                          type="button"
                          onClick={() => removeLesson(absoluteIndex)}
                          className="text-slate-500 hover:text-red-400 p-1"
                        >
                          <HiOutlineTrash size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-12 gap-3">
                      <input
                        value={lesson.title || ""}
                        onChange={(e) =>
                          updateLesson(absoluteIndex, "title", e.target.value)
                        }
                        className="col-span-9 bg-gray-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-orange-500 outline-none"
                        placeholder="Unit Title"
                      />
                      <input
                        type="number"
                        value={lesson.duration ?? ""}
                        onChange={(e) =>
                          updateLesson(
                            absoluteIndex,
                            "duration",
                            e.target.value === "" ? "" : Number(e.target.value),
                          )
                        }
                        className="col-span-3 bg-gray-950 border border-slate-800 rounded-lg px-2 py-2 text-xs text-center text-white focus:border-orange-500 outline-none"
                        placeholder="Min"
                      />
                      <input
                        value={lesson.videoUrl || ""}
                        onChange={(e) =>
                          updateLesson(
                            absoluteIndex,
                            "videoUrl",
                            e.target.value,
                          )
                        }
                        className="col-span-12 bg-gray-950 border border-slate-800 rounded-lg px-3 py-2 text-[11px] font-mono text-slate-400 focus:border-orange-500 outline-none"
                        placeholder="Video URL Source..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Section
            title="Live Zoom Conference Schedule"
            icon={<FiRadio className="text-purple-400 w-4 h-4" />}
          >
            <div className="space-y-3">
              {form.zoomSchedule.map((session, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row flex-wrap gap-3 bg-gradient-to-b from-gray-950 to-black p-3 rounded-xl border border-slate-800 shadow-inner items-center"
                >
                  {/* Title Input - Flex-grow allows it to take more space */}
                  <input
                    className="w-full sm:flex-[2] bg-gray-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-orange-500 outline-none transition-all"
                    placeholder="Session Title"
                    value={session.title ?? ""}
                    onChange={(e) =>
                      updateZoomSession(index, "title", e.target.value)
                    }
                  />

                  {/* Date Input */}
                  <input
                    type="datetime-local"
                    className="w-full sm:flex-[1] bg-gray-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-400 focus:border-orange-500 outline-none transition-all"
                    value={session.date ? session.date.slice(0, 16) : ""}
                    onChange={(e) =>
                      updateZoomSession(index, "date", e.target.value)
                    }
                  />

                  {/* Link Input */}
                  <input
                    className="w-full sm:flex-[2] bg-gray-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-orange-500 outline-none transition-all"
                    placeholder="Zoom Link"
                    value={session.link ?? ""}
                    onChange={(e) =>
                      updateZoomSession(index, "link", e.target.value)
                    }
                  />

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeZoomSession(index)}
                    className="w-full sm:w-auto px-4 py-2 text-xs font-bold text-red-400 hover:text-red-300 bg-red-950/20 hover:bg-red-950/40 rounded-lg border border-red-900/50 transition-all"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addZoomSession}
                className="text-xs text-purple-400 font-bold"
              >
                + Add Session
              </button>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

/* Structural Framers helper components blocks */
function Section({ title, icon, children }) {
  return (
    <section className="bg-gradient-to-b from-gray-950 to-black border border-slate-800/70 rounded-xl p-5 space-y-4 shadow-xl backdrop-blur-sm">
      <div className="flex items-center gap-2 border-b border-slate-800/60 pb-3">
        {icon}
        <h3 className="font-bold text-xs md:text-sm text-slate-300 uppercase tracking-wider">
          {title}
        </h3>
      </div>
      {children}
    </section>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-1.5 w-full">
      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">
        {label}
      </label>
      {children}
    </div>
  );
}
