import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { IoIosArrowBack } from "react-icons/io";
import { FaCertificate } from "react-icons/fa";
import Loading from "../../component/Loading";
import { toast } from "react-hot-toast";


export default function Certificates() {
  const [certificates, setCertificates] = useState([]);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_URL}/quiz/user-certificates`, { withCredentials: true })
      .then((res) => {
        setCertificates(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
        toast.error("You must be logged in.");
        navigate("/login");
      });
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (!certificates.length)
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-gray-400">
        <p className="text-lg">No certificates found.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-6 flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white font-medium py-2 px-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300"
        >
          <IoIosArrowBack className="w-5 h-5" />
          <span>Go Back</span>
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 py-10 px-6 text-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center max-w-6xl mx-auto mb-8">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          My Certificates
        </h1>
        <button
          onClick={() => navigate("/quizzes")}
          className="flex items-center  border-1 bg-gray-900 px-2 p-1 rounded-xl hover:text-indigo-200 transition duration-200"
        >
          <IoIosArrowBack className="w-3 h-5" />
          <span>Back</span>
        </button>
      </div>

      {/* Certificates Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {certificates.map((cert) => (
          <div
            key={cert._id}
            className="bg-gradient-to-r from-slate-950 to-gray-950 p-6 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-[1.02] transition duration-300 relative overflow-hidden"
          >
            {/* Badge icon */}
            <div className="absolute top-4 right-4 text-yellow-400 text-2xl">
              <FaCertificate />
            </div>

            {/* Subject */}
            <h2 className="text-2xl font-bold text-white mb-2">
              {cert.subject}
            </h2>

            {/* Date */}
            <p className="text-sm text-gray-400 mb-4">
              Awarded on:{" "}
              <span className="text-gray-200 font-medium">
                {new Date(cert.date).toLocaleDateString()}
              </span>
            </p>

            {/* Button */}
            <button
              onClick={() => navigate(`/certificate/${cert.certificateId}`)}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:shadow-xl transition duration-300"
            >
              View Certificate
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
