import { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchAdminCourses, deleteCourse } from '../../../redux/courseSlice.js'
import toast from 'react-hot-toast'
import { 
  HiOutlinePlus, 
  HiOutlinePencil, 
  HiOutlineTrash, 
  HiOutlineSearch, 
  HiOutlineEye, 
  HiOutlineEyeOff,
  HiChevronLeft,
  HiChevronRight
} from 'react-icons/hi' //  Cleaned subfolder entry path
import { FiBookOpen, FiDollarSign, FiUsers, FiLayers, FiAlertCircle } from 'react-icons/fi'
import Loading from '../../../component/Loading.jsx'

export default function AdminCourses() {
  const dispatch = useDispatch()
  const { adminCourses, loading } = useSelector(s => s.courses)
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState(null)
  const [firstLoadComplete, setFirstLoadComplete] = useState(false)

  // Pagination Configuration Metrics
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  useEffect(() => {
    dispatch(fetchAdminCourses())
      .unwrap()
      .catch(() => {})
      .finally(() => {
        setFirstLoadComplete(true)
      })
  }, [dispatch])

  // Prevent loading state component collision errors
  const isInitialPlugging = loading && !firstLoadComplete

  const handleDelete = async (id) => {
    if (!confirm('Are you absolutely sure you want to delete this course? This step cannot be undone.')) return
    setDeleting(id)
    try {
      await dispatch(deleteCourse(id)).unwrap()
      toast.success('Course repository dropped successfully')
    } catch (err) {
      toast.error(err || 'Failed to dispatch deletion task')
    } finally {
      setDeleting(null)
    }
  }

  // 1. Search Query Filters Execution
  const filtered = useMemo(() => {
    const rawCourses = adminCourses || []
    if (!search.trim()) return rawCourses

    const targetTerm = search.toLowerCase()
    return rawCourses.filter(c =>
      c.title?.toLowerCase().includes(targetTerm) ||
      c.category?.toLowerCase().includes(targetTerm)
    )
  }, [adminCourses, search])

  // Automatically reset backward boundaries on search filter input mutations
  useEffect(() => {
    setCurrentPage(1)
  }, [search])

  // 2. Pagination Math Bounds Calculations
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1

  const paginatedCourses = useMemo(() => {
    const offsetStart = (currentPage - 1) * itemsPerPage
    return filtered.slice(offsetStart, offsetStart + itemsPerPage)
  }, [filtered, currentPage])

  if (isInitialPlugging) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loading />
      </div>
    )
  }

  return (
    <div className="space-y-5 p-2 md:p-4 max-w-7xl mx-auto text-slate-100 antialiased selection:bg-blue-500/30">
      
      {/* Header Summary Dashboard Board */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-black via-gray-950 to-black p-4 rounded-xl border border-slate-800/80 shadow-xl">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Course Management
          </h1>
          <p className="text-slate-400 text-xs mt-0.5">
            Modify course directories, pricing structures, draft models, and syllabi
          </p>
        </div>
        
        <Link 
          to="/admin/courses/new" 
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold text-xs md:text-sm px-4 py-2.5 rounded-lg shadow-lg shadow-blue-500/15 active:scale-95 transition-all self-start sm:self-auto"
        >
          <HiOutlinePlus className="w-4 h-4 stroke-[2.5]" />
          <span>New Course</span>
        </Link>
      </div>

      {/* High-Fidelity Glass Search Frame */}
      <div className="relative flex items-center bg-gradient-to-r from-black via-gray-950 to-black p-2 rounded-xl border border-slate-800/60 backdrop-blur-md">
        <HiOutlineSearch className="absolute left-5 text-slate-500 w-4 h-4" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by directory titles, tech category fields, or index metrics..."
          className="w-full bg-slate-950/60 border border-slate-800 focus:border-blue-500/80 rounded-lg pl-10 pr-4 py-2 text-xs md:text-sm text-white focus:outline-none transition-all placeholder:text-slate-600 shadow-inner"
        />
      </div>

      {/* Central Content Panel Canvas */}
      <div className="bg-gradient-to-b from-gray-950 to-slate-950 border border-slate-800/70 rounded-xl overflow-hidden shadow-2xl">
        
        {/* Responsive Layout View 1: Mobile-First Adaptive Cards */}
        <div className="block md:hidden divide-y divide-slate-800/50">
          {paginatedCourses.map(course => {
            const isDeletingThis = deleting === course._id
            return (
              <div key={course._id} className="p-4 space-y-3 hover:bg-slate-900/30 transition-colors">
                <div className="flex gap-3">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-16 h-11 rounded-lg object-cover bg-slate-950 border border-slate-800 flex-shrink-0" 
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-white truncate">{course.title}</p>
                    <span className="inline-flex items-center gap-1 mt-1 text-[10px] bg-slate-950 border border-slate-800 text-slate-400 px-2 py-0.5 rounded-md font-medium">
                      <FiLayers className="w-2.5 h-2.5" />
                      {course.category || 'Uncategorized'}
                    </span>
                  </div>
                </div>

                {/* Micro Metrics Panel */}
                <div className="grid grid-cols-3 gap-2 bg-slate-950/40 border border-slate-900 rounded-lg p-2 text-center text-[11px]">
                  <div>
                    <span className="block text-[9px] uppercase font-bold text-slate-600 tracking-wider">Price</span>
                    <span className="font-bold text-slate-300">₹{course.price?.toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase font-bold text-slate-600 tracking-wider">Students</span>
                    <span className="font-semibold text-slate-300">{course.studentsCount || 0}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <span className="block text-[9px] uppercase font-bold text-slate-600 tracking-wider mb-0.5">Status</span>
                    <span className={`inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded font-medium ${
                      course.isPublished ? 'bg-green-500/10 text-green-400' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {course.isPublished ? 'Live' : 'Draft'}
                    </span>
                  </div>
                </div>

                {/* Operations Layer */}
                <div className="flex justify-between items-center pt-1">
                  {course.discountPrice ? (
                    <span className="text-[10px] text-orange-400 font-medium">
                      Offer: ₹{course.discountPrice?.toLocaleString('en-IN')}
                    </span>
                  ) : (
                    <span className="text-[9px] text-slate-600 font-mono">ID: {course._id?.slice(-6)}</span>
                  )}

                  <div className="flex items-center gap-2">
                    <Link 
                      to={`/admin/courses/edit/${course._id}`}
                      className="p-2 rounded-lg bg-slate-950 hover:bg-blue-500/15 border border-slate-800/80 text-slate-400 hover:text-blue-400 transition-colors"
                    >
                      <HiOutlinePencil className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(course._id)}
                      disabled={isDeletingThis}
                      className="p-2 rounded-lg bg-slate-950 hover:bg-red-500/15 border border-slate-800/80 text-slate-400 hover:text-red-400 transition-colors"
                    >
                      {isDeletingThis ? (
                        <div className="w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <HiOutlineTrash className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Responsive Layout View 2: High-Density Desktop Grid Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-800/80  bg-gradient-to-r from-black via-gray-950 to-black">
                {[
                  { label: 'Course Directory', icon: <FiBookOpen className="w-3 h-3" /> },
                  { label: 'Valuation & Offers', icon: <FiDollarSign className="w-3 h-3" /> },
                  { label: 'Enrolled Base', icon: <FiUsers className="w-3 h-3" /> },
                  { label: 'Visibility Matrix', icon: <FiLayers className="w-3 h-3" /> },
                  { label: 'Actions', icon: null, alignRight: true }
                ].map((thItem, idx) => (
                  <th 
                    key={idx} 
                    className={`p-4 text-xs font-bold text-slate-400 uppercase tracking-wider ${thItem.alignRight ? 'text-right' : ''}`}
                  >
                    <div className={`flex items-center gap-1.5 ${thItem.alignRight ? 'justify-end' : ''}`}>
                      {thItem.icon}
                      <span>{thItem.label}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {paginatedCourses.map(course => {
                const isDeletingThis = deleting === course._id
                return (
                  <tr key={course._id} className=" bg-gradient-to-r from-black via-gray-950 to-black hover:bg-slate-900 transition-colors duration-150">
                    {/* Course Card Meta column */}
                    <td className="p-4">
                      <div className="flex items-center gap-3.5">
                        <img 
                          src={course.thumbnail} 
                          alt={course.title}
                          className="w-14 h-9 rounded-lg object-cover bg-slate-950 border border-slate-800/80 flex-shrink-0 shadow-md" 
                        />
                        <div className="leading-tight max-w-[240px]">
                          <p className="text-sm text-white font-semibold truncate" title={course.title}>
                            {course.title}
                          </p>
                          <p className="text-xs text-slate-500 truncate mt-0.5">
                            {course.category || 'Uncategorized Asset'}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Pricing Grid details */}
                    <td className="p-4">
                      <div className="leading-tight">
                        <p className="text-sm font-black text-slate-200">
                          ₹{course.price?.toLocaleString('en-IN')}
                        </p>
                        {course.discountPrice && (
                          <p className="text-[11px] font-medium text-orange-400 mt-0.5">
                            ₹{course.discountPrice?.toLocaleString('en-IN')} active offer
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Total User Metric Count column */}
                    <td className="p-4">
                      <span className="text-sm font-bold text-slate-300 bg-slate-950/80 border border-slate-800 px-2.5 py-1 rounded-md font-mono">
                        {course.studentsCount || 0}
                      </span>
                    </td>

                    {/* Publishing Visibility Token Status flags */}
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-md font-extrabold uppercase tracking-widest ${
                        course.isPublished
                          ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                          : 'bg-slate-800/80 border border-slate-700/40 text-slate-400'
                      }`}>
                        {course.isPublished ? (
                          <>
                            <HiOutlineEye className="w-3 h-3 stroke-[2.5]" />
                            <span>Published</span>
                          </>
                        ) : (
                          <>
                            <HiOutlineEyeOff className="w-3 h-3 stroke-[2.5]" />
                            <span>Draft</span>
                          </>
                        )}
                      </span>
                    </td>

                    {/* Action Engine triggers */}
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link 
                          to={`/admin/courses/edit/${course._id}`}
                          className="p-2 rounded-lg bg-slate-950/40 hover:bg-blue-500/15 border border-slate-800/40 text-slate-400 hover:text-blue-400 transition-colors" 
                          title="Edit Repository"
                        >
                          <HiOutlinePencil className="w-4 h-4" />
                        </Link>
                        
                        <button
                          onClick={() => handleDelete(course._id)}
                          disabled={isDeletingThis}
                          className="p-2 rounded-lg bg-slate-950/40 hover:bg-red-500/15 border border-slate-800/40 text-slate-400 hover:text-red-400 transition-colors" 
                          title="Drop Record"
                        >
                          {isDeletingThis ? (
                            <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <HiOutlineTrash className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Dynamic Fallback Context Layer */}
        {filtered.length === 0 && (
          <div className="text-center py-20 bg-gradient-to-r from-black via-gray-950 to-black border-t border-slate-800/40">
            <FiAlertCircle className="text-slate-700 w-10 h-10 mx-auto mb-3 stroke-[1.5]" />
            <p className="text-slate-400 text-sm font-medium">
              {search ? 'No matching course datasets resolved' : 'Course ledger repository is vacant'}
            </p>
            <p className="text-slate-600 text-xs mt-0.5">
              {search ? 'Modify your active filter parameters' : 'Kickstart deployment tracking arrays by building a course module above'}
            </p>
          </div>
        )}
      </div>

      {/* Dynamic Pagination Frame Controller Terminal Footer */}
      {filtered.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-black border border-slate-800/80 rounded-xl text-xs backdrop-blur-md">
          <p className="text-slate-400 text-[11px] text-center sm:text-left">
            Showing <span className="font-bold text-white">{((currentPage - 1) * itemsPerPage) + 1}</span> to{' '}
            <span className="font-bold text-white">
              {Math.min(currentPage * itemsPerPage, filtered.length)}
            </span>{' '}
            of {filtered.length} total active records
          </p>
          
          <div className="flex items-center gap-1.5">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-white disabled:opacity-20 disabled:pointer-events-none transition-all active:scale-95"
            >
              <HiChevronLeft size={16} />
            </button>
            
            <span className="px-3 py-1 bg-black border border-slate-800/80 rounded-md font-mono text-[11px] font-bold text-slate-300">
              Page {currentPage} / {totalPages}
            </span>
            
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-white disabled:opacity-20 disabled:pointer-events-none transition-all active:scale-95"
            >
              <HiChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}