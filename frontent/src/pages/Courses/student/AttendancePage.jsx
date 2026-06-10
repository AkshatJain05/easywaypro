import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMyAttendance, markAttendance } from '../../../redux/dashboardSlice.js'
import toast from 'react-hot-toast'
import { FiCalendar, FiCheckCircle, FiXCircle, FiHash, FiClock, FiBookOpen, FiActivity, FiArrowLeft, FiAward, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import Loading from '../../../component/Loading.jsx'

export default function AttendancePage() {
  const dispatch = useDispatch()
  const { attendance, loading } = useSelector(s => s.dashboard)
  const [pollCode, setPollCode] = useState('')
  const [marking, setMarking] = useState(false)
  
  // Pagination State Matrix
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  useEffect(() => { 
    dispatch(fetchMyAttendance()) 
  }, [dispatch])

  // Reset pagination if overall dataset size updates dynamically
  useEffect(() => {
    setCurrentPage(1)
  }, [attendance?.length])

  const handleMark = async (e) => {
    e.preventDefault()
    if (!pollCode.trim()) return toast.error('Enter an attendance code')
    setMarking(true)
    try {
      await dispatch(markAttendance(pollCode.trim().toUpperCase())).unwrap()
      toast.success('Attendance marked successfully!')
      setPollCode('')
      dispatch(fetchMyAttendance())
    } catch (err) {
      toast.error(err || 'Failed to mark attendance')
    } finally {
      setMarking(false)
    }
  }

  const handleBack = () => {
    window.history.back()
  }

  if (loading) return <Loading />

  const attended = attendance?.filter(s => s.attended).length || 0
  const total = attendance?.length || 0
  const missed = total - attended
  const attendancePercentage = total > 0 ? Math.round((attended / total) * 100) : 0

  // Pagination Computing Logic
  const totalPages = Math.ceil(total / itemsPerPage) || 1
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = attendance ? attendance.slice(indexOfFirstItem, indexOfLastItem) : []

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8 text-slate-100 antialiased selection:bg-indigo-500/30 bg-gradient-to-br from-gray-950 to-black">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Navigation Layer: Premium Back Control Header */}
        <div className="flex items-center justify-between pb-2">
          <button 
            onClick={handleBack}
            className="group flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-800/80 bg-slate-900/40 text-xs font-medium text-slate-400 hover:text-white hover:border-slate-700/80 hover:bg-slate-800/40 transition-all duration-200 backdrop-blur-sm"
          >
            <FiArrowLeft size={14} className="transform group-hover:-translate-x-0.5 transition-transform" />
            <span>Return to Dashboard</span>
          </button>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold tracking-wider uppercase shadow-sm shadow-amber-500/5">
            <FiAward size={11} className="animate-bounce" />
            <span>Premium Tier</span>
          </div>
        </div>

        {/* Brand Header Identity Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-900 pb-5 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-400 animate-pulse" />
              <p className="text-[10px] text-indigo-400 font-bold tracking-widest uppercase">Easyway Pro Portal</p>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
              Attendance Hub
            </h1>
          </div>
          
          <div className="bg-slate-900/50 border border-slate-800/60 px-3.5 py-1.5 rounded-xl flex items-center gap-3 backdrop-blur-sm self-start sm:self-center shadow-md shadow-black/40">
            <FiActivity className="text-indigo-400" size={16} />
            <div>
              <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Presence Rate</p>
              <p className="text-xs font-extrabold text-slate-200">{attendancePercentage}% Verified</p>
            </div>
          </div>
        </div>

        {/* Actions Deck Split Wrapper */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          
          {/* Form Processing Card Module */}
          <div className="lg:col-span-2 bg-gradient-to-b from-slate-900/60 via-slate-950/40 to-slate-950/80 border border-slate-900 rounded-2xl p-5 shadow-2xl backdrop-blur-md flex flex-col justify-between">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span className="p-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg"><FiHash size={14}/></span>
                Validate Session Token
              </h2>
              <p className="text-xs text-slate-400 mt-1.5 mb-5 leading-relaxed">
                Provide the active verification check-in key generated live by your instructor to authenticate your session logs down below.
              </p>
            </div>

            <form onSubmit={handleMark} className="space-y-2 sm:space-y-0 sm:flex sm:gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-xs font-bold text-slate-500">#</span>
                <input
                  type="text"
                  value={pollCode}
                  onChange={e => setPollCode(e.target.value.toUpperCase())}
                  placeholder="ENTER SESSION POLL CODE"
                  className="w-full bg-slate-950/90 text-white placeholder-slate-600 font-mono text-xs tracking-widest uppercase rounded-xl border border-slate-800/80 px-4 pl-8 py-3.5 focus:outline-none focus:border-indigo-500/60 focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-inner"
                  maxLength={10}
                />
              </div>
              <button 
                type="submit" 
                disabled={marking} 
                className="w-full sm:w-auto relative group overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:brightness-110 text-white font-bold tracking-wide uppercase px-8 py-3.5 rounded-xl shadow-lg shadow-purple-900/20 transition-all transform active:scale-[0.98] disabled:opacity-40 flex items-center justify-center min-w-[130px] text-xs"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" style={{ animationDuration: '2s' }} />
                {marking ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : 'Check In'}
              </button>
            </form>
          </div>

          {/* Dynamic Interactive Metrics Ring Component */}
          <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-5 shadow-xl backdrop-blur-md flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="relative flex items-center justify-center mb-2">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle cx="48" cy="48" r="40" strokeWidth="5" stroke="#1e293b" fill="transparent" />
                <circle cx="48" cy="48" r="40" strokeWidth="5" 
                  stroke={attendancePercentage >= 75 ? "#10b981" : "#f59e0b"} 
                  fill="transparent" 
                  strokeDasharray={2 * Math.PI * 40}
                  strokeDashoffset={2 * Math.PI * 40 * (1 - attendancePercentage / 100)}
                  className="transition-all duration-1000 ease-out"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute text-xl font-black text-white">{attendancePercentage}%</div>
            </div>
            <span className="text-xs font-bold text-slate-300">Global Standing Matrix</span>
            <span className="text-[10px] text-slate-500 mt-0.5">Academic benchmark target: 75% Threshold</span>
          </div>
        </div>

        {/* Micro Primary Cards Row Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {[
            { label: 'Total Track Records', value: total, borderColor: 'border-slate-900', textColors: 'text-slate-100', iconBg: 'bg-slate-800/40 text-slate-400' },
            { label: 'Present Sign-Ins', value: attended, borderColor: 'border-emerald-500/10', textColors: 'text-emerald-400', iconBg: 'bg-emerald-500/10 text-emerald-400' },
            { label: 'Unverified Absences', value: missed, borderColor: 'border-rose-500/10', textColors: 'text-rose-400', iconBg: 'bg-rose-500/10 text-rose-400' },
          ].map((card, index) => (
            <div key={index} className={`bg-slate-900/30 border ${card.borderColor} rounded-xl p-4 flex items-center justify-between shadow-md backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5`}>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{card.label}</p>
                <p className={`text-2xl font-black mt-0.5 tracking-tight ${card.textColors}`}>{card.value}</p>
              </div>
              <div className={`p-2.5 rounded-lg text-sm ${card.iconBg}`}>
                {index === 0 && <FiCalendar size={16} />}
                {index === 1 && <FiCheckCircle size={16} />}
                {index === 2 && <FiXCircle size={16} />}
              </div>
            </div>
          ))}
        </div>

        {/* History Ledger List Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Timeline Manifest Log</h3>
            <span className="text-[10px] text-slate-400 font-bold bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-800">
              Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, total)} of {total}
            </span>
          </div>

          {total === 0 ? (
            <div className="text-center py-14 bg-slate-900/10 border border-dashed border-slate-900 rounded-2xl backdrop-blur-sm">
              <FiCalendar size={36} className="text-slate-800 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-500">No session metrics found</p>
              <p className="text-[11px] text-slate-600 mt-0.5 max-w-xs mx-auto">Active streams synchronize instantly as soon as a validation check-in is compiled.</p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                {currentItems.map((session) => (
                  <div 
                    key={session._id}
                    className={`group border rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all duration-200 bg-slate-900/20 backdrop-blur-sm hover:bg-slate-900/40 ${
                      session.attended ? 'border-emerald-500/10' : 'border-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                        session.attended ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                      }`}>
                        {session.attended ? <FiCheckCircle size={18} /> : <FiXCircle size={18} />}
                      </div>

                      <div className="space-y-0.5 min-w-0">
                        <p className="font-semibold text-slate-200 text-sm tracking-tight truncate group-hover:text-white transition-colors">
                          {session.title}
                        </p>
                        
                        <div className="flex items-center gap-x-2.5 text-[11px] text-slate-500 font-medium">
                          <span className="flex items-center gap-1 text-slate-400">
                            <FiBookOpen size={12} className="text-indigo-400/80 flex-shrink-0" />
                            <span className="truncate max-w-[140px] sm:max-w-none">{session.course?.title || 'General Module'}</span>
                          </span>
                          <span className="text-slate-800">•</span>
                          <span className="flex items-center gap-1">
                            <FiClock size={11} className="flex-shrink-0" />
                            {new Date(session.date).toLocaleDateString('en-IN', {
                              day: 'numeric', month: 'short', year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end border-t border-slate-950 pt-2.5 sm:pt-0 sm:border-0">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black tracking-wider uppercase ${
                        session.attended
                          ? 'bg-emerald-500/5 text-emerald-400 border border-emerald-500/10'
                          : 'bg-rose-500/5 text-rose-400 border border-rose-500/10'
                    }`}>
                        {session.attended ? 'Present' : 'Absent'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Premium Interactive Pagination Toolbar Control */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-slate-900 pt-4 mt-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg border border-slate-900 bg-slate-900/30 text-xs font-semibold text-slate-400 hover:text-white hover:border-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-all"
                  >
                    <FiChevronLeft size={14} />
                    <span>Previous</span>
                  </button>

                  <div className="text-xs text-slate-500 font-bold tracking-wide">
                    Page <span className="text-slate-200">{currentPage}</span> of <span className="text-slate-400">{totalPages}</span>
                  </div>

                  <button
                    onClick={() => setCurrentPage(p => Math.min(p - 1 + 2, totalPages))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg border border-slate-900 bg-slate-900/30 text-xs font-semibold text-slate-400 hover:text-white hover:border-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-all"
                  >
                    <span>Next</span>
                    <FiChevronRight size={14} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  )
}