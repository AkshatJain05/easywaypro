import React from "react";
import { Link } from "react-router-dom";
import { MdArrowOutward } from "react-icons/md";
import { FaYoutube, FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";
import logoEasyway from "../assets/logoEasyway.png"


const quickLinks = [
  { to: "/notes", label: "Notes" },
  { to: "/quiz", label: "Quizzes" },
  { to: "/video-lectures", label: "Video Lectures" },
  { to: "/pyq", label: "PYQs" },
];

const supportLinks = [
  { to: "/contact-us", label: "Contact Us" },
  { to: "/privacy-policy", label: "Privacy Policy" },
  { to: "/TAC", label: "Terms & Conditions" },
  { to: "/syllabus", label: "Syllabus" },
];

const socials = [
  { icon: FaYoutube, href: "https://www.youtube.com/@EasywayClasses2.0", label: "YouTube", color: "hover:text-red-500" },
  { icon: FaGithub, href: "#", label: "GitHub", color: "hover:text-white" },
  { icon: FaLinkedin, href: "#", label: "LinkedIn", color: "hover:text-blue-400" },
  { icon: FaInstagram, href: "#", label: "Instagram", color: "hover:text-pink-500" },
];

function Footer() {
  return (
    <footer className="relative w-full bg-[#030009] text-slate-300 overflow-hidden pt-12">
      {/* ── Decorative Background Elements ── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-sky-500/50 to-transparent" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-48 bg-sky-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-8xl mx-auto px-6 lg:px-20 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* ── Brand Section ── */}
          <div className="lg:col-span-5 space-y-5">
            <div className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-sky-500/20 blur-lg rounded-xl transition-all group-hover:bg-sky-500/40"></div>
                <div className="relative h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md">
                   <img src={logoEasyway} alt="Logo" className="h-8 w-8 object-contain" />
                   {/* <span className="text-sky-400 font-bold">E</span> */}
                </div>
              </div>
              <div className="flex flex-col">
                <h2 className="text-2xl font-black tracking-tight flex items-center">
                  <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    Easyway
                  </span>
                  <span className="text-white ml-1">Pro</span>
                </h2>
                <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">Smart Learning </span>
              </div>
            </div>

            <p className="text-sm text-gray-400 max-w-sm text-justify">
             Easyway Classes is your smart learning companion, offering tools like AI chatbot, code analyzer, quizzes, and study material to make learning effortless and engaging.
            </p>

            <div className="flex items-center gap-3">
              {socials.map(({ icon: Icon, href, label, color }) => (
                <a
                  key={label}
                  href={href}
                  className={`h-10 w-10 flex items-center justify-center rounded-xl bg-white/[0.03] border border-white/10 text-gray-500 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.08] hover:border-sky-500/30 ${color}`}
                  aria-label={label}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* ── Links Sections ── */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div className="space-y-5">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/90">Platform</h3>
              <ul className="space-y-3">
                {quickLinks.map(({ to, label }) => (
                  <li key={to}>
                    <Link to={to} className="group flex items-center gap-2 text-[14px] text-gray-400 hover:text-sky-400 transition-colors">
                      <span className="h-px w-0 bg-sky-400 transition-all duration-300 group-hover:w-3" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-5">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/90">Support</h3>
              <ul className="space-y-3">
                {supportLinks.map(({ to, label }) => (
                  <li key={to}>
                    <Link to={to} className="group flex items-center gap-2 text-[14px] text-gray-400 hover:text-sky-400 transition-colors">
                      <span className="h-px w-0 bg-sky-400 transition-all duration-300 group-hover:w-3" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1 space-y-5">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/90">Join Our Mission</h3>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 space-y-3">
                <p className="text-[11px] text-gray-400 italic">Want to contribute notes or lectures?</p>
                <Link to="/contact-us" className="w-full py-2 px-3 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 text-sky-400 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2">
                  Contact Us <MdArrowOutward />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="border-t border-white/5 py-3 bg-black/40 backdrop-blur-md">
        <div className="max-w-8xl mx-auto px-4 md:px-20 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <p className="text-[11px] text-gray-300 font-medium tracking-wide">
              © {new Date().getFullYear()} Easyway Classes. All rights reserved.
            </p>
            <p className="text-[10px] text-gray-500">
              Designed & Developed by <span className="text-gray-500">Akshat Jain</span>
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-[10px] text-gray-300  max-w-[260px] leading-relaxed text-center md:text-right">
              <span className="text-sky-600 font-bold uppercase mr-1">Notice:</span> 
              AI-generated answers and Algorithm Visualizer may contain mistakes. Verify before use.
            </div>
            <div className="h-6 w-px bg-white/5 hidden sm:block" />
            <div className="flex items-center gap-2 ">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <span className="text-[12px] font-bold text-emerald-500/80 uppercase tracking-widest hidden">Systems Online</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;