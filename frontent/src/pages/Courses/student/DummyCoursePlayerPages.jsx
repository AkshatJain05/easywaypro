import { useEffect, useState, useMemo, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCourse } from '../../../redux/courseSlice.js'
import { updateProgress } from '../../../redux/purchaseSlice.js'
import toast from 'react-hot-toast'
import {
  FiPlay, FiCheckCircle, FiCircle, FiArrowLeft, FiMessageCircle,
  FiAward, FiLock, FiMenu, FiX, FiVideo, FiEdit3, FiSave,
  FiChevronRight, FiList, FiClock, FiZap
} from 'react-icons/fi'
import ProgressBar from '../ProgressBar.jsx'
import Loading from '../../../component/Loading.jsx'

const TABS = [
  { id: 'lessons', label: 'Lessons', icon: FiList },
  { id: 'notes',   label: 'Notes',   icon: FiEdit3 },
]

export default function CoursePlayerPage() {
  const { courseId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { current: course, loading } = useSelector(s => s.courses)

  const [activeLesson, setActiveLesson] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState('lessons')
  const [notes, setNotes] = useState(() => {
    try { return JSON.parse(localStorage.getItem(`notes_${courseId}`) || '{}') } catch { return {} }
  })
  const [noteSaved, setNoteSaved] = useState(false)
  const noteRef = useRef(null)

  useEffect(() => { dispatch(fetchCourse(courseId)) }, [courseId])

  useEffect(() => {
    if (course?.lessons?.length > 0 && !activeLesson) {
      setActiveLesson(course.lessons[0])
    }
  }, [course])

  const sortedLessons = useMemo(() =>
    [...(course?.lessons || [])].sort((a, b) => a.order - b.order),
    [course?.lessons]
  )

  const currentNote = notes[activeLesson?._id] || ''

  const saveNote = () => {
    if (!activeLesson) return
    const updated = { ...notes, [activeLesson._id]: noteRef.current?.value || '' }
    setNotes(updated)
    localStorage.setItem(`notes_${courseId}`, JSON.stringify(updated))
    setNoteSaved(true)
    setTimeout(() => setNoteSaved(false), 2000)
  }

  const handleLessonComplete = () => {
    if (!activeLesson) return
    const purchase = course?.purchase
    if (!purchase) return
    const completedLessons = purchase.completedLessons || []
    const newCompleted = [...new Set([...completedLessons, activeLesson._id])]
    const progress = Math.round((newCompleted.length / course.lessons.length) * 100)
    dispatch(updateProgress({ courseId, lessonId: activeLesson._id, progress }))
      .unwrap()
      .then(() => toast.success('Lesson marked complete!'))
      .catch(err => toast.error(err))
  }

  const goToNextLesson = () => {
    const idx = sortedLessons.findIndex(l => l._id === activeLesson?._id)
    if (idx < sortedLessons.length - 1) setActiveLesson(sortedLessons[idx + 1])
  }

  const goPrevLesson = () => {
    const idx = sortedLessons.findIndex(l => l._id === activeLesson?._id)
    if (idx > 0) setActiveLesson(sortedLessons[idx - 1])
  }

  if (loading || !course) return <Loading />

  if (!course.isPurchased) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
        <div className="text-center bg-[#0c0c0e] border border-white/8 rounded-2xl p-12 max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto mb-5">
            <FiLock size={26} className="text-orange-400" />
          </div>
          <h2 className="text-2xl font-black text-white mb-2">Access Restricted</h2>
          <p className="text-slate-500 text-sm mb-6 leading-relaxed">You need to purchase this course to access its content.</p>
          <Link to={`/courses/${courseId}`} className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-400 text-black font-black rounded-xl transition-all">
            Buy Course
          </Link>
        </div>
      </div>
    )
  }

  const purchase = course.purchase || {}
  const completedLessons = purchase.completedLessons || []
  const progress = purchase.progress || 0
  const isCompleted = completedLessons.includes(activeLesson?._id)
  const currentIdx = sortedLessons.findIndex(l => l._id === activeLesson?._id)
  const hasPrev = currentIdx > 0
  const hasNext = currentIdx < sortedLessons.length - 1

  return (
    <div className="h-screen flex flex-col bg-[#050505] text-slate-200 font-sans overflow-hidden">

      {/* ── Top Bar ── */}
      <header className="h-14 shrink-0 border-b border-white/6 bg-[#080810]/95 backdrop-blur-xl flex items-center justify-between px-4 gap-3 z-30">

        {/* Left */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => navigate('/my-courses')}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/8 flex items-center justify-center text-slate-400 hover:text-white transition-all shrink-0"
          >
            <FiArrowLeft size={15} />
          </button>
          <div className="min-w-0 hidden sm:block">
            <p className="text-xs font-black text-white truncate leading-none">{course.title}</p>
            <p className="text-[10px] text-slate-500 mt-0.5 truncate">{activeLesson?.title || 'Select a lesson'}</p>
          </div>
        </div>

        {/* Center — progress pill (desktop) */}
        <div className="hidden md:flex items-center gap-3 bg-white/4 border border-white/6 rounded-full px-4 py-1.5">
          <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[11px] font-bold text-orange-400">{progress}%</span>
          <span className="text-[10px] text-slate-600">
            {completedLessons.length}/{course.lessons?.length}
          </span>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Zoom */}
          {course.zoomLink && (
            <a
              href={course.zoomLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/15 text-[11px] font-bold transition-all"
            >
              <FiVideo size={13} /> Zoom Class
            </a>
          )}

          {/* WhatsApp */}
          {course.whatsappSupport && (
            <a
              href={`https://wa.me/${course.whatsappSupport}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center hover:bg-emerald-500/15 transition-all"
              title="WhatsApp Support"
            >
              <FiMessageCircle size={14} />
            </a>
          )}

          {/* Certificate */}
          {progress >= 100 && (
            <a
              href={`/api/certificates/download/${courseId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/15 text-[11px] font-bold transition-all"
            >
              <FiAward size={13} /> Certificate
            </a>
          )}

          {/* Sidebar toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/8 flex items-center justify-center text-slate-400 hover:text-white transition-all"
          >
            {sidebarOpen ? <FiX size={15} /> : <FiMenu size={15} />}
          </button>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Main ── */}
        <main className="flex-1 flex flex-col overflow-hidden">

          {/* Video area */}
          <div className="flex-1 bg-black relative">
            {activeLesson?.videoUrl ? (
              <iframe
                key={activeLesson._id}
                src={activeLesson.videoUrl.replace('watch?v=', 'embed/')}
                className="w-full h-full"
                allowFullScreen
                title={activeLesson.title}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center">
                  <FiPlay size={22} className="text-slate-600 translate-x-0.5" />
                </div>
                <p className="text-slate-600 text-sm">Select a lesson to begin</p>
              </div>
            )}
          </div>

          {/* Lesson controls bar */}
          {activeLesson && (
            <div className="shrink-0 border-t border-white/6 bg-[#080810] px-4 py-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

                {/* Title + status */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                      Lesson {currentIdx + 1}
                    </span>
                    {isCompleted && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/15 px-2 py-0.5 rounded-full">
                        <FiCheckCircle size={9} /> Completed
                      </span>
                    )}
                  </div>
                  <h2 className="text-sm font-bold text-white mt-0.5 truncate">{activeLesson.title}</h2>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={goPrevLesson}
                    disabled={!hasPrev}
                    className="px-3 py-2 rounded-xl bg-white/5 border border-white/8 text-xs font-bold text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    ← Prev
                  </button>

                  {!isCompleted ? (
                    <button
                      onClick={handleLessonComplete}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold hover:bg-emerald-500/15 transition-all"
                    >
                      <FiCheckCircle size={13} /> Mark Complete
                    </button>
                  ) : (
                    <button
                      onClick={goToNextLesson}
                      disabled={!hasNext}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-black text-xs font-black disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all"
                    >
                      Next Lesson <FiChevronRight size={13} />
                    </button>
                  )}

                  {isCompleted && hasNext === false && progress >= 100 && (
                    <a
                      href={`/api/certificates/download/${courseId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500/15 border border-amber-500/25 text-amber-400 text-xs font-bold hover:bg-amber-500/20 transition-all"
                    >
                      <FiAward size={13} /> Get Certificate
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>

        {/* ── Sidebar ── */}
        {sidebarOpen && (
          <aside className="w-72 xl:w-80 shrink-0 border-l border-white/6 bg-[#080810] flex flex-col overflow-hidden">

            {/* Progress summary */}
            <div className="px-4 pt-4 pb-3 border-b border-white/6 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-600">Your Progress</span>
                <span className="text-xs font-black text-orange-400">{progress}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-600">
                <span>{completedLessons.length} of {course.lessons?.length} lessons done</span>
                {progress >= 100 && <span className="text-emerald-400 font-bold flex items-center gap-1"><FiZap size={9} /> Complete!</span>}
              </div>

              {/* Quick action pills */}
              <div className="flex gap-2 pt-1">
                {course.zoomLink && (
                  <a href={course.zoomLink} target="_blank" rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/15 text-blue-400 text-[10px] font-bold hover:bg-blue-500/15 transition-all">
                    <FiVideo size={11} /> Join Zoom
                  </a>
                )}
                {course.whatsappSupport && (
                  <a href={`https://wa.me/${course.whatsappSupport}`} target="_blank" rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/15 text-emerald-400 text-[10px] font-bold hover:bg-emerald-500/15 transition-all">
                    <FiMessageCircle size={11} /> Support
                  </a>
                )}
                {progress >= 100 && (
                  <a href={`/api/certificates/download/${courseId}`} target="_blank" rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/15 text-amber-400 text-[10px] font-bold hover:bg-amber-500/15 transition-all">
                    <FiAward size={11} /> Certificate
                  </a>
                )}
              </div>
            </div>

            {/* Tab bar */}
            <div className="flex border-b border-white/6 shrink-0">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-bold transition-all ${
                    activeTab === tab.id
                      ? 'text-orange-400 border-b-2 border-orange-500'
                      : 'text-slate-600 hover:text-slate-300'
                  }`}
                >
                  <tab.icon size={12} /> {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto">

              {/* Lessons tab */}
              {activeTab === 'lessons' && (
                <div className="p-3 space-y-1">
                  {sortedLessons.map((lesson, i) => {
                    const done = completedLessons.includes(lesson._id)
                    const active = activeLesson?._id === lesson._id
                    return (
                      <button
                        key={lesson._id}
                        onClick={() => setActiveLesson(lesson)}
                        className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all group ${
                          active
                            ? 'bg-orange-500/10 border border-orange-500/20'
                            : 'hover:bg-white/4 border border-transparent'
                        }`}
                      >
                        {/* Status icon */}
                        <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                          done ? 'bg-emerald-500/20' : active ? 'bg-orange-500/20' : 'bg-white/5'
                        }`}>
                          {done
                            ? <FiCheckCircle size={11} className="text-emerald-400" />
                            : active
                              ? <FiPlay size={9} className="text-orange-400 translate-x-px" />
                              : <FiCircle size={11} className="text-slate-700" />
                          }
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className={`text-[12px] font-semibold leading-snug truncate ${
                            active ? 'text-orange-100' : done ? 'text-slate-400' : 'text-slate-300'
                          }`}>
                            {i + 1}. {lesson.title}
                          </p>
                          {lesson.duration > 0 && (
                            <span className="text-[10px] text-slate-600 flex items-center gap-1 mt-0.5">
                              <FiClock size={9} /> {lesson.duration}m
                            </span>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Notes tab */}
              {activeTab === 'notes' && (
                <div className="p-4 flex flex-col gap-3 h-full">
                  {activeLesson ? (
                    <>
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                          Notes for this lesson
                        </p>
                        <button
                          onClick={saveNote}
                          className={`flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all ${
                            noteSaved
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                              : 'bg-white/5 border border-white/8 text-slate-400 hover:text-white'
                          }`}
                        >
                          <FiSave size={10} /> {noteSaved ? 'Saved!' : 'Save'}
                        </button>
                      </div>
                      <textarea
                        ref={noteRef}
                        defaultValue={currentNote}
                        key={activeLesson._id}
                        placeholder="Write your notes here…"
                        className="flex-1 w-full bg-white/4 border border-white/8 rounded-xl p-3 text-xs text-slate-300 placeholder-slate-700 resize-none focus:outline-none focus:border-orange-500/40 leading-relaxed min-h-[200px]"
                      />
                      <p className="text-[9px] text-slate-700 text-center">Notes are saved locally on your device</p>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-32 gap-2">
                      <FiEdit3 size={20} className="text-slate-700" />
                      <p className="text-xs text-slate-600">Select a lesson to take notes</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}