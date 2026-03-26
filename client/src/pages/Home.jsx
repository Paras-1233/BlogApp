import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import BlogCard from "../components/BlogCard";
import { getBlogs } from "../services/blogService";
import Sidebar from "../components/Sidebar";
import Hero from "../components/Hero";

const Home = () => {
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await getBlogs();
      const blogData = Array.isArray(res.data)
        ? res.data
        : res.data.blogs || [];
      setBlogs(blogData);
    } catch (err) {
      setError("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  const filteredBlogs = blogs.filter((blog) =>
    (blog.title || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-10">
          
          {/* HERO */}
        <Hero navigate={navigate} />

        {/* 🔍 SEARCH */}
        <div className="mb-10">
          <input
            type="text"
            placeholder="🔍 Search blogs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-5 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
          />
        </div>

        {/* BLOG SECTION */}
        <div id="blogs">
          <h2 className="text-2xl font-semibold mb-6">Latest Blogs</h2>

          {loading && <p className="text-center text-gray-500">Loading...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}

          {!loading && filteredBlogs.length === 0 && (
            <p className="text-center text-gray-500">
              No blogs found for "{search}"
            </p>
          )}

          {!loading && filteredBlogs.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">

              {/* LEFT - BLOG GRID */}
              <div className="md:col-span-2 grid sm:grid-cols-2 gap-6">
                {filteredBlogs.map((blog) => (
                  <BlogCard
                    key={blog._id}
                    blog={blog}
                    refreshBlogs={fetchBlogs}
                  />
                ))}
              </div>

              <Sidebar blogs={blogs} setSearch={setSearch} />
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;