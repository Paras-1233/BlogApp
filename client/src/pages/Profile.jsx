import MainLayout from "../layouts/MainLayout";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* Card */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-lg rounded-2xl p-6 text-center">

          {/* Avatar */}
          <div className="w-20 h-20 mx-auto rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold mb-4">
            {user.username?.charAt(0).toUpperCase()}
          </div>

          {/* Info */}
          <h2 className="text-2xl font-bold mb-1">
            {user.username}
          </h2>

          <p className="text-gray-500 dark:text-gray-300 mb-6">
            {user.email}
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-10 mb-6">
            <div>
              <p className="text-lg font-semibold">--</p>
              <p className="text-sm text-gray-500">Blogs</p>
            </div>
          </div>

          {/* Actions */}
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              navigate("/login");
            }}
            className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>

        </div>

      </div>
    </MainLayout>
  );
};

export default Profile;