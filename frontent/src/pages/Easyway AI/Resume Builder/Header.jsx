import TemplateSelector from "./TemplateSelector";

const Header = ({ selectedTemplate, setSelectedTemplate }) => {
  return (
    <header className="w-full p-2 shadow ">
      <div className="container  px-1 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Title */}
        <h1 className="text-3xl flex gap-2 sm:text-4xl text-center bg-white text-transparent bg-clip-text font-bold sm:text-left">
          Resume <p className="text-blue-500">Builder</p>
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
