import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaClock,
  FaRegQuestionCircle,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { motion } from "framer-motion";

export default function WebsiteOverview() {
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
    {
      q: "Is Easyway Classes free to use?",
      a: "Yes, most features are free.",
    },
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

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-black  text-slate-100">
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
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 * i }}
              className="px-4 py-5 bg-gradient-to-br from-gray-950 to-black  rounded-2xl shadow-md border border-slate-700 hover:shadow-lg transition text-center"
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

      {/* Extra Section: Why Choose Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-3xl font-extrabold mb-4 text-center text-white">
          Why Choose Easyway?
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-center mb-12">
          Designed for students, freshers, and learners — here’s why Easyway
          Classes stands out:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-gray-950 to-black p-6 rounded-xl shadow-md border border-slate-700 hover:shadow-lg transition text-center">
            <h3 className="font-semibold mb-2 text-white">
              All-in-One Platform
            </h3>
            <p className="text-sm text-slate-400 text-center">
              Resume builder, AI chatbot, PYQs, notes, and coding Analyzer all
              in one place.
            </p>
          </div>
          <div className="bg-gradient-to-br from-gray-950 to-black  p-6 rounded-xl shadow-md border border-slate-700 hover:shadow-lg transition text-center">
            <h3 className="font-semibold mb-2 text-white">Student-Friendly</h3>
            <p className="text-sm text-slate-400 text-center">
              Simple UI, free resources, and guides crafted for students and
              beginners.
            </p>
          </div>
          <div className="bg-gradient-to-br from-gray-950 to-black p-6 rounded-xl shadow-md border border-slate-700 hover:shadow-lg transition text-center">
            <h3 className="font-semibold mb-2 text-white">Regular Updates</h3>
            <p className="text-sm text-slate-400 text-center">
              Our team adds new notes, PYQs, and roadmap regularly.
            </p>
          </div>
          <div className="bg-gradient-to-br from-gray-950 to-black p-6 rounded-xl shadow-md border border-slate-700 hover:shadow-lg transition text-center">
            <h3 className="font-semibold mb-2 text-white">
              📘 Daily Tasks
            </h3>
            <p className="text-sm text-slate-400 text-center">
              Stay on track with Easyway – plan, manage, and complete your study
              goals every day.
            </p>
          </div>
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
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 * i }}
              className="bg-gradient-to-br from-gray-950 to-black  rounded-xl shadow border border-slate-700 hover:shadow-md transition"
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
              {openFAQ === i && (
                <div className="px-4 pb-4 text-sm text-slate-300 animate-fadeIn">
                  {faq.a}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
