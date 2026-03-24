import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import BlogCard from "../components/BlogCard";
import { getBlogs } from "../services/blogService";

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await getBlogs();
      setBlogs(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* Hero */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold">Latest Blogs</h1>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-center text-gray-500">Loading blogs...</p>
        )}

        {/* Error */}
        {error && (
          <p className="text-center text-red-500">{error}</p>
        )}

        {/* Empty State */}
        {!loading && blogs.length === 0 && (
          <p className="text-center text-gray-500">
            No blogs found. Create your first one 🚀
          </p>
        )}

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>

      </div>
    </MainLayout>
  );
};

export default Home;