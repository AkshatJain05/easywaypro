import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourse } from "../../redux/courseSlice.js";
import {
  createOrder,
  verifyPayment,
  resetPayment,
} from "../../redux/purchaseSlice.js";
import toast from "react-hot-toast";
import {
  FiClock,
  FiUsers,
  FiBook,
  FiStar,
  FiCheck,
  FiLock,
  FiShoppingCart,
  FiPlay,
  FiMessageCircle,
  FiAward,
  FiChevronLeft,
} from "react-icons/fi";
import Loading from "../../component/Loading.jsx";
import { loadRazorpay } from "../../utils/loadRazorpay.js";

export default function CourseDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current: course, loading } = useSelector((s) => s.courses);
  const { user, token } = useSelector((s) => s.auth);
  const {
    loading: payLoading,
    paymentSuccess,
    lastPurchase,
  } = useSelector((s) => s.purchase);

  useEffect(() => {
    dispatch(fetchCourse(id));
  }, [id]);

  useEffect(() => {
    if (paymentSuccess && lastPurchase) {
      toast.success("🎉 Payment successful! Course unlocked.");
      dispatch(resetPayment());
      navigate(`/receipt/${lastPurchase._id}`);
    }
  }, [paymentSuccess]);

  const handleBuy = async () => {
    const razorpayLoaded = await loadRazorpay();

    if (!razorpayLoaded) {
      toast.error("Failed to load Razorpay");
      return;
    }

    if (!token) {
      navigate("/login");
      return;
    }

   if (!user?.phoneNo) {
      toast.error("Please add your mobile number in your profile");

      setTimeout(() => {
        navigate("/profile");
      }, 2000); // 2 seconds

      return;
    }

    const orderRes = await dispatch(createOrder(id));
    if (createOrder.rejected.match(orderRes)) {
      toast.error(orderRes.payload);
      return;
    }
    const {
      orderId,
      amount,
      currency,
      key,
      user: uData,
      course: cData,
    } = orderRes.payload;
    const options = {
      key,
      amount,
      currency,
      name: "Easyway Pro",
      description: cData?.title,
      image: cData?.thumbnail,
      order_id: orderId,
      handler: async (response) => {
        const verifyRes = await dispatch(
          verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            courseId: id,
          }),
        );
        if (verifyPayment.rejected.match(verifyRes))
          toast.error(verifyRes.payload);
      },
       prefill: {
        name: uData?.name,
        email: uData?.email,
        contact: uData?.phoneNo, // Mobile Number
       },
      theme: { color: "#f97316" },
      modal: { ondismiss: () => toast("Payment cancelled", { icon: "ℹ️" }) },
    };
    new window.Razorpay(options).open();
  };

  if (loading || !course) return <Loading />;

  const price = course.discountPrice || course.price;
  const hasDiscount =
    course.discountPrice && course.discountPrice < course.price;
  const discountPct = hasDiscount
    ? Math.round((1 - price / course.price) * 100)
    : 0;
  const savings = hasDiscount ? course.price - price : 0;

  const includes = [
    { icon: FiPlay, text: `${course.lessons?.length || 0} video lessons` },
    { icon: FiClock, text: `${course.totalDuration || 0} hours of content` },
    { icon: FiAward, text: "Certificate of completion" },
    { icon: FiMessageCircle, text: "WhatsApp support" },
    ...(course.validityDays
      ? [{ icon: FiCheck, text: `${course.validityDays} days access` }]
      : []),
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-white bg-white/4 hover:bg-white/8 border border-white/6 px-4 py-2 rounded-full transition-all mb-8 w-fit"
        >
          <FiChevronLeft size={14} /> Back to Courses
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 items-start">
          {/* ── Main Content ── */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero block */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 flex-wrap">
                {course.category && (
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-orange-500/80">
                    {course.category}
                  </span>
                )}
                {course.level && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/5 border border-white/8 text-slate-400">
                    {course.level}
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                {course.title}
              </h1>

              <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
                {course.description}
              </p>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1">
                {course.rating > 0 && (
                  <span className="flex items-center gap-1.5 text-sm">
                    <FiStar
                      size={14}
                      className="text-amber-400 fill-amber-400 stroke-none"
                    />
                    <span className="text-amber-400 font-bold">
                      {course.rating.toFixed(1)}
                    </span>
                    <span className="text-slate-500">rating</span>
                  </span>
                )}
                {course.studentsCount > 0 && (
                  <span className="flex items-center gap-1.5 text-sm text-slate-400">
                    <FiUsers size={13} className="text-slate-500" />
                    {course.studentsCount.toLocaleString()} students
                  </span>
                )}
                {course.totalDuration > 0 && (
                  <span className="flex items-center gap-1.5 text-sm text-slate-400">
                    <FiClock size={13} className="text-slate-500" />
                    {course.totalDuration}h total
                  </span>
                )}
                {course.language && (
                  <span className="flex items-center gap-1.5 text-sm text-slate-400">
                    <FiBook size={13} className="text-slate-500" />
                    {course.language}
                  </span>
                )}
              </div>
            </div>

            {/* Mobile purchase card — shown only on small screens */}
            <div className="lg:hidden">
              <PurchaseCard
                course={course}
                price={price}
                hasDiscount={hasDiscount}
                discountPct={discountPct}
                savings={savings}
                includes={includes}
                payLoading={payLoading}
                handleBuy={handleBuy}
              />
            </div>

            {/* Instructor */}
            {course.instructor && (
              <div className="bg-[#0c0c0e] border border-white/6 rounded-2xl p-6">
                <h2 className="text-base font-bold text-white mb-5">
                  Your Instructor
                </h2>
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-xl font-black text-white shrink-0 select-none">
                    {course.instructor.name?.[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-white">
                      {course.instructor.name}
                    </p>
                    <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                      {course.instructor.bio || "Expert Instructor"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Curriculum */}
            {course.lessons?.length > 0 && (
              <div className="bg-[#0c0c0e] border border-white/6 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-base font-bold text-white">
                    Course Curriculum
                  </h2>
                  <span className="text-xs font-bold text-slate-500 bg-white/4 border border-white/6 px-3 py-1 rounded-full">
                    {course.lessons.length} lessons
                  </span>
                </div>

                <div className="space-y-1.5">
                  {course.lessons.map((lesson, i) => (
                    <div
                      key={lesson._id || i}
                      className="group flex items-center gap-3 p-3 rounded-xl hover:bg-white/4 transition-colors"
                    >
                      {/* Number */}
                      <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/6 flex items-center justify-center text-[10px] font-bold text-slate-500 shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </div>

                      {/* Title */}
                      <span className="text-sm text-slate-300 flex-1 leading-snug">
                        {lesson.title}
                      </span>

                      {/* Duration + lock/play */}
                      <div className="flex items-center gap-2.5 shrink-0">
                        {lesson.duration > 0 && (
                          <span className="text-[10px] text-slate-600 font-medium">
                            {lesson.duration}m
                          </span>
                        )}
                        {course.isPurchased && lesson.videoUrl ? (
                          <div className="w-6 h-6 rounded-full bg-orange-500/15 flex items-center justify-center">
                            <FiPlay
                              size={10}
                              className="text-orange-400 translate-x-px"
                            />
                          </div>
                        ) : (
                          <FiLock size={12} className="text-slate-700" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Sidebar — desktop only ── */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24">
              <PurchaseCard
                course={course}
                price={price}
                hasDiscount={hasDiscount}
                discountPct={discountPct}
                savings={savings}
                includes={includes}
                payLoading={payLoading}
                handleBuy={handleBuy}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Purchase sidebar card (shared between mobile inline + desktop sticky) ── */
function PurchaseCard({
  course,
  price,
  hasDiscount,
  discountPct,
  savings,
  includes,
  payLoading,
  handleBuy,
}) {
  return (
    <div className="bg-[#0c0c0e] border border-white/8 rounded-2xl overflow-hidden">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-transparent to-transparent" />
        {!course.isPurchased && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-orange-500/90 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-orange-950/50">
              <FiPlay size={18} className="text-white translate-x-0.5" />
            </div>
          </div>
        )}
      </div>

      <div className="p-5 space-y-5">
        {/* Price */}
        <div className="flex items-end justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">
              ₹{price.toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="text-sm text-slate-600 line-through">
                ₹{course.price.toLocaleString()}
              </span>
            )}
          </div>
          {hasDiscount && (
            <div className="text-right">
              <div className="text-xs font-black text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-full">
                {discountPct}% OFF
              </div>
              {savings > 0 && (
                <p className="text-[10px] text-emerald-400 font-bold mt-1">
                  Save ₹{savings.toLocaleString()}
                </p>
              )}
            </div>
          )}
        </div>

        {/* CTA */}
        {course.isPurchased ? (
          <div className="space-y-2.5">
            <Link
              to={`/learn/${course._id}`}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-400 active:scale-[0.98] text-black text-sm font-black transition-all"
            >
              <FiPlay size={14} /> Continue Learning
            </Link>
            {course.whatsappSupport && (
              <a
                href={`https://wa.me/${course.whatsappSupport}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold hover:bg-emerald-500/15 transition-colors"
              >
                <FiMessageCircle size={14} /> WhatsApp Support
              </a>
            )}
          </div>
        ) : (
          <button
            onClick={handleBuy}
            disabled={payLoading}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] text-black text-sm font-black transition-all"
          >
            {payLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                Processing…
              </>
            ) : (
              <>
                <FiShoppingCart size={14} /> Enroll Now — ₹
                {price.toLocaleString()}
              </>
            )}
          </button>
        )}

        {/* What's included */}
        <div className="pt-4 border-t border-white/6 space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">
            What's included
          </p>
          {includes.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-md bg-orange-500/10 flex items-center justify-center shrink-0">
                <Icon size={11} className="text-orange-400" />
              </div>
              <span className="text-xs text-slate-400">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
