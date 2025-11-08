import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Zap, Menu, X } from "lucide-react";
import ProfileDropDown from "../layout/ProfileDropDown";
import Button from "../ui/Button";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-slate-900/95 backdrop-blur-md shadow-2xl border-b border-cyan-500/20"
          : "bg-slate-900/80 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* --- Logo --- */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg shadow-cyan-500/50">
                <Zap className="w-6 h-6 text-white fill-white" />
              </div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-cyan-400 to-indigo-600 blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white tracking-tight leading-none">
                InvoiceFlow
              </span>
              <span className="text-xs text-cyan-400 font-medium tracking-wider">
                SMART BILLING
              </span>
            </div>
          </Link>

          {/* --- Desktop Nav --- */}
          <nav className="hidden lg:flex items-center space-x-8">
            <a
              href="#features"
              className="relative font-semibold text-gray-300 hover:text-cyan-400 transition-colors duration-300 group"
            >
              Features
              <span className="absolute bottom-[-6px] left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300" />
            </a>
            <a
              href="#info"
              className="relative font-semibold text-gray-300 hover:text-cyan-400 transition-colors duration-300 group"
            >
              Info
              <span className="absolute bottom-[-6px] left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300" />
            </a>
          </nav>

          {/* --- Right Side (Auth Buttons or Profile) --- */}
          <div className="hidden lg:flex items-center space-x-4">
            {isAuthenticated ? (
              <ProfileDropDown
                isOpen={profileDropdownOpen}
                onToggle={(e) => {
                  e.stopPropagation();
                  setProfileDropdownOpen(!profileDropdownOpen);
                }}
                avatar={user?.avatar || ""}
                companyName={user?.name || ""}
                email={user?.email || ""}
                onLogout={logout}
              />
            ) : (
              <>
                <Link
                  to="/login"
                  className="font-semibold text-gray-300 hover:text-cyan-400 px-4 py-2 rounded-lg hover:bg-slate-800/50 transition-all duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="relative bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-2.5 rounded-lg font-bold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105 transition-all duration-300 overflow-hidden group"
                >
                  <span className="relative z-10">Sign Up</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              </>
            )}
          </div>

          {/* --- Mobile Menu Button --- */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-300 hover:text-cyan-400 hover:bg-slate-800/50 transition-all duration-300"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* --- Mobile Menu --- */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-slate-900/98 backdrop-blur-xl border-t border-cyan-500/20 shadow-2xl">
          <div className="px-5 pt-4 pb-6 space-y-2">
            <a
              href="#features"
              className="block px-4 py-3 text-gray-300 font-semibold rounded-lg hover:bg-slate-800/70 hover:text-cyan-400 transition-all"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#info"
              className="block px-4 py-3 text-gray-300 font-semibold rounded-lg hover:bg-slate-800/70 hover:text-cyan-400 transition-all"
              onClick={() => setIsMenuOpen(false)}
            >
              Info
            </a>

            <div className="border-t border-slate-700/50 mt-4 pt-4">
              {isAuthenticated ? (
                <div className="p-2">
                  <Button
                    onClick={() => {
                      navigate("/dashboard");
                      setIsMenuOpen(false);
                    }}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold hover:scale-105 transition-transform shadow-lg shadow-cyan-500/30"
                  >
                    Go to Dashboard
                  </Button>
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block w-full text-center text-gray-300 font-semibold py-3 rounded-lg hover:bg-slate-800/70 hover:text-cyan-400 transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="block w-full text-center bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-lg font-bold mt-2 hover:scale-105 transition-transform shadow-lg shadow-cyan-500/30"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;