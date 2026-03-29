import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import BlogCard from "../components/BlogCard";
import { getBlogs } from "../services/blogService";
import RightSidebar from "../components/RightSiderbar";
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
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* HERO */}
        <Hero navigate={navigate} />

        {/* 🔍 SEARCH */}
        <div className="mb-12">
          <input
            type="text"
            placeholder="🔍 Search blogs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition"
          />
        </div>

        {/* BLOG SECTION */}
        <div id="blogs" className="mt-16">
          <h2 className="text-2xl font-semibold mb-8">Latest Blogs</h2>

          {/* Loading */}
          {loading && (
            <p className="text-center text-gray-400 text-sm">
              Loading blogs...
            </p>
          )}

          {/* Error */}
          {error && (
            <p className="text-center text-red-500 text-sm">{error}</p>
          )}

          {/* Empty */}
          {!loading && filteredBlogs.length === 0 && (
            <p className="text-center text-gray-500 text-sm">
              No blogs found for "{search}"
            </p>
          )}

          {/* Content */}
          {!loading && filteredBlogs.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10 items-start">

              {/* LEFT - BLOG GRID */}
              <div className="grid sm:grid-cols-2 gap-8 auto-rows-fr">
                {filteredBlogs.map((blog) => (
                  <BlogCard
                    key={blog._id}
                    blog={blog}
                    refreshBlogs={fetchBlogs}
                  />
                ))}
              </div>

              {/* RIGHT SIDEBAR */}
              <RightSidebar blogs={blogs} setSearch={setSearch} />
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;