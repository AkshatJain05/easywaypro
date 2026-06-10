import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDashboard } from '../../../redux/dashboardSlice.js'
import { FiChevronLeft, FiChevronRight, FiBook, FiCheckCircle, FiClock, FiAward, FiDownload, FiPlay, FiSearch } from 'react-icons/fi'
import Loading from "../../../component/Loading.jsx"

export default function DashboardPage() {
  const dispatch = useDispatch()
  const { purchases, loading } = useSelector(s => s.dashboard)
  const { user } = useSelector(s => s.auth)
  const navigate = useNavigate()

  // Search, Filter, and Pagination State
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all') 
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 4

  useEffect(() => { 
    dispatch(fetchDashboard()) 
  }, [dispatch])

  // Reset to page 1 whenever filters or search terms change
  useEffect(() => { 
    setCurrentPage(1) 
  }, [searchTerm, statusFilter])

  // Filtering Logic
  const filteredPurchases = purchases.filter(p => {
    const matchesSearch = p.course?.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' ? true : 
                          statusFilter === 'completed' ? p.isCompleted : !p.isCompleted && !p.isExpired
    return matchesSearch && matchesStatus
  })

  // --- Pagination Calculations ---
  const totalItems = filteredPurchases.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentActive = filteredPurchases.slice(indexOfFirstItem, indexOfLastItem)

  if (loading) return (
    <div>
     <Loading/>
    </div>
  )

  const stats = [
    { label: 'Enrolled', value: purchases.length, icon: FiBook, color: 'text-blue-400' },
    { label: 'Active', value: purchases.filter(p => !p.isExpired && !p.isCompleted).length, icon: FiClock, color: 'text-amber-400' },
    { label: 'Completed', value: purchases.filter(p => p.isCompleted).length, icon: FiCheckCircle, color: 'text-emerald-400' },
    { label: 'Certificates', value: purchases.filter(p => p.isCompleted).length, icon: FiAward, color: 'text-purple-400' },
  ]

  return (
    <div className="min-h-screen bg-[#030009] text-slate-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-5 space-y-10">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full transition-all border border-white/5 w-fit"
        >
          <FiChevronLeft size={14} /> Back
        </button>

        {/* Header with Search and Filter */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-5 pb-8 border-b border-white/8">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-amber-500/70 mb-2">Student Portal</p>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tighter leading-none">My Dashboard</h1>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <FiSearch className="absolute left-3 top-3 text-slate-500" size={14} />
              <input 
                placeholder="Search courses..." 
                className="bg-[#0c0c0e] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:border-amber-500/50 outline-none w-full sm:w-64"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              className="bg-[#0c0c0e] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-400 outline-none focus:border-amber-500/50"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="relative bg-[#0c0c0e] border border-white/6 rounded-2xl p-4 sm:p-5">
              <div className={`text-2xl sm:text-3xl font-black ${stat.color}`}>{stat.value}</div>
              <div className="flex items-center gap-1.5 mt-1.5">
                <stat.icon size={11} className="text-slate-600" />
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Course Cards Section */}
        <section className="space-y-5">
          <h2 className="text-lg sm:text-xl font-bold text-white">Your Courses</h2>
          {currentActive.length === 0 ? (
            <div className="rounded-2xl border border-white/6 bg-[#0c0c0e] p-12 text-center">
              <p className="text-slate-500 text-sm">No courses match your search or filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {currentActive.map(purchase => (
                <div key={purchase._id} className="group relative flex flex-col justify-between bg-[#0c0c0e] border border-white/6 rounded-2xl p-5 hover:border-white/10 transition-all duration-300">
                  <div>
                    <div className="flex gap-4 items-start">
                      <img src={purchase.course?.thumbnail} className="w-16 h-16 rounded-xl object-cover bg-white/5" alt={purchase.course?.title} />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm text-white line-clamp-2 group-hover:text-amber-400 transition-colors">{purchase.course?.title}</h3>
                        <button onClick={() => navigate(`/receipt/${purchase?._id}`)} className="mt-2 flex items-center gap-1.5 text-[10px] uppercase font-bold text-slate-500 hover:text-amber-400 transition-colors">
                          <FiDownload size={11} /> Receipt
                        </button>
                      </div>
                    </div>
                    <div className="mt-5">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[9px] uppercase font-bold tracking-wider text-slate-600">Progress</span>
                        <span className="text-[10px] font-black text-amber-500 font-mono">{Math.round(purchase.progress || 0)}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 transition-all duration-500" style={{ width: `${purchase.progress}%` }} />
                      </div>
                    </div>
                  </div>
                  <Link to={`/learn/${purchase.course?._id}`} className="mt-4 flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-amber-500 text-slate-300 hover:text-black text-sm font-bold rounded-xl transition-all shadow-lg shadow-transparent hover:shadow-amber-500/10">
                    <FiPlay size={13} /> Resume
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* --- Standardized Pagination Controls --- */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between border-t border-white/5 mt-8 pt-6 gap-4">
              <p className="text-xs text-slate-500 font-medium">
                Showing <span className="text-slate-300 font-bold">{indexOfFirstItem + 1}</span> to{' '}
                <span className="text-slate-300 font-bold">{Math.min(indexOfLastItem, totalItems)}</span> of{' '}
                <span className="text-slate-300 font-bold">{totalItems}</span> items
              </p>
              
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-20 disabled:pointer-events-none transition-all"
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
                          : 'bg-white/[0.02] border border-white/5 text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-20 disabled:pointer-events-none transition-all"
                >
                  <FiChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}