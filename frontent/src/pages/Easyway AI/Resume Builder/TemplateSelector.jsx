import { useState, useRef, useEffect, useMemo } from "react";
import {
  FaChevronDown,
  FaCheckCircle,
  FaLayerGroup,
  FaSearch,
} from "react-icons/fa";

const templates = [
  { name: "BluePro", desc: "Modern Professional Design", value: "Template3" },
  { name: "Classic", desc: "Education Focus (With Titles)", value: "Template6" },
  { name: "IndigoPro", desc: "Modern Professional Design", value: "Template9" },
  { name: "Minimal", desc: "Education Focus (No Title)", value: "Template1" },
  { name: "Two-Column Simple", desc: "Simple Layout", value: "Template2" },
  { name: "Minimal Skills", desc: "No Skill Category", value: "Template4" },
  { name: "Clean Layout", desc: "No Divider Lines", value: "Template5" },
  { name: "Professional", desc: "Skills & Projects Focus", value: "Template7" },
  { name: "Modern Two-Column", desc: "Resume Layout", value: "Template8" },
  { name: "IndigoPro 2", desc: "Modern Professional Design", value: "Template10" },
  { name: "BluePro 2", desc: "Modern Professional Design", value: "Template11" },
];

const TemplateSelector = ({ selectedTemplate, onChange }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);

  const selected =
    templates.find((t) => t.value === selectedTemplate) || templates[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredTemplates = useMemo(() => {
    return templates.filter(
      (template) =>
        template.name.toLowerCase().includes(search.toLowerCase()) ||
        template.desc.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <div ref={ref} className="relative w-full sm:w-auto">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="
          flex items-center gap-2
          w-full sm:w-[250px]
          h-11
          px-3
          rounded-xl
          border border-slate-800
          bg-slate-950
          hover:border-indigo-500/40
          transition-all duration-300
        "
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-blue-500 flex items-center justify-center flex-shrink-0">
          <FaLayerGroup className="text-white text-xs" />
        </div>

        <div className="flex-1 min-w-0 text-center">
          <p className="text-[10px] uppercase tracking-wider text-slate-500">
            Template
          </p>

          <h4 className="text-xs sm:text-sm font-semibold text-white truncate">
            {selected.name}
          </h4>
        </div>

        <FaChevronDown
          className={`text-slate-500 text-xs transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="
            absolute right-0 mt-2
            w-[90vw] max-w-[280px] sm:w-[320px]
            rounded-2xl
            overflow-hidden
            border border-slate-800
            bg-[#09090B]
            shadow-[0_20px_50px_rgba(0,0,0,0.65)]
            z-50
          "
        >
          {/* Header */}
          <div className="p-3 border-b border-slate-800">
            <h3 className="text-sm font-semibold text-white">
              Choose Template
            </h3>

            <p className="text-[11px] text-slate-500 mt-0.5">
              Select your resume design
            </p>

            <div className="relative mt-2">
              <FaSearch className="absolute left-3 top-3 text-[10px] text-slate-500" />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search template..."
                className="
                  w-full
                  h-9
                  pl-8 pr-3
                  rounded-lg
                  bg-slate-950
                  border border-slate-800
                  text-xs text-white
                  placeholder:text-slate-500
                  outline-none
                  focus:border-indigo-500
                "
              />
            </div>
          </div>

          {/* List */}
          <div className="max-h-[250px] sm:max-h-[320px] overflow-y-auto p-2">
            {filteredTemplates.map((template) => {
              const active =
                template.value === selectedTemplate;

              return (
                <button
                  key={template.value}
                  onClick={() => {
                    onChange(template.value);
                    setOpen(false);
                  }}
                  className={`
                    w-full
                    flex items-center justify-between
                    p-2.5
                    rounded-xl
                    mb-1
                    text-left
                    transition-all duration-200
                    ${
                      active
                        ? "bg-indigo-500/10 border border-indigo-500/20"
                        : "border border-transparent hover:bg-slate-900"
                    }
                  `}
                >
                  <div className="min-w-0">
                    <h4
                      className={`text-xs font-medium truncate ${
                        active
                          ? "text-indigo-300"
                          : "text-white"
                      }`}
                    >
                      {template.name}
                    </h4>

                    <p className="text-[10px] text-slate-500 truncate">
                      {template.desc}
                    </p>
                  </div>

                  {active && (
                    <FaCheckCircle className="text-indigo-400 text-sm flex-shrink-0" />
                  )}
                </button>
              );
            })}

            {filteredTemplates.length === 0 && (
              <div className="py-5 text-center text-xs text-slate-500">
                No templates found
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-800 px-3 py-2 flex items-center justify-between">
            <span className="text-[10px] text-slate-500">
              {templates.length} Templates
            </span>

            <span className="text-[10px] text-indigo-400">
              Premium Designs
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateSelector;
export { templates };