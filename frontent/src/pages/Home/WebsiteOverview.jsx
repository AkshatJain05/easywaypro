import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaFileAlt, FaRobot, FaBook, FaPlayCircle,
  FaClipboardList, FaCheckCircle, FaProjectDiagram,
  FaMap, FaFolderOpen, FaTasks, FaFileInvoice, FaCode,
} from "react-icons/fa";
import {
  MdOutlineArrowOutward, MdExpandMore, MdExpandLess,
  MdHelpOutline,
} from "react-icons/md";

// ─── Data ────────────────────────────────────────────────────────────────────

const featuresData = [
  { name: "Notes",                    icon: FaFileAlt,        viewLink: "/notes",                description: "Access curated study notes for various subjects and topics." },
  { name: "PYQ",                      icon: FaClipboardList,  viewLink: "/pyq",                  description: "Previous Year Questions to practice and strengthen your concepts." },
  { name: "Video Lecture",            icon: FaPlayCircle,     viewLink: "/video-lectures",       description: "Watch curated video lectures to understand topics visually." },
  { name: "Syllabus",                 icon: FaBook,           viewLink: "/syllabus",             description: "Complete syllabus for each course and subject at one place." },
  { name: "Quizzes",                  icon: FaCheckCircle,    viewLink: "/quiz",                 description: "Attempt timed quizzes to test your knowledge and improve speed." },
  { name: "Quiz for Certificate",     icon: FaClipboardList,  viewLink: "/quizzes",              description: "Take quizzes and earn certificates upon successful completion." },
  { name: "Algorithm Visualizer",     icon: FaProjectDiagram, viewLink: "/algorithm-visualizer", description: "Visualize and understand algorithms step by step." },
  { name: "Roadmap",                  icon: FaMap,            viewLink: "/roadmap",              description: "Structured roadmap to plan your learning journey effectively." },
  { name: "Documentation Hub",        icon: FaFolderOpen,     viewLink: "/docs",                 description: "Central hub for all guides, documentation, and references." },
  { name: "Task Planner",             icon: FaTasks,          viewLink: "/task-planner",         description: "Plan, track, and complete your daily tasks efficiently." },
  { name: "Resume Builder",           icon: FaFileInvoice,    viewLink: "/resume-builder",       description: "Create, customize, and print professional resumes quickly." },
  { name: "AI Chatbot",               icon: FaRobot,          viewLink: "/easyway-ai",           description: "Get instant help with coding, concepts, and interview tips." },
  { name: "Code Analyzer",            icon: FaCode,           viewLink: "/code-analyzer",        description: "Analyze, debug, and optimize your code effectively." },
];

const steps = [
  { id: 1, emoji: "✦", title: "Create Account",  desc: "Sign up with your email and get instant access to all tools." },
  { id: 2, emoji: "⬡", title: "Explore Tools",   desc: "Use resume builder, notes, AI chat, and more." },
  { id: 3, emoji: "◈", title: "Practice & Learn", desc: "Access PYQs, analyze code, and strengthen concepts." },
  { id: 4, emoji: "◎", title: "Build & Apply",    desc: "Prepare resumes, practice coding, and apply confidently." },
];

const whyUs = [
  { title: "All-in-One Platform", desc: "Resume builder, AI chatbot, PYQs, notes, and code analyzer — all in one place.", color: "text-sky-400",    border: "rgba(56,189,248,0.2)",   bg: "rgba(56,189,248,0.06)"   },
  { title: "Student-Friendly",    desc: "Simple UI, free resources, and guides crafted for students and beginners.",       color: "text-indigo-400", border: "rgba(129,140,248,0.2)", bg: "rgba(129,140,248,0.06)" },
  { title: "Regular Updates",     desc: "Our team adds new notes, PYQs, and roadmap regularly.",                           color: "text-emerald-400", border: "rgba(52,211,153,0.2)", bg: "rgba(52,211,153,0.06)" },
  { title: "Daily Task Tracking", desc: "Plan, manage, and complete your study goals every day with the task planner.",    color: "text-amber-400",  border: "rgba(251,191,36,0.2)",  bg: "rgba(251,191,36,0.06)"  },
];

const faqs = [
  { q: "Is Easyway Classes free to use?",         a: "Yes, most features are completely free to use with no hidden charges." },
  { q: "Can I print or save my resume as PDF?",   a: "Yes, you can print or save resumes in PDF format directly from the resume builder." },
  { q: "Does the AI chatbot help with coding?",   a: "Yes, it can explain concepts, debug code, and give personalized learning tips." },
  { q: "Are notes and PYQs updated regularly?",   a: "Yes, our team frequently updates study materials and question banks." },
];

// ─── Shared animation variants ────────────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  }),
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function SectionHeader({ badge, title, highlight, subtitle }) {
  return (
    <div className="text-center mb-10">
      <div className="flex justify-center mb-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
          style={{ background: "rgba(14,165,233,0.08)", border: "1px solid rgba(14,165,233,0.18)", color: "#7dd3fc" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
          {badge}
        </span>
      </div>
      <h2 className="syne text-2xl sm:text-3xl font-extrabold text-white">
        {title}{" "}
        {highlight && (
          <span style={{
            background: "linear-gradient(135deg,#38bdf8 0%,#818cf8 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>{highlight}</span>
        )}
      </h2>
      {subtitle && <p className="mt-2.5 text-sm text-gray-500 max-w-xl mx-auto leading-relaxed">{subtitle}</p>}
      <div className="mt-5 h-px max-w-[180px] mx-auto bg-gradient-to-r from-transparent via-sky-500/25 to-transparent" />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function WebsiteOverview() {
  const [openFAQ, setOpenFAQ] = useState(null);

  return (
    <>
      <style>{`
        // @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Inter:wght@400;500;600&display=swap');
        .overview-root { font-family: 'Inter', sans-serif; }
        .syne { font-family: 'Syne', sans-serif; }

        .card-base {
          background: #0a0a14;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
        }
        .card-base:hover {
          transform: translateY(-3px);
          border-color: rgba(14,165,233,0.22);
          box-shadow: 0 10px 28px -6px rgba(14,165,233,0.1);
        }

        /* step number */
        .step-num {
          font-family: 'Syne', sans-serif;
          font-size: 2.5rem;
          font-weight: 800;
          line-height: 1;
          background: linear-gradient(135deg, rgba(56,189,248,0.25), rgba(129,140,248,0.15));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* table row hover */
        .feat-row { transition: background 0.18s ease; }
        .feat-row:hover { background: rgba(14,165,233,0.05); }

        /* FAQ */
        .faq-item {
          background: #0a0a14;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          overflow: hidden;
          transition: border-color 0.2s ease;
        }
        .faq-item.faq-open { border-color: rgba(14,165,233,0.25); }

        /* Dot-grid bg */
        .dot-bg {
          background-image: radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 26px 26px;
        }
      `}</style>

      <div className="overview-root min-h-screen bg-[#030009] text-white">

        {/* ══════════════════════════════════════
            SECTION 1 — How It Works
        ══════════════════════════════════════ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-20">
          <SectionHeader
            badge="Getting Started"
            title="How Easyway"
            highlight="Works"
            subtitle="Easyway brings together everything you need — from resumes to AI-powered study tools. Here's your journey:"
          />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((s, i) => (
              <motion.div
                key={s.id}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeUp}
                className="card-base p-5 sm:p-6 flex flex-col gap-3"
              >
                {/* Step emoji + number */}
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{s.emoji}</span>
                  <span className="step-num">0{s.id}</span>
                </div>
                <div>
                  <h3 className="syne text-sm sm:text-base font-bold text-white mb-1">{s.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
                {/* connector bar */}
                <div className="mt-auto h-0.5 w-full rounded-full bg-gradient-to-r from-sky-500/30 to-transparent" />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
        </div>

        {/* ══════════════════════════════════════
            SECTION 2 — Why Choose Us
        ══════════════════════════════════════ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-20">
          <SectionHeader
            badge="Why Us"
            title="Why Choose"
            highlight="Easyway?"
            subtitle="Designed for students, freshers, and learners — here's why Easyway Classes stands out:"
          />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {whyUs.map((item, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeUp}
                className="card-base p-5 sm:p-6 flex flex-col gap-3"
                style={{ "--hover-border": item.border }}
              >
                {/* Accent dot */}
                <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: item.bg, border: `1px solid ${item.border}` }}>
                  <span className={`text-lg ${item.color}`}>✦</span>
                </div>
                <div>
                  <h3 className={`syne text-sm sm:text-base font-bold mb-1 ${item.color}`}>{item.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
        </div>

        {/* ══════════════════════════════════════
            SECTION 3 — All Features Table
        ══════════════════════════════════════ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-20">
          <SectionHeader
            badge="All Features"
            title="Features"
            highlight="Overview"
            subtitle="Access all core tools in one place. Everything you need, listed clearly."
          />

          <div className="rounded-2xl overflow-hidden border border-white/[0.07]"
            style={{ background: "#020108" }}>
            {/* Table header */}
            <div className="grid grid-cols-[1fr_2fr_80px] sm:grid-cols-[1.2fr_2.5fr_90px] gap-0 px-5 py-3 border-b border-white/[0.07]"
              style={{ background: "rgba(14,165,233,0.04)" }}>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Feature</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 hidden sm:block">Description</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 text-center">Link</span>
            </div>

            {/* Rows */}
            {featuresData.map((f, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={fadeUp}
                className={`feat-row grid grid-cols-[1fr_80px] sm:grid-cols-[1.2fr_2.5fr_90px] gap-0 items-center px-5 py-3.5 ${
                  i < featuresData.length - 1 ? "border-b border-white/[0.04]" : ""
                }`}
              >
                {/* Name + icon */}
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center"
                    style={{ background: "rgba(14,165,233,0.08)", border: "1px solid rgba(14,165,233,0.14)" }}>
                    <f.icon className="text-sky-400 text-xs" />
                  </div>
                  <span className="text-sm font-semibold text-white truncate syne">{f.name}</span>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-300 leading-relaxed line-clamp-2 hidden sm:block pr-4">
                  {f.description}
                </p>

                {/* CTA */}
                <div className="flex justify-center">
                  <Link
                    to={f.viewLink}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-sky-400 transition-all duration-200 hover:text-sky-300"
                    style={{ background: "rgba(14,165,233,0.08)", border: "1px solid rgba(14,165,233,0.15)" }}
                  >
                    Open <MdOutlineArrowOutward size={11} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
        </div>

        {/* ══════════════════════════════════════
            SECTION 4 — FAQ
        ══════════════════════════════════════ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-20">
          <SectionHeader
            badge="FAQ"
            title="Frequently Asked"
            highlight="Questions"
            subtitle="Quick answers to common queries about Easyway Pro."
          />

          <div className="space-y-3">
            {faqs.map((faq, i) => {
              const isOpen = openFAQ === i;
              return (
                <motion.div
                  key={i}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={fadeUp}
                  className={`faq-item ${isOpen ? "faq-open" : ""}`}
                >
                  <button
                    onClick={() => setOpenFAQ(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-md flex-shrink-0 flex items-center justify-center"
                        style={{ background: "rgba(14,165,233,0.08)", border: "1px solid rgba(14,165,233,0.15)" }}>
                        <MdHelpOutline className="text-sky-400 text-xs" />
                      </div>
                      <span className="text-sm font-semibold text-white leading-snug">{faq.q}</span>
                    </div>
                    <span className="flex-shrink-0 text-gray-500">
                      {isOpen ? <MdExpandLess size={20} /> : <MdExpandMore size={20} />}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="answer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        style={{ overflow: "hidden" }}
                      >
                        <div className="px-5 pb-4 ml-9 text-sm text-gray-400 leading-relaxed border-t border-white/[0.04] pt-3">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </section>

      </div>
    </>
  );
}