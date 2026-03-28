import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) =>
    location.pathname === path
      ? "text-blue-600 font-semibold"
      : "text-gray-600 hover:text-black";

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMenuOpen(false);
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <h1
          onClick={() => navigate("/")}
          className="font-bold text-2xl text-blue-600 cursor-pointer tracking-tight"
        >
          BlogApp
        </h1>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-6">

          <button onClick={() => navigate("/")} className={isActive("/")}>
            Home
          </button>

          {user && (
            <button
              onClick={() => navigate("/dashboard")}
              className={isActive("/dashboard")}
            >
              Dashboard
            </button>
          )}

          {user && (
            <button
              onClick={() => navigate("/profile")}
              className="text-gray-600 hover:text-black"
            >
              Profile
            </button>
          )}

          {user ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/login")}
                className="text-gray-600 hover:text-black"
              >
                Login
              </button>

              <button
                onClick={() => navigate("/register")}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Register
              </button>
            </div>
          )}
        </div>

        {/* MOBILE BUTTON */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-2xl"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t shadow-md px-6 py-4 flex flex-col gap-4">

          <button onClick={() => { navigate("/"); setMenuOpen(false); }}>
            Home
          </button>

          {user && (
            <>
              <button onClick={() => { navigate("/dashboard"); setMenuOpen(false); }}>
                Dashboard
              </button>

              <button onClick={() => { navigate("/profile"); setMenuOpen(false); }}>
                Profile
              </button>

              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                Logout
              </button>
            </>
          )}

          {!user && (
            <>
              <button onClick={() => { navigate("/login"); setMenuOpen(false); }}>
                Login
              </button>

              <button
                onClick={() => { navigate("/register"); setMenuOpen(false); }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Register
              </button>
            </>
          )}

        </div>
      )}
    </nav>
  );
};

export default Navbar;