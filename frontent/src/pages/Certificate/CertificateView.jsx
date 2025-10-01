import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { MdOutlinePrint } from "react-icons/md"; 
import { IoIosArrowBack } from "react-icons/io"; 
import Certificates from "../../assets/certificate.png";
import Loading from "../../component/Loading.jsx"
import { toast } from "react-hot-toast";

const printStyles = `
  @media print {
    @page { size: A4 landscape; margin: 0; }
    body { margin:0; padding:0; background: #000 !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    .no-print { display:none !important; }
    body * { visibility:hidden; }
    .certificate-container, .certificate-container * { visibility:visible; }
    .certificate-container { position:absolute; left:0; top:0; right:0; bottom:0; display:flex; align-items:center; justify-content:center; }
    .certificate-content { width:95%; max-width:1000px; height:auto; box-shadow:none !important; border:none !important; background-size:cover !important; background-position:center !important; transform:scale(1.0) !important; }
  }
`;

export default function CertificateView() {
  const { certificateId } = useParams();
  const navigate = useNavigate();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const certificateRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios.get(`${API_URL}/quiz/certificate/${certificateId}`)
      .then(res => {
        setCertificate(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        toast.error("Certificate not found.");
        navigate("/certificates");
      });
  }, [certificateId]);

  if (loading) return <div className="flex justify-center mt-10"><Loading /></div>;

  const handlePrint = () => {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = printStyles;
    document.head.appendChild(styleSheet);
    window.print();
    document.head.removeChild(styleSheet);
  };

  const handleGoBack = () => navigate('/certificates');

  const descriptiveText = 
    "This certificate recognizes the dedication, effort, and successful completion of all curriculum requirements, achieving certified proficiency in the subject matter.";

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Control Buttons - Hidden on print */}
      <div className="no-print w-full max-w-5xl flex justify-between items-center mb-6">
        <button
          onClick={handleGoBack}
          className="flex items-center gap-2 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-300"
        >
          <IoIosArrowBack size={20} />
          <span className="text-sm font-medium">Go Back</span>
        </button>
        {/* Hide print button on smaller screens for better mobile UX */}
        <button
          onClick={handlePrint}
          className="hidden sm:flex items-center gap-2 bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
        >
          <MdOutlinePrint size={20} />
          <span className="text-sm">Print / Save as PDF</span>
        </button>
      </div>

      {/* Certificate Container - This is what will be printed */}
      <div className="certificate-container w-full flex justify-center">
        <div
          ref={certificateRef}
          className="certificate-content relative w-full max-w-5xl aspect-[297/210] bg-white shadow-2xl flex flex-col justify-between p-6 sm:p-8 md:p-12"
          style={{
            backgroundImage: `url(${Certificates})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Main Content */}
          <div className="w-full text-center text-gray-950 mt-19">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-indigo-900">Easyway Pro</h1>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold italic text-gray-800 mt-2">Certificate of Achievement</h2>
            
            <p className="text-sm sm:text-base md:text-lg mt-6 sm:mt-8">This certificate is proudly presented to</p>
            <h3 className="text-2xl sm:text-4xl md:text-5xl font-bold text-black my-2 sm:my-3">
              {certificate.name || "Student Name"}
            </h3>
            
            <p className="text-xs sm:text-sm md:text-base max-w-3xl mx-auto mt-4 leading-snug">{descriptiveText}</p>
            
            <p className="text-sm sm:text-base md:text-lg font-medium mt-4 sm:mt-6">for successfully completing the course</p>
            <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-800 my-2">
              {certificate.subject}
            </h4>
            
            <p className="text-xs sm:text-sm md:text-base mt-4">
              Awarded on: <span className="font-semibold">{new Date(certificate.date).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </p>
          </div>

          {/* Footer Section */}
          <div className="w-full flex justify-between items-end mt-4 sm:mt-2 mb-12 px-2">
            {/* Certificate ID & URL */}
            <div className="text-left text-xs sm:text-sm text-gray-700 max-w-[50%]">
              <p className="font-semibold">Certificate ID: <span className="font-mono">{certificate.certificateId}</span></p>
              <p className="break-words">Verify at: <span className="text-blue-600 font-medium">{`${window.location.origin}/certificate/${certificate.certificateId}`}</span></p>
            </div>
            
            {/* Signature */}
            <div className="text-center">
              {/* Add your signature image source here */}
              {/* <img src="/path/to/signature.png" alt="Signature" className="w-28 sm:w-36 h-auto mx-auto" /> */}
              <div className=" border-gray-600 pt-1 mt-8 sm:mt-12">
                <p className="font-bold text-sm sm:text-base text-gray-800">Akshat Jain</p>
                <p className="text-xs sm:text-sm font-medium text-indigo-800">Founder, Easyway Pro</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
