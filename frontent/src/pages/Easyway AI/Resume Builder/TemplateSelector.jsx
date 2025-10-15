const templates = [
  { name: "BluePro — Modern Professional Design", value: "Template3" },
  { name: "Classic — Education Focus (With Titles)", value: "Template6" },
  { name: "IndigoPro — Modern Professional Design", value: "Template9" },
  { name: "Minimal — Education Focus (No Title)", value: "Template1" },
  { name: "Two-Column Simple Layout", value: "Template2" },
  { name: "Minimal — No Skill Category", value: "Template4" },
  { name: "Clean Layout (No Divider Lines)", value: "Template5" },
  { name: "Professional — Skills & Projects Focus", value: "Template7" },
  { name: "Modern Two-Column Resume", value: "Template8" },
];
const TemplateSelector = ({ selectedTemplate, onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <label className="font-medium text-gray-200">Select Template:</label>
      <select
        className="border border-gray-300 rounded px-2 py-1 w-[200px] md:w-[290px]"
        value={selectedTemplate}
        onChange={(e) => onChange(e.target.value)}
      >
        {templates.map((template) => (
          <option
            key={template.value}
            className="text-gray-200 bg-slate-950"
            value={template.value}
          >
            {template.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TemplateSelector;
export { templates };
