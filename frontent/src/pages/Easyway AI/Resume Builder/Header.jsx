import TemplateSelector from "./TemplateSelector";

const Header = ({ selectedTemplate, setSelectedTemplate }) => {
  return (
    <header className="w-full p-2 shadow ">
      <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-semibold text-center sm:text-left">
          Resume Builder
        </h1>

        {/* Template Selector */}
        <TemplateSelector
          selectedTemplate={selectedTemplate}
          onChange={setSelectedTemplate}
        />
      </div>
    </header>
  );
};

export default Header;
