import { useState } from "react";
import { FaBarsStaggered } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { NavLink } from "react-router-dom";
import UserMenu from "./UserMenu";

function Nav() {
  const [open, setOpen] = useState(false);

  const navList = [
    { name: "Home", link: "/" },
    { name: "Study Material", link: "/study-material" },
    { name: "Resume Builder", link: "/resume-builder" },
    { name: "AI Tools", link: "/easyway-ai" },
    { name: "Contact Us", link: "/contact-us" },
  ];

  const handleNavLinkClick = () => setOpen(false);

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-150 bg-gray-950/80 backdrop-blur-lg border-b border-gray-800 shadow-lg">
        <div className="max-w-8xl mx-auto flex items-center justify-between h-[54px] md:h-[56px] px-4 lg:px-12 text-white">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-3">
            {/* Logo Text */}
            <h1
              className="font-extrabold text-2xl md:text-2xl lg:text-3xl bg-clip-text text-transparent 
      bg-gradient-to-r from-blue-400 via-sky-500 to-indigo-600 drop-shadow-lg"
            >
              Easyway Pro
            </h1>
          </NavLink>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-10 font-medium">
            {navList.map((list, index) => (
              <NavLink
                key={index}
                to={list.link}
                className={({ isActive }) =>
                  `relative transition duration-300 pb-1 ${
                    isActive ? "text-yellow-400 after:w-full" : null
                  } after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-gradient-to-r after:from-blue-400 after:to-indigo-600 after:transition-all after:duration-300 after:w-0 hover:after:w-full`
                }
              >
                {list.name}
              </NavLink>
            ))}
            <UserMenu />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex gap-2 items-center lg:hidden">
            <UserMenu />
            <button
              onClick={() => setOpen(!open)}
              aria-label="Toggle Menu"
              className="p-2 text-2xl transition-transform duration-300 hover:scale-110"
            >
              {open ? <RxCross2 /> : <FaBarsStaggered />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu (Slide-in) */}
      <div
        className={`fixed top-0 right-0 h-screen w-3/4 max-w-sm bg-gray-950/95 backdrop-blur-lg shadow-xl border-l border-gray-800 transform transition-transform duration-500 ease-in-out z-140 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col items-center mt-20 gap-3 font-medium text-lg px-6">
          {navList.map((list, index) => (
            <NavLink
              key={index}
              to={list.link}
              onClick={handleNavLinkClick}
              className={({ isActive }) =>
                `w-full text-center py-2 rounded-md transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-indigo-700 shadow-md text-white"
                    : "hover:bg-slate-800 hover:text-yellow-400"
                }`
              }
            >
              {list.name}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Spacer (so content isn’t hidden) */}
      <div className="h-[58px]"></div>
    </>
  );
}

export default Nav;
