import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCourses, fetchPublicCourses } from '../../redux/courseSlice.js'
import CourseCard from './CourseCard.jsx'
import { FiSearch, FiX, FiBookOpen } from 'react-icons/fi'
import Loading from '../../component/Loading.jsx'

const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced']
const CATEGORIES = ['All', 'Web Development', 'Data Science', 'AI/ML', 'Mobile Development', 'Design', 'Marketing']

export default function CoursesPage() {
  const dispatch = useDispatch()
  const { courses, loading } = useSelector(s => s.courses)
  const { token } = useSelector(s => s.auth)
  const [search, setSearch] = useState('')
  const [level, setLevel] = useState('All')
  const [category, setCategory] = useState('All')

  const hasFilters = search || level !== 'All' || category !== 'All'
  const clearFilters = () => { setSearch(''); setLevel('All'); setCategory('All') }

  useEffect(() => {
    const params = {}
    if (search) params.search = search
    if (level !== 'All') params.level = level
    if (category !== 'All') params.category = category
    const action = token ? fetchCourses : fetchPublicCourses
    dispatch(action(params))
  }, [search, level, category, token])

  return (
    <div className="min-h-screen bg-[#030009] text-slate-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">

        {/* ── Header ── */}
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-500/70">Catalog</p>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tighter leading-none">
              All Courses
            </h1>
            {!loading && (
              <p className="text-sm text-slate-500 shrink-0">
                <span className="text-white font-bold">{courses.length}</span> courses
                {hasFilters && <span className="text-orange-500"> · filtered</span>}
              </p>
            )}
          </div>
        </div>

        {/* ── Filters ── */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={15} />
            <input
              className="w-full bg-white/5 border border-white/8 hover:border-white/12 focus:border-orange-500/50 focus:ring-0 focus:outline-none text-white placeholder-slate-600 text-sm pl-10 pr-10 py-2.5 rounded-xl transition-colors"
              placeholder="Search courses…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              >
                <FiX size={14} />
              </button>
            )}
          </div>

          {/* Level pills */}
          <div className="flex flex-wrap gap-2 overflow-x-auto scrollbar-none pb-0.5 sm:pb-0 shrink-0">
            {LEVELS.map(l => (
              <button
                key={l}
                onClick={() => setLevel(l)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  level === l
                    ? 'bg-orange-500 text-black'
                    : 'bg-white/5 border border-white/8 text-slate-400 hover:text-white hover:border-white/15'
                }`}
              >
                {l === 'All' ? 'All Levels' : l}
              </button>
            ))}
          </div>

          {/* Category select */}
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="bg-white/5 border border-white/8 hover:border-white/12 focus:border-orange-500/50 focus:outline-none text-slate-300 text-xs font-bold py-2.5 px-4 rounded-xl transition-colors cursor-pointer shrink-0 min-w-40"
          >
            {CATEGORIES.map(c => (
              <option key={c} value={c} className="bg-[#111]">{c === 'All' ? 'All Categories' : c}</option>
            ))}
          </select>
        </div>

        {/* Active filter tags */}
        {hasFilters && (
          <div className="flex items-center gap-2 flex-wrap -mt-3">
            {search && (
              <span className="flex items-center gap-1.5 text-[11px] font-medium bg-white/5 border border-white/8 text-slate-300 px-3 py-1 rounded-full">
                "{search}"
                <button onClick={() => setSearch('')} className="text-slate-500 hover:text-white transition-colors"><FiX size={11} /></button>
              </span>
            )}
            {level !== 'All' && (
              <span className="flex items-center gap-1.5 text-[11px] font-medium bg-white/5 border border-white/8 text-slate-300 px-3 py-1 rounded-full">
                {level}
                <button onClick={() => setLevel('All')} className="text-slate-500 hover:text-white transition-colors"><FiX size={11} /></button>
              </span>
            )}
            {category !== 'All' && (
              <span className="flex items-center gap-1.5 text-[11px] font-medium bg-white/5 border border-white/8 text-slate-300 px-3 py-1 rounded-full">
                {category}
                <button onClick={() => setCategory('All')} className="text-slate-500 hover:text-white transition-colors"><FiX size={11} /></button>
              </span>
            )}
            <button onClick={clearFilters} className="text-[11px] text-orange-500 hover:text-orange-400 font-bold transition-colors ml-1">
              Clear all
            </button>
          </div>
        )}

        {/* ── Grid / States ── */}
        {loading ? (
          <Loading />
        ) : courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/4 border border-white/8 flex items-center justify-center">
              <FiBookOpen size={24} className="text-slate-600" />
            </div>
            <div>
              <p className="text-white font-bold">No courses found</p>
              <p className="text-slate-500 text-sm mt-1">Try adjusting your filters or search term.</p>
            </div>
            <button
              onClick={clearFilters}
              className="px-5 py-2 rounded-xl bg-orange-500 text-black text-sm font-black hover:bg-orange-400 active:scale-95 transition-all"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map(course => <CourseCard key={course._id} course={course} />)}
          </div>
        )}

      </div>
    </div>
  )
}