import ScrollReveal from "../../component/ScllorAnimation";
import chatBot from "../../assets/chatBot.png";
import codeAnalyzer from "../../assets/codeAnalyzer.png";
import todo from "../../assets/todo.png";
import resumeBuilder from "../../assets/resumeBuilder.png";
import roadmap from "../../assets/roadMap.png";
import { Link } from "react-router-dom";

function EasywayAI() {

  const easywayAIList = [
    { name: "AI ChatBot", link: "/chatBot", img: chatBot, tag: "AI Assistant" },
    { name: "Code Analyzer", link: "/code-analyzer", img: codeAnalyzer, tag: "Developer Tool" },
    { name: "Task Planner", link: "/task-planner", img: todo, tag: "Productivity" },
    { name: "Resume Builder", link: "/resume/dashboard", img: resumeBuilder, tag: "Career" },
    { name: "Roadmap", link: "/roadmap", img: roadmap, tag: "Learning Path" }
  ];

  return (
    <section className="w-full bg-[#030009] px-4 sm:px-8 lg:px-12 pb-30 py-12">

      {/* 🔷 Title */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full 
                        bg-sky-500/10 border border-sky-400/20 text-sky-300 text-[10px] uppercase tracking-widest">
          <span className="w-2 h-2 bg-sky-400 rounded-full animate-pulse"></span>
          AI Tools
        </div>

        <h2 className="text-3xl md:text-4xl font-extrabold mt-4 text-white">
          AI{" "}
          <span className="bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text text-transparent">
            Tools & Services
          </span>
        </h2>

        <p className="mt-3 text-gray-400 text-sm max-w-md mx-auto">
          Supercharge your productivity with intelligent AI-powered tools.
        </p>

        <div className="mt-5 h-[2px] w-24 mx-auto bg-gradient-to-r from-transparent via-sky-500/40 to-transparent" />
      </div>

      {/* 🔷 Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 max-w-7xl mx-auto">

        {easywayAIList.map((item, index) => (
          <ScrollReveal from="bottom" key={index}>
            <Link to={item.link} className="block group">

              <div className="
                relative rounded-2xl overflow-hidden
                bg-white/[0.03] backdrop-blur-xl
                border border-white/10
                transition-all duration-300
                group-hover:-translate-y-2
                group-hover:shadow-xl group-hover:shadow-sky-500/20
                group-hover:border-sky-400/30
              ">

                {/* Glow Border */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition pointer-events-none">
                  <div className="absolute inset-0 rounded-2xl border border-sky-400/30 blur-[1px]" />
                </div>

                {/* Image */}
                <div className="relative overflow-hidden aspect-[4/3]">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition" />
                </div>

                {/* Content */}
                <div className="p-3 flex flex-col gap-2">

                  {/* Tag */}
                  <span className="px-2 py-[2px] text-[10px] font-semibold rounded-full 
                                   bg-sky-500/10 text-sky-300 border border-sky-400/20 w-fit">
                    {item.tag}
                  </span>

                  {/* Title */}
                  <h3 className="text-white font-semibold text-sm group-hover:text-sky-300 transition">
                    {item.name}
                  </h3>

                </div>
              </div>

            </Link>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

export default EasywayAI;