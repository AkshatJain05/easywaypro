import { useState } from "react";
import { FaClock, FaRegQuestionCircle, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function WebsiteOverview() {
  const steps = [
    { id: 1, title: "Create an account", desc: "Sign up with your email and get instant access." },
    { id: 2, title: "Explore tools", desc: "Use resume builder, notes, AI chat, and more." },
    { id: 3, title: "Practice & Learn", desc: "Access PYQs, analyze code, and strengthen concepts." },
    { id: 4, title: "Build & Apply", desc: "Prepare resumes, practice coding, and apply confidently." },
  ];

  const faqs = [
    { q: "Is Easyway Classes free to use?", a: "Yes, most features are free." },
    { q: "Can I print or save my resume as PDF?", a: "Yes, you can print or save resumes in PDF format." },
    { q: "Does the AI chatbot help with coding?", a: "Yes, it can explain concepts, debug code, and give learning tips." },
    { q: "Are notes and PYQs updated regularly?", a: "Yes, our team frequently updates study materials and question banks." },
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
        <h2 className="text-3xl font-extrabold mb-4 text-center text-white">How Easyway Works</h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-center mb-12">
          Easyway Classes brings together everything you need — from resumes to AI-powered study tools. Here’s a simple journey:
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
              <h3 className="font-semibold text-lg mb-2 text-white">{s.title}</h3>
              <p className="text-sm text-slate-400">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-3xl font-extrabold mb-4 text-center text-white">Why Choose Easyway?</h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-center mb-12">
          Designed for students, freshers, and learners — here’s why Easyway Classes stands out:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "All-in-One Platform", desc: "Resume builder, AI chatbot, PYQs, notes, and coding Analyzer all in one place." },
            { title: "Student-Friendly", desc: "Simple UI, free resources, and guides crafted for students and beginners." },
            { title: "Regular Updates", desc: "Our team adds new notes, PYQs, and roadmap regularly." },
            { title: "Daily Tasks", desc: "Stay on track with Easyway – plan, manage, and complete your study goals every day." },
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

      {/* FAQ Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-3xl font-extrabold mb-4 text-center text-white">Frequently Asked Questions</h2>
        <p className="text-slate-400 text-center mb-10">Quick answers to common queries</p>
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
                {openFAQ === i ? <FaChevronUp className="text-slate-400" /> : <FaChevronDown className="text-slate-400" />}
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
