import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { useNavigate } from "react-router-dom";
import { getMyBlogs, deleteBlog } from "../services/blogService";

const Dashboard = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const response = await getMyBlogs();
      setBlogs(response.data || []);
    } catch (error) {
      console.error(error);
      alert("Failed to load your blogs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this blog?");
    if (!confirmDelete) return;

    try {
      await deleteBlog(id);
      setBlogs((prev) => prev.filter((b) => b._id !== id));
    } catch (error) {
      console.error(error);
      alert("Failed to delete blog.");
    }
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* 🔥 Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Your Blogs</h1>

          <button
            onClick={() => navigate("/create")}
            className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition shadow"
          >
            + New Blog
          </button>
        </div>

        {/* Loading */}
        {loading ? (
          <p className="text-center text-gray-500 mt-10">
            Loading your blogs...
          </p>
        ) : blogs.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">
            No blogs yet. Create your first one 🚀
          </p>
        ) : (
          /* 🔥 GRID CARDS */
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {blogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition group"
              >
                {/* Image */}
                <img
                  src={
                    blog.image ||
                    "https://images.unsplash.com/photo-1498050108023-c5249f4df085"
                  }
                  className="w-full h-40 object-cover group-hover:scale-105 transition duration-300"
                />

                {/* Content */}
                <div className="p-4">
                  <h2 className="font-semibold text-lg mb-1 line-clamp-1">
                    {blog.title}
                  </h2>

                  <p className="text-xs text-gray-400 mb-3">
                    {new Date(blog.createdAt).toDateString()}
                  </p>

                  {/* Actions */}
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => navigate(`/edit/${blog._id}`)}
                      className="text-blue-600 text-sm font-medium hover:underline"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(blog._id)}
                      className="text-red-500 text-sm font-medium hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}

          </div>
        )}

      </div>
    </MainLayout>
  );
};

export default Dashboard;