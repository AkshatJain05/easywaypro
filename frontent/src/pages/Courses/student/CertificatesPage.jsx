import { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMyCertificates } from '../../../redux/dashboardSlice.js'
import { FiAward, FiDownload, FiCalendar, FiBookOpen, FiShare2, FiCopy, FiArrowLeft } from 'react-icons/fi' // Added FiArrowLeft
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi'
import Loading from '../../../component/Loading.jsx'
import axios from 'axios' 
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom' // Imported useNavigate hook

export default function CertificatesPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate() // Initialized navigation router instance
  const { certificates = [], loading } = useSelector(s => s.dashboard)
  const [firstLoadComplete, setFirstLoadComplete] = useState(false)
  
  // Tracking states for progress loader engine
  const [downloadingId, setDownloadingId] = useState(null)
  const [downloadProgress, setDownloadProgress] = useState(0)

  // Pagination Configuration 
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

  useEffect(() => {
    dispatch(fetchMyCertificates())
      .unwrap()
      .catch(() => {})
      .finally(() => {
        setFirstLoadComplete(true)
      })
  }, [dispatch])

  const isInitialPlugging = loading && !firstLoadComplete
  const totalPages = Math.ceil(certificates.length / itemsPerPage) || 1

  const paginatedCertificates = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return certificates.slice(startIndex, startIndex + itemsPerPage)
  }, [certificates, currentPage])

  const copyToClipboard = (id) => {
    navigator.clipboard.writeText(id)
    toast.success('Certificate ID copied to clipboard!')
  }

  // ── AXIOS DIRECT BASE URL DOWNLOAD ENGINE ──
  const handleDownloadCertificate = async (e, courseId, title) => {
    e.preventDefault()
    
    if (downloadingId) return 
    setDownloadingId(courseId)
    setDownloadProgress(10)

    try {
      const response = await axios.get(`${BASE_URL}/api/certificates/download/${courseId}`, {
        responseType: 'blob', 
        withCredentials: true, 
        headers: {
          'Accept': 'application/pdf'
        },
        onDownloadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            setDownloadProgress(percentage)
          } else {
            setDownloadProgress((prev) => (prev >= 90 ? 90 : prev + 15))
          }
        }
      })

      const fileBlob = new Blob([response.data], { type: 'application/pdf' })
      setDownloadProgress(95)

      const blobUrl = window.URL.createObjectURL(fileBlob)
      const virtualLink = document.createElement('a')
      virtualLink.href = blobUrl
      
      const cleanFileName = title.replace(/[^a-z0-9]/gi, '_').toLowerCase()
      virtualLink.download = `certificate_${cleanFileName}.pdf`
      
      document.body.appendChild(virtualLink)
      virtualLink.click()
      
      document.body.removeChild(virtualLink)
      window.URL.revokeObjectURL(blobUrl)
      setDownloadProgress(100)

    } catch (error) {
      console.error("Direct absolute Axios transmission failed:", error)
      alert('Network loading issue occurred. Trying direct fallback...')
      window.open(`${BASE_URL}/api/certificates/download/${courseId}`, '_blank')
    } finally {
      setTimeout(() => {
        setDownloadingId(null)
        setDownloadProgress(0)
      }, 600)
    }
  }

  if (isInitialPlugging) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <Loading />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#030009] text-slate-100 antialiased selection:bg-amber-500/30 py-10 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* ── BACK BUTTON ROW ── */}
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)} // Navigates cleanly back one step in browser memory history
            className="group flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-amber-400 bg-slate-900/40 hover:bg-slate-900 border border-slate-900 hover:border-amber-500/30 px-3 py-1.5 rounded-xl transition-all active:scale-95 cursor-pointer"
          >
            <FiArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Go Back</span>
          </button>
        </div>
        
        {/* Header Summary Deck */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              <p className="text-xs font-bold text-amber-500 tracking-widest uppercase">Verified Achievements</p>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mt-1">
              Credentials & Certificates
            </h1>
            <p className="text-slate-400 mt-1 text-xs md:text-sm">
              Review, verify, and export academic completion tokens earned on the platform.
            </p>
          </div>
          
          <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 px-4 py-2 rounded-xl self-start md:self-auto">
            <FiAward className="text-amber-400 w-5 h-5" />
            <span className="text-xs font-bold text-slate-300">
              {certificates.length} Earned Documents
            </span>
          </div>
        </div>

        {/* Empty Context Fallback */}
        {certificates.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/20 border border-slate-900 rounded-2xl max-w-2xl mx-auto">
            <div className="w-14 h-14 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4 shadow-inner">
              <FiAward size={28} className="text-amber-400" />
            </div>
            <h2 className="text-xl font-bold text-white">No certificates yet</h2>
            <p className="text-slate-400 mt-1.5 text-xs max-w-sm mx-auto">
              Finish lesson criteria, pass corresponding benchmarks, and your digital badges will populate here automatically.
            </p>
          </div>
        ) : (
          <>
            {/* Cards Matrix Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {paginatedCertificates.map(cert => {
                const formattedDate = new Date(cert.issuedAt).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'short', year: 'numeric'
                })
                const isThisDownloading = downloadingId === cert.course?._id

                return (
                  <div 
                    key={cert._id} 
                    className="flex flex-col bg-slate-900/40 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl hover:border-amber-500/40 transition-all duration-300 group"
                  >
                    {/* Visual Certificate Top Frame */}
                    <div className="relative h-36 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center border-b border-slate-900/80 p-4">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.05),transparent)] pointer-events-none" />
                      <div className="absolute inset-2 border border-slate-800 rounded-xl group-hover:border-amber-500/10 transition-colors" />
                      <FiAward className="absolute text-slate-900/30 w-24 h-24 pointer-events-none -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" />
                      
                      <div className="text-center z-10 space-y-1">
                        <FiAward size={24} className="text-amber-500 mx-auto drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]" />
                        <p className="text-[10px] text-amber-500 font-extrabold uppercase tracking-widest">Completion Certificate</p>
                        <p className="text-white text-xs font-semibold truncate max-w-[240px] px-1">{cert.course?.title}</p>
                      </div>
                    </div>

                    {/* Metadata Information Body */}
                    <div className="p-5 flex flex-col flex-grow space-y-4">
                      <div className="space-y-1 min-h-[44px]">
                        <h3 className="font-bold text-white text-sm line-clamp-2 leading-snug group-hover:text-amber-400 transition-colors" title={cert.course?.title}>
                          {cert.course?.title}
                        </h3>
                        {cert.course?.instructor?.name && (
                          <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                            <FiBookOpen className="text-slate-600" /> by {cert.course.instructor.name}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-900 text-[11px] text-slate-400">
                        <div>
                          <span className="block text-[9px] uppercase font-bold text-slate-600 tracking-wider">Date Issued</span>
                          <span className="font-medium text-slate-300 flex items-center gap-1 mt-0.5">
                            <FiCalendar size={11} className="text-slate-500" /> {formattedDate}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[9px] uppercase font-bold text-slate-600 tracking-wider">Verification</span>
                          <span className="font-mono text-emerald-400 block mt-0.5 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded text-center w-max font-bold text-[10px]">
                            VERIFIED
                          </span>
                        </div>
                      </div>

                      <div className="bg-slate-950/80 rounded-lg px-3 py-2 border border-slate-900 flex items-center justify-between group/id">
                        <div className="truncate pr-2">
                          <p className="text-[9px] uppercase font-bold text-slate-600 tracking-wider">Credential ID</p>
                          <p className="font-mono text-[11px] text-slate-400 truncate mt-0.5">{cert.certificateId}</p>
                        </div>
                        <button 
                          onClick={() => copyToClipboard(cert.certificateId)}
                          className="text-slate-500 hover:text-white p-1 rounded hover:bg-slate-900 cursor-pointer transition-colors"
                          title="Copy Unique Verification Key"
                        >
                          <FiCopy size={12} />
                        </button>
                      </div>

                      {/* Explicitly Tracked Download Trigger */}
                      <div className="pt-2 mt-auto relative">
                        <button
                          onClick={(e) => handleDownloadCertificate(e, cert.course?._id, cert.course?.title)}
                          disabled={downloadingId !== null}
                          className={`w-full flex items-center justify-center gap-2 font-semibold py-2 rounded-xl text-xs tracking-wide transition-all ${
                            isThisDownloading 
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 cursor-wait' 
                              : 'bg-slate-900 hover:bg-amber-500 hover:text-black border border-slate-800 hover:border-amber-500 text-slate-200 cursor-pointer active:scale-[0.98]'
                          }`}
                        >
                          <FiDownload size={13} className={`stroke-[2.5] ${isThisDownloading ? 'animate-spin' : ''}`} /> 
                          <span>
                            {isThisDownloading ? `Downloading ${downloadProgress}%` : 'Download Certificate PDF'}
                          </span>
                        </button>

                        {/* Interactive Visual Progress Base Bar */}
                        {isThisDownloading && (
                          <div className="absolute left-0 right-0 -bottom-1 h-1 bg-slate-900 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-amber-500 transition-all duration-150"
                              style={{ width: `${downloadProgress}%` }}
                            />
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                )
              })}
            </div>

            {/* Pagination Controls */}
            {certificates.length > itemsPerPage && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-slate-900/20 border border-slate-900 rounded-xl text-xs backdrop-blur-md">
                <p className="text-slate-400 text-[11px] text-center sm:text-left">
                  Showing <span className="font-bold text-white">{((currentPage - 1) * itemsPerPage) + 1}</span> to{' '}
                  <span className="font-bold text-white">
                    {Math.min(currentPage * itemsPerPage, certificates.length)}
                  </span>{' '}
                  of {certificates.length} global records
                </p>
                
                <div className="flex items-center gap-1.5">
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                    className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-white disabled:opacity-20 disabled:pointer-events-none transition-all active:scale-95 cursor-pointer"
                  >
                    <HiChevronLeft size={16} />
                  </button>
                  
                  <span className="px-3 py-1 bg-slate-950 border border-slate-800/80 rounded-md font-mono text-[11px] font-bold text-slate-300">
                    Page {currentPage} / {totalPages}
                  </span>
                  
                  <button 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => p + 1)}
                    className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-white disabled:opacity-20 disabled:pointer-events-none transition-all active:scale-95 cursor-pointer"
                  >
                    <HiChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}