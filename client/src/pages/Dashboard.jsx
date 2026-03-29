import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { useNavigate } from "react-router-dom";
import { getMyBlogs, deleteBlog } from "../services/blogService";
import { useAuth } from "../contexts/AuthContext";


// ─── Skeleton loader ───────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
    <div className="h-40 bg-gray-100" />
    <div className="p-5 space-y-3">
      <div className="h-4 bg-gray-100 rounded-full w-3/4" />
      <div className="h-3 bg-gray-100 rounded-full w-1/3" />
      <div className="flex justify-between pt-2">
        <div className="h-3 bg-gray-100 rounded-full w-12" />
        <div className="h-3 bg-gray-100 rounded-full w-12" />
      </div>
    </div>
  </div>
);

// ─── Stat card ─────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon, color, delay }) => (
  <div
    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4
      hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default"
    style={{ animationDelay: delay }}
  >
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-900 leading-none">{value}</p>
      <p className="text-xs text-gray-400 font-medium mt-1">{label}</p>
    </div>
  </div>
);

// ─── Blog card (grid view) ─────────────────────────────────────────────────────
const BlogCard = ({ blog, onEdit, onDelete, onView, index }) => (
  <div
    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden
      hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col"
    style={{ animationDelay: `${index * 60}ms` }}
  >
    {/* Thumbnail */}
    <div className="relative h-44 overflow-hidden bg-gray-50 flex-shrink-0">
      <img
        src={blog.image || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80"}
        alt={blog.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      {/* Quick view on hover */}
      <button
        onClick={() => onView(blog._id)}
        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      >
        <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
          View post →
        </span>
      </button>
    </div>

    {/* Body */}
    <div className="p-5 flex flex-col flex-1">
      <h3 className="font-semibold text-gray-900 text-[0.95rem] leading-snug line-clamp-2 mb-1.5">
        {blog.title}
      </h3>
      <p className="text-xs text-gray-400 font-medium mb-4">
        {new Date(blog.createdAt).toLocaleDateString("en-US", {
          month: "short", day: "numeric", year: "numeric",
        })}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-2 mt-auto">
        <button
          onClick={() => onEdit(blog._id)}
          className="flex-1 py-2 rounded-xl border border-blue-200 text-blue-600 text-xs font-semibold
            hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-200"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(blog._id)}
          className="flex-1 py-2 rounded-xl border border-red-100 text-red-400 text-xs font-semibold
            hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);

// ─── Recent post row ───────────────────────────────────────────────────────────
const RecentRow = ({ blog, onEdit, onDelete, onView, index }) => (
  <div
    className="flex items-center gap-4 py-3.5 px-4 rounded-xl hover:bg-gray-50 transition-colors duration-150 group"
    style={{ animationDelay: `${index * 50}ms` }}
  >
    {/* Thumb */}
    <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
      <img
        src={blog.image || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=100&q=70"}
        alt=""
        className="w-full h-full object-cover"
      />
    </div>

    {/* Title + date */}
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-gray-800 truncate">{blog.title}</p>
      <p className="text-xs text-gray-400 mt-0.5">
        {new Date(blog.createdAt).toLocaleDateString("en-US", {
          month: "short", day: "numeric",
        })}
      </p>
    </div>

    {/* Actions (appear on hover) */}
    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
      <button
        onClick={() => onView(blog._id)}
        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors"
        title="View"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      </button>
      <button
        onClick={() => onEdit(blog._id)}
        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
        title="Edit"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </button>
      <button
        onClick={() => onDelete(blog._id)}
        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
        title="Delete"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  </div>
);

// ─── Empty state ───────────────────────────────────────────────────────────────
const EmptyState = ({ onCreateClick }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
      <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    </div>
    <h3 className="text-base font-semibold text-gray-800 mb-1">No posts yet</h3>
    <p className="text-sm text-gray-400 mb-6 max-w-xs">
      Your published posts will appear here. Start writing your first one now.
    </p>
    <button
      onClick={onCreateClick}
      className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl
        hover:bg-blue-700 hover:shadow-md hover:-translate-y-px transition-all duration-200"
    >
      Write your first post
    </button>
  </div>
);

// ─── Confirm delete modal ──────────────────────────────────────────────────────
const DeleteModal = ({ onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onCancel} />
    <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
      <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center mb-4">
        <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </div>
      <h3 className="text-base font-semibold text-gray-900 mb-1">Delete this post?</h3>
      <p className="text-sm text-gray-400 mb-6">This action cannot be undone.</p>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600
            hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold
            hover:bg-red-600 hover:shadow-md transition-all duration-200"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);

// ─── Dashboard ─────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("grid"); // "grid" | "list"
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [mounted, setMounted] = useState(false);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const response = await getMyBlogs();
      setBlogs(response.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setTimeout(() => setMounted(true), 50);
    }
  };

  useEffect(() => { loadBlogs(); }, []);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteBlog(deleteTarget);
      setBlogs((prev) => prev.filter((b) => b._id !== deleteTarget));
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteTarget(null);
    }
  };

  // Fake stats derived from real data
  const stats = [
    {
      label: "Total Posts",
      value: blogs.length,
      color: "bg-blue-50 text-blue-500",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      ),
    },
    {
      label: "Total Views",
      value: "2.4k",
      color: "bg-emerald-50 text-emerald-500",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      label: "Total Likes",
      value: "318",
      color: "bg-rose-50 text-rose-500",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      ),
    },
    {
      label: "Comments",
      value: "57",
      color: "bg-violet-50 text-violet-500",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
        </svg>
      ),
    },
  ];

  return (
    <MainLayout>
      
      {/* Fade-in wrapper */}
      <div
        className={`max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 transition-all duration-500 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
        }`}
      >

        {/* ── Welcome bar ───────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-sm text-gray-400 font-medium mb-0.5">{greeting()},</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              {user?.username ?? "Writer"} 👋
            </h1>
          </div>

          <button
            onClick={() => navigate("/create")}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold
              rounded-xl shadow-sm hover:bg-blue-700 hover:shadow-md hover:-translate-y-px
              active:translate-y-0 transition-all duration-200 self-start sm:self-auto"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Post
          </button>
        </div>

        {/* ── Stats row ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <StatCard key={s.label} {...s} delay={`${i * 60}ms`} />
          ))}
        </div>

        {/* ── Posts section ─────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          {/* Section header */}
          <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-100">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Your Posts</h2>
              {!loading && (
                <p className="text-xs text-gray-400 mt-0.5">
                  {blogs.length} {blogs.length === 1 ? "post" : "posts"} total
                </p>
              )}
            </div>

            {/* View toggle */}
            {!loading && blogs.length > 0 && (
              <div className="flex items-center bg-gray-100 rounded-lg p-0.5 gap-0.5">
                {[
                  {
                    id: "grid", icon: (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                      </svg>
                    )
                  },
                  {
                    id: "list", icon: (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                      </svg>
                    )
                  },
                ].map(({ id, icon }) => (
                  <button
                    key={id}
                    onClick={() => setView(id)}
                    className={`p-1.5 rounded-md transition-all duration-150 ${
                      view === id
                        ? "bg-white text-gray-800 shadow-sm"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div className={view === "grid" ? "p-5 sm:p-6" : "px-2 py-3"}>
            {loading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : blogs.length === 0 ? (
              <EmptyState onCreateClick={() => navigate("/create")} />
            ) : view === "grid" ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {blogs.map((blog, i) => (
                  <BlogCard
                    key={blog._id}
                    blog={blog}
                    index={i}
                    onEdit={(id) => navigate(`/edit/${id}`)}
                    onDelete={(id) => setDeleteTarget(id)}
                    onView={(id) => navigate(`/blog/${id}`)}
                  />
                ))}
              </div>
            ) : (
              <div>
                {blogs.map((blog, i) => (
                  <RecentRow
                    key={blog._id}
                    blog={blog}
                    index={i}
                    onEdit={(id) => navigate(`/edit/${id}`)}
                    onDelete={(id) => setDeleteTarget(id)}
                    onView={(id) => navigate(`/blog/${id}`)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <DeleteModal
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </MainLayout>
  );
};

export default Dashboard;