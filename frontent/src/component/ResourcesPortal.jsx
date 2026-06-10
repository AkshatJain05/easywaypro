import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // 1. Hook import kiya browser history ke liye
import { 
  FiFileText, 
  FiMap, 
  FiBookOpen, 
  FiFolder, 
  FiVideo, 
  FiUserCheck, 
  FiCpu, 
  FiCode, 
  FiAward, 
  FiActivity, 
  FiCheckSquare, 
  FiHelpCircle,
  FiArrowUpRight,
  FiSearch,
  FiX,
  FiChevronLeft // Back button ke arrow ke liye icon
} from 'react-icons/fi';

export default function ResourcesPortal() {
  const navigate = useNavigate(); // 2. Navigation controller initialize kiya
  
  // Search query state
  const [searchQuery, setSearchQuery] = useState('');
  
  // 1. CORE ACADEMIC RESOURCES
  const academicResources = [
    { title: 'Documentation Hub', desc: 'Core technical docs & reference sheets.', link: '/docs', icon: <FiFileText className="text-blue-400" /> },
    { title: 'Learning Roadmaps', desc: 'Step-by-step career path guidelines.', link: '/roadmap', icon: <FiMap className="text-emerald-400" /> },
    { title: 'Premium Notes', desc: 'Curated comprehensive topic breakdowns.', link: '/notes', icon: <FiBookOpen className="text-indigo-400" /> },
    { title: 'Course Syllabus', desc: 'Complete structural breakdown of chapters.', link: '/syllabus', icon: <FiFolder className="text-amber-400" /> },
    { title: 'Previous Year PYQs', desc: 'Exam archives and structured questions.', link: '/pyq', icon: <FiAward className="text-violet-400" /> },
    { title: 'Video Lectures', desc: 'High definition on-demand masterclasses.', link: '/video-lectures', icon: <FiVideo className="text-rose-400" /> },
  ];

  // 2. INTELLIGENT AI & DEVELOPMENT UTILITIES
  const premiumUtilities = [
    { title: 'AI Resume Builder', desc: 'Craft production-ready professional CVs.', link: '/resume/dashboard', icon: <FiUserCheck className="text-cyan-400" /> },
    { title: 'EWP AI Chatbot', desc: '24/7 intelligent contextual assistance.', link: '/chatBot', icon: <FiCpu className="text-purple-400" /> },
    { title: 'Smart Code Analyzer', desc: 'Scan code for efficiency and bugs.', link: '/code-analyzer', icon: <FiCode className="text-teal-400" /> },
    { title: 'Interactive Quizzes', desc: 'Test real-time understanding & metrics.', link: '/quizzes', icon: <FiAward className="text-pink-400" /> },
    { title: 'Algorithm Visualizer', desc: 'Analyze time complexities visually.', link: '/algorithm-visualizer', icon: <FiActivity className="text-orange-400" /> },
    { title: 'Task Planner', desc: 'Manage workflows and active progress.', link: '/task-planner', icon: <FiCheckSquare className="text-lime-400" /> },
  ];

  // Search filter logic
  const filteredAcademics = academicResources.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUtilities = premiumUtilities.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hasResults = filteredAcademics.length > 0 || filteredUtilities.length > 0;

  return (
    <div className="min-h-screen bg-black text-slate-100 font-sans antialiased selection:bg-blue-600/30 selection:text-blue-200 overflow-x-hidden relative">
      
      {/* Decorative Ambient Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-12">
        
        {/* PREMIUM BACK BUTTON ROW */}
        <div className="flex items-center justify-start">
          <button
            onClick={() => navigate(-1)} // History mein 1 step piche jaane ke liye
            className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/40 hover:bg-slate-900/90 border border-slate-800/60 hover:border-slate-700/80 text-slate-400 hover:text-slate-200 text-[10px] font-black uppercase tracking-wider transition-all duration-200 active:scale-[0.97]"
          >
            <FiChevronLeft size={14} className="text-slate-500 group-hover:text-slate-300 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to Dashboard</span>
          </button>
        </div>

        {/* COMPACT HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-slate-900 pb-8">
          <div className="space-y-2.5 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-slate-900 to-slate-900/60 border border-slate-800/80 px-3 py-1 rounded-full text-[9px] font-black tracking-[0.18em] uppercase text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981] animate-pulse" />
              Easyway Pro Nexus
            </div>
            <h1 className="text-3xl font-black tracking-tight bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
              Centralized Resource Hub
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              Access engineering core assets, AI sandbox utilities, and support desk portals.
            </p>
          </div>

          {/* DYNAMIC SEARCH BAR MATRIC */}
          <div className="relative w-full md:w-80 group">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
              <FiSearch size={14} />
            </span>
            <input 
              type="text"
              placeholder="Search tools & resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/40 border border-slate-800/80 focus:border-blue-500/40 rounded-xl pl-10 pr-9 py-2.5 text-xs text-slate-200 placeholder-slate-500 outline-none focus:ring-4 focus:ring-blue-500/5 transition-all duration-300 shadow-inner"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-300 transition-colors"
              >
                <FiX size={14} />
              </button>
            )}
          </div>
        </div>

        {/* EMPTY STATE RESULTS CASE */}
        {!hasResults && (
          <div className="text-center py-16 border border-dashed border-slate-900 rounded-2xl bg-slate-950/20 max-w-md mx-auto">
            <div className="h-8 w-8 rounded-full bg-slate-900 flex items-center justify-center mx-auto mb-3 border border-slate-800">
              <FiX size={14} className="text-slate-600" />
            </div>
            <p className="text-xs text-slate-400 font-bold tracking-wide">No modular assets match your search</p>
            <p className="text-[11px] text-slate-600 mt-1">Try double checking your keywords syntax queries.</p>
          </div>
        )}

        {/* SECTION 1: STUDY MATERIAL & SYLLABUS GRID */}
        {filteredAcademics.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pl-1">
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 border-l-2 border-blue-500 pl-2.5">Academic Essentials</h2>
              <span className="text-[10px] text-slate-600 font-mono bg-slate-900/50 border border-slate-800/40 px-2 py-0.5 rounded-md">{filteredAcademics.length} Modules</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAcademics.map((item, idx) => (
                <div 
                  key={idx}
                  className="group bg-slate-900/20 border border-slate-900/80 hover:border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 hover:bg-slate-900/40 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-black/40 relative overflow-hidden"
                >
                  {/* Card Glow Underlay */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/2 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="flex gap-4 items-start relative z-10">
                    <div className="w-9 h-9 shrink-0 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-base shadow-xl group-hover:scale-105 transition-all duration-300 group-hover:border-slate-700">
                      {item.icon}
                    </div>
                    <div className="space-y-1 min-w-0">
                      <h3 className="text-[13px] font-black text-slate-200 group-hover:text-white transition-colors truncate tracking-wide">
                        {item.title}
                      </h3>
                      <p className="text-[11px] text-slate-400 font-medium leading-relaxed line-clamp-2 pr-1">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                  
                  {/* COMPACT MINI ACTION BUTTON */}
                  <div className="mt-4 pt-3 border-t border-slate-900/80 flex items-center justify-end relative z-10">
                    <a 
                      href={item.link}
                      className="inline-flex items-center gap-1.5 bg-slate-950/80 hover:bg-blue-600 border border-slate-800/80 hover:border-blue-500 text-slate-400 hover:text-white font-black text-[10px] uppercase tracking-wider py-1.5 px-3 rounded-lg transition-all duration-200 group-hover:shadow-lg group-hover:shadow-blue-950/20"
                    >
                      <span>Explore</span>
                      <FiArrowUpRight size={11} className="text-slate-500 group-hover:text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 2: INTELLIGENT DEV UTILITIES & AI TOOLS */}
        {filteredUtilities.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pl-1">
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 border-l-2 border-indigo-500 pl-2.5">AI Sandbox & Utilities</h2>
              <span className="text-[10px] text-slate-600 font-mono bg-slate-900/50 border border-slate-800/40 px-2 py-0.5 rounded-md">{filteredUtilities.length} Modules</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredUtilities.map((item, idx) => (
                <div 
                  key={idx}
                  className="group bg-slate-900/20 border border-slate-900/80 hover:border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 hover:bg-slate-900/40 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-black/40 relative overflow-hidden"
                >
                  {/* Card Glow Underlay */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/2 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="flex gap-4 items-start relative z-10">
                    <div className="w-9 h-9 shrink-0 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-base shadow-xl group-hover:scale-105 transition-all duration-300 group-hover:border-slate-700">
                      {item.icon}
                    </div>
                    <div className="space-y-1 min-w-0">
                      <h3 className="text-[13px] font-black text-slate-200 group-hover:text-white transition-colors truncate tracking-wide">
                        {item.title}
                      </h3>
                      <p className="text-[11px] text-slate-400 font-medium leading-relaxed line-clamp-2 pr-1">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                  
                  {/* COMPACT MINI ACTION BUTTON */}
                  <div className="mt-4 pt-3 border-t border-slate-900/80 flex items-center justify-end relative z-10">
                    <a 
                      href={item.link}
                      className="inline-flex items-center gap-1.5 bg-slate-950/80 hover:bg-indigo-600 border border-slate-800/80 hover:border-indigo-500 text-slate-400 hover:text-white font-black text-[10px] uppercase tracking-wider py-1.5 px-3 rounded-lg transition-all duration-200 group-hover:shadow-lg group-hover:shadow-indigo-950/20"
                    >
                      <span>Launch</span>
                      <FiArrowUpRight size={11} className="text-slate-500 group-hover:text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 3: COMPACT ADMIN CARE STRIP */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900/40 to-slate-950 border border-slate-900 rounded-2xl p-5 shadow-2xl shadow-black/30 flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative overflow-hidden group/strip">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-indigo-500/2 to-purple-500/0 opacity-0 group-hover/strip:opacity-100 transition-opacity duration-500" />
          
          <div className="flex gap-4 items-center relative z-10">
            <div className="p-2.5 bg-slate-950 border border-slate-800/80 rounded-xl text-blue-400 shadow-xl shrink-0 group-hover/strip:border-slate-700 transition-colors duration-300">
              <FiHelpCircle size={18} />
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-black text-white tracking-wide uppercase">
                Need Admin Care Support?
              </h3>
              <p className="text-[11px] text-slate-400 font-medium max-w-xl leading-relaxed">
                Facing setup anomalies, billing queries, or account problems? Open an active tracking support ticket.
              </p>
            </div>
          </div>
          
          <Link 
            to="/contact-us"
            className="relative z-10 inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-[10px] uppercase tracking-widest px-5 py-2.5 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-indigo-950/40 whitespace-nowrap text-center"
          >
            <span>Contact Desk</span>
            <FiArrowUpRight size={12} />
          </Link>
        </div>

      </div>
    </div>
  );
}