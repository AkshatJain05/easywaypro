import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { MdOutlinePrint } from "react-icons/md";
import { FaDownload } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import Certificates from "../../assets/certificate.png";
import Loading from "../../component/Loading.jsx";
import { toast } from "react-hot-toast";

// --- Constants for Consistency and Quality ---
const COMPANY_NAME = "Easyway Pro";
const SIGNATURE_NAME = "Akshat Jain";
const SIGNATURE_TITLE = "Founder, Easyway Pro";
const DOWNLOAD_WIDTH = 1056; // Fixed pixel dimensions for high-res download
const DOWNLOAD_HEIGHT = 816;
const DESCRIPTIVE_TEXT =
  "This certificate recognizes the dedication, effort, and successful completion of all curriculum requirements, achieving certified proficiency in the subject matter.";

// --- Helper Function: Wrap Text on Canvas (Remains the same) ---
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  let lineCount = 0;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, y + lineCount * lineHeight);
      line = words[n] + " ";
      lineCount++;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, y + lineCount * lineHeight);
  return y + (lineCount + 1) * lineHeight;
}

// -------------------------------------------------------------------------

export default function CertificateView() {
  const { certificateId } = useParams();
  const navigate = useNavigate();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  // 1. Data Fetching
  useEffect(() => {
    axios
      .get(`${API_URL}/quiz/certificate/${certificateId}`)
      .then((res) => {
        setCertificate(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Certificate fetch error:", err);
        toast.error("Certificate not found or expired.");
        setTimeout(() => navigate("/certificates"), 2000);
      });
  }, [certificateId, API_URL, navigate]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <Loading />
      </div>
    );

  if (!certificate) return null;

  // 2. Download Function (Pure Canvas - Logic is independent of screen size)
  const handleDownload = () => {
    setIsDownloading(true);
    const toastId = toast.loading("Generating certificate image...", {
      id: "download",
    });

    const canvas = document.createElement("canvas");
    canvas.width = DOWNLOAD_WIDTH;
    canvas.height = DOWNLOAD_HEIGHT;
    const ctx = canvas.getContext("2d");

    const bgImage = new Image();
    bgImage.src = Certificates;
    bgImage.crossOrigin = "anonymous";

    const loadPromise = new Promise((resolve, reject) => {
      bgImage.onload = resolve;
      bgImage.onerror = () =>
        reject(
          "Failed to load background image. Check the path and CORS settings."
        );
    });

    loadPromise
      .then(() => {
        try {
          // --- Drawing Logic (Canvas) ---
          ctx.drawImage(bgImage, 0, 0, DOWNLOAD_WIDTH, DOWNLOAD_HEIGHT);
          ctx.textAlign = "center";

          // Header
          ctx.font = "bold 55px 'Arial'";
          ctx.fillStyle = "#1E40AF";
          ctx.fillText(COMPANY_NAME, DOWNLOAD_WIDTH / 2, 170);

          ctx.font = "italic 32px 'Arial'";
          ctx.fillStyle = "#374151";
          ctx.fillText("Certificate of Achievement", DOWNLOAD_WIDTH / 2, 230);

          ctx.font = "18px 'Arial'";
          ctx.fillStyle = "#374151";
          ctx.fillText(
            "This certificate is proudly presented to",
            DOWNLOAD_WIDTH / 2,
            280
          );

          // Recipient Name
          ctx.font = "bold 48px 'Times New Roman'";
          ctx.fillStyle = "#000";
          ctx.fillText(certificate.name, DOWNLOAD_WIDTH / 2, 350);

          // Description
          ctx.font = "20px 'Arial'";
          ctx.fillStyle = "#374151";
          const nextY = wrapText(
            ctx,
            DESCRIPTIVE_TEXT,
            DOWNLOAD_WIDTH / 2,
            400,
            DOWNLOAD_WIDTH * 0.7,
            30
          );

          ctx.font = "18px 'Arial'";
          ctx.fillStyle = "#374151";
          ctx.fillText(
            " for successfully completing the course",
            DOWNLOAD_WIDTH / 2,
            475
          );

          // Subject
          ctx.font = "bold 28px 'Arial'";
          ctx.fillStyle = "#1D4ED8";
          ctx.fillText(certificate.subject, DOWNLOAD_WIDTH / 2, nextY + 60);

          // Date
          const dateString = new Date(certificate.date).toLocaleDateString(
            "en-GB",
            {
              day: "numeric",
              month: "long",
              year: "numeric",
            }
          );
          ctx.font = "18px 'Arial'";
          ctx.fillStyle = "#111827";
          ctx.fillText(
            `Awarded on: ${dateString}`,
            DOWNLOAD_WIDTH / 2,
            nextY + 100
          );

          // --- Footer (Signature & Details) ---

          const signatureX = DOWNLOAD_WIDTH - 150;
          const signatureY = DOWNLOAD_HEIGHT - 120;

          // Signature Line
          // ctx.strokeStyle = "#000";
          // ctx.lineWidth = 1.5;
          // ctx.beginPath();
          // ctx.moveTo(signatureX - 100, signatureY - 55);
          // ctx.lineTo(signatureX + 100, signatureY - 55);
          // ctx.stroke();

          // Issuer Details (Center aligned to the line)
          ctx.textAlign = "center";
          ctx.font = "bold 18px 'Arial'";
          ctx.fillStyle = "#0F172A";
          ctx.fillText(SIGNATURE_NAME, signatureX, signatureY);

          ctx.font = "16px 'Arial'";
          ctx.fillStyle = "#1D4ED8";
          ctx.fillText(SIGNATURE_TITLE, signatureX, signatureY + 25);

          // Verification Details (Left Aligned)
          const detailX = 100;
          ctx.textAlign = "left";
          ctx.font = "14px monospace";
          ctx.fillStyle = "#0F172A";
          ctx.fillText(
            `Certificate ID: ${certificate.certificateId}`,
            detailX,
            DOWNLOAD_HEIGHT - 120
          );
          ctx.fillText(
            `Verification Link: ${window.location.origin}/certificate/${certificate.certificateId}`,
            detailX,
            DOWNLOAD_HEIGHT - 100
          );

          // Trigger Download
          const link = document.createElement("a");
          link.download = `${certificate.name.replace(
            /\s/g,
            "_"
          )}_Certificate.png`;
          link.href = canvas.toDataURL("image/png", 1.0);
          link.click();

          toast.success("Certificate successfully downloaded! 🎉", {
            id: toastId,
          });
        } catch (error) {
          console.error("Canvas Drawing/Download Error:", error);
          if (error.name === "SecurityError") {
            throw new Error(
              "Security Error: Cannot download due to cross-origin restrictions (CORS)."
            );
          }
          throw new Error(
            "An internal error occurred during image finalization."
          );
        }
      })
      .catch((errorMessage) => {
        const message =
          typeof errorMessage === "string"
            ? errorMessage
            : errorMessage.message;

        toast.error(message || "An unknown error prevented the download.", {
          id: toastId,
        });
      })
      .finally(() => {
        setIsDownloading(false);
      });
  };

  const handleGoBack = () => navigate("/certificates");

  // 3. Render (Responsive HTML/CSS)
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
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
          onClick={handleDownload}
          className="flex items-center gap-2 bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
        >
          <FaDownload size={16} />
          <span className="text-sm">Download Certificate</span>
        </button>
      </div>

      {/* Certificate Container - This is what will be printed */}
      <div className="certificate-container w-full flex justify-center">
        <div
          className="certificate-content relative w-full max-w-5xl aspect-[297/210] bg-white shadow-2xl flex flex-col justify-between p-6 sm:p-8 md:p-12"
          style={{
            backgroundImage: `url(${Certificates})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Main Content */}
          <div className="w-full text-center text-gray-950 mt-19">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-indigo-900">
              Easyway Pro
            </h1>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold italic text-gray-800 mt-2">
              Certificate of Achievement
            </h2>

            <p className="text-sm sm:text-base md:text-lg mt-6 sm:mt-8">
              This certificate is proudly presented to
            </p>
            <h3 className="text-2xl sm:text-4xl md:text-5xl font-bold text-black my-2 sm:my-3">
              {certificate.name || "Student Name"}
            </h3>

            <p className="text-xs sm:text-sm md:text-base max-w-3xl mx-auto mt-4 leading-snug">
              {DESCRIPTIVE_TEXT}
            </p>

            <p className="text-sm sm:text-base md:text-lg font-medium mt-4 sm:mt-6">
              for successfully completing the course
            </p>
            <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-800 my-2">
              {certificate.subject}
            </h4>

            <p className="text-xs sm:text-sm md:text-base mt-4">
              Awarded on:{" "}
              <span className="font-semibold">
                {new Date(certificate.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </p>
          </div>

          {/* Footer Section */}
          <div className="w-full flex justify-between items-end mt-4 sm:mt-2 mb-12 px-2">
            {/* Certificate ID & URL */}
            <div className="text-left text-xs sm:text-sm text-gray-700 max-w-[50%]">
              <p className="font-semibold">
                Certificate ID:{" "}
                <span className="font-mono">{certificate.certificateId}</span>
              </p>
              <p className="break-words">
                Verify at:{" "}
                <span className="text-blue-600 font-medium">{`${window.location.origin}/certificate/${certificate.certificateId}`}</span>
              </p>
            </div>

            {/* Signature */}
            <div className="text-center">
              {/* Add your signature image source here */}
              {/* <img src="/path/to/signature.png" alt="Signature" className="w-28 sm:w-36 h-auto mx-auto" /> */}
              <div className=" border-gray-600 pt-1 mt-8 sm:mt-12">
                <p className="font-bold text-sm sm:text-base text-gray-800">
                  Akshat Jain
                </p>
                <p className="text-xs sm:text-sm font-medium text-indigo-800">
                  Founder, Easyway Pro
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
