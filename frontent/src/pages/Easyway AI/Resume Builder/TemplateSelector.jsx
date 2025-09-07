const templates = [
  { name: "Template 1", value: "Template1" },
  { name: "Template 2", value: "Template2" },
  { name: "Template 3", value: "Template3" },
  { name: "Template 4", value: "Template4" },
  { name: "Template 5", value: "Template5" },
  { name: "Template 6", value: "Template6" },
];

const TemplateSelector = ({ selectedTemplate, onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <label className="font-medium text-gray-200">Select Template:</label>
      <select
        className="border border-gray-300 rounded px-2 py-1"
        value={selectedTemplate}
        onChange={(e) => onChange(e.target.value)}
      >
        {templates.map((template) => (
          <option key={template.value} className="text-gray-200 bg-slate-950" value={template.value}>
            {template.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TemplateSelector;
export { templates };
