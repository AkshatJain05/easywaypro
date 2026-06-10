import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom' // Added for back button
import { fetchCourses, fetchPublicCourses } from '../../redux/courseSlice.js'
import CourseCard from './CourseCard.jsx'
import { FiSearch, FiX, FiBookOpen, FiChevronLeft, FiChevronRight, FiArrowLeft } from 'react-icons/fi'
import Loading from '../../component/Loading.jsx'

const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced']
const CATEGORIES = ['All', 'Web Development', 'Data Science', 'AI/ML', 'Mobile Development', 'Design', 'Marketing']
const ITEMS_PER_PAGE = 8

export default function CoursesPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { courses, loading } = useSelector(s => s.courses)
  const { token } = useSelector(s => s.auth)
  
  const [search, setSearch] = useState('')
  const [level, setLevel] = useState('All')
  const [category, setCategory] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)

  const hasFilters = search || level !== 'All' || category !== 'All'
  const clearFilters = () => { setSearch(''); setLevel('All'); setCategory('All'); setCurrentPage(1) }

  useEffect(() => {
    const params = {}
    if (search) params.search = search
    if (level !== 'All') params.level = level
    if (category !== 'All') params.category = category
    const action = token ? fetchCourses : fetchPublicCourses
    dispatch(action(params))
    setCurrentPage(1) // Reset to first page on filter change
  }, [search, level, category, token, dispatch])

  // ── New: Scroll to top when page changes ──
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [currentPage]);

  // Pagination Logic
  const totalPages = Math.ceil(courses.length / ITEMS_PER_PAGE)
  const paginatedCourses = courses.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  return (
    <div className="min-h-screen bg-gradient-to-r from-black via-gray-950 to-black text-slate-200 font-sans px-4 sm:px-8 py-10">
      <div className="max-w-7.5xl md:px-7 mx-auto space-y-8">

        {/* ── Header with Back Button ── */}
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
            <FiArrowLeft size={20} />
          </button>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-500/70">Explore</p>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tighter">All Courses</h1>
          </div>
        </div>

        {/* ── Filters Section ── */}
        <div className="bg-[#0f0f11] p-5 rounded-2xl border border-white/5 space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
              <input
                className="w-full bg-[#030009] border border-white/10 focus:border-orange-500/50 outline-none text-sm pl-10 pr-4 py-3 rounded-xl transition-all"
                placeholder="Search by title or topic..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select value={category} onChange={e => setCategory(e.target.value)} className="bg-[#030009] border border-white/10 text-xs font-bold py-3 px-4 rounded-xl outline-none cursor-pointer">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {LEVELS.map(l => (
              <button key={l} onClick={() => setLevel(l)} className={`px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all ${level === l ? 'bg-orange-500 text-black' : 'bg-white/5 border border-white/5'}`}>
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* ── Grid ── */}
        {loading ? <Loading /> : courses.length === 0 ? (
          <div className="py-20 text-center text-slate-500">No results found.</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-4">
              {paginatedCourses.map(course => <CourseCard key={course._id} course={course} />)}
            </div>

            {/* ── Pagination Controls ── */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 py-8">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-2 rounded-lg bg-white/5 disabled:opacity-30 hover:bg-white/10"><FiChevronLeft /></button>
                <span className="text-xs font-bold text-slate-400">Page {currentPage} of {totalPages}</span>
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-2 rounded-lg bg-white/5 disabled:opacity-30 hover:bg-white/10"><FiChevronRight /></button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}