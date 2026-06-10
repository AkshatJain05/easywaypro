import { useState } from 'react'
import axios from 'axios'
import { 
  FiAward, FiCalendar, FiBookOpen, FiUser, FiCheckCircle, 
  FiXCircle, FiSearch, FiDownload, FiShield, FiArrowLeft 
} from 'react-icons/fi'

export default function VerifyCertificate() {
  const [certId, setCertId] = useState('')
  const [loading, setLoading] = useState(false)
  const [certificate, setCertificate] = useState(null)
  const [error, setError] = useState(null)

  const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

  const handleVerify = async (e) => {
    e.preventDefault()
    if (!certId.trim()) return

    setLoading(true)
    setError(null)
    setCertificate(null)

    try {
      const response = await axios.get(`${BASE_URL}/api/certificates/verify/${certId.trim()}`)
      
      if (response.data.success) {
        setCertificate(response.data.certificate)
      } else {
        setError('Invalid Certificate ID. No matching record found inside Easyway Pro registries.')
      }
    } catch (err) {
      console.error('Verification error:', err)
      setError(err.response?.data?.message || 'Verification failed. Please double-check the configuration and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (courseId, title) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/certificates/download/${courseId}`, {
        responseType: 'blob',
        withCredentials: true
      })
      const fileBlob = new Blob([response.data], { type: 'application/pdf' })
      const blobUrl = window.URL.createObjectURL(fileBlob)
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = `easywaypro_certificate_${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(blobUrl)
    } catch (err) {
      window.open(`${BASE_URL}/api/certificates/download/${courseId}`, '_blank')
    }
  }

  return (
    <div className="min-h-screen bg-[#030009] text-slate-100 antialiased py-12 px-4 md:px-8 flex flex-col items-center selection:bg-amber-500/30 relative overflow-hidden">
      
      {/* Decorative Branding Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.07),transparent_50%)] pointer-events-none" />
      <div className="absolute top-[20%] left-[10%] w-72 h-72 bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-72 h-72 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-2xl w-full space-y-8 relative z-10">
        
        {/* Header with Back Button */}
        <div className="text-center space-y-3 relative">
          <button 
            onClick={() => window.history.back()} 
            className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white  hover:bg-slate-900 border border-slate-800/80 px-3 py-2 rounded-xl transition-all active:scale-95 cursor-pointer group/btn"
          >
            <FiArrowLeft className="transition-transform group-hover/btn:-translate-x-0.5" size={14} />
            <span className="hidden sm:inline">Back</span>
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-medium tracking-wider text-slate-400 uppercase mb-2">
            <FiShield className="text-amber-500 animate-pulse" size={12} /> Official Ledger System
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
            Easyway<span className="text-amber-500"> Pro</span> Verification
          </h1>
          <p className="text-slate-400 text-xs md:text-sm max-w-md mx-auto leading-relaxed">
            Instant, decentralized verification infrastructure securely validating student performance tokens and global credentials.
          </p>
        </div>

        {/* Input Interface */}
        <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 shadow-2xl backdrop-blur-xl relative">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-black via-gray-950 to-black" />
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase font-extrabold text-slate-400 tracking-widest mb-2.5">
                Secure Tracking Reference String
              </label>
              <div className="relative group">
                <input
                  type="text"
                  value={certId}
                  onChange={(e) => setCertId(e.target.value)}
                  placeholder="Enter dynamic certificate ID or tracking link hash..."
                  className="w-full bg-gray-950 border border-slate-800/80 rounded-2xl py-3.5 pl-5 pr-14 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/20 shadow-inner transition-all font-mono"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !certId.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-slate-900 hover:bg-amber-500 text-slate-400 hover:text-black border border-slate-800/60 hover:border-amber-500 disabled:opacity-20 disabled:hover:bg-slate-900 disabled:hover:text-slate-400 transition-all flex items-center justify-center cursor-pointer group-hover:scale-102"
                >
                  <FiSearch size={16} className={loading ? 'animate-spin text-amber-500' : 'transition-transform group-hover:scale-105'} />
                </button>
              </div>
            </div>
          </form>
        </div>


        {/* Shimmering Skeleton Mockup Loading State */}
        {loading && (
          <div className="bg-slate-900/20 border border-slate-900 rounded-3xl p-6 space-y-6 animate-pulse shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-900">
              <div className="w-1/3 h-4 bg-slate-800 rounded-md" />
              <div className="w-16 h-5 bg-slate-800 rounded-md" />
            </div>
            <div className="w-3/4 h-6 bg-slate-800 rounded-md" />
            <div className="grid grid-cols-2 gap-4 pt-2">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="space-y-2">
                  <div className="w-1/2 h-3 bg-slate-800/60 rounded" />
                  <div className="w-5/6 h-4 bg-slate-800 rounded" />
                </div>
              ))}
            </div>
            <div className="w-full h-10 bg-slate-800/40 rounded-xl" />
          </div>
        )}

        {/* Failure Alerts */}
        {error && (
          <div className="flex items-start gap-4 bg-red-500/5 border border-red-500/10 p-5 rounded-2xl text-red-400 text-sm shadow-xl backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 left-0 bottom-0 w-1 bg-red-500" />
            <FiXCircle size={20} className="shrink-0 text-red-500/80 mt-0.5" />
            <div className="space-y-0.5">
              <h4 className="font-bold tracking-tight text-white">System Verification Refused</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        {/* Verified Showcase Component */}
        {certificate && (
          <div className="bg-slate-900/40 border border-emerald-500/20 rounded-3xl overflow-hidden shadow-2xl relative group">
            
            {/* Ambient verification glow layout */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.03),transparent_40%)] pointer-events-none" />

            {/* Header Validation Banner */}
            <div className="bg-slate-900/60 px-6 py-4 border-b border-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 text-emerald-400">
                <FiCheckCircle size={18} className="drop-shadow-[0_0_8px_rgba(16,185,129,0.5)] fill-emerald-500/10 stroke-[2.5]" />
                <span className="text-xs font-extrabold uppercase tracking-widest">Easyway Pro Validated Asset</span>
              </div>
              <span className="text-[10px] font-mono bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full font-bold tracking-wider self-start sm:self-auto">
                AUTHENTIC & GENUINE
              </span>
            </div>

            {/* Credential Specs Board */}
            <div className="p-6 space-y-6">
              
              {/* Minimalist Virtual Frame Mockup preview */}
              <div className="border border-dashed border-slate-800 rounded-2xl p-5 bg-slate-950/40 relative group-hover:border-amber-500/20 transition-colors">
                <FiAward className="absolute right-4 bottom-4 text-slate-900/40 w-20 h-20 pointer-events-none group-hover:text-amber-500/5 transition-colors" />
                <span className="block text-[9px] uppercase font-extrabold text-amber-500/80 tracking-widest mb-1.5">Certified Course Curriculum</span>
                <h3 className="text-lg md:text-xl font-bold text-white leading-snug group-hover:text-amber-400 transition-colors">
                  {certificate.course?.title}
                </h3>
              </div>

              {/* Data Node Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 text-xs pt-2">
                <div className="space-y-1">
                  <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">Accredited Graduate</span>
                  <div className="flex items-center gap-2 text-slate-200 font-semibold text-sm">
                    <FiUser className="text-slate-600 shrink-0" size={14} />
                    <span>{certificate.user?.name}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">Authorized Authority</span>
                  <div className="flex items-center gap-2 text-slate-200 font-semibold text-sm">
                    <FiBookOpen className="text-slate-600 shrink-0" size={14} />
                    <span className="truncate">{certificate.course?.instructor?.name || 'Easyway Pro Expert Team'}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">Issuance Date</span>
                  <div className="flex items-center gap-2 text-slate-300 font-medium">
                    <FiCalendar className="text-slate-600 shrink-0" size={14} />
                    <span>
                      {new Date(certificate.issuedAt).toLocaleDateString('en-US', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">Secure Registry Identifier</span>
                  <div className="font-mono text-amber-500 text-[11px] font-extrabold mt-0.5 tracking-wide">
                    {certificate.certificateId}
                  </div>
                </div>
              </div>

              {/* Verified Action Drawer */}
              <div className="pt-4 border-t border-slate-900">
                <button
                  onClick={() => handleDownload(certificate.course?._id, certificate.course?.title)}
                  className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 rounded-2xl text-xs tracking-wider uppercase transition-all shadow-lg shadow-amber-500/5 active:scale-[0.99] cursor-pointer"
                >
                  <FiDownload size={14} className="stroke-[2.5]" />
                  <span>Download Signed Document Vector</span>
                </button>
              </div>

            </div>
          </div>
        )}

     

      </div>
    </div>
  )
}