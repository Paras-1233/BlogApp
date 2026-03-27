import MainLayout from "../layouts/MainLayout";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMyBlogs } from "../services/blogService";

const Profile = () => {
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      navigate("/profile");
    } else {
      fetchMyBlogs();
    }
  }, []);

  const fetchMyBlogs = async () => {
    try {
      const res = await getMyBlogs();
      setBlogs(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return null;

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* PROFILE CARD */}
        <div className="bg-white shadow-xl rounded-2xl p-8 text-center">

          {/* 👤 Avatar */}
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center text-3xl font-bold mb-4 shadow-md">
            {user.name?.charAt(0).toUpperCase() || user.username?.charAt(0).toUpperCase()}
          </div>

          {/* Name */}
          <h2 className="text-2xl font-bold mb-1">
            {user.name || user.username}
          </h2>

          {/* Username */}
          <p className="text-gray-500 mb-1">
            @{user.username}
          </p>

          {/* Email */}
          <p className="text-gray-500 mb-6">
            {user.email}
          </p>

          {/* 📊 Stats */}
          <div className="flex justify-center gap-12 mb-6">

            <div>
              <p className="text-xl font-bold text-blue-600">
                {blogs.length}
              </p>
              <p className="text-sm text-gray-500">Blogs</p>
            </div>

          </div>

          {/* 🔘 Actions */}
          <div className="flex justify-center gap-4">

            <button
              onClick={() => navigate("/dashboard")}
              className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              My Blogs
            </button>

            <button
              onClick={() => {
                localStorage.clear();
                navigate("/login");
              }}
              className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>

          </div>

        </div>

        {/* 📚 BLOG LIST PREVIEW */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-4">
            Your Recent Blogs
          </h3>

          {blogs.length === 0 ? (
            <p className="text-gray-500">
              You haven't created any blogs yet.
            </p>
          ) : (
            <div className="space-y-3">
              {blogs.slice(0, 3).map((blog) => (
                <div
                  key={blog._id}
                  onClick={() => navigate(`/blog/${blog._id}`)}
                  className="p-4 bg-white rounded-lg shadow hover:shadow-md cursor-pointer transition"
                >
                  <h4 className="font-semibold">
                    {blog.title}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {new Date(blog.createdAt).toDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </MainLayout>
  );
};

export default Profile;