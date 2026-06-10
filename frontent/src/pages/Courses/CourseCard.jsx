import { Link } from 'react-router-dom'
import { FiClock, FiUsers, FiStar, FiPlay } from 'react-icons/fi'

export default function CourseCard({ course }) {
  const price = course.discountPrice || course.price
  const hasDiscount = course.discountPrice && course.discountPrice < course.price
  const discountPct = hasDiscount
    ? Math.round((1 - course.discountPrice / course.price) * 100)
    : 0
  const savings = hasDiscount ? course.price - course.discountPrice : 0

  return (
    <div className="group relative bg-[#0f0f11] border border-white/6 rounded-2xl overflow-hidden transition-all duration-300 hover:border-orange-500/25 hover:shadow-xl hover:shadow-orange-950/30 hover:-translate-y-0.5 flex flex-col m-2">

      {/* ── Thumbnail ── */}
      <div className="relative overflow-hidden aspect-video shrink-0">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* Play hint — fades in on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-11 h-11 rounded-full bg-orange-500/90 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-orange-900/50">
            <FiPlay size={16} className="text-white translate-x-0.5" />
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
          {course.level && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/50 text-white backdrop-blur-sm border border-white/10">
              {course.level}
            </span>
          )}
          {hasDiscount && (
            <span className="ml-auto text-[10px] font-black px-2.5 py-1 rounded-full bg-orange-500 text-white shadow-md shadow-orange-900/40">
              {discountPct}% OFF
            </span>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex flex-col flex-1 p-5 gap-3">

        {/* Category */}
        {course.category && (
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-orange-500/80">
            {course.category}
          </span>
        )}

        {/* Title */}
        <h3 className="font-semibold text-[15px] text-white leading-snug line-clamp-2 group-hover:text-orange-50 transition-colors text-justify">
          {course.title}
        </h3>

        {/* Description */}
        <p className="text-[13px] text-slate-500 line-clamp-2 leading-relaxed text-justify">
          {course.shortDescription || course.description}
        </p>

        {/* Instructor */}
        {course.instructor?.name && (
          <p className="text-[11px] text-slate-600">
            by <span className="text-slate-400 font-medium">{course.instructor.name}</span>
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center gap-0 text-[11px] text-slate-500 mt-auto pt-3 border-t border-white/5">
          {course.rating > 0 && (
            <>
              <span className="flex items-center gap-1 text-amber-400 font-bold">
                <FiStar size={11} className="fill-amber-400 stroke-none" />
                {course.rating.toFixed(1)}
              </span>
              <span className="mx-2.5 text-white/10">|</span>
            </>
          )}
          {course.studentsCount > 0 && (
            <>
              <span className="flex items-center gap-1">
                <FiUsers size={11} />
                {course.studentsCount.toLocaleString()}
              </span>
              <span className="mx-2.5 text-white/10">|</span>
            </>
          )}
          {course.totalDuration > 0 && (
            <span className="flex items-center gap-1">
              <FiClock size={11} />
              {course.totalDuration}h
            </span>
          )}
        </div>

        {/* Price row */}
        <div className="flex items-end justify-between gap-2 pt-1">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-white">₹{price.toLocaleString()}</span>
            {hasDiscount && (
              <span className="text-xs text-slate-600 line-through">₹{course.price.toLocaleString()}</span>
            )}
          </div>
          {savings > 0 && (
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/8 border border-emerald-400/15 px-2 py-0.5 rounded-full">
              Save ₹{savings.toLocaleString()}
            </span>
          )}
        </div>

        {/* CTA — collapsed at rest, revealed on hover */}
        <div className="overflow-hidden max-h-0 group-hover:max-h-14 transition-all duration-300 ease-in-out">
          <Link
            to={`/courses/${course._id}`}
            className="mt-1 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 active:scale-[0.98] text-black text-sm font-black tracking-tight transition-all duration-150"
          >
            View Course
          </Link>
        </div>
      </div>
    </div>
  )
}