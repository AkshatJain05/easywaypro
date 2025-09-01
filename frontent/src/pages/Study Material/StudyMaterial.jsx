import ScrollReveal from "../../component/ScllorAnimation";
import notes from "../../assets/notes.png";
import quiz from "../../assets/quizImg.png";
import pyq from "../../assets/pyqImg.png";
import onlineLecture from "../../assets/onlineLecture.png";
import roadmap from "../../assets/roadMap.png";
import syllabus from "../../assets/syllabusImg.png";
import {Link} from "react-router-dom";

function StudyMaterial() {
  const studyMaterialList = [
    { name: "AKTU PYQ's", link: "/pyq", img: pyq },
    { name: "Quizzes", link: "/quizs", img: quiz },
    { name: "Notes", link: "/notes", img: notes },
    { name: "Video Lectures", link: "/video-lectures", img: onlineLecture },
    { name: "Roadmaps", link: "/roadmap", img: roadmap },
    { name: "AKTU Syllabus", link: "/syllabus", img: syllabus },
  ];

  return (
    <>
      {/* Title */}
      <div className="mt-8 md:mt-12 text-center">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-100">
          Study Material
        </h2>
        <div className="flex justify-center mt-2">
          <hr className="bg-orange-500 h-1 rounded-full w-32 md:w-40 lg:w-52 border-0" />
        </div>
      </div>

      {/* Cards */}
      <div className="px-4 sm:px-6 md:px-12 lg:px-20 mt-8 md:mt-12 mb-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8 md:gap-10 lg:gap-12 max-w-7xl mx-auto">
          {studyMaterialList.map((list, index) => (
            <ScrollReveal from="bottom" key={index}>
              <Link to={list.link}>
              <div
                className="w-full max-w-[170px] sm:max-w-[200px] md:max-w-[220px] 
                           bg-gradient-to-br from-gray-950 to-black border-1 border-slate-500 rounded-xl overflow-hidden
                           shadow-[0_0_10px_rgba(255,255,255,0.15)]
                           hover:shadow-[0_0_18px_rgba(255,255,255,0.35)]
                           transition-all duration-300 hover:scale-[1.05] mx-auto"
              >
                {/* Image */}
                <div className="overflow-hidden">
                  <img
                    src={list.img}
                    alt={list.name}
                    className="h-28 sm:h-32 md:h-36 lg:h-40 w-full object-cover
                               transform hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Title */}
                <p className="py-2 sm:py-3 text-sm sm:text-base md:text-lg text-center font-medium text-slate-100 bg-gradient-to-br from-gray-950 to-black">
                  {list.name}
                </p>
              </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </>
  );
}

export default StudyMaterial;
