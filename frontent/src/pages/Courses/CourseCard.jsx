import { Link } from 'react-router-dom';
import { FiClock, FiUsers, FiStar, FiPlay } from 'react-icons/fi';

/**
 * Helper Sub-Components for clean structure
 */
const StatItem = ({ icon: Icon, children }) => (
  <div className="flex items-center gap-1">
    <Icon size={12} />
    <span>{children}</span>
  </div>
);

export default function CourseCard({ course }) {
  const { price, hasDiscount, discountPct, finalPrice } = getPricing(course);

  return (
    <Link to={`/courses/${course._id}`} className="group block m-2 h-full focus:outline-none">
      <article className="flex flex-col h-full bg-[#0a0a0c] border border-gray-900 rounded-2xl overflow-hidden transition-all duration-500 hover:border-orange-500/40 hover:shadow-[0_20px_40px_-20px_rgba(249,115,22,0.25)]">
        
        {/* 1. Media Section */}
        <div className="relative aspect-video overflow-hidden">
          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent opacity-90" />
          <Badge level={course.level} />
        </div>

        {/* 2. Text Content Section */}
        <div className="flex flex-col flex-1 p-5 gap-3">
          <h3 className="font-bold text-[16px] text-slate-100 leading-snug line-clamp-2">{course.title}</h3>
          <p className="text-[13px] text-slate-500 leading-relaxed line-clamp-2 flex-grow">
            {course.shortDescription || course.description}
          </p>

          {/* 3. Stats Section */}
          <div className="flex items-center gap-4 text-[11px] text-slate-600 py-3 border-y border-white/[0.04]">
            <div className="flex items-center gap-1 text-amber-500/90">
              <FiStar size={12} className="fill-amber-500/20" />
              <span className="font-semibold text-slate-300">{course.rating?.toFixed(1) || '0.0'}</span>
            </div>
            <StatItem icon={FiUsers}>{course.studentsCount?.toLocaleString()}</StatItem>
            <StatItem icon={FiClock}>{course.totalDuration}h</StatItem>
          </div>

          {/* 4. Footer Section */}
          <div className="flex items-center justify-between pt-2">
            <PriceDisplay price={price} finalPrice={finalPrice} hasDiscount={hasDiscount} />
            <div className="px-4 py-2 rounded-lg bg-orange-600 text-black text-[11px] font-black uppercase tracking-wider">View</div>
          </div>
        </div>
      </article>
    </Link>
  );
}

/** 
 * Utility functions/components to keep the main logic clean
 */
function getPricing(course) {
  const price = course.price;
  const finalPrice = course.discountPrice || course.price;
  const hasDiscount = course.discountPrice && course.discountPrice < course.price;
  const discountPct = Math.round((1 - finalPrice / price) * 100);
  return { price, hasDiscount, discountPct, finalPrice };
}

const Badge = ({ level }) => (
  <div className="absolute top-4 left-4">
    <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md bg-white/5 backdrop-blur-md border border-white/10 text-slate-300">
      {level || 'Beginner'}
    </span>
  </div>
);

const PriceDisplay = ({ price, finalPrice, hasDiscount }) => (
  <div className="flex flex-col">
    <span className="text-lg font-black text-white tracking-tight">₹{finalPrice.toLocaleString()}</span>
    {hasDiscount && <span className="text-[10px] text-slate-700 line-through">₹{price.toLocaleString()}</span>}
  </div>
);