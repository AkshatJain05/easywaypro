import { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchRevenue } from '../../../redux/adminSlice.js'
import {
  HiOutlineCash, HiOutlineBookOpen, HiOutlineUsers,
  HiOutlineShoppingBag, HiOutlineLightningBolt, HiOutlineRefresh,
  HiChevronLeft, HiChevronRight
} from 'react-icons/hi'
import { FiTrendingUp, FiActivity, FiLayers } from 'react-icons/fi'
import Loading from '../../../component/Loading.jsx'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function AdminDashboard() {
  const dispatch = useDispatch()
  const { stats, revenuePerCourse, monthlyRevenue, loading } = useSelector(s => s.admin)
  const [firstLoadComplete, setFirstLoadComplete] = useState(false)

  // Local Pagination Settings for the Course Revenue metrics layout
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  useEffect(() => {
    dispatch(fetchRevenue())
      .unwrap()
      .catch(() => {})
      .finally(() => {
        setFirstLoadComplete(true)
      })
  }, [dispatch])

  // Safeguard flag tracking against quick visual page redraw flashes
  const isInitialPlugging = loading && !firstLoadComplete

  // 1. Math bounds for standard Bar Chart scaling computations
  const maxMonth = useMemo(() => {
    if (!monthlyRevenue || monthlyRevenue.length === 0) return 1
    return Math.max(...monthlyRevenue.map(m => m.total || 0), 1)
  }, [monthlyRevenue])

  // 2. Client Side Pagination Compute Engine
  const totalPages = useMemo(() => {
    const totalItems = revenuePerCourse?.length || 0
    return Math.ceil(totalItems / itemsPerPage) || 1
  }, [revenuePerCourse])

  const paginatedCourses = useMemo(() => {
    const rawCourses = revenuePerCourse || []
    const offsetStart = (currentPage - 1) * itemsPerPage
    return rawCourses.slice(offsetStart, offsetStart + itemsPerPage)
  }, [revenuePerCourse, currentPage])

  if (isInitialPlugging) {
    return (
      <div className="flex items-center justify-center min-h-[450px]">
        <Loading />
      </div>
    )
  }

  // Abstracted array of objects representing stat indicators
  const statMetrics = [
    { label: 'Total Revenue', value: `₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`, icon: HiOutlineCash, color: 'text-orange-400 border-orange-500/10', bg: 'bg-orange-500/10' },
    { label: 'Total Courses', value: stats?.totalCourses || 0, icon: HiOutlineBookOpen, color: 'text-blue-400 border-blue-500/10', bg: 'bg-blue-500/10' },
    { label: 'Total Students', value: stats?.totalStudents || 0, icon: HiOutlineUsers, color: 'text-emerald-400 border-emerald-500/10', bg: 'bg-emerald-500/10' },
    { label: 'Total Sales', value: stats?.totalPurchases || 0, icon: HiOutlineShoppingBag, color: 'text-purple-400 border-purple-500/10', bg: 'bg-purple-500/10' },
    { label: 'Active Access', value: stats?.activePurchases || 0, icon: HiOutlineLightningBolt, color: 'text-cyan-400 border-cyan-500/10', bg: 'bg-cyan-500/10' },
    { label: 'Expired Grants', value: stats?.expiredPurchases || 0, icon: HiOutlineRefresh, color: 'text-red-400 border-red-500/10', bg: 'bg-red-500/10' },
  ]

  return (
    <div className="space-y-6 p-2 md:p-4 max-w-7xl mx-auto text-slate-100 antialiased selection:bg-blue-500/30">
      
      {/* Premium Dynamic Title Panel Banner */}
      <div className="bg-gradient-to-r from-black via-gray-950 to-black p-4 rounded-xl border border-slate-800/80 shadow-xl">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
          Platform Performance Vault
        </h1>
        <p className="text-slate-400 text-xs mt-0.5">
          Real-time transactional logs, pipeline updates, and asset enrollment matrices
        </p>
      </div>

      {/* Grid Block Layout 1: Adaptive High-Density Statistics Summary Panels */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {statMetrics.map(({ label, value, icon: Icon, color, bg }) => (
          <div 
            key={label} 
            className={`bg-black border-slate-800 backdrop-blur-md rounded-xl p-4 border transition-all duration-200 hover:scale-[1.02] hover:bg-slate-900/90 shadow-md ${color}`}
          >
            <div className={`w-8.5 h-8.5 rounded-lg ${bg} flex items-center justify-center mb-3 border border-white/5`}>
              <Icon className="w-4.5 h-4.5" />
            </div>
            <div className="text-xl font-black tracking-tight text-white font-mono">{value}</div>
            <div className="text-[11px] font-medium text-slate-500 mt-1 uppercase tracking-wider">{label}</div>
          </div>
        ))}
      </div>

      {/* Grid Block Layout 2: Dual Core Charts & Analytical Metrics Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Sub-block A: Timeline Chart Visualization */}
        <div className="lg:col-span-7 bg-gradient-to-r from-black via-gray-950 to-black border border-slate-800/70 rounded-xl p-4 shadow-xl">
          <div className="flex items-center gap-2 mb-5 border-b border-slate-800/60 pb-3">
            <FiTrendingUp className="text-orange-400 w-4 h-4" />
            <h2 className="font-bold text-sm text-slate-200 uppercase tracking-wider">
              Monthly Revenue Distribution
            </h2>
          </div>

          {monthlyRevenue && monthlyRevenue.length > 0 ? (
            <div className="space-y-3.5">
              {monthlyRevenue.map((m, idx) => {
                const monthTotal = m.total || 0;
                const percentageWidth = Math.max((monthTotal / maxMonth) * 100, 6);
                
                return (
                  <div key={idx} className="flex items-center gap-3 group">
                    <span className="text-xs font-semibold text-slate-400 w-8 flex-shrink-0">
                      {MONTHS[(m._id?.month - 1)] || 'N/A'}
                    </span>
                    
                    <div className="flex-1 h-7 bg-slate-950 rounded-lg overflow-hidden border border-slate-900/80 shadow-inner relative flex items-center">
                      <div
                        className="h-full bg-gradient-to-r from-orange-600 via-orange-500 to-amber-400 rounded-md flex items-center justify-end pr-2 transition-all duration-500 group-hover:brightness-110"
                        style={{ width: `${percentageWidth}%` }}
                      >
                        {percentageWidth > 18 && (
                          <span className="text-[11px] text-white font-bold font-mono drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                            ₹{monthTotal.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                      
                      {/* Text fallback layout positioning if bar width scales down too narrow */}
                      {percentageWidth <= 18 && (
                        <span className="text-[11px] text-slate-300 font-bold font-mono ml-2">
                          ₹{monthTotal.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                    
                    <span className="text-[11px] font-mono font-medium text-slate-500 w-16 text-right bg-slate-950 border border-slate-900 px-1.5 py-0.5 rounded">
                      {m.count || 0} sales
                    </span>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FiActivity className="text-slate-700 w-8 h-8 mb-2" />
              <p className="text-slate-500 text-xs font-medium">No chronological revenue charts detected</p>
            </div>
          )}
        </div>

        {/* Sub-block B: Course Yield Ranking Module with Interactive Pagination */}
        <div className="lg:col-span-5 bg-gradient-to-r from-black via-gray-950 to-black border border-slate-800/70 rounded-xl p-4 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-5 border-b border-slate-800/60 pb-3">
              <FiLayers className="text-blue-400 w-4 h-4" />
              <h2 className="font-bold text-sm text-slate-200 uppercase tracking-wider">
                Revenue Segments by Course
              </h2>
            </div>

            {revenuePerCourse && revenuePerCourse.length > 0 ? (
              <div className="space-y-2.5">
                {paginatedCourses.map((c, idx) => {
                  // Calculate rank calculation identifier index matching absolute pagination depth
                  const absoluteRank = ((currentPage - 1) * itemsPerPage) + idx + 1;
                  
                  return (
                    <div 
                      key={idx} 
                      className="flex items-center gap-3 p-2 bg-slate-950/40 border border-slate-900 rounded-xl hover:bg-slate-900/40 transition-colors"
                    >
                      <div className="w-6 h-6 rounded-md bg-slate-950 border border-slate-800 flex items-center justify-center flex-shrink-0 shadow-inner">
                        <span className="text-[10px] text-slate-400 font-mono font-bold">{absoluteRank}</span>
                      </div>
                      
                      <div className="flex-1 min-w-0 leading-tight">
                        <p className="text-xs md:text-sm font-semibold text-slate-200 truncate" title={c.title}>
                          {c.title || 'Unknown Course Module'}
                        </p>
                        <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                          {c.count || 0} secure registrations
                        </p>
                      </div>
                      
                      <span className="text-xs md:text-sm font-black text-orange-400 flex-shrink-0 font-mono pl-1">
                        ₹{(c.total || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <HiOutlineBookOpen className="text-slate-700 w-8 h-8 mb-2" />
                <p className="text-slate-500 text-xs font-medium">No course asset matrix registers found</p>
              </div>
            )}
          </div>

          {/* Integrated Multi-Page Panel Controller Foot Deck */}
          {revenuePerCourse && revenuePerCourse.length > itemsPerPage && (
            <div className="flex items-center justify-between gap-2 pt-4 mt-4 border-t border-slate-900 text-[11px]">
              <span className="text-slate-500 font-medium">
                Page {currentPage} of {totalPages}
              </span>
              
              <div className="flex items-center gap-1">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="p-1 rounded-md bg-slate-950 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-20 disabled:pointer-events-none transition-all active:scale-90"
                >
                  <HiChevronLeft size={14} />
                </button>
                
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="p-1 rounded-md bg-slate-950 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-20 disabled:pointer-events-none transition-all active:scale-90"
                >
                  <HiChevronRight size={14} />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}