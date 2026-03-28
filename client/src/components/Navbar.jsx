import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect, useRef } from "react";
import logo from "../assets/logo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
    setDropdownOpen(false);
  };

  const avatarInitial = user?.username?.charAt(0).toUpperCase();

  return (
    <>
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm"
            : "bg-white/80 backdrop-blur-sm border-b border-gray-100"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-[60px] flex items-center justify-between">

          {/* ── Logo ── */}
          <button
  onClick={() => navigate("/")}
  className="flex items-center gap-2"
>
  <img
    src={logo}
    alt="BlogiFy Logo"
className="h-28 w-auto object-contain"
  />
</button>

          {/* ── Desktop Nav ── */}
          <div className="hidden md:flex items-center gap-5">

            {/* Nav links */}
            {[
              { path: "/", label: "Home" },
              ...(user ? [{ path: "/dashboard", label: "Dashboard" }] : []),
            ].map(({ path, label }) => (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`relative py-1.5 text-sm font-medium transition-colors duration-150 ${
                  isActive(path)
                    ? "text-blue-600"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {label}
                {isActive(path) && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-blue-600 to-blue-400" />
                )}
              </button>
            ))}

            {/* Logged-in: avatar dropdown */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300 transition-all duration-150"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs flex-shrink-0">
                    {avatarInitial}
                  </div>
                  <span className="text-sm font-medium text-gray-700 max-w-[96px] truncate">
                    {user?.username}
                  </span>
                  <svg
                    className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-200/60 py-1.5 z-50 overflow-hidden">
                    {/* User info */}
                    <div className="px-4 py-2.5 border-b border-gray-50">
                      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Signed in as</p>
                      <p className="text-sm font-semibold text-gray-800 truncate mt-0.5">{user?.username}</p>
                    </div>

                    {/* Menu items */}
                    <div className="py-1">
                      <button
                        onClick={() => navigate("/profile")}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                      >
                        <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
                        </svg>
                        Profile
                      </button>
                      <button
                        onClick={() => navigate("/dashboard")}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                      >
                        <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                        </svg>
                        Dashboard
                      </button>
                    </div>

                    <div className="border-t border-gray-100 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                        </svg>
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Logged-out: auth buttons */
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate("/login")}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Log in
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm transition-all hover:-translate-y-px"
                >
                  Get started
                </button>
              </div>
            )}
          </div>

          {/* ── Mobile hamburger ── */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col justify-center gap-[5px] w-9 h-9 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors items-center"
            aria-label="Toggle menu"
          >
            <span
              className={`block w-[17px] h-[1.5px] bg-gray-600 rounded-full transition-all duration-200 origin-center ${
                menuOpen ? "rotate-45 translate-y-[6.5px]" : ""
              }`}
            />
            <span
              className={`block w-[17px] h-[1.5px] bg-gray-600 rounded-full transition-all duration-200 ${
                menuOpen ? "opacity-0 scale-x-0" : ""
              }`}
            />
            <span
              className={`block w-[17px] h-[1.5px] bg-gray-600 rounded-full transition-all duration-200 origin-center ${
                menuOpen ? "-rotate-45 -translate-y-[6.5px]" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      {/* ── Mobile Drawer ── */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />

          {/* Slide-in panel */}
          <div className="absolute right-0 top-0 h-full w-[82%] max-w-[310px] bg-white shadow-2xl flex flex-col">

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <button
                onClick={() => { navigate("/"); setMenuOpen(false); }}
                className="text-[1.1rem] font-bold tracking-tight bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent"
              >
                BlogiFy
              </button>
              <button
                onClick={() => setMenuOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 text-sm transition-colors"
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            {/* User card */}
            {user && (
              <div className="mx-4 mt-4 p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {avatarInitial}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{user?.username}</p>
                  <p className="text-xs text-blue-500 font-medium">Signed in</p>
                </div>
              </div>
            )}

            {/* Nav links */}
            <div className="flex flex-col gap-1 p-4 flex-1">
              {[
                { path: "/", label: "Home" },
                ...(user ? [
                  { path: "/dashboard", label: "Dashboard" },
                  { path: "/profile", label: "Profile" },
                ] : []),
              ].map(({ path, label }) => (
                <button
                  key={path}
                  onClick={() => { navigate(path); setMenuOpen(false); }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive(path)
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Bottom actions */}
            <div className="p-4 border-t border-gray-100 flex flex-col gap-2">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="w-full py-3 rounded-xl text-sm font-medium text-red-500 border border-red-100 hover:bg-red-50 transition-colors"
                >
                  Sign out
                </button>
              ) : (
                <>
                  <button
                    onClick={() => { navigate("/register"); setMenuOpen(false); }}
                    className="w-full py-3 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    Get started
                  </button>
                  <button
                    onClick={() => { navigate("/login"); setMenuOpen(false); }}
                    className="w-full py-3 rounded-xl text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    Log in
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;