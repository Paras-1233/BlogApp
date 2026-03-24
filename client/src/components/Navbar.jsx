import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between">

        <h1
          onClick={() => navigate("/")}
          className="font-bold text-xl text-blue-600 cursor-pointer"
        >
          BlogApp
        </h1>

        <div className="space-x-4">
          <button
            onClick={() => navigate("/")}
            className="text-gray-600 hover:text-black"
          >
            Home
          </button>

          <button
            onClick={() => navigate("/login")}
            className="text-gray-600 hover:text-black"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-gray-600 hover:text-black"
          >
            Dashboard
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;