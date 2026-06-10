import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDashboard } from '../../../redux/dashboardSlice.js'
import ProgressBar from '../ProgressBar.jsx'
import { FiPlay, FiLock, FiRefreshCw, FiSearch, FiBookOpen, FiArrowLeft, FiChevronRight, FiChevronLeft } from 'react-icons/fi'
import Loading from '../../../component/Loading.jsx'

export default function PurchasedCoursesPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { purchases, loading } = useSelector(s => s.dashboard)

  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')
  
  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5 // Adjust this number as needed

  useEffect(() => { 
    dispatch(fetchDashboard()) 
  }, [dispatch])

  // Reset pagination to page 1 whenever search terms or filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, filter])

  const filteredCourses = purchases.filter(p => {
    const matchesSearch = p.course?.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filter === 'all' ? true : (filter === 'active' ? !p.isExpired : p.isExpired)
    return matchesSearch && matchesFilter
  })

  // --- Pagination Calculations ---
  const totalItems = filteredCourses.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentCourses = filteredCourses.slice(indexOfFirstItem, indexOfLastItem)

  const counts = {
    all: purchases.length,
    active: purchases.filter(p => !p.isExpired).length,
    expired: purchases.filter(p => p.isExpired).length,
  }

  if (loading) return <Loading />

  return (
    <div className="min-h-screen bg-[#050508] py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-slate-500 hover:text-slate-200 text-sm font-medium mb-6 transition-colors"
        >
          <FiArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
          Back
        </button>

        {/* Header */}
        <div className="mb-6">
          <p className="text-amber-500 text-xs font-bold uppercase tracking-widest mb-2">Your Learning</p>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tighter leading-none">My Library</h1>
          <p className="text-slate-500 mt-3 text-sm">
            {counts.active} active course{counts.active !== 1 ? 's' : ''} · {counts.expired} expired
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
            <input
              type="text"
              placeholder="Search your courses…"
              className="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-amber-500/40 focus:outline-none focus:bg-white/[0.06] transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter tabs */}
          <div className="flex bg-white/[0.04] p-1 rounded-xl border border-white/[0.06] gap-0.5">
            {['all', 'active', 'expired'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`relative px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all flex items-center gap-1.5 ${
                  filter === f
                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {f}
                <span className={`text-[10px] font-black ${filter === f ? 'text-black/60' : 'text-slate-600'}`}>
                  {counts[f]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Course List */}
        {totalItems === 0 ? (
          <EmptyState searchTerm={searchTerm} />
        ) : (
          <div className="flex flex-col gap-4">
            {currentCourses.map((purchase) => (
              <CourseCard key={purchase._id} purchase={purchase} />
            ))}
          </div>
        )}

        {/* --- Pagination UI Controls --- */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-white/[0.06] mt-8 pt-6">
            <p className="text-xs text-slate-500 font-medium">
              Showing <span className="text-slate-300 font-bold">{indexOfFirstItem + 1}</span> to{' '}
              <span className="text-slate-300 font-bold">{Math.min(indexOfLastItem, totalItems)}</span> of{' '}
              <span className="text-slate-300 font-bold">{totalItems}</span> courses
            </p>
            
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-slate-400 hover:text-white hover:bg-white/[0.05] disabled:opacity-30 disabled:pointer-events-none transition-all"
              >
                <FiChevronLeft size={16} />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                      currentPage === page
                        ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/10'
                        : 'bg-white/[0.02] border border-white/[0.06] text-slate-400 hover:text-white hover:bg-white/[0.05]'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-slate-400 hover:text-white hover:bg-white/[0.05] disabled:opacity-30 disabled:pointer-events-none transition-all"
              >
                <FiChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

function CourseCard({ purchase }) {
  const { isExpired, course, progress, completedLessons } = purchase
  const pct = progress || 0
  const completed = completedLessons?.length || 0
  const total = course?.lessons?.length || 0

  return (
    <div className={`group relative flex overflow-hidden rounded-2xl border transition-all duration-300 ${
      isExpired
        ? 'bg-[#0d0d12] border-white/[0.05] opacity-60 hover:opacity-80'
        : 'bg-[#0d0d12] border-white/[0.06] hover:border-amber-500/25 hover:bg-[#0f0f14]'
    }`}>

      {/* Left progress accent strip */}
      <div className="w-1 flex-shrink-0 self-stretch relative overflow-hidden bg-white/5">
        <div
          className={`absolute bottom-0 left-0 w-full transition-all duration-700 rounded-tr-full ${
            isExpired ? 'bg-slate-600' : 'bg-amber-500'
          }`}
          style={{ height: `${pct}%` }}
        />
        {!isExpired && pct > 0 && (
          <div
            className="absolute left-0 w-full h-8 bg-amber-400/30 blur-sm"
            style={{ bottom: `${pct}%`, transform: 'translateY(50%)' }}
          />
        )}
      </div>

      {/* Thumbnail */}
      <div className="relative flex-shrink-0 hidden sm:block">
        <img
          src={course?.thumbnail}
          alt={course?.title}
          className="w-44 h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0d0d12]/80" />
        {isExpired && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-2.5">
              <FiLock className="text-red-400" size={18} />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-5 flex flex-col justify-between min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className={`font-bold text-base leading-snug truncate transition-colors ${
              isExpired ? 'text-slate-400' : 'text-white group-hover:text-amber-400'
            }`}>
              {course?.title}
            </h3>
            <p className="text-slate-600 text-xs mt-1 font-mono">
              {completed}/{total} lessons
            </p>
          </div>
          <StatusBadge isExpired={isExpired} />
        </div>

        {/* Progress row */}
        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="flex-1 max-w-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">Progress</span>
              <span className={`text-[10px] font-black ${isExpired ? 'text-slate-600' : 'text-amber-500'}`}>
                {Math.round(pct)}%
              </span>
            </div>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${isExpired ? 'bg-slate-700' : 'bg-amber-500'}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          <ActionButton isExpired={isExpired} courseId={course?._id} pct={pct} />
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ isExpired }) {
  return (
    <span className={`flex-shrink-0 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg ${
      isExpired
        ? 'bg-red-500/10 text-red-400 border border-red-500/10'
        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10'
    }`}>
      {isExpired ? 'Expired' : 'Active'}
    </span>
  )
}

function ActionButton({ isExpired, courseId, pct }) {
  if (isExpired) {
    return (
      <Link
        to={`/courses/${courseId}`}
        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-white/10 text-[11px] font-bold text-slate-400 hover:text-white hover:border-white/20 transition-all"
      >
        <FiRefreshCw size={11} /> Renew
      </Link>
    )
  }

  if (pct === 0) {
    return (
      <Link
        to={`/learn/${courseId}`}
        className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-[11px] font-black rounded-xl transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30"
      >
        <FiPlay size={11} /> Start
      </Link>
    )
  }

  if (pct >= 100) {
    return (
      <Link
        to={`/learn/${courseId}`}
        className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-[11px] font-black rounded-xl border border-emerald-500/20 transition-all"
      >
        Review <FiChevronRight size={11} />
      </Link>
    )
  }

  return (
    <Link
      to={`/learn/${courseId}`}
      className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-[11px] font-black rounded-xl transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30"
    >
      <FiPlay size={11} /> Continue
    </Link>
  )
}

function EmptyState({ searchTerm }) {
  return (
    <div className="text-center py-24 border border-dashed border-white/[0.06] rounded-2xl">
      <div className="w-14 h-14 bg-white/[0.03] border border-white/[0.06] rounded-2xl flex items-center justify-center mx-auto mb-4">
        <FiBookOpen size={22} className="text-slate-600" />
      </div>
      <p className="text-slate-300 font-bold text-base">
        {searchTerm ? `No results for "${searchTerm}"` : 'No courses here'}
      </p>
      <p className="text-slate-600 text-sm mt-1">
        {searchTerm ? 'Try a different search term.' : 'Browse the catalogue to get started.'}
      </p>
    </div>
  )
}