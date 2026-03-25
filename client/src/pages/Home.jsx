import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import BlogCard from "../components/BlogCard";
import { getBlogs } from "../services/blogService";

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState(""); // ✅ NEW
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
      console.error(err);
      setError("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  // ✅ FILTER LOGIC
  const filteredBlogs = blogs.filter((blog) =>
  (blog.title || "")
    .toLowerCase()
    .includes(search.toLowerCase())
);
  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* 🔥 HERO */}
        <div className="relative rounded-2xl overflow-hidden mb-10">
          <img
            src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
            className="w-full h-72 object-cover"
          />
          <div className="absolute inset-0 bg-black/50 flex flex-col justify-end p-6 text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              The Art of Slow Design
            </h1>
            <p className="text-sm text-gray-200 max-w-md">
              Embracing purpose over pace in modern design.
            </p>
          </div>
        </div>

        {/* 🔍 SEARCH BAR */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="🔍 Search blogs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold mb-6">
          Latest Blogs
        </h2>

        {/* Loading */}
        {loading && (
          <p className="text-center text-gray-500">
            Loading blogs...
          </p>
        )}

        {/* Error */}
        {error && (
          <p className="text-center text-red-500">{error}</p>
        )}

        {/* Empty */}
        {!loading && filteredBlogs.length === 0 && (
          <p className="text-center text-gray-500">
            No blogs found for "{search}" 😕
          </p>
        )}

        {/* GRID */}
        {!loading && filteredBlogs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* LEFT */}
            <div className="md:col-span-2 grid sm:grid-cols-2 gap-6">
              {filteredBlogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>

            {/* RIGHT */}
            <div className="space-y-6">

              {/* Trending */}
              <div className="bg-white/70 backdrop-blur-lg p-5 rounded-2xl shadow-md">
                <h3 className="font-semibold mb-3">
                  🔥 Trending
                </h3>

                <div className="space-y-3 text-sm text-gray-600">
                  {blogs.slice(0, 3).map((b) => (
                    <p
                      key={b._id}
                      className="hover:text-black cursor-pointer"
                    >
                      {b.title}
                    </p>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="bg-white/70 backdrop-blur-lg p-5 rounded-2xl shadow-md">
                <h3 className="font-semibold mb-3">
                  🏷 Tags
                </h3>

                <div className="flex flex-wrap gap-2">
                  {["React", "MERN", "JavaScript", "UI/UX"].map(
                    (tag) => (
                      <span
                        key={tag}
                        className="bg-gray-100 px-3 py-1 text-xs rounded-full hover:bg-gray-200 cursor-pointer"
                      >
                        #{tag}
                      </span>
                    )
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </MainLayout>
  );
};

export default Home;