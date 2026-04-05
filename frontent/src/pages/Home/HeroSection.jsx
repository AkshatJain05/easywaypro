import { useNavigate } from "react-router-dom";
import student1Img from "../../assets/studentGroup.png";
import TypingMotion from "./TypingMotion.jsx";
import ScrollReveal from "../../component/ScllorAnimation.jsx";

function HeroSection() {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        // @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap');

        .hero-root { font-family: 'Inter', sans-serif; }
        .syne { font-family: 'Syne', sans-serif; }

        /* Floating glow orbs */
        @keyframes floatOrb {
          0%, 100% { transform: translateY(0px) scale(1); }
          50%       { transform: translateY(-18px) scale(1.04); }
        }
        .orb-float { animation: floatOrb 7s ease-in-out infinite; }
        .orb-float-slow { animation: floatOrb 10s ease-in-out infinite reverse; }

        /* Image hover lift */
        .hero-img { transition: transform 0.4s ease, filter 0.4s ease; }
        .hero-img:hover { transform: translateY(-6px) scale(1.02); filter: drop-shadow(0 0 40px rgba(14,165,233,0.45)); }

        /* Button glow */
        .btn-primary {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .btn-primary::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(14,165,233,0.15), rgba(99,102,241,0.1));
          opacity: 0;
          transition: opacity 0.3s ease;
          border-radius: inherit;
        }
        .btn-primary:hover::after { opacity: 1; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 25px -4px rgba(14,165,233,0.25); }

        .btn-secondary {
          transition: all 0.3s ease;
        }
        .btn-secondary:hover {
          transform: translateY(-2px);
          border-color: rgba(14,165,233,0.5);
          color: #7dd3fc;
          box-shadow: 0 8px 25px -4px rgba(14,165,233,0.15);
        }

        /* Gradient text */
        .gradient-text {
          background: linear-gradient(135deg, #38bdf8 0%, #818cf8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Stat card */
        .stat-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px;
          transition: border-color 0.3s ease, background 0.3s ease;
        }
        .stat-card:hover {
          border-color: rgba(14,165,233,0.2);
          background: rgba(14,165,233,0.04);
        }

        /* Decorative grid dots */
        .dot-grid {
          background-image: radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px);
          background-size: 28px 28px;
        }

        /* Badge pill */
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 14px;
          border-radius: 999px;
          background: rgba(14,165,233,0.08);
          border: 1px solid rgba(14,165,233,0.2);
          color: #7dd3fc;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        /* Divider gradient */
        .hero-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(14,165,233,0.2), transparent);
          border: none;
        }
      `}</style>

      <section className="hero-root relative w-full select-none text-white overflow-hidden bg-[#030009]">

        {/* ---- Background layers ---- */}
        {/* Dot grid */}
        <div className="dot-grid absolute inset-0 pointer-events-none opacity-40" />

        {/* Glow orbs */}
        <div
          className="orb-float absolute top-[-80px] left-[-60px] w-[360px] h-[360px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(14,165,233,0.07) 0%, transparent 70%)" }}
        />
        <div
          className="orb-float-slow absolute bottom-[-60px] right-[-40px] w-[300px] h-[300px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)" }}
        />

        {/* ---- Main grid ---- */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center px-6 md:px-14 lg:px-24 py-14 lg:py-20">

          {/* === LEFT CONTENT === */}
          <ScrollReveal from="left">
            <div className="text-center lg:text-left max-w-xl mx-auto lg:mx-0">

              {/* Badge */}
              <div className="flex justify-center lg:justify-start mb-5">
                <span className="hero-badge">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  AI-Powered Learning
                </span>
              </div>

              {/* Heading */}
              <h1 className="syne text-4xl sm:text-5xl lg:text-[3.6rem] font-bold leading-[1.1] tracking-tight text-white">
                Learn with <br />
                <span className="gradient-text">
                  <TypingMotion />
                </span>
              </h1>

              {/* Description — desktop */}
              <p className="hidden md:block text-gray-400 mt-6 text-base lg:text-lg leading-relaxed max-w-lg">
                Easyway Pro helps students learn smarter with AI-powered tools.
                From Todo, roadmap, and notes to PYQs, quizzes, resume builder,
                chatbot, and code analyzer — everything you need in one place.
              </p>

              {/* Description — mobile */}
              <p className="md:hidden text-gray-400 mt-5 text-sm leading-relaxed">
                Learn smarter with chatbot, code analyzer, notes & task manager — all in one place.
              </p>

              {/* Buttons */}
              <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-3">
                <button
                  onClick={() => navigate("/easyway-ai")}
                  className="btn-primary px-6 py-2.5 rounded-xl text-sm font-semibold text-white border border-sky-500/40 bg-sky-500/10"
                >
                  ✦ Explore AI Tools
                </button>
                <button
                  onClick={() => navigate("/study-material")}
                  className="btn-secondary px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-300 border border-white/[0.1] bg-white/[0.03]"
                >
                  Explore Study Material →
                </button>
              </div>

              {/* Stats row */}
              <div className="mt-10 grid grid-cols-3 gap-3 max-w-sm mx-auto lg:mx-0">
                {[
                  { value: "3+", label: "AI Tools" },
                  { value: "10+", label: "Students" },
                  { value: "Free", label: "to Start" },
                ].map((stat) => (
                  <div key={stat.label} className="stat-card px-3 py-3 text-center">
                    <p className="syne text-lg font-bold text-sky-400">{stat.value}</p>
                    <p className="text-[10px] text-gray-600 mt-0.5 uppercase tracking-wider">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* === RIGHT CONTENT (Image + Glow) === */}
          <ScrollReveal from="right">
            <div className="relative flex justify-center items-center">

              {/* Glow ring */}
              <div
                className="absolute w-[320px] h-[320px] md:w-[420px] md:h-[420px] rounded-full pointer-events-none"
                style={{
                  background: "radial-gradient(circle, rgba(14,165,233,0.1) 0%, rgba(99,102,241,0.06) 50%, transparent 75%)",
                  filter: "blur(20px)",
                }}
              />

              {/* Rotating dashed ring */}
              <div
                className="absolute w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-full pointer-events-none"
                style={{
                  border: "1px dashed rgba(14,165,233,0.12)",
                  animation: "spin 30s linear infinite",
                }}
              />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

              {/* Corner accents */}
              <div className="absolute top-4 right-8 w-10 h-10 border-t-2 border-r-2 border-sky-500/20 rounded-tr-lg pointer-events-none" />
              <div className="absolute bottom-4 left-8 w-10 h-10 border-b-2 border-l-2 border-indigo-500/20 rounded-bl-lg pointer-events-none" />

              {/* Student image */}
              <img
                src={student1Img}
                alt="Students learning"
                className="hero-img relative z-10 h-72 sm:h-96 md:h-[28rem] lg:h-[32rem] object-contain"
                style={{ filter: "drop-shadow(0 0 10px rgba(14,165,233,0.25))" }}
              />
            </div>
          </ScrollReveal>
        </div>

        {/* ---- Divider ---- */}
        <hr className="hero-divider mx-6 md:mx-14 lg:mx-24" />
      </section>
    </>
  );
}

export default HeroSection;