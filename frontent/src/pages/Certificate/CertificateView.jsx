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
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-black">
      {/* Control Buttons */}
      <div className="flex justify-between items-center w-full max-w-6xl mb-8 no-print">
        <button
          onClick={handleGoBack}
          className="flex items-center space-x-1 text-white hover:text-gray-300 transition duration-200"
        >
          <IoIosArrowBack className="w-5 h-5" />
          <span>Go Back</span>
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-900 hover:to-blue-950 text-white font-medium py-2 px-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-[1.02]"
        >
          <MdOutlinePrint className="w-5 h-5" />
          <span>Print / Save PDF</span>
        </button>
      </div>

      {/* Certificate Container */}
      <div className="certificate-container w-full flex justify-center">
        <div
          ref={certificateRef}
          className="certificate-content relative w-full max-w-[1000px] aspect-[11/5] bg-white rounded-xl shadow-2xl p-6 md:p-12 lg:p-16 flex flex-col items-center justify-between"
          style={{
            backgroundImage:`url(${Certificates})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="w-full flex flex-col items-center mt-4 md:mt-6 text-black">
            {/* Company Name */}
            <h1 className="text-3xl md:text-5xl font-bold text-center text-indigo-900">Easyway Pro</h1>
            {/* Certificate Title */}
            <h2 className="text-xl md:text-3xl  italic text-center text-gray-900 mt-2 md:mt-4 font-semibold">Certificate of Achievement</h2>

            {/* Recipient */}
            <p className="text-sm md:text-lg text-center text-gray-800 mt-4">This is awarded to</p>
            <h3 className="text-2xl md:text-5xl font-bold my-2 md:my-4 text-center">{certificate.name || "Student Name"}</h3>

            {/* Description */}
            <p className="text-center text-sm md:text-lg text-gray-800 mt-2 md:mt-4 px-4 md:px-12 leading-relaxed">{descriptiveText}</p>

            {/* Course */}
            <p className="text-center text-sm md:text-lg text-gray-900 font-medium mt-4 md:mt-6">For successfully completing the course:</p>
            <h4 className="text-xl md:text-3xl font-bold text-blue-800 my-2 md:my-4 text-center">{certificate.subject}</h4>

            {/* Date */}
            <p className="text-center text-xs md:text-base text-gray-900 mt-2">
              Awarded on: <span className="font-semibold">{new Date(certificate.date).toLocaleDateString("en-US", { year:'numeric', month:'long', day:'numeric' })}</span>
            </p>
          </div>

          {/* Signature on the right */}
          <div className="w-full flex justify-end items-end mt-6 md:mt-8 px-4 md:px-12 relative">
            <div className="flex flex-col items-center">
              <img className="w-32 md:w-48 h-auto mb-1 md:mb-2" />
              <p className="text-gray-900 font-semibold text-sm md:text-lg">Akshat Jain</p>
              <p className="text-indigo-800 text-xs md:text-sm font-medium">Founder</p>
            </div>
          </div>

          {/* Certificate ID & URL at bottom-left */}
          <p className="absolute md:bottom-17 md:left-16  bottom-4 left-4 text-xs md:text-sm text-gray-900 break-words max-w-[50%]">
            Certificate ID: <span className="font-mono">{certificate.certificateId}</span><br/>
            Verify at: <span className="text-blue-700">{window.location.origin}/certificate/{certificate.certificateId}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
