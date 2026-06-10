import TemplateSelector from "./TemplateSelector";
import { FaFileAlt } from "react-icons/fa";

const Header = ({ selectedTemplate, setSelectedTemplate }) => {
  return (
    <header className="sticky top-0 z-50 border-b border-indigo-500/20 bg-[#090912]/85 backdrop-blur-xl supports-[backdrop-filter]:bg-[#090912]/70">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-3">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 py-4">

          {/* Logo Section */}
          <div className="flex items-center gap-3 w-full lg:w-auto justify-center lg:justify-start">

            <div className="hidden md:flex w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-800 to-blue-900  items-center justify-center shadow-lg shadow-indigo-500/20 flex-shrink-0">
              <FaFileAlt className="text-white text-lg" />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-gray-100">
                  Resume
                  <span className="ml-2 bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Builder
                  </span>
                </h1>

                <span className="px-2 py-0.5 text-[10px] sm:text-xs font-semibold rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300">
                  PRO
                </span>
              </div>

              <p className="text-xs text-slate-400 hidden sm:block">
                Create professional resumes in minutes
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="w-full lg:w-auto flex justify-center  lg:justify-end">
            <div className="w-full sm:w-auto flex justify-center">
              <TemplateSelector
                selectedTemplate={selectedTemplate}
                onChange={setSelectedTemplate}
              />
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Glow Line */}
      <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
    </header>
  );
};

export default Header;