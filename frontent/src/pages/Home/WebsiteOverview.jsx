import { useState } from "react";
import {
  FaClock,
  FaRegQuestionCircle,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { FaExternalLinkAlt } from "react-icons/fa";
import {
  FaFileAlt,
  FaRobot,
  FaBook,
  FaPlayCircle,
  FaClipboardList,
  FaCheckCircle,
  FaProjectDiagram,
  FaMap,
  FaFolderOpen,
  FaTasks,
  FaFileInvoice,
  FaCode,
} from "react-icons/fa";

export default function WebsiteOverview() {
  const featuresData = [
    {
      name: "Notes",
      description:
        "Access curated study notes for various subjects and topics.",
      icon: FaFileAlt,
      viewLink: "/notes",
    },
    {
      name: "PYQ",
      description:
        "Previous Year Questions to practice and strengthen your concepts.",
      icon: FaClipboardList,
      viewLink: "/pyq",
    },
    {
      name: "Video Lecture",
      description:
        "Watch curated video lectures to understand topics visually.",
      icon: FaPlayCircle,
      viewLink: "/video-lectures",
    },
    {
      name: "Syllabus",
      description:
        "Complete syllabus for each course and subject at one place.",
      icon: FaBook,
      viewLink: "/syllabus",
    },
    {
      name: "Quizzes",
      description:
        "Attempt timed quizzes to test your knowledge and improve speed.",
      icon: FaCheckCircle,
      viewLink: "/quiz",
    },
    {
      name: "Quiz Test for Certificate",
      description:
        "Take quizzes and earn certificates upon successful completion.",
      icon: FaClipboardList,
      viewLink: "/quizzes",
    },
    {
      name: "Algorithm Visualizer",
      description: "Visualize and understand algorithms step by step.",
      icon: FaProjectDiagram,
      viewLink: "/algorithm-visualizer",
    },
    {
      name: "Roadmap",
      description:
        "Structured roadmap to plan your learning journey effectively.",
      icon: FaMap,
      viewLink: "/roadmap",
    },
    {
      name: "Documentation Hub",
      description: "Central hub for all guides, documentation, and references.",
      icon: FaFolderOpen,
      viewLink: "/docs",
    },
    {
      name: "Task Planner",
      description: "Plan, track, and complete your daily tasks efficiently.",
      icon: FaTasks,
      viewLink: "/task-planner",
    },
    {
      name: "Resume Builder",
      description: "Create, customize, and print professional resumes quickly.",
      icon: FaFileInvoice,
      viewLink: "/resume-builder",
    },
    {
      name: "AI Chatbot",
      description:
        "Get instant help with coding, concepts, and interview tips.",
      icon: FaRobot,
      viewLink: "/chatBot",
    },
    {
      name: "Code Analyzer",
      description: "Analyze, debug, and optimize your code effectively.",
      icon: FaCode,
      viewLink: "/code-analyzer",
    },
  ];

  const steps = [
    {
      id: 1,
      title: "Create an account",
      desc: "Sign up with your email and get instant access.",
    },
    {
      id: 2,
      title: "Explore tools",
      desc: "Use resume builder, notes, AI chat, and more.",
    },
    {
      id: 3,
      title: "Practice & Learn",
      desc: "Access PYQs, analyze code, and strengthen concepts.",
    },
    {
      id: 4,
      title: "Build & Apply",
      desc: "Prepare resumes, practice coding, and apply confidently.",
    },
  ];

  const faqs = [
    { q: "Is Easyway Classes free to use?", a: "Yes, most features are free." },
    {
      q: "Can I print or save my resume as PDF?",
      a: "Yes, you can print or save resumes in PDF format.",
    },
    {
      q: "Does the AI chatbot help with coding?",
      a: "Yes, it can explain concepts, debug code, and give learning tips.",
    },
    {
      q: "Are notes and PYQs updated regularly?",
      a: "Yes, our team frequently updates study materials and question banks.",
    },
  ];

  const [openFAQ, setOpenFAQ] = useState(null);
  const toggleFAQ = (index) => setOpenFAQ(openFAQ === index ? null : index);

  // Variants for scroll animations
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, type: "spring", stiffness: 120 },
    }),
  };

  return (
    <div className="min-h-screen  text-slate-100">
      {/* Overview Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-3xl font-extrabold mb-4 text-center text-white">
          How Easyway Works
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-center mb-12">
          Easyway Classes brings together everything you need — from resumes to
          AI-powered study tools. Here’s a simple journey:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={s.id}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={cardVariants}
              className="px-4 py-5 bg-gradient-to-br from-gray-950 to-black rounded-2xl shadow-md border border-slate-700 text-center cursor-pointer
                         hover:scale-105 hover:shadow-xl transition-transform duration-300"
            >
              <div className="flex justify-center mb-4 text-indigo-300 text-3xl">
                <FaClock />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-white">
                {s.title}
              </h3>
              <p className="text-sm text-slate-400">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-3xl font-extrabold mb-4 text-center text-white">
          Why Choose Easyway?
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-center mb-12">
          Designed for students, freshers, and learners — here’s why Easyway
          Classes stands out:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "All-in-One Platform",
              desc: "Resume builder, AI chatbot, PYQs, notes, and coding Analyzer all in one place.",
            },
            {
              title: "Student-Friendly",
              desc: "Simple UI, free resources, and guides crafted for students and beginners.",
            },
            {
              title: "Regular Updates",
              desc: "Our team adds new notes, PYQs, and roadmap regularly.",
            },
            {
              title: "Daily Tasks",
              desc: "Stay on track with Easyway – plan, manage, and complete your study goals every day.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={cardVariants}
              className="bg-gradient-to-br from-gray-950 to-black p-6 rounded-xl shadow-md border border-slate-700 text-center
                         hover:scale-105 hover:shadow-xl transition-transform duration-300"
            >
              <h3 className="font-semibold mb-2 text-white">{item.title}</h3>
              <p className="text-sm text-slate-400">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* All Features Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 border border-gray-800 rounded-3xl">
        <h2 className="text-3xl font-extrabold mb-4 text-center text-white">
          {" "}
          All Features Overview
        </h2>
        <p className="text-slate-400 text-center mb-10">
          Access all core tools in one place. Hover rows for better readability.
        </p>

        <div className="bg-gradient-to-br from-gray-950 to-black rounded-xl shadow-2xl border border-gray-700 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gradient-to-br from-gray-950 to-black">
              <tr>
                <th className="px-6 py-3 text-left text-md font-bold text-white uppercase tracking-wider">
                  Feature
                </th>
                <th className="px-6 py-3 text-left text-md font-bold  text-white uppercase tracking-wider hidden sm:table-cell">
                  Description
                </th>
                <th className="px-6 py-3 text-center text-md text-bold font-medium text-white uppercase tracking-wider">
                  View
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {featuresData.map((feature, index) => (
                <tr
                  key={index}
                  className="bg-gradient-to-br from-gray-950 to-black hover:bg-gray-700 transition duration-300 cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-md font-medium text-white flex items-center gap-3">
                    <feature.icon className="text-indigo-50 text-md" />
                    {feature.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300 hidden sm:table-cell">
                    {feature.description}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <a
                      href={feature.viewLink}
                      className="inline-flex items-center px-3 py-1 bg-slate-950 border border-gray-700   hover:bg-slate-900 text-white text-sm font-semibold rounded-md transition"
                    >
                      Go <FaExternalLinkAlt className="ml-1 text-xs" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-3xl font-extrabold mb-4 text-center text-white">
          Frequently Asked Questions
        </h2>
        <p className="text-slate-400 text-center mb-10">
          Quick answers to common queries
        </p>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={cardVariants}
              className="bg-gradient-to-br from-gray-950 to-black rounded-xl shadow border border-slate-700"
            >
              <button
                onClick={() => toggleFAQ(i)}
                className="w-full flex justify-between items-center p-4 text-left"
              >
                <div className="flex items-center gap-2">
                  <FaRegQuestionCircle className="text-indigo-300" />
                  <span className="font-semibold text-white">{faq.q}</span>
                </div>
                {openFAQ === i ? (
                  <FaChevronUp className="text-slate-400" />
                ) : (
                  <FaChevronDown className="text-slate-400" />
                )}
              </button>
              <AnimatePresence>
                {openFAQ === i && (
                  <div className="px-4 pb-4 text-sm text-slate-300 overflow-hidden">
                    {faq.a}
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
