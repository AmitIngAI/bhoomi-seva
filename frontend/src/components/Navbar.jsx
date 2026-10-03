import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogIn, LayoutDashboard, LogOut, Globe } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `font-semibold text-base transition px-2 py-1 relative ${
      isActive(path)
        ? "text-white-300"
        : "text-white hover:text-white-200"
    }`;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
        <nav className="bg-orange-400 shadow-lg sticky top-0 z-50 border-b-4 border-orange-500">
      <div className="max-w-full mx-auto px-6 lg:px-10">
        <div className="flex justify-between items-center h-20">

          {/* ============ LEFT: LOGO ============ */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full p-1">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#1E3A8A" strokeWidth="3"/>
                <circle cx="50" cy="50" r="8" fill="#1E3A8A"/>
                {[...Array(24)].map((_, i) => (
                  <line
                    key={i}
                    x1="50"
                    y1="50"
                    x2={50 + 40 * Math.cos((i * 15 * Math.PI) / 180)}
                    y2={50 + 40 * Math.sin((i * 15 * Math.PI) / 180)}
                    stroke="#1E3A8A"
                    strokeWidth="1.5"
                  />
                ))}
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold font-hindi text-white leading-tight drop-shadow-md">
                भूमि-सेवा
              </h1>
              <p className="text-sm font-bold text-navy-800 leading-tight">
                Bhoomi Seva
              </p>
            </div>
          </Link>

                    {/* ============ CENTER: MENU LINKS ============ */}
          <div className="hidden md:flex items-center gap-8 flex-1 justify-center">
            <Link to="/" className={linkClass("/")}>
              {t("home")}
              {isActive("/") && (
                <span className="absolute bottom-0 left-0 right-0 h-1 bg-navy-800 rounded"></span>
              )}
            </Link>
            <Link to="/search" className={linkClass("/search")}>
              {t("searchRecords")}
              {isActive("/search") && (
                <span className="absolute bottom-0 left-0 right-0 h-1 bg-navy-800 rounded"></span>
              )}
            </Link>
            <Link to="/about" className={linkClass("/about")}>
              {t("aboutUs")}
              {isActive("/about") && (
                <span className="absolute bottom-0 left-0 right-0 h-1 bg-navy-800 rounded"></span>
              )}
            </Link>
            <Link to="/contact" className={linkClass("/contact")}>
              {t("contactUs")}
              {isActive("/contact") && (
                <span className="absolute bottom-0 left-0 right-0 h-1 bg-navy-800 rounded"></span>
              )}
            </Link>
          </div>

          {/* ============ RIGHT: TRANSLATE + LOGIN ============ */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">

            {/* Login / Dashboard Button - Navy Blue */}
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="bg-navy-800 hover:bg-navy-900 text-white px-5 py-3 rounded-lg font-semibold text-sm transition flex items-center gap-2 shadow-md"
                >
                  <LayoutDashboard size={18} />
                  {t("myDashboard")}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-white hover:text-red-200 bg-white/10 p-2 rounded-lg"
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-navy-800 hover:bg-navy-900 text-white px-6 py-3 rounded-lg font-semibold text-sm transition flex items-center gap-2 shadow-lg"
              >
                <LogIn size={18} />
                {t("loginRegister")}
              </Link>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            className="md:hidden text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-navy-400 space-y-3">
            <Link to="/" onClick={() => setMenuOpen(false)} className="block py-2 text-white font-semibold">
              {t("home")}
            </Link>
            <Link to="/search" onClick={() => setMenuOpen(false)} className="block py-2 text-white font-semibold">
              {t("searchRecords")}
            </Link>
            <Link to="/predict" onClick={() => setMenuOpen(false)} className="block py-2 text-white font-semibold">
              {t("predictValue")}
            </Link>
            <Link to="/admin" onClick={() => setMenuOpen(false)} className="block py-2 text-white font-semibold">
              {t("dashboard")}
            </Link>

            {/* Mobile Language Toggle */}
            <div className="flex items-center gap-2 py-2">
              <span className="text-sm text-white">{t("language")}</span>             
              <button
                onClick={() => setLanguage("EN")}
                className={`px-3 py-1 text-xs font-bold rounded ${
                  language === "EN" ? "bg-white text-white-500" : "bg-navy-600 text-white"
                }`}
              >EN</button>
              <button
                onClick={() => setLanguage("MR")}
                className={`px-3 py-1 text-xs font-bold rounded ${
                  language === "MR" ? "bg-white text-white-500" : "bg-navy-600 text-white"
                }`}
              >म</button>
            </div>

            {user ? (
              <Link to="/dashboard" className="block py-2 text-yellow-200 font-bold">
                {t("dashboard")}
              </Link>
            ) : (
              <Link to="/login" className="block py-2 bg-navy-800 text-white text-center rounded-lg font-semibold">
                {t("loginRegister")}
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;