import ScrollReveal from "../../component/ScllorAnimation";
import { Link } from "react-router-dom";
import {
  MdOutlineVideoLibrary,
  MdOutlineCheckCircle,
  MdOutlineNotes,
  MdOutlineQuiz,
  MdOutlineMap,
  MdOutlineSmartToy,
  MdOutlineCode,
  MdOutlineLeaderboard,
} from "react-icons/md";

const featureList = [
  {
    name: "Easyway Classes 2.0",
    featureLink: "https://www.youtube.com/@EasywayClasses2.0",
    icon: MdOutlineVideoLibrary,
    description: "Free video lectures & tutorials",
    accent: "from-sky-500/20 to-cyan-500/10",
    iconColor: "text-sky-400",
    borderHover: "rgba(56,189,248,0.3)",
    glowColor: "rgba(56,189,248,0.12)",
  },
  {
    name: "Task Planner (Todo List)",
    featureLink: "/task-planner",
    icon: MdOutlineCheckCircle,
    description: "Organize tasks & deadlines",
    accent: "from-indigo-500/20 to-violet-500/10",
    iconColor: "text-indigo-400",
    borderHover: "rgba(129,140,248,0.3)",
    glowColor: "rgba(129,140,248,0.12)",
  },
  {
    name: "Notes",
    featureLink: "/notes",
    icon: MdOutlineNotes,
    description: "Smart note-taking system",
    accent: "from-emerald-500/20 to-teal-500/10",
    iconColor: "text-emerald-400",
    borderHover: "rgba(52,211,153,0.3)",
    glowColor: "rgba(52,211,153,0.12)",
  },
  {
    name: "PYQ",
    featureLink: "/pyq",
    icon: MdOutlineQuiz,
    description: "Previous year questions bank",
    accent: "from-amber-500/20 to-yellow-500/10",
    iconColor: "text-amber-400",
    borderHover: "rgba(251,191,36,0.3)",
    glowColor: "rgba(251,191,36,0.12)",
  },
  {
    name: "Roadmap",
    featureLink: "/roadmap",
    icon: MdOutlineMap,
    description: "Structured learning paths",
    accent: "from-sky-500/20 to-blue-500/10",
    iconColor: "text-blue-400",
    borderHover: "rgba(96,165,250,0.3)",
    glowColor: "rgba(96,165,250,0.12)",
  },
  {
    name: "ChatBot AI",
    featureLink: "/chatbot",
    icon: MdOutlineSmartToy,
    description: "AI-powered study assistant",
    accent: "from-violet-500/20 to-purple-500/10",
    iconColor: "text-violet-400",
    borderHover: "rgba(167,139,250,0.3)",
    glowColor: "rgba(167,139,250,0.12)",
  },
  {
    name: "Code Analyzer",
    featureLink: "/code-analyzer",
    icon: MdOutlineCode,
    description: "Debug & optimize your code",
    accent: "from-rose-500/20 to-pink-500/10",
    iconColor: "text-rose-400",
    borderHover: "rgba(251,113,133,0.3)",
    glowColor: "rgba(251,113,133,0.12)",
  },
  {
    name: "Quiz",
    featureLink: "/quiz",
    icon: MdOutlineLeaderboard,
    description: "Put Your Knowledge to the Test",
    accent: "from-orange-500/20 to-amber-500/10",
    iconColor: "text-orange-400",
    borderHover: "rgba(251,146,60,0.3)",
    glowColor: "rgba(251,146,60,0.12)",
  },
];

function FeatureBox() {
  return (
    <>
      <style>{`
        // @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Inter:wght@400;500;600&display=swap');
        .feat-root { font-family: 'Inter', sans-serif; }
        .syne { font-family: 'Syne', sans-serif; }

        .feat-card {
          position: relative;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.07);
          background: #0a0a14;
          transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
          overflow: hidden;
        }
        .feat-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--card-glow-color, #38bdf8), transparent);
          opacity: 0;
          transition: opacity 0.25s ease;
          border-radius: 16px 16px 0 0;
        }
        .feat-card:hover::before { opacity: 1; }
        .feat-card:hover {
          transform: translateY(-4px);
          border-color: var(--card-border-hover, rgba(56,189,248,0.3));
          box-shadow: 0 12px 30px -6px var(--card-glow-color, rgba(56,189,248,0.12));
        }

        .feat-icon-wrap {
          transition: transform 0.25s ease;
        }
        .feat-card:hover .feat-icon-wrap {
          transform: scale(1.1) rotate(-4deg);
        }

        .arrow-icon {
          opacity: 0;
          transform: translateX(-4px);
          transition: opacity 0.2s ease, transform 0.2s ease;
        }
        .feat-card:hover .arrow-icon {
          opacity: 1;
          transform: translateX(0);
        }

        /* Section label */
        .section-label {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 3px 12px;
          border-radius: 999px;
          background: rgba(14,165,233,0.08);
          border: 1px solid rgba(14,165,233,0.18);
          color: #7dd3fc;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        /* Shimmer on card bg */
        .feat-card .card-shimmer {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 50% 0%, var(--card-glow-color, rgba(56,189,248,0.08)) 0%, transparent 65%);
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
          border-radius: inherit;
        }
        .feat-card:hover .card-shimmer { opacity: 1; }

        @keyframes cardFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .feat-card { animation: cardFadeUp 0.35s ease both; }
      `}</style>

      <section className="feat-root w-full bg-[#030009] text-white px-4 sm:px-8 lg:px-14 pt-10 pb-20 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">

          {/* ---- Section Header ---- */}
          <ScrollReveal from="bottom">
            <div className="text-center mb-12">
              <div className="flex justify-center mb-4">
                <span className="section-label">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  What We Offer
                </span>
              </div>
              <h2 className="syne text-2xl sm:text-3xl font-extrabold text-white ">
                Everything You Need to{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Learn Smarter
                </span>
              </h2>
              <p className="mt-3 text-sm text-gray-500 max-w-xl mx-auto leading-relaxed">
                Powerful tools designed to simplify your workflow and supercharge your productivity
              </p>

              {/* Divider */}
              <div className="mt-7 h-px max-w-xs mx-auto bg-gradient-to-r from-transparent via-sky-500/25 to-transparent" />
            </div>
          </ScrollReveal>

          {/* ---- Feature Grid ---- */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {featureList.map((feature, index) => {
              const Icon = feature.icon;
              const isExternal = feature.featureLink.startsWith("http");

              return (
                <ScrollReveal from="bottom" key={index}>
                  <Link
                    to={feature.featureLink}
                    target={isExternal ? "_blank" : "_self"}
                    rel={isExternal ? "noopener noreferrer" : ""}
                    className="block"
                    style={{
                      "--card-border-hover": feature.borderHover,
                      "--card-glow-color": feature.glowColor,
                    }}
                  >
                    <div
                      className="feat-card p-4 sm:p-5 h-full flex flex-col gap-3"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      {/* Shimmer overlay */}
                      <span className="card-shimmer" />

                      {/* Top row: icon + arrow */}
                      <div className="flex items-start justify-between relative z-10">
                        {/* Icon */}
                        <div
                          className={`feat-icon-wrap w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${feature.accent} border border-white/[0.07]`}
                        >
                          <Icon className={`${feature.iconColor} text-xl`} />
                        </div>

                        {/* Arrow */}
                        <svg
                          className={`arrow-icon w-4 h-4 ${feature.iconColor} mt-1`}
                          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                        </svg>
                      </div>

                      {/* Text */}
                      <div className="relative z-10">
                        <p className="text-sm font-semibold text-white leading-snug syne">
                          {feature.name}
                        </p>
                        <p className="text-[11px] text-gray-600 mt-1 leading-relaxed line-clamp-2">
                          {feature.description}
                        </p>
                      </div>

                      {/* Bottom tag */}
                      <div className="relative z-10 mt-auto pt-2 border-t border-white/[0.04] flex items-center justify-between">
                        <span className={`text-[10px] font-medium uppercase tracking-wider ${feature.iconColor} opacity-60`}>
                          {isExternal ? "External ↗" : "Open →"}
                        </span>
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

export default FeatureBox;