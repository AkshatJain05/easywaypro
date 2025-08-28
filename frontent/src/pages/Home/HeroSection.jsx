import { useNavigate } from "react-router-dom";
import student1Img from "../../assets/studentGroup.png";
import TypingMotion from "./TypingMotion.jsx";
import ScrollReveal from "../../component/ScllorAnimation.jsx"

function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative w-full overflow-hidden select-none  text-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center px-6 md:px-14 lg:px-24 py-12 lg:py-10">
        
        {/* === Left Content === */}
        <ScrollReveal from="left">
        <div className="text-center lg:text-left max-w-xl mx-auto lg:mx-0">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold ">
            Learn with <br />
            <TypingMotion/>
          </h1>

          {/* Desktop Description */}
          <p className="hidden md:block text-slate-300 mt-9 mb-3 text-lg lg:text-xl tracking-wide text-justify ">
            Easyway Classes helps students learn smarter with AI-powered tools. 
            From chatbot for instant answers to code analyzer, notes, and 
            task management — everything you need in one place.
          </p>

          {/* Mobile Description */}
          <p className="md:hidden text-slate-300 mt-6  mx-3 text-base">
            Learn smarter with chatbot, code analyzer, notes & task manager — all in one place.
          </p>

          {/* Buttons */}
          <div className="mt-10 flex flex-wrap justify-center lg:justify-start gap-4">
            <button
              onClick={() => navigate("/courses")}
              className="px-3 py-2 lg:px-7 lg:py-3 rounded-2xl bg-gradient-to-r from-slate-950 to-slate-900 border-white border-1 text-white font-semibold shadow-md hover:from-slate-900 hover:to-slate-800 transition-all"
            >
              Explore Courses
            </button>

            <button
              onClick={() => navigate("/login")}
               className="px-3 py-2 lg:px-7 lg:py-3 rounded-2xl bg-gradient-to-r from-slate-950 to-slate-900 border-white border-1 text-white font-semibold shadow-md hover:from-slate-900 hover:to-slate-800 transition-all"
            >
               Login
            </button>
          </div>
        </div>
        </ScrollReveal>

       <ScrollReveal from="right">
        {/* === Right Content (Image + Glow) === */}
        <div className="relative flex justify-center items-center">
          {/* Softer Blue Glow */}
          <div className="absolute h-72 w-72 md:h-[28rem] md:w-[28rem] rounded-full 
            bg-gradient-radial from-slate-100/30 via-slate-100/20 to-transparent 
            blur-2xl opacity-60 -z-10">
          </div>

          {/* Student Image */}
          <img
            src={student1Img}
            alt="Students"
            className="h-72 sm:h-96 md:h-110 lg:h-130 relative z-10 drop-shadow-[0_0_20px_rgba(59,100,206,0.3)]"
          />
        </div>
        </ScrollReveal>
      </div>

      {/* Divider */}
      <hr className="my-3 border-slate-800" />
    </section>
  );
}

export default HeroSection;
