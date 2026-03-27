import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth(); // 🔥 use context

  const isActive = (path) =>
    location.pathname === path
      ? "text-blue-600 font-semibold"
      : "text-gray-600 hover:text-black";

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

        {/* Links */}
        <div className="flex items-center gap-6">

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
      </div>
    </nav>
  );
};

export default Navbar;