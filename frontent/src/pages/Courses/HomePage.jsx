import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPublicCourses } from '../../redux/courseSlice.js'
import CourseCard from './CourseCard.jsx'
import { FiArrowRight, FiBookOpen, FiAward, FiUsers, FiZap } from 'react-icons/fi'

const STATS = [
  { icon: FiBookOpen, value: '50+', label: 'Expert Courses' },
  { icon: FiUsers, value: '2,000+', label: 'Active Students' },
  { icon: FiAward, value: '95%', label: 'Completion Rate' },
  { icon: FiZap, value: '24/7', label: 'Support' },
]

export default function HomePage() {
  const dispatch = useDispatch()
  const { courses, loading } = useSelector(s => s.courses)

  useEffect(() => { dispatch(fetchPublicCourses()) }, [])

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-amber-500/5" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-orange-500/8 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-amber-500/8 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto text-center animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm text-orange-300 mb-8">
            <FiZap size={13} className="text-orange-400" />
            India's Premier Online Learning Platform
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-bold text-white leading-tight">
            Master Skills That<br />
            <span className="gradient-text">Shape Your Future</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Expert-led courses with live sessions, attendance tracking, and verifiable certificates.
            Learn at your own pace, grow on your own terms.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link to="/courses" className="btn-primary text-base px-8 py-3 flex items-center gap-2">
              Explore Courses <FiArrowRight />
            </Link>
            <Link to="/register" className="btn-outline text-base px-8 py-3">
              Start for Free
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="relative max-w-4xl mx-auto mt-20 grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map(({ icon: Icon, value, label }) => (
            <div key={label} className="glass rounded-2xl p-5 text-center hover:border-orange-500/20 transition-colors">
              <Icon className="mx-auto mb-2 text-orange-400" size={20} />
              <div className="text-2xl font-display font-bold text-white">{value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="text-sm font-medium text-orange-400 uppercase tracking-widest mb-2">Featured</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white">Popular Courses</h2>
            </div>
            <Link to="/courses" className="hidden md:flex items-center gap-2 text-sm text-slate-400 hover:text-orange-400 transition-colors">
              View all <FiArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="aspect-video bg-slate-800" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-slate-800 rounded w-1/3" />
                    <div className="h-5 bg-slate-800 rounded w-3/4" />
                    <div className="h-4 bg-slate-800 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.slice(0, 6).map(course => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          )}

          {courses.length > 6 && (
            <div className="text-center mt-10">
              <Link to="/courses" className="btn-outline inline-flex items-center gap-2">
                View All Courses <FiArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center glass rounded-3xl p-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
            Ready to start learning?
          </h2>
          <p className="mt-4 text-slate-400">Join thousands of students already learning with EduVault.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/register" className="btn-primary px-8 py-3">Create Free Account</Link>
            <Link to="/courses" className="btn-outline px-8 py-3">Browse Courses</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
