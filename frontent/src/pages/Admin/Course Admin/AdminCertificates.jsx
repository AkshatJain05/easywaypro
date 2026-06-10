import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { issueCertificate, fetchAllUsers } from '../../../redux/adminSlice.js'
import { fetchAdminCourses } from '../../../redux/courseSlice.js'
import toast from 'react-hot-toast'
import { HiOutlineBadgeCheck, HiOutlinePlus, HiOutlineEye } from 'react-icons/hi'
import { motion, AnimatePresence } from 'framer-motion'

export default function AdminCertificates() {
  const dispatch = useDispatch()
  const { users = [] } = useSelector(s => s.admin)
  const { adminCourses = [] } = useSelector(s => s.courses)
  
  const [form, setForm] = useState({ userId: '', courseId: '' })
  const [issuing, setIssuing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  useEffect(() => {
    dispatch(fetchAllUsers())
    dispatch(fetchAdminCourses())
  }, [dispatch])

  // Computed Values for Entity Names (Used for dynamic form handling & real-time preview canvas)
  const studentRegistry = users.filter(u => u.role === 'student')
  const selectedStudent = studentRegistry.find(u => u._id === form.userId)
  const selectedCourse = adminCourses.find(c => c._id === form.courseId)

  const filteredStudents = searchQuery === '' 
    ? studentRegistry 
    : studentRegistry.filter(u => 
        u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        u.email?.toLowerCase().includes(searchQuery.toLowerCase())
      )

  const handleIssue = async (e) => {
    e.preventDefault()
    if (!form.userId || !form.courseId) return toast.error('Select a student and course')
    setIssuing(true)
    try {
      await dispatch(issueCertificate(form)).unwrap()
      toast.success('Certificate issued successfully!')
      setForm({ userId: '', courseId: '' })
      setSearchQuery('')
    } catch (err) {
      toast.error(err || 'Failed to issue certificate')
    } finally {
      setIssuing(false)
    }
  }

  return (
    <div className="text-zinc-100 font-sans antialiased max-w-[1300px] mx-auto space-y-6">
      
      {/* Structural Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-white">Certificate Issuance Engine</h1>
        <p className="text-zinc-500 text-xs mt-1">Configure parameters, verify template mapping, and override authorization records.</p>
      </div>

      {/* Grid Canvas: Left Core Controls | Right Real-time Preview Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Form & Protocols */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Active Notice */}
          <div className="rounded-xl p-4 border border-white/[0.04] bg-[#09090b]">
            <div className="flex items-start gap-3">
              <HiOutlineBadgeCheck className="w-4 h-4 text-zinc-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-zinc-200">Auto-Generation Guard</p>
                <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
                  System triggers auto-generation once user logs 100% course progression. 
                  Manual dispatch forces immutable administrative injection parameters.
                </p>
              </div>
            </div>
          </div>

          {/* Form Component */}
          <div className="rounded-xl border border-white/[0.04] bg-[#09090b] p-5 shadow-sm">
            <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">Authorization Parameters</h2>
            
            <form onSubmit={handleIssue} className="space-y-4">
              
              {/* Type-In Searchable Student Combobox Selector */}
              <div className="space-y-1.5 relative">
                <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wide">Target Student *</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder={selectedStudent ? `${selectedStudent.name} (${selectedStudent.email})` : "Type name or email to search..."}
                    value={searchQuery}
                    onFocus={() => setIsDropdownOpen(true)}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setIsDropdownOpen(true)
                    }}
                    className="w-full text-xs bg-[#0d0d12] border border-white/[0.06] rounded-lg px-3.5 py-2.5 text-zinc-300 focus:outline-none focus:border-white/20 transition-all placeholder:text-zinc-500"
                    required={!form.userId}
                  />
                  {selectedStudent && searchQuery === '' && (
                    <button 
                      type="button"
                      onClick={() => { setForm(f => ({ ...f, userId: '' })); setSearchQuery(''); }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-zinc-500 hover:text-white transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Combobox Panel */}
                <AnimatePresence>
                  {isDropdownOpen && (
                    <>
                      <div className="absolute z-50 w-full mt-1 bg-[#0d0d12] border border-white/[0.08] rounded-lg shadow-xl max-h-48 overflow-y-auto p-1 custom-scrollbar">
                        {filteredStudents.length === 0 ? (
                          <p className="text-[11px] text-zinc-600 p-3 text-center">No structural matches found</p>
                        ) : (
                          filteredStudents.map((u) => (
                            <button
                              key={u._id}
                              type="button"
                              onClick={() => {
                                setForm(f => ({ ...f, userId: u._id }))
                                setSearchQuery('')
                                setIsDropdownOpen(false)
                              }}
                              className={`w-full text-left px-3 py-2 rounded-md transition-colors block text-xs group cursor-pointer ${
                                form.userId === u._id ? 'bg-white/10 text-white' : 'hover:bg-white/[0.04] text-zinc-400'
                              }`}
                            >
                              <span className="font-medium group-hover:text-white">{u.name}</span>
                              <span className="text-zinc-500 block text-[10px] mt-0.5">{u.email}</span>
                            </button>
                          ))
                        )}
                      </div>
                      <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Standard Active Course Selection List */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wide">Target Course Spec *</label>
                <select 
                  value={form.courseId} 
                  onChange={e => setForm(f => ({...f, courseId: e.target.value}))} 
                  className="w-full text-xs bg-[#0d0d12] border border-white/[0.06] rounded-lg px-3.5 py-2.5 text-zinc-300 focus:outline-none focus:border-white/20 transition-all cursor-pointer appearance-none"
                  required
                >
                  <option value="" className="text-zinc-600">Select catalog target...</option>
                  {adminCourses.map(c => (
                    <option key={c._id} value={c._id} className="text-zinc-300">{c.title}</option>
                  ))}
                </select>
              </div>

              {/* Form Action Dispatcher */}
              <button 
                type="submit" 
                disabled={issuing} 
                className="w-full flex items-center justify-center gap-2 bg-white text-black hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-600 font-medium text-xs py-2.5 px-4 rounded-lg transition-all active:scale-[0.99] cursor-pointer shadow-sm mt-2"
              >
                {issuing ? (
                  <>
                    <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" /> 
                    <span>Processing Encryption Keys...</span>
                  </>
                ) : (
                  <>
                    <HiOutlinePlus className="w-3.5 h-3.5" /> 
                    <span>Authorize & Issue Document</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Dynamic Specifications */}
          <div className="rounded-xl border border-white/[0.04] bg-[#09090b] p-5 space-y-3">
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Metadata Blueprint</h3>
            <ul className="space-y-2 text-[11px] text-zinc-500 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-zinc-600 mt-1.5 shrink-0" />
                <span>Binds unique cryptographic verification hash structures to each row output.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-zinc-600 mt-1.5 shrink-0" />
                <span>Renders structural layers as vector formats, clean for high-resolution printing engines.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Premium Document Canvas Preview */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center gap-2 px-1 text-zinc-400 text-xs">
            <HiOutlineEye className="text-sm text-zinc-500" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Live Vector Matrix Preview</span>
          </div>

          <div className="w-full aspect-[1.414/1] bg-[#09090b] border border-white/[0.04] rounded-xl flex flex-col justify-between p-8 md:p-12 relative overflow-hidden shadow-2xl selection:bg-transparent select-none">
            
            {/* Elegant Geometrics (High-end Vector Accent Lines) */}
            <div className="absolute top-0 right-0 w-32 h-32 border-t border-r border-white/[0.02] mt-4 mr-4 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 border-b border-l border-white/[0.02] mb-4 ml-4 pointer-events-none" />
            
            {/* Document Header Branding */}
            <div className="flex justify-between items-start z-10">
              <div>
                <div className="w-6 h-6 bg-white text-black font-black text-[10px] rounded flex items-center justify-center">Ω</div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 mt-2">Easyway Pro</p>
                <p className="text-[7px] font-medium tracking-widest text-zinc-600 uppercase">Verification Engine</p>
              </div>
              <div className="text-right">
                <span className="text-[8px] font-mono tracking-tight px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-zinc-400 uppercase">
                  Spec-V1.02
                </span>
              </div>
            </div>

            {/* Dynamic Core Copy Center */}
            <div className="space-y-4 my-auto z-10 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">Certificate of Completion</p>
              
              <div className="space-y-1">
                <p className="text-[10px] italic text-zinc-500">This document hereby recognizes and validates that</p>
                <h3 className="text-lg md:text-2xl font-bold tracking-tight text-white transition-all duration-200">
                  {selectedStudent ? selectedStudent.name : <span className="text-zinc-700 font-mono tracking-normal">[Recipient Name Context]</span>}
                </h3>
              </div>

              <div className="space-y-1 max-w-md mx-auto">
                <p className="text-[10px] italic text-zinc-500">has successfully completed all requirements, examinations, and project benchmarks for</p>
                <h4 className="text-xs md:text-sm font-semibold tracking-wide text-zinc-200 transition-all duration-200">
                  {selectedCourse ? selectedCourse.title : <span className="text-zinc-700 font-mono tracking-normal">[Target Academic Program Course String]</span>}
                </h4>
              </div>
            </div>

            {/* Document Footer Verification Details */}
            <div className="flex justify-between items-end border-t border-white/[0.02] pt-4 z-10">
              <div className="space-y-1">
                <p className="text-[7px] font-mono uppercase tracking-widest text-zinc-600">Issue Date</p>
                <p className="text-[9px] font-mono text-zinc-400">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              
              {/* Decorative Vector Seal Layout */}
              <div className="flex flex-col items-center justify-center shrink-0">
                <div className="w-7 h-7 border border-white/10 rounded-full flex items-center justify-center relative">
                  <div className="w-5 h-5 border border-dashed border-white/5 rounded-full" />
                </div>
                <p className="text-[6px] font-mono uppercase tracking-widest text-zinc-600 mt-1">System Seal</p>
              </div>

              <div className="space-y-1 text-right">
                <p className="text-[7px] font-mono uppercase tracking-widest text-zinc-600">Credential Identifier</p>
                <p className="text-[9px] font-mono text-zinc-400 tracking-tight">
                  {form.userId && form.courseId ? `CERT-${form.userId.slice(-4).toUpperCase()}-${form.courseId.slice(-4).toUpperCase()}` : 'CERT-XXXX-XXXX'}
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}