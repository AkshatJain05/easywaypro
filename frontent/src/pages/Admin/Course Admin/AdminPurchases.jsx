import { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllPurchases } from '../../../redux/adminSlice.js'
import { HiOutlineSearch } from 'react-icons/hi'
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi'
import { FiCreditCard, FiCalendar, FiUser, FiBookOpen, FiClock, FiActivity, FiPrinter } from 'react-icons/fi'
import Loading from '../../../component/Loading.jsx'

export default function AdminPurchases() {
  const dispatch = useDispatch()
  const { purchases, loading } = useSelector(s => s.admin)
  const [search, setSearch] = useState('')
  const [selectedCourse, setSelectedCourse] = useState('all')
  const [firstLoadComplete, setFirstLoadComplete] = useState(false)

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  useEffect(() => {
    dispatch(fetchAllPurchases())
      .unwrap()
      .catch(() => {}) 
      .finally(() => {
        setFirstLoadComplete(true)
      })
  }, [dispatch])

  const isInitialPlugging = loading && !firstLoadComplete

  // Extract unique course titles for the select dropdown filter
  const uniqueCourses = useMemo(() => {
    const rawPurchases = purchases || []
    const titles = rawPurchases.map(p => p.course?.title).filter(Boolean)
    return [...new Set(titles)].sort()
  }, [purchases])

  // Process both cascading filters concurrently 
  const filtered = useMemo(() => {
    let dataset = purchases || []

    if (selectedCourse !== 'all') {
      dataset = dataset.filter(p => p.course?.title === selectedCourse)
    }

    if (!search.trim()) return dataset
    
    const normalizedTerm = search.toLowerCase()
    return dataset.filter(p =>
      p.user?.name?.toLowerCase().includes(normalizedTerm) ||
      p.user?.email?.toLowerCase().includes(normalizedTerm) ||
      p.course?.title?.toLowerCase().includes(normalizedTerm)
    )
  }, [purchases, search, selectedCourse])

  useEffect(() => {
    setCurrentPage(1)
  }, [search, selectedCourse])

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1

  const paginatedPurchases = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filtered.slice(startIndex, startIndex + itemsPerPage)
  }, [filtered, currentPage])

  // Calculate global statistics for the active selection
  const reportSummary = useMemo(() => {
    const totalRevenue = filtered.reduce((acc, curr) => acc + (curr.amount || 0), 0)
    return {
      totalRevenue,
      recordCount: filtered.length,
      targetScope: selectedCourse === 'all' ? 'All Platform Courses' : selectedCourse,
      generatedAt: new Date().toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
      })
    }
  }, [filtered, selectedCourse])

  // Native Web Browser Sandbox Printing Core Command
  const handleNativePrintPdf = () => {
    window.print()
  }

  if (isInitialPlugging) {
    return (
      <div>
        <Loading />
      </div>
    )
  }

  return (
    <div className="space-y-5 p-2 md:p-4 max-w-7xl mx-auto text-slate-100 antialiased selection:bg-blue-500/30">
      
      {/* ── STYLE BLOCKS FOR CLEAN NATIVE PRINT TEMPLATE OUTLINE ── */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * { visibility: hidden; background: transparent !important; color: #000 !important; }
          #easyway-printable-ledger, #easyway-printable-ledger * { visibility: visible; }
          #easyway-printable-ledger { position: absolute; left: 0; top: 0; width: 100%; base-layer: true; }
          tr { page-break-inside: avoid; }
        }
      `}} />

      {/* Header Summary Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-black via-gray-950 to-black p-4 rounded-xl border border-slate-800/80 shadow-xl print:hidden">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Transaction Ledger
          </h1>
          <p className="text-slate-400 text-xs mt-0.5">
            Manage student access tokens, course permissions, and invoices
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleNativePrintPdf}
            disabled={filtered.length === 0}
            className="flex items-center gap-2 bg-white text-black hover:bg-slate-200 font-semibold px-3.5 py-1.5 rounded-lg text-xs transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer active:scale-95"
          >
            <FiPrinter className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Print / Save PDF</span>
          </button>
          
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800/60">
            <FiCreditCard className="text-orange-400 w-4 h-4" />
            <span className="text-xs font-semibold text-slate-300">
              {filtered.length} of {purchases?.length || 0} Records
            </span>
          </div>
        </div>
      </div>

      {/* Control Filter Dropdown and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-gradient-to-r from-black via-gray-950 to-black p-2 rounded-xl border border-slate-800/60 backdrop-blur-md print:hidden">
        <div className="relative flex items-center">
          <FiBookOpen className="absolute left-3.5 text-slate-500 w-4 h-4 pointer-events-none" />
          <select
            value={selectedCourse}
            onChange={e => setSelectedCourse(e.target.value)}
            className="w-full bg-slate-950/60 border border-slate-800 focus:border-blue-500/80 rounded-lg pl-10 pr-4 py-2 text-xs md:text-sm text-white focus:outline-none transition-all cursor-pointer appearance-none shadow-inner"
          >
            <option value="all">All Platform Courses</option>
            {uniqueCourses.map((title, i) => (
              <option key={i} value={title}>{title}</option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-xs">▼</div>
        </div>

        <div className="relative flex items-center md:col-span-2">
          <HiOutlineSearch className="absolute left-3.5 text-slate-500 w-4 h-4" />
          <input 
            value={search} 
            onChange={e => setSearch(e.target.value)}
            type="text"
            placeholder="Search within subset by student name, email alias, or course keyword..." 
            className="w-full bg-slate-950/60 border border-slate-800 focus:border-blue-500/80 rounded-lg pl-10 pr-4 py-2 text-xs md:text-sm text-white focus:outline-none transition-all placeholder:text-slate-600 shadow-inner" 
          />
        </div>
      </div>

      {/* Main Container Layer (Desktop and Mobile View) */}
      <div className="bg-gradient-to-r from-black via-gray-950 to-black border border-slate-800/70 rounded-xl overflow-hidden shadow-2xl print:hidden">
        
        {/* Mobile View Card Grid */}
        <div className="block md:hidden divide-y divide-slate-800/60">
          {paginatedPurchases.map(p => {
            const expired = p.expiresAt && new Date(p.expiresAt) < new Date()
            const userInitial = p.user?.name?.[0]?.toUpperCase() || '?'
            
            return (
              <div key={p._id} className="p-4 space-y-3 hover:bg-slate-900/40 transition-colors">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-black flex-shrink-0">
                      {userInitial}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{p.user?.name || 'Anonymous Student'}</p>
                      <p className="text-[11px] text-slate-500 truncate">{p.user?.email || 'N/A'}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    expired ? 'bg-red-500/10 border border-red-500/20 text-red-400'
                    : p.isCompleted ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                    : 'bg-blue-500/10 border border-blue-500/20 text-blue-400'
                  }`}>
                    {expired ? 'Expired' : p.isCompleted ? 'Completed' : 'Active'}
                  </span>
                </div>

                <div className="bg-slate-950/50 rounded-lg p-2.5 space-y-2 border border-slate-900">
                  <div className="flex items-center gap-2 text-xs">
                    <FiBookOpen className="text-slate-500 flex-shrink-0 w-3.5 h-3.5" />
                    <span className="text-slate-300 truncate font-medium">{p.course?.title || 'Unknown Asset Course'}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-900 text-slate-400">
                    <div>
                      <span className="block text-[9px] uppercase font-bold text-slate-600 tracking-wider">Purchased</span>
                      <span className="font-medium text-slate-300">
                        {new Date(p.purchasedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[9px] uppercase font-bold text-slate-600 tracking-wider">Expiration</span>
                      <span className={`font-medium ${expired ? 'text-red-400' : 'text-slate-300'}`}>
                        {p.expiresAt ? new Date(p.expiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Lifetime Access'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-1">
                  <span className="text-[10px] text-slate-500 font-mono">ID: {p._id?.slice(-8)}</span>
                  <span className="text-base font-black text-orange-400">₹{p.amount?.toLocaleString('en-IN')}</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Desktop Grid Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-800/80 bg-slate-950/40">
                {[
                  { label: 'Student Context', icon: <FiUser className="w-3 h-3" /> },
                  { label: 'Target Asset Course', icon: <FiBookOpen className="w-3 h-3" /> },
                  { label: 'Amount Paid', icon: <FiCreditCard className="w-3 h-3" /> },
                  { label: 'Purchase Timeline', icon: <FiCalendar className="w-3 h-3" /> },
                  { label: 'Expiration', icon: <FiClock className="w-3 h-3" /> },
                  { label: 'Status Matrix', icon: <FiActivity className="w-3 h-3" /> }
                ].map((h, idx) => (
                  <th key={idx} className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <div className="flex items-center gap-1.5">
                      {h.icon}
                      <span>{h.label}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {paginatedPurchases.map(p => {
                const expired = p.expiresAt && new Date(p.expiresAt) < new Date()
                const userInitial = p.user?.name?.[0]?.toUpperCase() || '?'
                
                return (
                  <tr key={p._id} className="hover:bg-slate-900/30 transition-colors duration-150">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/60 flex items-center justify-center text-slate-300 text-xs font-bold shadow-md">
                          {userInitial}
                        </div>
                        <div className="leading-tight max-w-[160px]">
                          <p className="text-sm text-white font-semibold truncate">{p.user?.name || 'Unknown Student'}</p>
                          <p className="text-xs text-slate-500 truncate mt-0.5">{p.user?.email || 'N/A'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm font-medium text-slate-300 max-w-[200px] truncate" title={p.course?.title}>
                        {p.course?.title || 'Unknown Course Context'}
                      </p>
                    </td>
                    <td className="p-4">
                      <span className="text-sm font-black text-orange-400">
                        ₹{p.amount?.toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-xs font-medium text-slate-400">
                        {new Date(p.purchasedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs font-semibold ${expired ? 'text-red-400' : 'text-slate-400'}`}>
                        {p.expiresAt ? new Date(p.expiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Lifetime'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`text-[10px] px-2.5 py-1 rounded-md font-extrabold uppercase tracking-widest ${
                        expired ? 'bg-red-500/10 border border-red-500/20 text-red-400'
                        : p.isCompleted ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                        : 'bg-blue-500/10 border border-blue-500/20 text-blue-400'
                      }`}>
                        {expired ? 'Expired' : p.isCompleted ? 'Completed' : 'Active'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Empty Context Fallback */}
        {filtered.length === 0 && (
          <div className="text-center py-20 bg-slate-900/20 border-t border-slate-800/40">
            <FiCreditCard className="text-slate-700 w-10 h-10 mx-auto mb-3 stroke-[1.5]" />
            <p className="text-slate-400 text-sm font-medium">No matching ledger receipts detected</p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {filtered.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-black border border-slate-800/80 rounded-xl text-xs backdrop-blur-md print:hidden">
          <p className="text-slate-400 text-[11px] text-center sm:text-left">
            Showing <span className="font-bold text-white">{((currentPage - 1) * itemsPerPage) + 1}</span> to{' '}
            <span className="font-bold text-white">{Math.min(currentPage * itemsPerPage, filtered.length)}</span> of {filtered.length} entries
          </p>
          <div className="flex items-center gap-1.5">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-white disabled:opacity-20 cursor-pointer"><HiChevronLeft size={16} /></button>
            <span className="px-3 py-1 bg-slate-950 border border-slate-800/80 rounded-md text-[11px] text-slate-300">Page {currentPage} / {totalPages}</span>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-white disabled:opacity-20 cursor-pointer"><HiChevronRight size={16} /></button>
          </div>
        </div>
      )}


      {/* 🔥 ── HIDDEN HIGH-RES ARCHIVAL CONTAINER PRINT TARGET ── 🔥 */}
      <div id="easyway-printable-ledger" className="hidden print:block p-8 font-sans text-black bg-white">
        {/* Document Corporate Metadata Header */}
        <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', borderBottom: '2px solid #000', paddingBottom: '16px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, tracking: '-0.05em' }}>EASYWAY PRO</h1>
            <p style={{ fontSize: '12px', color: '#475569', margin: '5px 0 0 0' }}>Financial Transaction Ledger Summary Report</p>
            <p style={{ fontSize: '10px', color: '#64748b', margin: '2px 0 0 0' }}>Generated on: {reportSummary.generatedAt}</p>
          </div>
          <div style={{ textAlign: 'right', background: '#f1f5f9', padding: '12px', borderRadius: '8px',margin:"2px", border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#64748b', display: 'block' }}>TOTAL REVENUE EARNED</span>
            <span style={{ fontSize: '18px', fontWeight: '900', color: '#0f172a' }}>INR {reportSummary.totalRevenue.toLocaleString('en-IN')}.00</span>
          </div>
        </div>

        {/* Current Active Filter Constraints Metadata */}
        <div style={{ margin: '20px 0', fontSize: '11px', color: '#334155' }}>
          <strong>Filter Scope Scope Range:</strong> {reportSummary.targetScope} ({reportSummary.recordCount} records loaded)
        </div>

        {/* Full Comprehensive Print-Ready Grid Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', marginTop: '10px' }}>
          <thead>
            <tr style={{ background: '#0f172a', color: '#fff', fontSize: '10px' }}>
              <th style={{ padding: '10px', border: '1px solid #cbd5e1' }}>Student Name</th>
              <th style={{ padding: '10px', border: '1px solid #cbd5e1' }}>Email Address</th>
              <th style={{ padding: '10px', border: '1px solid #cbd5e1' }}>Course Title Title</th>
              <th style={{ padding: '10px', border: '1px solid #cbd5e1' }}>Purchase Date</th>
              <th style={{ padding: '10px', border: '1px solid #cbd5e1', textAlign: 'right' }}>Paid Amount</th>
            </tr>
          </thead>
          <tbody style={{ fontSize: '9.5px' }}>
            {filtered.map((p, index) => (
              <tr key={p._id} style={{ background: index % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                <td style={{ padding: '8px', border: '1px solid #e2e8f0', fontWeight: 'bold' }}>{p.user?.name || 'N/A'}</td>
                <td style={{ padding: '8px', border: '1px solid #e2e8f0', color: '#334155' }}>{p.user?.email || 'N/A'}</td>
                <td style={{ padding: '8px', border: '1px solid #e2e8f0' }}>{p.course?.title || 'N/A'}</td>
                <td style={{ padding: '8px', border: '1px solid #e2e8f0' }}>{new Date(p.purchasedAt).toLocaleDateString('en-IN')}</td>
                <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'right', fontWeight: 'bold' }}>₹{p.amount?.toLocaleString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}