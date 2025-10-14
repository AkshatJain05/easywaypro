import ResumeTemplate1 from "./ResumeTemplate/ResumeTemplate1";
import ResumeTemplate2 from "./ResumeTemplate/ResumeTemplate2";
import ResumeTemplate3 from "./ResumeTemplate/ResumeTemplate3";
import ResumeTemplate4 from "./ResumeTemplate/ResumeTemplate4";
import ResumeTemplate5 from "./ResumeTemplate/ResumeTemplate5";
import ResumeTemplate6 from "./ResumeTemplate/ResumeTemplate6";
import ResumeTemplate7 from "./ResumeTemplate/ResumeTemplate7";
import ResumeTemplate8 from "./ResumeTemplate/ResumeTemplate8";
import ResumeTemplate9 from "./ResumeTemplate/ResumeTemplate9";

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
};

const ResumePreview = ({ resumeData, selectedTemplate }) => {
  const SelectedComponent = templateMap[selectedTemplate] || ResumeTemplate6;
  return <SelectedComponent resumeData={resumeData} />;
};

export default ResumePreview;
