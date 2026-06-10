import { Link } from "react-router-dom";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-[#030009] text-gray-300 px-6 py-16 relative overflow-hidden selection:bg-indigo-500/30 selection:text-white">
      
      {/* Background Ambience Elements */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-indigo-500/[0.03] blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-sky-500/[0.03] blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400/80 hover:text-indigo-300 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Page Header */}
        <header className="border-b border-white/[0.08] pb-8 mb-12">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-3">
            Terms &{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-sky-400 bg-clip-text text-transparent">
              Conditions
            </span>
          </h1>
          <p className="text-sm font-medium tracking-wide text-gray-500 uppercase">
            Last Updated: September 2025
          </p>
        </header>

        {/* Main Document Content */}
        <div className="space-y-10 text-base md:text-[17px] leading-relaxed font-light text-gray-400">
          
          <p className="text-gray-300 text-lg font-normal leading-relaxed">
            Welcome to <strong className="font-semibold text-white">Easyway Pro</strong>. By using our website and
            services, you agree to the following Terms and Conditions. Please read
            them carefully.
          </p>

          <hr className="border-white/[0.05]" />

          {/* Section 1 */}
          <section className="space-y-2">
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-3">
              <span className="text-sm text-indigo-400 font-mono">01.</span> Use of Services
            </h2>
            <p>
              Easyway Pro is provided for educational and demonstration purposes.
              Users agree not to misuse the platform or attempt to disrupt its
              functionality.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-2">
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-3">
              <span className="text-sm text-indigo-400 font-mono">02.</span> Accounts & Responsibility
            </h2>
            <p>
              If you create an account, you are responsible for maintaining the
              security of your login information and for all activities under your
              account.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-2">
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-3">
              <span className="text-sm text-indigo-400 font-mono">03.</span> Intellectual Property
            </h2>
            <p>
              All content, tools, and services on Easyway Pro are owned by the project
              team unless otherwise stated. You may not copy, reproduce, or distribute
              without permission.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-2">
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-3">
              <span className="text-sm text-indigo-400 font-mono">04.</span> Limitation of Liability
            </h2>
            <p>
              Easyway Pro is a college project and is provided <span className="text-gray-300 italic font-normal">“as is.”</span> We do not
              guarantee accuracy, reliability, or availability. We are not responsible
              for any losses or damages caused by using the platform.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-2">
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-3">
              <span className="text-sm text-indigo-400 font-mono">05.</span> Third-Party Services
            </h2>
            <p>
              Our platform may use third-party services (e.g., hosting on Render or
              APIs). We are not responsible for any issues caused by those services.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-2">
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-3">
              <span className="text-sm text-indigo-400 font-mono">06.</span> Termination
            </h2>
            <p>
              We reserve the right to suspend or terminate access to Easyway Pro at
              any time, without notice, if users violate these Terms.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-2">
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-3">
              <span className="text-sm text-indigo-400 font-mono">07.</span> Changes to Terms
            </h2>
            <p>
              We may update these Terms from time to time. Updates will be posted on
              this page with a new "Last Updated" date.
            </p>
          </section>

          {/* Section 8: Educational Disclaimer Box */}
          <div className="mt-12 bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 relative overflow-hidden backdrop-blur-md">
            <div className="absolute top-0 left-0 w-1 h-full bg-sky-500/50" />
            <h3 className="text-sm font-semibold tracking-wider uppercase text-sky-400 mb-1.5">
              08. Note
            </h3>
            <p className="text-sm text-gray-400 font-normal">
              This project is for educational purposes only and not intended as a commercial service.
            </p>
          </div>

          {/* Footer Callout */}
          <footer className="pt-8 border-t border-white/[0.05] mt-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-sm text-gray-500">
              Have questions or need clarifications regarding these terms?
            </p>
            <Link 
              to="/contact-us" 
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-indigo-400/40 text-sm font-semibold text-white transition-all duration-200 shadow-sm"
            >
              Contact Us
            </Link>
          </footer>

        </div>
      </div>
    </div>
  );
}