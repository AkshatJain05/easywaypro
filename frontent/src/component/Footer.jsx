import { Link } from "react-router-dom";
import logoEasyway from "../assets/logoEasyway.png";

function Footer() {
  const quickLinks = [
    { to: "/notes", label: "Notes" },
    { to: "/quizs", label: "Quizzes" },
    { to: "/video-lectures", label: "Video Lectures" },
    { to: "/pyq", label: "PYQs" },
  ];

  const supportLinks = [
    { to: "/contact-us", label: "Contact Us" },
    { to: "/privacy-policy", label: "Privacy Policy" },
    { to: "/TAC", label: "Terms & Conditions" },
    { to: "/syllabus", label: "Syllabus" },
  ];

  return (
    <footer className="w-full bg-gradient-to-br from-gray-950 to-black border-t-1 border-gray-800 opacity-98 text-white ">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 flex flex-col md:flex-row justify-between gap-12">
        
        {/* Logo + About */}
        <div className="flex-1 text-center md:text-left space-y-6 max-w-lg">
          {/* <img
            src={logo2Img}
            alt="Easyway Logo"
            className="h-16 sm:h-20 md:h-24 mx-auto md:mx-0 rounded-2xl border-2 border-yellow-400 shadow-lg"
          /> */}
          <div className="flex flex-col items-center md:flex-row md:items-center gap-3">
  <img
    src={logoEasyway}
    alt="Easyway Logo"
    className="h-12  sm:h-12 md:h-12 rounded-2xl border-2 border-yellow-400 shadow-lg"
  />
  <span className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 bg-clip-text text-transparent drop-shadow-md">
    Easyway Pro
  </span>
</div>
          <p className="text-sm  md:text-lg text-slate-300 text-center md:text-justify">
            Easyway Classes is your smart learning companion, offering tools like AI chatbot,
            code analyzer, quizzes, and study material to make learning effortless and engaging.
          </p>
        </div>

        {/* Links Section */}
        <div className="flex flex-1 justify-center md:justify-end gap-16 sm:gap-20 text-center md:text-left">
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg md:text-xl font-semibold text-yellow-400 mb-4">Quick Links</h3>
            <ul className="flex flex-col gap-3 text-slate-300 text-sm sm:text-base">
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <Link to={link.to} className="hover:text-yellow-400 transition">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg md:text-xl font-semibold text-yellow-400 mb-4">Support</h3>
            <ul className="flex flex-col gap-3 text-slate-300 text-sm sm:text-base">
              {supportLinks.map((link, idx) => (
                <li key={idx}>
                  <Link to={link.to} className="hover:text-yellow-400 transition">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-5 flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm text-slate-400 gap-2">
          <p>© 2025 Easyway Classes. All rights reserved.</p>
          <p>
            AI-generated answers may contain mistakes.{" "}
            <span className="text-yellow-400">Verify before use.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
