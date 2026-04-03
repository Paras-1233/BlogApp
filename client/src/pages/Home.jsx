import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import BlogCard from "../components/BlogCard";
import { getBlogs } from "../services/blogService";
import RightSidebar from "../components/RightSiderbar";
import Hero from "../components/Hero";

const Home = () => {
  const navigate = useNavigate();
  const INITIAL_VISIBLE_BLOGS = 4;

  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_BLOGS);

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
  const visibleBlogs = filteredBlogs.slice(0, visibleCount);

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_BLOGS);
  }, [search]);

  return (
    <MainLayout>
      <div className="mx-auto w-full max-w-[1380px] px-4 sm:px-6 py-10">

        {/* HERO */}
        <Hero navigate={navigate} />

        {/* 🔍 SEARCH */}
        <div className="mb-12 relative">

  {/* 🔍 Modern Icon */}
  <svg
    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
  >
    <circle
      cx="11"
      cy="11"
      r="7"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path
      d="M20 20L16.65 16.65"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>

  <input
    type="text"
    placeholder="Search blogs..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-full pl-12 pr-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition"
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
            <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.7fr)_360px] gap-8 xl:gap-10 items-start">

              {/* LEFT - BLOG GRID */}
              <div>
                <div className="grid sm:grid-cols-2 gap-8 auto-rows-fr">
                  {visibleBlogs.map((blog) => (
                    <BlogCard
                      key={blog._id}
                      blog={blog}
                      refreshBlogs={fetchBlogs}
                    />
                  ))}
                </div>

                {filteredBlogs.length > visibleCount && (
                  <div className="mt-10 rounded-[28px] border border-slate-200 bg-white/90 px-6 py-7 shadow-[0_12px_34px_rgba(15,23,42,0.07)]">
                    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-600">
                          Keep Reading
                        </p>
                        <h3 className="mt-2 text-xl font-semibold text-slate-900">
                          More stories are waiting below the fold.
                        </h3>
                        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                          Showing {visibleCount} of {filteredBlogs.length} posts so the
                          feed stays easier to scan.
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          setVisibleCount((prev) =>
                            Math.min(prev + INITIAL_VISIBLE_BLOGS, filteredBlogs.length)
                          )
                        }
                        className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800"
                      >
                        Load More Stories
                      </button>
                    </div>
                  </div>
                )}
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
