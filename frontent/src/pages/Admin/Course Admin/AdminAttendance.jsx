import { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchAttendanceSessions,
  createAttendanceSession,
  toggleAttendanceSession,
} from '../../../redux/adminSlice.js'
import { fetchAdminCourses } from '../../../redux/courseSlice.js'

import toast from 'react-hot-toast'
import { HiOutlinePlus, HiOutlineChevronDown, HiOutlineChevronUp, HiSearch, HiSortAscending } from 'react-icons/hi'
import { FiCalendar, FiUsers, FiToggleLeft, FiToggleRight, FiHash, FiPrinter, FiChevronLeft, FiChevronRight, FiFilter } from 'react-icons/fi'
import Loading from '../../../component/Loading.jsx'

export default function AdminAttendance() {
  const dispatch = useDispatch()
  
  // Pulling state layers from Redux
  const { sessions, loading: adminLoading } = useSelector(s => s.admin)
  const { adminCourses, loading: coursesLoading } = useSelector(s => s.courses)
  
  // UI States
  const [showForm, setShowForm] = useState(false)
  const [expandedSession, setExpandedSession] = useState(null)
  const [form, setForm] = useState({ courseId: '', title: '', date: '', zoomLink: '' })
  const [submitting, setSubmitting] = useState(false)

  // Search, Filter, Pagination States
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDate, setFilterDate] = useState('')
  const [sortOrder, setSortOrder] = useState('latest') 
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Local safety flag to ensure we have done at least one successful fetch cycle
  const [firstLoadComplete, setFirstLoadComplete] = useState(false)

  useEffect(() => {
    // Run async dispatches together and flip the completion flag when they resolve
    Promise.all([
      dispatch(fetchAttendanceSessions()),
      dispatch(fetchAdminCourses())
    ]).finally(() => {
      setFirstLoadComplete(true)
    })
  }, [dispatch])

  // Strict loading evaluation logic
  const isInitialPlugging = adminLoading || coursesLoading || !firstLoadComplete

  // Reset pagination safely if base dataset changes size
  useEffect(() => {
    setCurrentPage(1)
  }, [sessions?.length])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!form.courseId || !form.title || !form.date) return toast.error('Course, title and date are required')
    setSubmitting(true)
    try {
      await dispatch(createAttendanceSession(form)).unwrap()
      toast.success('Session created!')
      setForm({ courseId: '', title: '', date: '', zoomLink: '' })
      setShowForm(false)
    } catch (err) {
      toast.error(err || 'Failed to create session')
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggle = async (id) => {
    try {
      await dispatch(toggleAttendanceSession(id)).unwrap()
      toast.success('Session status updated')
    } catch (err) {
      toast.error(err || 'Failed to toggle session')
    }
  }

  // Combined Search, Filter, and Sort Engine
  const filteredAndSortedSessions = useMemo(() => {
    let result = sessions ? [...sessions] : []

    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase()
      result = result.filter(s => 
        s.title.toLowerCase().includes(term) || 
        s.course?.title?.toLowerCase().includes(term)
      )
    }

    if (filterDate) {
      result = result.filter(s => s.date.startsWith(filterDate))
    }

    result.sort((a, b) => {
      if (sortOrder === 'latest') return new Date(b.date) - new Date(a.date)
      if (sortOrder === 'oldest') return new Date(a.date) - new Date(b.date)
      if (sortOrder === 'az') return a.title.localeCompare(b.title)
      if (sortOrder === 'za') return b.title.localeCompare(a.title)
      return 0
    })

    return result
  }, [sessions, searchTerm, filterDate, sortOrder])

  // Pagination Compute
  const paginatedSessions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredAndSortedSessions.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredAndSortedSessions, currentPage])

  const totalPages = Math.ceil(filteredAndSortedSessions.length / itemsPerPage) || 1

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  const handleDateChange = (e) => {
    setFilterDate(e.target.value)
    setCurrentPage(1)
  }

  const handleSortChange = (e) => {
    setSortOrder(e.target.value)
    setCurrentPage(1)
  }

  const handlePrintSession = (session) => {
    const sessionDate = new Date(session.date).toLocaleString('en-IN', { 
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
    })

    const rowsHtml = session.attendees && session.attendees.length > 0
      ? session.attendees.map((a, idx) => `
          <tr>
            <td>${idx + 1}</td>
            <td><strong>${a.user?.name || 'Unknown'}</strong></td>
            <td>${a.user?.email || 'N/A'}</td>
            <td style="color: #059669; font-weight: bold;">Present</td>
          </tr>
        `).join('')
      : `<tr><td colspan="4" style="text-align:center; color:#64748b;">No attendees recorded.</td></tr>`

    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <html>
        <head>
          <title>Attendance Report - ${session.title}</title>
          <style>
            @page { size: A4 portrait; margin: 15mm; }
            body { 
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; 
              color: #1e293b; 
              background-color: #F2EDED; 
              padding: 0; 
              margin: 0; 
              font-size: 12px; 
              -webkit-print-color-adjust: exact; 
              print-color-adjust: exact;
            }
            .brand-header { text-align: center; font-size: 14px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
            .header { border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 16px; }
            .title { font-size: 18px; margin: 0 0 6px 0; color: #0f172a; font-weight: 700; }
            .meta-info { color: #475569; font-size: 11.5px; margin: 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 5px; background: #ffffff; }
            th { background: #e2e8f0; color: #1e293b; padding: 7px 10px; border: 1px solid #cbd5e1; text-align: left; font-weight: 600; }
            td { padding: 7px 10px; border: 1px solid #e2e8f0; color: #334155; }
            tr:nth-child(even) { background: #f3f4f6; }
          </style>
        </head>
        <body>
          <div class="brand-header">Easyway Pro Attendance</div>
          <div class="header">
            <h1 class="title">${session.title}</h1>
            <p class="meta-info">
              <strong>Course:</strong> ${session?.course?.title || 'N/A'} &nbsp;|&nbsp; 
              <strong>Date:</strong> ${sessionDate} &nbsp;|&nbsp; 
              <strong>Code:</strong> ${session.pollCode || 'N/A'}
            </p>
          </div>
          <table>
            <thead>
              <tr>
                <th style="width: 8%">#</th>
                <th style="width: 42%">Name</th>
                <th style="width: 35%">Email</th>
                <th style="width: 15%">Status</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
          <script>
            window.onload = function() { 
              window.print(); 
              setTimeout(function() { window.close(); }, 100); 
            };
          </script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  return (
    <div className="space-y-3.5 p-3 md:p-4 max-w-7xl mx-auto text-slate-100 antialiased selection:bg-blue-500/30 bg-black border border-gray-950 rounded-2xl">
      
      {/* Premium Header Panel */}
      <div className="flex items-center justify-between flex-wrap gap-3 bg-gradient-to-r from-black via-gray-950 to-black p-3 rounded-xl border border-slate-800/80 shadow-xl">
        <div>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">Live Session Vault</h1>
          <p className="text-slate-400 text-[11px] mt-0.5">Track user participation metrics matrix</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-900/20 active:scale-95 transition-all text-white"
        >
          <HiOutlinePlus className="w-4 h-4 transition-transform group-hover:rotate-90" /> New Session
        </button>
      </div>

      {/* Interactive Control & Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-gradient-to-r from-black via-gray-950 to-black p-2 rounded-xl border border-slate-800/60 backdrop-blur-md">
        {/* Search */}
        <div className="relative flex items-center">
          <HiSearch className="absolute left-2.5 text-slate-500 w-4 h-4" />
          <input 
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by keyword..."
            className="w-full bg-slate-950/60 border border-slate-800 focus:border-blue-500/80 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-white focus:outline-none transition-all placeholder:text-slate-600"
          />
        </div>
        
        {/* Date Filter */}
        <div className="relative flex items-center">
          <FiFilter className="absolute left-2.5 text-slate-500 w-3.5 h-3.5" />
          <input 
            type="date"
            value={filterDate}
            onChange={handleDateChange}
            className="w-full bg-slate-950/60 border border-slate-800 focus:border-blue-500/80 rounded-lg pl-8 pr-2 py-1.5 text-xs text-white focus:outline-none transition-all scheme-dark"
          />
        </div>

        {/* Sorting Dropdown */}
        <div className="relative flex items-center">
          <HiSortAscending className="absolute left-2.5 text-slate-500 w-4 h-4" />
          <select 
            value={sortOrder}
            onChange={handleSortChange}
            className="w-full bg-slate-950/60 border border-slate-800 focus:border-blue-500/80 rounded-lg pl-8 pr-2 py-1.5 text-xs text-white focus:outline-none transition-all appearance-none cursor-pointer"
          >
            <option value="latest">Timeline: Newest First</option>
            <option value="oldest">Timeline: Oldest First</option>
            <option value="az">Alphabetical: A → Z</option>
            <option value="za">Alphabetical: Z → A</option>
          </select>
        </div>
      </div>

      {/* Create Form Section */}
      {showForm && (
        <div className="bg-gradient-to-r from-black via-gray-950 to-black border border-slate-800 rounded-xl p-3.5 shadow-2xl animate-fade-up">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5">Initialize Session Context</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Course Target *</label>
              <select 
                value={form.courseId} 
                onChange={e => setForm(f => ({...f, courseId: e.target.value}))} 
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500" 
                required
              >
                <option value="">Choose course mapping</option>
                {adminCourses?.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
              </select>
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Session Descriptor *</label>
              <input 
                value={form.title} 
                onChange={e => setForm(f => ({...f, title: e.target.value}))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500" 
                placeholder="e.g. Lab Session 4" 
                required 
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Schedule Anchor *</label>
              <input 
                type="datetime-local" 
                value={form.date} 
                onChange={e => setForm(f => ({...f, date: e.target.value}))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 scheme-dark" 
                required 
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Zoom Routing Stream</label>
              <input 
                value={form.zoomLink} 
                onChange={e => setForm(f => ({...f, zoomLink: e.target.value}))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500" 
                placeholder="https://zoom.us/j/..." 
              />
            </div>
            
            <div className="md:col-span-2 flex gap-2 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-3 py-1.5 rounded-lg border border-slate-800 text-xs text-slate-400 hover:bg-slate-800 transition-all">Cancel</button>
              <button type="submit" disabled={submitting} className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium rounded-lg px-3 py-1.5 text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg">
                {submitting ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Deploy Session'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Stream Deck */}
      <div className="space-y-2">
        {isInitialPlugging ? (
          /* 1. Show the inline loader while initial background operations finish */
          <div className="">
            <Loading />
          </div>
        ) : paginatedSessions.length === 0 ? (
          /* 2. Show the empty state if the dataset loaded but returned no entries */
          <div className="text-center py-10 bg-black border border-slate-800/60 rounded-xl">
            <FiCalendar size={24} className="text-slate-600 mx-auto mb-2" />
            <p className="text-slate-500 text-xs">No entries match your standard parameters.</p>
          </div>
        ) : (
          /* 3. Render the active data list seamlessly */
          paginatedSessions.map(session => (
            <div 
              key={session._id} 
              className={`bg-gradient-to-r from-black via-gray-950 to-black border rounded-xl overflow-hidden transition-all duration-200 ${
                session.isActive ? 'border-green-500/30 shadow-md shadow-green-500/5' : 'border-slate-800/70'
              }`}
            >
              {/* Row Context Wrapper */}
              <div className="p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-8.5 h-8.5 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    session.isActive ? 'bg-green-500/10 shadow-inner' : 'bg-slate-800/60'
                  }`}>
                    <FiCalendar size={14} className={session.isActive ? 'text-green-400' : 'text-slate-400'} />
                  </div>
                  
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="font-semibold text-slate-100 text-sm truncate max-w-[200px] sm:max-w-xs">{session.title}</p>
                      {session.isActive && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-green-500/10 border border-green-500/20 text-green-400 font-black tracking-wider animate-pulse">
                          LIVE
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                      {session.course?.title} <span className="text-slate-700">|</span> {new Date(session.date).toLocaleString('en-IN', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })}
                    </p>
                  </div>
                </div>

                {/* Right Action Terminal Layout */}
                <div className="flex items-center justify-between sm:justify-end gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800/60">
                  <div className="flex items-center gap-1 bg-slate-950 border border-slate-800/80 rounded-md px-1.5 py-0.5">
                    <FiHash size={10} className="text-amber-400" />
                    <span className="font-mono text-[11px] text-amber-300 font-bold tracking-wider">{session.pollCode}</span>
                  </div>

                  <div className="flex items-center gap-0.5">
                    {/* Native Layout Capture Trigger */}
                    <button 
                      onClick={() => handlePrintSession(session)}
                      className="p-1.5 rounded-md text-slate-400 hover:text-blue-400 hover:bg-slate-800/80 active:scale-90 transition-all"
                      title="Generate Document Printout"
                    >
                      <FiPrinter size={14} />
                    </button>

                    {/* Expand/Collapse Accordion Trigger */}
                    <button 
                      onClick={() => setExpandedSession(expandedSession === session._id ? null : session._id)}
                      className="flex items-center gap-1 px-2 py-1.5 rounded-md text-slate-300 hover:text-white hover:bg-slate-800/80 text-xs transition-all"
                    >
                      <FiUsers size={12} className="text-slate-400" /> 
                      <span className="font-bold text-[11px]">{session.attendees?.length || 0}</span>
                      {expandedSession === session._id ? <HiOutlineChevronUp className="w-3.5 h-3.5" /> : <HiOutlineChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {/* Functional Status Selector */}
                    <button 
                      onClick={() => handleToggle(session._id)}
                      className={`p-1.5 rounded-md transition-colors active:scale-95 ${
                        session.isActive ? 'text-green-400 hover:bg-green-500/10' : 'text-slate-600 hover:bg-slate-800'
                      }`}
                    >
                      {session.isActive ? <FiToggleRight size={18} /> : <FiToggleLeft size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Collapsible Attendee Layout View */}
              {expandedSession === session._id && (
                <div className="border-t border-slate-900 bg-slate-950/40 p-2.5">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Authenticated Entries</p>
                  
                  {(!session.attendees || session.attendees.length === 0) ? (
                    <p className="text-slate-600 text-[11px] italic pl-1 py-1">No user sync events registered yet.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1.5">
                      {session.attendees.map(a => (
                        <div key={a.user?._id} className="flex items-center gap-2 p-1.5 rounded border border-slate-800/40 bg-slate-900/40 hover:bg-slate-900/90 transition-colors min-w-0">
                          <div className="w-4.5 h-4.5 rounded bg-blue-500/10 flex items-center justify-center text-blue-400 text-[9px] font-black flex-shrink-0">
                            {a.user?.name?.[0]?.toUpperCase() || '?'}
                          </div>
                          <div className="min-w-0 leading-tight">
                            <p className="text-[11px] font-semibold text-slate-300 truncate">{a.user?.name || 'User'}</p>
                            <p className="text-[9px] text-slate-500 truncate mt-0.5">{a.user?.email || 'N/A'}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination Dashboard Terminal */}
      {!isInitialPlugging && totalPages > 1 && (
        <div className="flex items-center justify-between p-2 bg-black border border-slate-800/80 rounded-xl mt-2 text-xs">
          <p className="text-slate-400 text-[11px]">
            Showing <span className="font-bold text-white">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="font-bold text-white">{Math.min(currentPage * itemsPerPage, filteredAndSortedSessions.length)}</span> of {filteredAndSortedSessions.length} sessions
          </p>
          <div className="flex items-center gap-1">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              <FiChevronLeft size={14} />
            </button>
            <span className="px-2.5 text-[11px] font-bold text-slate-300">Page {currentPage} of {totalPages}</span>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              <FiChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}