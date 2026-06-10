import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaCertificate, FaTrophy, FaCalendarAlt, FaArrowLeft, FaExternalLinkAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import Loading from "../../component/Loading";
import { toast } from "react-hot-toast";

export default function Certificates() {
  const [certificates, setCertificates] = useState([]);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_URL}/quiz/user-certificates`, { withCredentials: true })
      .then((res) => {
        setCertificates(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        toast.error("Failed to load certificates");
      });
  }, [API_URL]);

  if (loading) return <Loading />;

  const total = certificates.length;
  const latest = certificates[0];

  return (
    <div className="min-h-screen bg-[#050505] text-white px-4 sm:px-8 py-12">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* ================= HEADER ================= */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tighter">My Achievements</h1>
            <p className="text-slate-500 mt-1">Track and manage your verified course certifications.</p>
          </div>
          
          <div className="flex gap-3">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 bg-white/5 border border-white/10 px-5 py-2.5 rounded-xl hover:bg-white/10 transition-all font-bold text-sm">
              <FaArrowLeft /> Back
            </button>
            <button onClick={() => navigate("/certificate")} className="flex items-center gap-2 bg-amber-500 text-black px-5 py-2.5 rounded-xl hover:bg-amber-400 transition-all font-bold text-sm">
              <FaCertificate /> Course Certificate
            </button>
          </div>
        </div>

        {/* ================= STATS ================= */}
        {total > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Total Earned", val: total, color: "text-amber-500" },
              { label: "Latest Subject", val: latest?.subject, color: "text-blue-400" },
              { label: "Recent Date", val: new Date(latest?.date).toLocaleDateString(), color: "text-emerald-400" }
            ].map((s, i) => (
              <div key={i} className="bg-[#0c0c0e] border border-white/5 rounded-2xl p-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-2">{s.label}</p>
                <h2 className={`text-2xl font-black ${s.color} truncate`}>{s.val}</h2>
              </div>
            ))}
          </div>
        )}

        {/* ================= GRID ================= */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Certificate Gallery</h2>
          </div>

          {total === 0 ? (
            <div className="bg-[#0c0c0e] border border-white/5 rounded-3xl p-16 text-center">
              <FaTrophy className="text-5xl text-slate-700 mb-4 mx-auto" />
              <h2 className="text-xl font-bold">No Achievements Yet</h2>
              <p className="text-slate-500 mb-6 text-sm">Complete your first quiz to unlock a certificate.</p>
              <button onClick={() => navigate("/quizzes")} className="bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-slate-200 transition">Start Now</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.map((cert) => (
                <motion.div
                  key={cert._id}
                  whileHover={{ y: -5 }}
                  className="bg-[#0c0c0e] border border-white/5 rounded-2xl p-6 hover:border-amber-500/30 transition-all group"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
                      <FaCertificate size={24} />
                    </div>
                    <span className="text-[10px] font-mono bg-white/5 px-2 py-1 rounded text-slate-500">
                      ID: {cert.certificateId.slice(-6)}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold mb-1 truncate">{cert.subject}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-2 mb-6">
                    <FaCalendarAlt /> Earned on {new Date(cert.date).toLocaleDateString()}
                  </p>

                  <button 
                    onClick={() => navigate(`/certificate/${cert.certificateId}`)}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-bold transition-all"
                  >
                    View Certificate <FaExternalLinkAlt size={12} />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}