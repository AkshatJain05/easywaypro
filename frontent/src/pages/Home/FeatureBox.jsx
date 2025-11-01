import ScrollReveal from "../../component/ScllorAnimation";
import { Link } from "react-router-dom";

function FeatureBox() {
  const featureList = [
    { name: "Easyway Classes 2.0", featureLink: "https://www.youtube.com/@EasywayClasses2.0" },
    { name: "Task Planner", featureLink: "/task-planner" },
    { name: "Notes", featureLink: "/notes" },
    { name: "PYQ", featureLink: "/pyq" },
    { name: "Roadmap", featureLink: "/roadmap" },
    { name: "ChatBot AI", featureLink: "/chatbot" },
    { name: "Code Analyzer", featureLink: "/code-analyzer" },
    { name: "Quiz", featureLink: "/quiz" },
  ];

  return (
    <div className="w-full text-white px-4 sm:px-6 lg:px-12 
                    pt-6 pb-16
                    overflow-x-hidden">
      {/* Section Header */}
      <div className="text-center mb-12 px-2">
        <h2 className="text-3xl md:text-4xl font-bold 
                       bg-clip-text text-gray-50 drop-shadow-md">
          Features
        </h2>
        <p className="mt-3  text-gray-400 leading-relaxed 
                      max-w-2xl mx-auto font-medium">
          Explore powerful tools designed to simplify your workflow and boost productivity
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 
                      gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto w-full">
        {featureList.map((feature, index) => (
          <ScrollReveal from="bottom" key={index}>
            <Link
              to={feature.featureLink}
              target={feature.featureLink.startsWith("http") ? "_blank" : "_self"}
              rel={feature.featureLink.startsWith("http") ? "noopener noreferrer" : ""}
              className="group block w-full"
            >
              <div className="relative w-full h-full rounded-xl p-[1px] 
                              bg-gray-700 
                              transition-transform duration-300 
                              group-hover:scale-105 group-hover:shadow-lg 
                              group-hover:shadow-yellow-500/30">
                <div className="h-16 sm:h-20 lg:h-24 w-full rounded-xl 
                                bg-gradient-to-br from-gray-950 to-black 
                                flex items-center justify-center px-2 text-center">
                  <span className="text-sm sm:text-base lg:text-lg font-medium 
                                   text-gray-200 group-hover:text-yellow-300 transition-colors">
                    {feature.name}
                  </span>
                </div>
              </div>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}

export default FeatureBox;
