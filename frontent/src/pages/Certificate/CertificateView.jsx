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
    @page {
      size: A4 landscape;
      margin: 0;
    }

    body {
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    .no-print {
      display: none !important;
    }

    body * {
      visibility: hidden;
    }

    .certificate-container, .certificate-container * {
      visibility: visible;
    }

    .certificate-container {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .certificate-content {
      width: 11in !important;
      height: 7.5in !important;
      box-shadow: none !important;
      border: none !important;
      transform: scale(1.0) !important; /* Adjust scale if needed for perfect fit */
      background-size: cover !important;
      background-position: center !important;
    }
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
    axios
      .get(`${API_URL}/quiz/certificate/${certificateId}`)
      .then((res) => {
        setCertificate(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Certificate not found.");
        navigate("/certificates");
      });
  }, [certificateId]);

  if (loading) return <p className="text-center mt-10 text-gray-400"><Loading/></p>;

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
    <div className="min-h-screen flex flex-col items-center justify-center  px-4 py-10">
      
      {/* Control Buttons */}
      <div className="flex justify-between items-center w-full max-w-6xl mb-8 no-print">
        <button
          onClick={handleGoBack}
          className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-800 transition duration-200"
        >
          <IoIosArrowBack className="w-5 h-5" />
          <span>Go Back</span>
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium py-2 px-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-[1.02]"
        >
          <MdOutlinePrint className="w-5 h-5" />
          <span>Print / Save PDF</span>
        </button>
      </div>

      {/* Certificate Container */}
      <div className="certificate-container w-full flex justify-center">
        <div
          ref={certificateRef}
          className=" certificate-content relative w-[11in] h-[8.5in] bg-yellow-50 border-5 border-blue-950 p-12 md:p-16 lg:p-20"
          style={{
            backgroundImage:`url(${Certificates})`, // Place your certificate template image in public folder
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Company Name */}
          <h1 className="text-5xl font-bold text-center text-indigo-800 mt-8">
            Easyway Pro
          </h1>

          {/* Certificate Title */}
          <h2 className="text-3xl md:text-4xl font-light italic text-center text-gray-700 mt-4">
            Certificate of Achievement
          </h2>

          {/* Recipient Name */}
          <p className="text-center text-lg md:text-xl text-gray-700 mt-6">
            This is awarded to
          </p>
          <h3 className="text-center text-5xl md:text-6xl font-extrabold text-gray-900 my-6">
            {certificate.name || "Student Name"}
          </h3>

          {/* Description */}
          <p className="text-center text-lg md:text-xl text-gray-700 mt-4 px-8 leading-relaxed">
            {descriptiveText}
          </p>

          {/* Subject */}
          <p className="text-center text-lg md:text-xl text-gray-700 font-medium mt-6">
            For successfully completing the course:
          </p>
          <h4 className="text-center text-3xl md:text-4xl font-bold text-blue-700 my-4">
            {certificate.subject}
          </h4>

          {/* Date */}
          <p className="text-center text-base text-gray-600 mt-2">
            Awarded on:{" "}
            <span className="font-semibold text-gray-800">
              {new Date(certificate.date).toLocaleDateString("en-US", { year:'numeric', month:'long', day:'numeric' })}
            </span>
          </p>

          {/* Signature */}
          <div className="absolute bottom-19 md:bottom-25 right-12 flex flex-col items-center">
            <img
              // src="https://i.ibb.co/0jFYhY5/signature.png"
              // alt="Founder Signature"
              className="w-48 h-auto mb-2"
            />
            <p className="text-gray-800 font-semibold text-lg">Akshat Jain</p>
            <p className="text-indigo-600 text-sm font-medium">Founder</p>
          </div>

          {/* Certificate ID & URL */}
          <p className="absolute bottom-25 left-17 text-xs text-gray-600">
            Certificate ID: <span className="font-mono">{certificate.certificateId}</span><br/>
            Verify at: <span className="text-blue-600 break-words">{window.location.origin}/certificate/{certificate.certificateId}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
