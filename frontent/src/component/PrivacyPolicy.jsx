import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#030009] text-gray-300 px-6 py-16 relative overflow-hidden selection:bg-sky-500/30 selection:text-white">
      
      {/* Background Ambience Elements */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-sky-500/[0.03] blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-indigo-500/[0.03] blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Navigation Breadcrumb / Go Back */}
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-400/80 hover:text-sky-300 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Page Header */}
        <header className="border-b border-white/[0.08] pb-8 mb-12">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-3">
            Privacy{" "}
            <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
              Policy
            </span>
          </h1>
          <p className="text-sm font-medium tracking-wide text-gray-500 uppercase">
            Last Updated: September 2025
          </p>
        </header>

        {/* Main Document Content */}
        <div className="space-y-10 text-base md:text-[17px] leading-relaxed font-light text-gray-400">
          
          <p className="text-gray-300 text-lg font-normal leading-relaxed">
            At <strong className="font-semibold text-white">Easyway Pro</strong>, your privacy is important to us. This
            Privacy Policy explains how we collect, use, and protect your
            information when you use our website and services.
          </p>

          <hr className="border-white/[0.05]" />

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-3">
              <span className="text-sm text-sky-400 font-mono">01.</span> Information We Collect
            </h2>
            <ul className="space-y-3 pl-6 list-disc marker:text-sky-400/60 text-gray-400">
              <li>
                <strong className="font-semibold text-gray-200">Personal Information (if provided):</strong> Name, email
                address, or contact details (e.g., when using a contact form).
              </li>
              <li>
                <strong className="font-semibold text-gray-200">Non-Personal Information:</strong> Browser type, device info,
                and usage data.
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-3">
              <span className="text-sm text-sky-400 font-mono">02.</span> How We Use Your Information
            </h2>
            <ul className="space-y-2 pl-6 list-disc marker:text-sky-400/60 text-gray-400">
              <li>To provide and improve our services.</li>
              <li>To respond to questions or feedback.</li>
              <li>To maintain security and prevent misuse.</li>
              <li>For educational/demo purposes (college project).</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-3">
              <span className="text-sm text-sky-400 font-mono">03.</span> Sharing of Information
            </h2>
            <p>
              We do <strong className="font-semibold text-red-400/90">not sell or rent</strong> your personal information. We
              may share data only if required by law or for security reasons.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-3">
              <span className="text-sm text-sky-400 font-mono">04.</span> Data Security
            </h2>
            <p>
              We use reasonable technical measures to protect your information.
              However, no website is 100% secure.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-3">
              <span className="text-sm text-sky-400 font-mono">05.</span> Cookies
            </h2>
            <p>
              Easyway Pro may use cookies to improve user experience. You can disable
              cookies in your browser settings if you prefer.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-3">
              <span className="text-sm text-sky-400 font-mono">06.</span> Third-Party Services
            </h2>
            <p>
              If we use third-party tools (like analytics, APIs, or hosting on
              Render), those services may collect limited information according to
              their own privacy policies.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-3">
              <span className="text-sm text-sky-400 font-mono">07.</span> Children’s Privacy
            </h2>
            <p>
              Our platform is intended for students and learners. We do not knowingly
              collect data from children under 13.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-3">
              <span className="text-sm text-sky-400 font-mono">08.</span> Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. Updates will be
              posted on this page with a new "Last Updated" date.
            </p>
          </section>

          {/* Section 9: Educational Disclaimer Box */}
          <div className="mt-12 bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 relative overflow-hidden backdrop-blur-md">
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500/50" />
            <h3 className="text-sm font-semibold tracking-wider uppercase text-indigo-400 mb-1.5">
              9. Note
            </h3>
            <p className="text-sm text-gray-400 font-normal">
              This project is for educational purposes only and not intended as a commercial service.
            </p>
          </div>

          {/* Footer Callout */}
          <footer className="pt-8 border-t border-white/[0.05] mt-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-sm text-gray-500">
              If you have questions regarding this documentation, please reach out.
            </p>
            <Link 
              to="/contact-us" 
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-sky-400/40 text-sm font-semibold text-white transition-all duration-200 shadow-sm"
            >
              Contact Us
            </Link>
          </footer>

        </div>
      </div>
    </div>
  );
}