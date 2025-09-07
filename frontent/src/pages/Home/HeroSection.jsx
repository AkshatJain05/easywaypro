import { useNavigate } from "react-router-dom";
import student1Img from "../../assets/studentGroup.png";
import TypingMotion from "./TypingMotion.jsx";
import ScrollReveal from "../../component/ScllorAnimation.jsx";

function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative w-full select-none text-white overflow-visible bg-gradient-to-b from-slate-950 to-black overflow-x-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center px-6 md:px-14 lg:px-24 py-12 lg:py-16">
        
        {/* === Left Content === */}
        <ScrollReveal from="left">
          <div className="text-center lg:text-left max-w-xl mx-auto lg:mx-0">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Learn with <br />
              <TypingMotion />
            </h1>

            {/* Desktop Description */}
            <p className="hidden md:block text-slate-300 mt-9 mb-3 text-lg lg:text-xl  text-justify">
             Easyway Pro helps students learn smarter with AI-powered tools.
 From Todo, roadmap, and notes to PYQs, quizzes, resume builder, chatbot, and code analyzer — everything you need in one place.
            </p>

            {/* Mobile Description */}
            <p className="md:hidden text-slate-300 mt-6 mx-3 text-base">
              Learn smarter with chatbot, code analyzer, notes & task manager — all in one place.
            </p>

            {/* Buttons */}
            <div className="mt-10 flex flex-wrap justify-center lg:justify-start gap-4">
              <button
                onClick={() => navigate("/easyway-ai")}
                className="px-3 py-2 lg:px-7 lg:py-3 rounded-2xl bg-gradient-to-r from-slate-950 to-slate-900 border border-white text-white font-semibold shadow-md hover:from-slate-900 hover:to-slate-800 transition-all"
              >
                 Explore AI Tools
              </button>

              <button
                onClick={() => navigate("/study-material")}
                className="px-3 py-2 lg:px-7 lg:py-3 rounded-2xl bg-gradient-to-r from-slate-950 to-slate-900 border border-white text-white font-semibold shadow-md hover:from-slate-900 hover:to-slate-800 transition-all"
              >
                Explore Study Material
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* === Right Content (Image + Glow) === */}
        <ScrollReveal from="right">
          <div className="relative flex justify-center items-center overflow-visible">
            
            {/* Glow Effect */}
            <div
              className="absolute h-80 w-80 md:h-[28rem] md:w-[28rem] rounded-full
              bg-gradient-radial from-slate-100/30 via-slate-100/20 to-transparent
              blur-3xl opacity-70 -z-10"
            ></div>

            {/* Student Image */}
            <img
              src={student1Img}
              alt="Students"
              className="h-72 sm:h-96 md:h-[28rem] lg:h-[32rem] relative z-10 
              drop-shadow-[0_0_25px_rgba(59,100,155,0.35)]"
            />
          </div>
        </ScrollReveal>
      </div>

      {/* Divider */}
      <hr className="my-6 border-slate-900" />
    </section>
  );
}

export default HeroSection;
