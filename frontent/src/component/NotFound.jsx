import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHome } from "react-icons/fa";

export default function NotFound() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[#030014] text-white px-6 overflow-hidden">
      
      {/* ── VISUAL EFFECTS ── */}
      {/* Cyber Grid Background */}
      <div className="absolute inset-0 z-0 opacity-20" 
           style={{ backgroundImage: `linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)`, 
           backgroundSize: '40px 40px', maskImage: 'radial-gradient(ellipse at center, black, transparent 80%)' }} 
      />
      
      {/* Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-500/10 blur-[120px] rounded-full animate-pulse delay-700" />

      {/* ── CONTENT ── */}
      <div className="relative z-10 text-center">
        
        {/* Animated Icon */}
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="inline-block p-4 rounded-3xl bg-white/5 border border-white/10 mb-8"
        >
        </motion.div>

        {/* Glitchy 404 Header */}
        <h1 className="text-[10rem] md:text-[14rem] font-black leading-none tracking-tighter select-none relative">
          <span className="bg-gradient-to-b from-white to-slate-800 bg-clip-text text-transparent opacity-20">
            404
          </span>
          {/* Overlaid Glitch Text */}
          <span className="absolute inset-0 flex items-center justify-center text-white drop-shadow-[0_0_15px_rgba(34,211,238,0.3)] animate-pulse">
            404
          </span>
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-4">
            System <span className="text-cyan-400">Desync</span> Detected
          </h2>
          <p className="text-slate-400 mb-10 text-center max-w-sm mx-auto text-sm leading-relaxed font-medium uppercase tracking-widest">
            The coordinates you requested do not exist in the Easyway Pro database.
          </p>
        </motion.div>

        {/* Premium CTA */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link
            to="/"
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-black uppercase text-xs tracking-[0.2em] rounded-2xl transition-all hover:bg-cyan-400 hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] overflow-hidden"
          >
            {/* Hover Shine Effect */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            
            <FaHome className="text-lg" />
            Return to Command Center
          </Link>
        </motion.div>

        {/* Bottom Technical Label */}
        <p className="mt-16 text-[10px] text-slate-600 font-bold tracking-[0.5em] uppercase opacity-50">
          Error_Code: 0x404_NULL_POINTER
        </p>
      </div>
    </div>
  );
}