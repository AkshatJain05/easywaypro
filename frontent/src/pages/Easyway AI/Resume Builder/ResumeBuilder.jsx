import useLocalStorage from "./hooks/useLocalStorage";
import Header from "./Header";
import PersonalInfo from "./PersonalInfo";
import Education from "./Education";
import Experience from "./Experience";
import Skills from "./Skills";
import Projects from "./Projects";
import ResumePreview from "./ResumePreview";
import { FaPrint, FaUndo } from "react-icons/fa";
import "../../../print.css";
import {Toaster, toast } from "react-hot-toast";
import Certifications from "./Certifications";
import ChatBot from "../../../component/ChatBot";

const initialResumeData = {
  personalInfo: {
    name: "",
    email: "",
    phone: "",
    address: "",
    linkedin: "",
    github: "",
    summary: "",
  },
  education: [],
  experience: [],
  skills: [],
  projects: [],
  certifications:[],
};

const ResumeBuilder = () => {
  // Use the initialResumeData constant for the local storage hook
  const [resumeData, setResumeData] = useLocalStorage(
    "fresherResumeDataV1",
    initialResumeData
  );

  const handlePrintAndSave = () => {
    window.print();
  };

  // 3. Create the handleReset function
  const handleReset = () => {
    // Instead of confirm, show toast with undo option
    toast((t) => (
      <span>
        ⚠️ Reset all fields?
        <button
          className="ml-3 px-3 py-1 bg-green-500 text-white rounded"
          onClick={() => {
            setResumeData(initialResumeData);
            // toast.dismiss(t.id);
            // toast.success("All fields reset ✅");
            toast.dismiss();
          }}
        >
          Yes
        </button>
        <button
          className="ml-2 px-3 py-1 bg-gray-500 text-white rounded"
          onClick={() => toast.dismiss(t.id)}
        >
          No
        </button>
      </span>
    ));
  };

  return (
    <>
    <div className={`min-h-screen transition-colors duration-300`}>
      {/* <Toaster position="top-center" reverseOrder={false} /> */}
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Forms */}
          <div className="space-y-8 p-6 bg-gray-900 rounded-2xl shadow-lg print-hide">
            <PersonalInfo
              resumeData={resumeData}
              setResumeData={setResumeData}
            />
            <Education resumeData={resumeData} setResumeData={setResumeData} />
            <Experience resumeData={resumeData} setResumeData={setResumeData} />
            <Skills resumeData={resumeData} setResumeData={setResumeData} />
            <Projects resumeData={resumeData} setResumeData={setResumeData} />
            <Certifications resumeData={resumeData} setResumeData={setResumeData}/>

            {/* 4. Add the Reset button next to the Print button */}
            <div className="flex justify-end items-center pt-4 space-x-4">
              <button
                onClick={handleReset}
                className="flex items-center space-x-2 px-3 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                <FaUndo />
                <span>Reset</span>
              </button>
              <button
                onClick={handlePrintAndSave}
                className="flex items-center space-x-2 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FaPrint />
                <span>Save as PDF/Print</span>
              </button>
            </div>
          </div>

          {/* Live Preview */}
          <div>
            <div className="sticky top-8 print-static">
              <ResumePreview resumeData={resumeData} />
            </div>
          </div>
        </div>
      </main>
    </div>
    <ChatBot context="resume" />
    </>
    
  );
};

export default ResumeBuilder;
