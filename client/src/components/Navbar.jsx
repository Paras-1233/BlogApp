import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth(); // 🔥 use context

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // ✅ DIRECT AUTH (NO STATE BUGS)
  const token = localStorage.getItem("token");

  let user = null;
  const rawUser = localStorage.getItem("user");
  if (rawUser) {
    try {
      user = JSON.parse(rawUser);
    } catch (error) {
      console.warn("Navbar: failed to parse user object from localStorage", error);
      user = null;
    }
  }

  const isLoggedIn = !!token;
  const username = user?.username || "User";
  const profileImage = user?.profileImage || null;

  const handleLogout = () => {
    localStorage.clear();
    setMenuOpen(false);
    setDropdownOpen(false);
    navigate("/login");
  };

  const getLinkStyle = (path) =>
    `transition-colors duration-200 ${
      location.pathname === path
        ? "text-blue-600 font-semibold"
        : "text-gray-600 hover:text-blue-500"
    }`;

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="font-bold text-2xl text-blue-600">
          BlogiFy
        </Link>

        {/* DESKTOP */}
        <div className="hidden md:flex items-center gap-6">

          {/* Home */}
          <button onClick={() => navigate("/")} className={isActive("/")}>
            Home
          </button>

          {/* Dashboard */}
          {user && (
            <button
              onClick={() => navigate("/dashboard")}
              className={isActive("/dashboard")}
            >
              Dashboard
            </button>
          )}

          {/* Profile */}
          {user && (
            <button
              onClick={() => navigate("/profile")}
              className="text-gray-600 hover:text-black"
            >
              Profile
            </button>
          )}

          {/* Auth Section */}
          {user ? (
            <button
              onClick={() => {
                logout(); // 🔥 important
                navigate("/login");
              }}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          ) : (
            <div className="flex items-center gap-3">
          <Link to="/" className={getLinkStyle("/")}>
            Home
          </Link>

          {isLoggedIn && (
            <Link to="/dashboard" className={getLinkStyle("/dashboard")}>
              Dashboard
            </Link>
          )}

          {/* 👤 USER DROPDOWN */}
          {isLoggedIn ? (
            <div className="relative">

              {/* CLICK AREA */}
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 cursor-pointer px-3 py-1 rounded-lg hover:bg-gray-100 transition"
                type="button"
                aria-expanded={dropdownOpen}
                aria-label="User menu"
              >
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold overflow-hidden">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt={`${username} avatar`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{username.charAt(0).toUpperCase()}</span>
                  )}
                </div>

                {/* Username */}
                <span className="font-medium text-gray-700">
                  {username}
                </span>

                {/* Arrow */}
                <span className="text-sm text-gray-500">⌄</span>
              </button>

              {/* DROPDOWN */}
              {dropdownOpen && (
                <div className="absolute right-0 top-12 w-44 bg-white border rounded-xl shadow-lg py-2 z-50">

                  <button
                    onClick={() => {
                      navigate("/profile");
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    type="button"
                  >
                    👤 Profile
                  </button>

                  <button
                    onClick={() => {
                      handleLogout();
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                    type="button"
                  >
                    🚪 Logout
                  </button>

                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className={getLinkStyle("/login")}>
                Login
              </Link>

              <Link
                to="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* MOBILE BUTTON */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <div className="px-6 py-6 flex flex-col gap-5">

            {/* USER HEADER */}
            {isLoggedIn && (
              <div className="flex items-center gap-3 border-b pb-4">
                <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg overflow-hidden">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt={`${username} avatar`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{username.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div>
                  <p className="font-semibold">{username}</p>
                  <p className="text-xs text-gray-500">Logged in</p>
                </div>
              </div>
            )}

            <Link to="/" onClick={() => setMenuOpen(false)}>
              Home
            </Link>

            {isLoggedIn && (
              <>
                <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
                  Dashboard
                </Link>

                <Link to="/profile" onClick={() => setMenuOpen(false)}>
                  Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                  Logout
                </button>
              </>
            )}

            {!isLoggedIn && (
              <>
                <Link to="/login">Login</Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  Register
                </Link>
              </>
            )}

          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;