import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchReceipt } from "../../../redux/purchaseSlice.js";
import {
  FiCheckCircle,
  FiArrowLeft,
  FiPrinter,
  FiMail,
  FiPhone,
  FiBook,
  FiUser,
  FiCalendar,
  FiClock,
} from "react-icons/fi";
import Loading from "../../../component/Loading.jsx";
import ProfileCheckPopup from "../../../component/ProfileCheckPopup.jsx";

export default function ReceiptPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { receipt, loading } = useSelector((state) => state.purchase);

  useEffect(() => {
    if (id) {
      dispatch(fetchReceipt(id));
    }
  }, [dispatch, id]);

  const handlePrint = () => {
    document.title = `Receipt-${receipt?.razorpayPaymentId || "receipt"}`;

    setTimeout(() => {
      window.print();
    }, 100);
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) return <Loading />;

  if (!receipt) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Receipt not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] py-12 px-4">
      <ProfileCheckPopup/>
      <style>{`
        @page {
          size: A4;
          margin: 10mm;
        }

        @media print {

          html,
          body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          body * {
            visibility: hidden;
          }

          #receipt-content,
          #receipt-content * {
            visibility: visible;
          }

          #receipt-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            max-width: 100%;
            background: white !important;
            color: black !important;
            border: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            padding: 20px !important;
          }

          .no-print {
            display: none !important;
          }

          .text-white,
          .text-slate-200,
          .text-slate-300 {
            color: black !important;
          }

          .text-slate-500 {
            color: #666 !important;
          }

          .bg-slate-900 {
            background: #f5f5f5 !important;
            border: 1px solid #ddd !important;
          }

          .border-slate-800,
          .border-slate-700 {
            border-color: #d1d5db !important;
          }

          a {
            text-decoration: none !important;
            color: black !important;
          }
        }
      `}</style>

      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="no-print inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-8"
        >
          <FiArrowLeft size={14} />
          Back to My Courses
        </button>

        <div
          id="receipt-content"
          className="receipt-card bg-[#111113] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-8"
        >
          {/* Header */}
          <div className="border-b border-slate-800 pb-8 flex justify-between items-start">
            <div>
              <h1 className="text-xl font-bold text-white uppercase tracking-widest">
                EasyWay Pro (Official Receipt)
              </h1>

              <p className="text-emerald-500 text-xs font-bold mt-1 flex items-center gap-2">
                <FiCheckCircle size={12} />
                Payment Verified
              </p>
            </div>

            <div className="text-right">
              <p className="text-slate-500 text-[10px] uppercase">
                Transaction Date
              </p>

              <p className="text-white font-bold">
                {formatDate(receipt?.purchasedAt)}
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="py-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoRow
                label="Student Name"
                value={receipt?.user?.name}
                icon={FiUser}
              />

              <InfoRow
                label="Email Address"
                value={receipt?.user?.email}
                icon={FiMail}
              />

              <InfoRow
                label="Contact Number"
                value={receipt?.user?.phoneNo || "N/A"}
                icon={FiPhone}
              />

              <InfoRow
                label="Course Title"
                value={receipt?.course?.title}
                icon={FiBook}
              />

              <InfoRow
                label="Purchase Date"
                value={formatDate(receipt?.purchasedAt)}
                icon={FiCalendar}
              />

              <InfoRow
                label="Expiry Date"
                value={
                  receipt?.expiresAt
                    ? formatDate(receipt.expiresAt)
                    : "Lifetime Access"
                }
                icon={FiClock}
              />
            </div>

            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-700 pb-4">
                <span className="text-slate-500 uppercase text-[10px] font-bold">
                  Total Amount Paid
                </span>

                <span className="text-2xl font-black text-white">
                  ₹{Number(receipt?.amount || 0).toLocaleString("en-IN")}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-slate-500">Order ID</p>

                  <p className="font-mono text-slate-300 break-all">
                    {receipt?.razorpayOrderId}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500">Payment ID</p>

                  <p className="font-mono text-slate-300 break-all">
                    {receipt?.razorpayPaymentId}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="no-print pt-8 border-t border-slate-800 flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 bg-white text-black py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-all"
            >
              <FiPrinter />
              Print Receipt
            </button>

            <Link
              to={`/learn/${receipt?.course?._id}`}
              className="flex-1 bg-slate-800 text-white py-4 rounded-xl font-bold text-center hover:bg-slate-700 transition-all"
            >
              Start Learning
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 text-slate-500">
        <Icon size={14} />
      </div>

      <div>
        <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
          {label}
        </p>

        <p className="text-sm font-semibold text-slate-200 mt-0.5 break-words">
          {value || "N/A"}
        </p>
      </div>
    </div>
  );
}
