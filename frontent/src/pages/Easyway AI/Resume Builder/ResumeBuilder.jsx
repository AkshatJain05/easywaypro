import { useState, useEffect, useRef } from "react";
import Header from "./Header";
import PersonalInfo from "./PersonalInfo";
import Education from "./Education";
import Experience from "./Experience";
import Skills from "./Skills";
import Projects from "./Projects";
import Certifications from "./Certifications";
import ResumePreview from "./ResumePreview";
import ChatBot from "../../../component/ChatBot";
import { FaPrint, FaUndo } from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import "../../../print.css";
import Loading from "../../../component/Loading";

// Axios global config for cookie-based auth
axios.defaults.withCredentials = true;

const initialResumeData = {
  personalInfo: {
    name: "",
    title: "",
    email: "",
    phone: "",
    address: "",
    linkedin: "",
    github: "",
    summary: "",
    portfolio: "",
  },
  education: [],
  experience: [],
  skills: [],
  projects: [],
  certifications: [],
};

const ResumeBuilder = () => {
  const [resumeData, setResumeData] = useState(initialResumeData);
  const [resumeId, setResumeId] = useState(null);
  const [loading, setLoading] = useState(true);
  const debounceTimer = useRef(null);
   const [selectedTemplate, setSelectedTemplate] = useState("Template1")
  const API_URL = import.meta.env.VITE_API_URL;

  // Load resume on mount
  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await axios.get(`${API_URL}/resumes`,{withCredentials: true}); // cookie sent automatically
        if (res.data) {
          setResumeData(res.data);
          setResumeId(res.data._id);
        }
      } catch (err) {
        console.log("No resume found or error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResume();
  }, []);

  // Debounced save to backend
  const debouncedSave = (data) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(async () => {
      try {
        if (!resumeId) {
          const res = await axios.post("/resumes", data,{withCredentials: true});
          setResumeId(res.data._id);
        } else {
          await axios.put(`${API_URL}/resumes/${resumeId}`, data,{withCredentials: true});
        }
        // toast.success("Auto-saved ", { duration: 1200 });
      } catch (err) {
        toast.error("Error saving resume");
      }
    }, 1000);
  };

  // Update section data and trigger debounced save
  const updateResumeData = (section, updatedSectionData) => {
    setResumeData((prev) => {
      const updated = { ...prev, [section]: updatedSectionData };
      debouncedSave(updated);
      return updated;
    });
  };

  // Print / Save PDF
  const handlePrintAndSave = () => {
    window.print();
  };

  // Reset all fields
  const handleReset = () => {
  toast((t) => (
    <span>
       Reset all fields?
      <button
        className="ml-3 px-3 py-1 bg-green-500 text-white rounded"
        onClick={async () => {
          try {
            const { data } = await axios.post(`${API_URL}/resumes/reset`,{withCredentials: true});
            setResumeData(data.data);
            toast.dismiss(t.id);
            toast.success("All fields reset")
          } catch (error) {
            toast.error("Failed to reset resume");
          }
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


  if(loading){
    return <Loading/>
  }
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="min-h-screen transition-colors duration-300">
        <Header
        selectedTemplate={selectedTemplate}
        setSelectedTemplate={setSelectedTemplate}
      />
        <main className="container mx-auto p-4 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Forms */}
            <div className="space-y-8 p-6 bg-gradient-to-br from-gray-950 to-black rounded-2xl shadow-lg print-hide border-2 border-gray-600">
              <PersonalInfo
                resumeData={resumeData}
                updateResumeData={updateResumeData}
              />
              <Education
                resumeData={resumeData}
                updateResumeData={updateResumeData}
              />
              <Experience
                resumeData={resumeData}
                updateResumeData={updateResumeData}
              />
              <Skills
                resumeData={resumeData}
                updateResumeData={updateResumeData}
              />
              <Projects
                resumeData={resumeData}
                updateResumeData={updateResumeData}
              />
              <Certifications
                resumeData={resumeData}
                updateResumeData={updateResumeData}
              />

              {/* Reset & Print */}
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
                <ResumePreview resumeData={resumeData} selectedTemplate={selectedTemplate} />
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
