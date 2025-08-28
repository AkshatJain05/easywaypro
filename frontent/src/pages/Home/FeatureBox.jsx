  import ScrollReveal from "../../component/ScllorAnimation";
  import { Link } from "react-router-dom";

  function FeatureBox() {
    const featureList = [
      { name: "Easyway Classes 2.0", featureLink: "/login" },
      { name: "Todo-List", featureLink: "#" },
      { name: "Notes", featureLink: "#" },
      { name: "PYQ", featureLink: "#" },
      { name: "Course", featureLink: "#" },
      { name: "ChatBot AI", featureLink: "#" },
      { name: "Code Analyzer", featureLink: "#" },
      { name: "Live Mentor Chat", featureLink: "#" },
    ];

    return (
      <div className="w-full text-white px-4 sm:px-8 lg:px-16 py-12">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white">
            Features
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-400 mt-2 max-w-md mx-auto">
            Explore the tools designed to simplify your workflow
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {featureList.map((feature, index) => (
            <ScrollReveal from="bottom" key={index}>
              <Link 
                to={feature.featureLink}
                target={feature.featureLink.startsWith("http") ? "_blank" : "_self"}
                rel={
                  feature.featureLink.startsWith("http")
                    ? "noopener noreferrer"
                    : ""
                }
                className="group"
              >
                <div className="h-16 sm:h-20 lg:h-24 rounded-lg bg-gradient-to-r from-slate-950 to-slate-900 
                                border border-gray-500 flex items-center justify-center 
                                text-center shadow-sm
                                transition-all duration-300 ease-out
                                group-hover:border-yellow-500 group-hover:shadow-lg group-hover:shadow-yellow-500/30 group-hover:-translate-y-1">
                  <span className="text-sm sm:text-base lg:text-lg font-medium text-gray-200 group-hover:text-yellow-400 transition-colors">
                    {feature.name}
                  </span>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    );
  }

  export default FeatureBox;
