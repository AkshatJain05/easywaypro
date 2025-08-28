import { useState } from "react";
import { FaBarsStaggered } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import logoEasyway from "../assets/logoEasyway.png";
import { NavLink, useNavigate } from "react-router-dom";

function Nav() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const navList = [
    { name: "Home", link: "/" },
    { name: "Study Material", link: "/study-material" },
    { name: "Courses", link: "/courses" },
    { name: "Easyway AI", link: "/easyway-ai" },
    { name: "Contact Us", link: "/contact-us" },
  ];

  const handleNavLinkClick = () => setOpen(false);
  const handleLoginBtn = () => {
    navigate("/login");
    setOpen(false);
  };

  return (
    <>
      <nav className="z-70 fixed top-0 left-0 w-full h-[55px] flex items-center justify-between px-4 lg:px-12 bg-gray-950 opacity-98 border-b border-gray-800 backdrop-blur-md text-white">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2">
          <img
            src={logoEasyway}
            alt="Easyway Logo"
            className="h-9 md:h-10 w-auto"
          />
          <h1 className="font-bold text-lg sm:text-xl md:text-2xl tracking-wide">
            Easyway Classes 2.0
          </h1>
        </NavLink>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-8 font-medium">
          {navList.map((list, index) => (
            <NavLink
              key={index}
              to={list.link}
              className={({ isActive }) =>
                `px-3 py-1 rounded-md transition ${
                  isActive
                    ? "bg-slate-800  border-1 border-white"
                    : "hover:text-yellow-400"
                }`
              }
            >
              {list.name}
            </NavLink>
          ))}

          <button
            onClick={handleLoginBtn}
            className="px-4 py-1.5 bg-slate-900 text-white font-semibold rounded-lg shadow-md hover:bg-slate-800 transition border-1 border-white"
          >
            Login
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          aria-label="Toggle Menu"
          className="lg:hidden p-2 text-2xl"
        >
          {open ? <RxCross2 /> : <FaBarsStaggered />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden z-50 fixed top-[64px] left-0 w-full bg-gray-950/95 backdrop-blur-md border-b border-gray-800 transition-all duration-300 ${
          open ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="flex flex-col  px-2 w-full justify-center items-center py-6 gap-4 font-medium text-base">
          {navList.map((list, index) => (
            <NavLink
              key={index}
              to={list.link}
              onClick={handleNavLinkClick}
              className={({ isActive }) =>
                `w-full text-center py-2 rounded-md ${
                  isActive
                    ? "bg-slate-800  border-1 border-white"
                    : "hover:bg-slate-800 hover:text-yellow-500"
                }`
              }
            >
              {list.name}
            </NavLink>
          ))}

          <button
            onClick={handleLoginBtn}
            className="mt-4 w-40 px-4 py-2 bg-slate-900 text-white font-semibold rounded-lg shadow-md hover:bg-slate-400 transition"
          >
            Login
          </button>
        </div>
      </div>

      {/* Spacer (to avoid content hiding under fixed navbar) */}
      <div className="bg-black h-[55px]"></div>
    </>
  );
}

export default Nav;
