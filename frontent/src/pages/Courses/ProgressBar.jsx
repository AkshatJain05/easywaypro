export default function ProgressBar({ value = 0, label, showPercent = true, color = 'orange' }) {
  const colors = {
    orange: 'from-orange-500 to-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]',
    green: 'from-green-500 to-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]',
    blue: 'from-blue-500 to-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]',
    purple: 'from-purple-500 to-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.3)]',
  }

  return (
    <div className="w-full group">
      {/* Header section with refined typography */}
      {(label || showPercent) && (
        <div className="flex justify-between items-end mb-2">
          {label && (
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              {label}
            </span>
          )}
          {showPercent && (
            <span className="text-[10px] font-mono font-bold text-slate-200 bg-white/5 px-2 py-0.5 rounded-md">
              {Math.round(value)}%
            </span>
          )}
        </div>
      )}

      {/* Track */}
      <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5">
        {/* Progress Bar with Glow */}
        <div
          className={`h-full bg-gradient-to-r ${colors[color]} rounded-full transition-all duration-1000 ease-out relative`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        >
          {/* Subtle shine effect */}
          <div className="absolute inset-0 bg-white/20 blur-[1px]" />
        </div>
      </div>
    </div>
  )
}