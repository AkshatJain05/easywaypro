import { Link, useNavigate } from "react-router-dom";
import { FaSort, FaCodeBranch, FaArrowLeft, FaPlay } from "react-icons/fa";
import { motion } from "framer-motion";

const HomePage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const features = [
    {
      title: "Sorting Algorithms",
      tag: "Interactive",
      description: "Visualize Bubble, Merge, Quick, and Insertion Sort with real-time speed control.",
      icon: <FaSort className="text-5xl text-cyan-400 group-hover:drop-shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-all" />,
      link: "/sorting",
      color: "from-cyan-500/20 to-blue-500/5",
    },
    {
      title: "Tree Structures",
      tag: "Animated",
      description: "Explore AVL, Red-Black, and Binary Search Trees with step-by-step logic tracing.",
      icon: <FaCodeBranch className="text-5xl text-purple-400 group-hover:drop-shadow-[0_0_15px_rgba(192,132,252,0.5)] transition-all" />,
      link: "/trees",
      color: "from-purple-500/20 to-indigo-500/5",
    },
  ];

  return (
    <div className="min-h-screen  text-white relative overflow-hidden selection:bg-cyan-500/30">
      
      {/* ── BACKGROUND AMBIENCE ── */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* ── TOP NAVIGATION ── */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.button
          whileHover={{ x: -5 }}
          onClick={handleBack}
          className="flex items-center gap-2 text-slate-500 hover:text-cyan-400 font-bold text-xs uppercase tracking-widest transition-colors z-50 relative cursor-pointer"
        >
          <FaArrowLeft /> Back to Dashboard
        </motion.button>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-20 flex flex-col items-center">
        
        {/* ── HERO SECTION ── */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            Algorithm Lab 
          </div>
          
          <h1 className="flex gap-2 text-3xl md:text-5xl font-black tracking-tighter mb-2 bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent leading-[1.1] md:pl-13">
            Explore Algorithms <br /> 
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              Visually.
            </span>
          </h1>
          
          <p className="text-slate-400 text-sm md:text-md max-w-2xl mx-auto leading-relaxed">
            Master complex data structures and algorithms through high-fidelity interactive 
            animations. Designed for visual learners and competitive programmers.
          </p>
        </motion.div>

        {/* ── FEATURES GRID ── */}
        <div className="grid gap-6 md:grid-cols-2 w-full">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link
                to={feature.link}
                className={`group relative block h-full p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all overflow-hidden shadow-2xl hover:shadow-cyan-500/10`}
              >
                {/* Background Gradient Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-8">
                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 group-hover:scale-110 group-hover:bg-white/[0.08] transition-all duration-500">
                      {feature.icon}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 border border-slate-800 px-3 py-1 rounded-full group-hover:border-white/20 transition-colors">
                      {feature.tag}
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                    {feature.title}
                  </h2>
                  <p className="text-slate-400 text-sm leading-relaxed mb-8">
                    {feature.description}
                  </p>

                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-cyan-500 group-hover:gap-4 transition-all">
                    Start Visualizing <FaPlay className="text-[10px]" />
                  </div>
                </div>

                {/* Decorative Accent */}
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-white/5 to-transparent rounded-tl-full translate-x-10 translate-y-10 group-hover:translate-x-5 group-hover:translate-y-5 transition-transform duration-700" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* ── FOOTER FOOTPRINT ── */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-20 text-[10px] uppercase tracking-[0.4em] text-center font-bold text-slate-600"
        >
          Built for Deep Understanding • Easyway Pro
        </motion.p>
      </div>
    </div>
  );
};

export default HomePage;