import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import Loading from "../../component/Loading";
import { toast } from "react-hot-toast";


export default function Result() {
  const navigate = useNavigate();
  const [score, setScore] = useState(null);
  const [certificateId, setCertificateId] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios
      .get(`${API_URL}/quiz/user-score`, { withCredentials: true })
      .then((res) => {
        setScore(res.data.score);
        setCertificateId(res.data.certificate?.certificateId || null);
        setLoading(false);
      })
      .catch(() => {
        toast.error("You must be logged in to view the result.");
        navigate("/login");
      });
  }, [navigate, API_URL]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-300">
        <Loading/>
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 text-gray-100">
      <div className="bg-gradient-to-r from-slate-950 to-gray-950 rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-6">Quiz Result</h1>

        <div className="text-2xl mb-6">
          Your Score: <span className="font-semibold text-blue-400">{score} / 100</span>
        </div>

        {score >= 60 ? (
          <>
            <FaCheckCircle className="text-green-400 text-3xl mx-auto mb-4" />
            <p className="text-green-400 font-semibold mb-6">Congratulations! You passed.</p>
            <button
              onClick={() => navigate(`/certificate/${certificateId}`)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded mb-3"
            >
              View Certificate
            </button>
          </>
        ) : (
          <>
            <FaTimesCircle className="text-red-500 text-3xl mx-auto mb-4" />
            <p className="text-red-500 font-semibold mb-6">You did not pass. Try again!</p>
          </>
        )}

        <button
          onClick={() => navigate("/certificates")}
          className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2 rounded"
        >
          View All Certificates
        </button>
      </div>
    </div>
  );
}
