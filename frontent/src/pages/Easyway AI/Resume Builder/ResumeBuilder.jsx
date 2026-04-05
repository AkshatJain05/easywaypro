
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "./Header";
import PersonalInfo from "./PersonalInfo";
import Education from "./Education";
import Experience from "./Experience";
import Skills from "./Skills";
import Projects from "./Projects";
import Certifications from "./Certifications";
import ResumePreview from "./ResumePreview";
import ChatBot from "../../../component/ChatBot";
import { FaPrint, FaUndo, FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-hot-toast";
import axios from "axios";
import "../../../print.css";
import Loading from "../../../component/Loading";

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
  const { id } = useParams();
  const navigate = useNavigate();
  const debounceTimer = useRef(null);

  const [resumeData, setResumeData] = useState(initialResumeData);
  const [loading, setLoading] = useState(true);
  const [previewOnly, setPreviewOnly] = useState(false);

  const [selectedTemplate, setSelectedTemplate] = useState(
    localStorage.getItem("selectedTemplate") || "Template3",
  );

  const API_URL = import.meta.env.VITE_API_URL;

  /* ================= LOAD RESUME ================= */
  useEffect(() => {
    if (!id) return;

    const fetchResume = async () => {
      try {
        const res = await axios.get(`${API_URL}/resumes/${id}`);
        setResumeData(res.data);
      } catch {
        toast.error("Resume not found");
        navigate("/resume/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [id, API_URL, navigate]);

  /* ================= SAVE TEMPLATE ================= */
  useEffect(() => {
    localStorage.setItem("selectedTemplate", selectedTemplate);
  }, [selectedTemplate]);

  /* ================= CLEANUP DEBOUNCE ================= */
  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  /* ================= AUTO SAVE ================= */
  const debouncedSave = (data) => {
    if (!id) return;

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(async () => {
      try {
        await axios.put(`${API_URL}/resumes/${id}`, data);
      } catch {
        toast.error("Error saving resume");
      }
    }, 800);
  };

  const updateResumeData = (section, updatedSectionData) => {
    setResumeData((prev) => {
      const updated = { ...prev, [section]: updatedSectionData };
      debouncedSave(updated);
      return updated;
    });
  };

  /* ================= RESET ================= */
  const handleReset = () => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <p className="font-medium">Reset this resume?</p>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1 bg-gray-500 text-white rounded"
            >
              No
            </button>

            <button
              onClick={async () => {
                toast.dismiss(t.id);
                const loadingToast = toast.loading("Resetting...");

                try {
                  const { data } = await axios.put(
                    `${API_URL}/resumes/reset/${id}`,
                  );

                  setResumeData(data.data);

                  toast.dismiss(loadingToast);
                  toast.success("Resume reset successfully");
                } catch {
                  toast.dismiss(loadingToast);
                  toast.error("Failed to reset");
                }
              }}
              className="px-3 py-1 bg-red-600 text-white rounded"
            >
              Yes
            </button>
          </div>
        </div>
      ),
      { duration: 5000 },
    );
  };
  /* ================= PRINT ================= */
  const handlePrint = () => {
    window.print();
  };

  if (loading) return <Loading />;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-950 to-black text-white">
        {/* ACTION BAR */}
        <div className="print-hide sticky top-0 z-50 backdrop-blur-md bg-gray-950 border-b border-gray-800 shadow-lg">
          <div className="max-w-8xl mx-auto px-3 sm:px-6 py-3 flex flex-row md:flex-row md:items-center md:justify-between gap-3">
            {/* LEFT SECTION */}
            <div className="flex items-center justify-between w-full md:w-auto">
              <button
                onClick={() => navigate("/resume/dashboard")}
                className="flex items-center gap-2 text-sm sm:text-sm font-medium px-2 py-1 rounded-lg bg-gray-900 border border-gray-700 hover:bg-gray-800 transition"
              >
                ← Dashboard
              </button>

              {/* Mobile Title */}
              <h2 className="ml-3 text-sm sm:text-base text-center  text-gray-200 truncate max-w-[160px] sm:max-w-xs md:hidden">
                {resumeData.title || "Untitled Resume"}
              </h2>
            </div>

            {/* CENTER TITLE (Desktop) */}
            <div className="hidden md:flex justify-center flex-1 ">
              <h2 className="text-lg font-medium text-gray-200 px-4 py-1 rounded-lg  border-gray-700  shadow-sm">
                {resumeData.title || "Untitled Resume"}
              </h2>
            </div>

            {/* RIGHT ACTIONS */}
            <div className="flex items-center justify-end gap-2 sm:gap-3 ">
              {/* Preview Toggle */}
              <button
                onClick={() => setPreviewOnly(!previewOnly)}
                className="flex items-center gap-2 px-3 py-2 text-xs sm:text-sm rounded-lg bg-gray-800 border border-gray-700 hover:bg-gray-700 transition"
              >
                {previewOnly ? <FaEyeSlash /> : <FaEye />}
                <span className="hidden sm:inline">
                  {previewOnly ? "Edit Mode" : "Preview"}
                </span>
              </button>

              {/* Print Button */}
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md transition"
              >
                <FaPrint />
                <span className="hidden sm:inline">Save as PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* TEMPLATE HEADER */}
        <div className="print-hide max-w-8xl mx-auto px-3 sm:px-6 mt-4">
          <Header
            selectedTemplate={selectedTemplate}
            setSelectedTemplate={setSelectedTemplate}
          />
        </div>

        {/* </div> */}
        <main className="container mx-auto p-4 md:p-6">
          {previewOnly ? (
            <div className="bg-white text-black shadow-xl rounded-lg p-6">
              <ResumePreview
                resumeData={resumeData}
                selectedTemplate={selectedTemplate}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* FORM */}
              <div className="space-y-8 p-6 bg-gradient-to-br from-gray-950 to-black rounded-2xl shadow-lg border border-gray-700 print-hide">
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

                <div className="flex justify-end pt-4 gap-4 flex-wrap">
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    <FaPrint />
                    Save as PDF
                  </button>

                  <button
                    onClick={handleReset}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700"
                  >
                    <FaUndo />
                    Reset
                  </button>
                </div>
              </div>

              {/* PREVIEW */}
              <div className="bg-white text-black  rounded-lg">
                <ResumePreview
                  resumeData={resumeData}
                  selectedTemplate={selectedTemplate}
                />
              </div>
            </div>
          )}
        </main>
      </div>

      <div className="print-hide">
        <ChatBot context="resume" />
      </div>
    </>
  );
};

export default ResumeBuilder;











// import { useState, useEffect, useRef } from "react";
// import Header from "./Header";
// import PersonalInfo from "./PersonalInfo";
// import Education from "./Education";
// import Experience from "./Experience";
// import Skills from "./Skills";
// import Projects from "./Projects";
// import Certifications from "./Certifications";
// import ResumePreview from "./ResumePreview";
// import ChatBot from "../../../component/ChatBot";
// import { FaPrint, FaUndo } from "react-icons/fa";
// import { toast, Toaster } from "react-hot-toast";
// import axios from "axios";
// import "../../../print.css";
// import Loading from "../../../component/Loading";

// // Axios global config for cookie-based auth
// axios.defaults.withCredentials = true;

// const initialResumeData = {
//   personalInfo: {
//     name: "",
//     title: "",
//     email: "",
//     phone: "",
//     address: "",
//     linkedin: "",
//     github: "",
//     summary: "",
//     portfolio: "",
//   },
//   education: [],
//   experience: [],
//   skills: [],
//   projects: [],
//   certifications: [],
// };

// const ResumeBuilder = () => {
//   const [resumeData, setResumeData] = useState(initialResumeData);
//   const [resumeId, setResumeId] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const debounceTimer = useRef(null);
//    const [selectedTemplate, setSelectedTemplate] = useState("Template3")
//   const API_URL = import.meta.env.VITE_API_URL;

//   // Load resume on mount
//   useEffect(() => {
//     const fetchResume = async () => {
//       try {
//         const res = await axios.get(`${API_URL}/resumes`,{withCredentials: true}); // cookie sent automatically
//         if (res.data) {
//           setResumeData(res.data);
//           setResumeId(res.data._id);
//         }
//       } catch (err) {
//         console.log("No resume found or error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchResume();
//   }, []);

//   // Debounced save to backend
//   const debouncedSave = (data) => {
//     if (debounceTimer.current) clearTimeout(debounceTimer.current);

//     debounceTimer.current = setTimeout(async () => {
//       try {
//         if (!resumeId) {
//           const res = await axios.post(`${API_URL}/resumes`, data,{withCredentials: true});
//           setResumeId(res.data._id);
//         } else {
//           await axios.put(`${API_URL}/resumes/${resumeId}`, data,{withCredentials: true});
//         }
//         // toast.success("Auto-saved ", { duration: 1200 });
//       } catch (err) {
//         toast.error("Error saving resume");
//       }
//     }, 1000);
//   };

//   // Update section data and trigger debounced save
//   const updateResumeData = (section, updatedSectionData) => {
//     setResumeData((prev) => {
//       const updated = { ...prev, [section]: updatedSectionData };
//       debouncedSave(updated);
//       return updated;
//     });
//   };

//   // Print / Save PDF
//   const handlePrintAndSave = () => {
//     window.print();
//   };

//   // Reset all fields
//  const handleReset = () => {
//     toast((t) => (
//       <span>
//         Reset all fields?
//         <button
//           className="ml-3 px-3 py-1 bg-green-500 text-white rounded"
//           onClick={async () => {
//             toast.dismiss(t.id); // close confirm

//             // show loading
//             const loadingToast = toast.loading("Resetting...");
//             try {
//               const { data } = await axios.post(`${API_URL}/resumes/reset`, {
//                 withCredentials: true,
//               });

//               setResumeData(data.data);

//               // dismiss loading immediately
//               toast.dismiss(loadingToast);

//               // show success (auto dismiss after 5s)
//               const msg = toast.success("All fields reset", { duration: 3000 });
//               toast.dismiss(msg);
//             } catch (error) {
//               toast.dismiss(loadingToast);
//               const msg = toast.error("Failed to reset resume", {
//                 duration: 3000,
//               });
//               toast.dismiss(msg);
//             }
//           }}
//         >
//           Yes
//         </button>
//         <button
//           className="ml-2 px-3 py-1 bg-gray-500 text-white rounded"
//           onClick={() => toast.dismiss(t.id)}
//         >
//           No
//         </button>
//       </span>
//     ));
//   };

//   if(loading){
//     return <Loading/>
//   }
//   return (
//     <>
//       <div className="min-h-screen transition-colors duration-300">
//         <Header
//         selectedTemplate={selectedTemplate}
//         setSelectedTemplate={setSelectedTemplate}
//       />
//         <main className="container mx-auto p-4 md:p-6">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//             {/* Input Forms */}
//             <div className="space-y-8 p-6 bg-gradient-to-br from-gray-950 to-black rounded-2xl shadow-lg print-hide border-2 border-gray-600">
//               <PersonalInfo
//                 resumeData={resumeData}
//                 updateResumeData={updateResumeData}
//               />
//               <Education
//                 resumeData={resumeData}
//                 updateResumeData={updateResumeData}
//               />
//               <Experience
//                 resumeData={resumeData}
//                 updateResumeData={updateResumeData}
//               />
//               <Skills
//                 resumeData={resumeData}
//                 updateResumeData={updateResumeData}
//               />
//               <Projects
//                 resumeData={resumeData}
//                 updateResumeData={updateResumeData}
//               />
//               <Certifications
//                 resumeData={resumeData}
//                 updateResumeData={updateResumeData}
//               />

//               {/* Reset & Print */}
//               <div className="flex justify-end items-center pt-4 space-x-4">
//                 <button
//                   onClick={handleReset}
//                   className="flex items-center space-x-2 px-3 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
//                 >
//                   <FaUndo />
//                   <span>Reset</span>
//                 </button>
//                 <button
//                   onClick={handlePrintAndSave}
//                   className="flex items-center space-x-2 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                 >
//                   <FaPrint />
//                   <span>Save as PDF/Print</span>
//                 </button>
//               </div>
//             </div>

//             {/* Live Preview */}
//             <div>
//               <div className="sticky top-8 print-static">
//                 <ResumePreview resumeData={resumeData} selectedTemplate={selectedTemplate} />
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>
//       <ChatBot context="resume" />
//     </>
//   );
// };

// export default ResumeBuilder;
