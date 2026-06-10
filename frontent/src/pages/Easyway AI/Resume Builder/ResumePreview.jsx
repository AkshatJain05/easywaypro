import React, { Suspense } from "react";

// --- Template Imports ---
import ResumeTemplate1 from "./ResumeTemplate/ResumeTemplate1";
import ResumeTemplate2 from "./ResumeTemplate/ResumeTemplate2";
import ResumeTemplate3 from "./ResumeTemplate/ResumeTemplate3";
import ResumeTemplate4 from "./ResumeTemplate/ResumeTemplate4";
import ResumeTemplate5 from "./ResumeTemplate/ResumeTemplate5";
import ResumeTemplate6 from "./ResumeTemplate/ResumeTemplate6";
import ResumeTemplate7 from "./ResumeTemplate/ResumeTemplate7";
import ResumeTemplate8 from "./ResumeTemplate/ResumeTemplate8";
import ResumeTemplate9 from "./ResumeTemplate/ResumeTemplate9";
import ResumeTemplate10 from "./ResumeTemplate/ResumeTemplate10";
import ResumeTemplate11 from "./ResumeTemplate/ResumeTemplate11";

const templateMap = {
  Template1: ResumeTemplate1,
  Template2: ResumeTemplate2,
  Template3: ResumeTemplate3,
  Template4: ResumeTemplate4,
  Template5: ResumeTemplate5,
  Template6: ResumeTemplate6,
  Template7: ResumeTemplate7,
  Template8: ResumeTemplate8,
  Template9: ResumeTemplate9,
  Template10: ResumeTemplate10,
  Template11: ResumeTemplate11,
};

// --- Internal Error Boundary ---
class ResumePreviewErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full w-full items-center justify-center p-10 text-red-500">
          Error loading this template. Please try another.
        </div>
      );
    }
    return this.props.children;
  }
}

// --- Main Preview Component ---
const ResumePreview = ({ resumeData, selectedTemplate }) => {
  const SelectedComponent = templateMap[selectedTemplate] || ResumeTemplate3;

  return (
    <div className="w-full h-full flex flex-col bg-black overflow-hidden shadow-inner">
      {/* DOCUMENT TOP BAR */}
      <div className="w-full px-6 py-2 bg-gray-950 border-b border-gray-200 flex justify-between items-center print:hidden">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Live Preview</span>
        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
          {selectedTemplate}
        </span>
      </div>

      {/* CANVAS */}
      <div className="w-full flex-1 overflow-y-auto p-4 md:p-8 flex justify-center">
        <div className="w-full max-w-[800px] min-h-[1050px] bg-white origin-top transition-all">
          <ResumePreviewErrorBoundary>
            <Suspense fallback={
              <div className="flex items-center justify-center h-full text-gray-400 italic">
                Loading Template...
              </div>
            }>
              <SelectedComponent resumeData={resumeData} />
            </Suspense>
          </ResumePreviewErrorBoundary>
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;