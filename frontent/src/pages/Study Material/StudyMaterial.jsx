import ScrollReveal from "../../component/ScllorAnimation";
import { Link } from "react-router-dom";
import { MdArrowOutward } from "react-icons/md";

import notes from "../../assets/notes.png";
import quiz from "../../assets/quizImg.png";
import pyq from "../../assets/pyqImg.png";
import onlineLecture from "../../assets/onlineLecture.png";
import roadmap from "../../assets/roadMap.png";
import syllabus from "../../assets/syllabusImg.png";
import algorithmVisualizer from "../../assets/algorithmVisualizer.png";
import Certificates from "../../assets/certificatefeature.png";
import Docs from "../../assets/docs.png";

const studyMaterialList = [
  { name: "Roadmaps",               link: "/roadmap",               img: roadmap,              tag: "Learning Path" },
  { name: "Quizzes",                link: "/quiz",                  img: quiz,                 tag: "Practice"      },
  { name: "Notes",                  link: "/notes",                 img: notes,                tag: "Study"         },
  { name: "Video Lectures",         link: "/video-lectures",        img: onlineLecture,        tag: "Watch"         },
  { name: "Syllabus",               link: "/syllabus",              img: syllabus,             tag: "Curriculum"    },
  { name: "PYQ's",                  link: "/pyq",                   img: pyq,                  tag: "Exam Prep"     },
  { name: "Algorithm Visualizer",   link: "/algorithm-visualizer",  img: algorithmVisualizer,  tag: "Interactive"   },
  { name: "Quizzes (Certificate)",  link: "/quizzes",               img: Certificates,         tag: "Earn Cert"     },
  { name: "Documentation Hub",      link: "/docs",                  img: Docs,                 tag: "Reference"     },
];

function StudyMaterial() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;500;600&display=swap');
        .sm-root { font-family: 'Inter', sans-serif; }
        .syne { font-family: 'Syne', sans-serif; }

        .sm-card {
          position: relative;
          background: #0a0a14;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          overflow: hidden;
          transition: transform 0.28s ease, border-color 0.28s ease, box-shadow 0.28s ease;
        }
        .sm-card:hover {
          transform: translateY(-5px);
          border-color: rgba(14,165,233,0.3);
          box-shadow: 0 14px 32px -6px rgba(14,165,233,0.13);
        }

        /* Top glow line */
        .sm-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #38bdf8, transparent);
          opacity: 0;
          transition: opacity 0.28s ease;
          z-index: 2;
        }
        .sm-card:hover::before { opacity: 1; }

        /* Image zoom */
        .sm-img {
          width: 100%; display: block;
          transition: transform 0.45s ease;
          object-fit: cover;
        }
        .sm-card:hover .sm-img { transform: scale(1.06); }

        /* Arrow icon slide */
        .sm-arrow {
          opacity: 0;
          transform: translate(-2px, 2px);
          transition: opacity 0.2s ease, transform 0.2s ease;
        }
        .sm-card:hover .sm-arrow {
          opacity: 1;
          transform: translate(0, 0);
        }

        /* Image overlay on hover */
        .sm-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent 40%, rgba(10,10,20,0.7) 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .sm-card:hover .sm-overlay { opacity: 1; }

        /* Tag pill */
        .sm-tag {
          display: inline-flex;
          align-items: center;
          padding: 1px 7px;
          border-radius: 999px;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          background: rgba(14,165,233,0.09);
          border: 1px solid rgba(14,165,233,0.17);
          color: #7dd3fc;
        }
      `}</style>

      <section className="sm-root w-full bg-[#030009] px-4 sm:px-8 lg:px-12 pt-5 pb-20">
        <div className="max-w-7xl mx-auto">

          {/* ── Section Header ── */}
          <ScrollReveal from="bottom">
            <div className="text-center mb-10">
              {/* Badge */}
              <div className="flex justify-center mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
                  style={{ background: "rgba(14,165,233,0.08)", border: "1px solid rgba(14,165,233,0.18)", color: "#7dd3fc" }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  Resources
                </span>
              </div>

              <h2 className="syne text-2xl sm:text-3xl font-extrabold text-white">
                Study{" "}
                <span style={{
                  background: "linear-gradient(135deg,#38bdf8 0%,#818cf8 100%)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                }}>
                  Material
                </span>
              </h2>
              <p className="mt-2 text-xs text-gray-500 max-w-md mx-auto">
                Everything you need to learn, practice, and ace your exams — all in one place.
              </p>
              <div className="mt-4 h-px max-w-[140px] mx-auto bg-gradient-to-r from-transparent via-sky-500/30 to-transparent" />
            </div>
          </ScrollReveal>

          {/* ── Cards Grid ── */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {studyMaterialList.map((item, index) => (
              <ScrollReveal from="bottom" key={index}>
                <Link to={item.link} className="block" tabIndex={0}>
                  <div className="sm-card" style={{ animationDelay: `${index * 0.04}s` }}>

                    {/* Image area */}
                    <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
                      <img
                        src={item.img}
                        alt={item.name}
                        className="sm-img h-full w-full"
                      />
                      <div className="sm-overlay" />
                    </div>

                    {/* Card footer */}
                    <div className="px-3 pt-2.5 pb-3 flex flex-col gap-1.5">
                      {/* Tag + Arrow row */}
                      <div className="flex items-center justify-between">
                        <span className="sm-tag">{item.tag}</span>
                        <MdArrowOutward className="sm-arrow text-sky-400" size={13} />
                      </div>

                      {/* Name */}
                      <p className="syne text-xs sm:text-sm font-bold text-white leading-snug line-clamp-2">
                        {item.name}
                      </p>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default StudyMaterial;