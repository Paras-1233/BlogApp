import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import MainLayout from "../layouts/MainLayout";
import { getMyBlogs, deleteBlog } from "../services/blogService";
import { useAuth } from "../contexts/AuthContext";

import StatsCards from "../components/dashboard/StatsCards";
import TopPostCard from "../components/dashboard/TopPostCard";
import EngagementCard from "../components/dashboard/EngagementCard";
import WeeklyStats from "../components/dashboard/WeeklyStats";
import ViewsChart from "../components/dashboard/ViewsChart";

const DELETE_CONFIRM_TOAST_ID = "dashboard-delete-confirm";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const res = await getMyBlogs();
        setBlogs(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadBlogs();
  }, []);

  const performDelete = async (blogId) => {
    try {
      toast.dismiss(DELETE_CONFIRM_TOAST_ID);
      setDeletingId(blogId);
      await deleteBlog(blogId);
      setBlogs((prev) => prev.filter((blog) => blog._id !== blogId));
      toast.success("Post deleted successfully.");
    } catch (err) {
      console.error(err);
      toast.error("Couldn't delete the post. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDelete = (blogId) => {
    toast.custom(
      () => (
        <div className="w-[340px] rounded-[22px] border border-slate-200 bg-white p-4 shadow-xl">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <AlertTriangle size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900">
                Delete this post?
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                This action can&apos;t be undone, and the post will be removed
                from your dashboard.
              </p>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => {
                toast.dismiss(DELETE_CONFIRM_TOAST_ID);
                performDelete(blogId);
              }}
              className="rounded-xl bg-red-600 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Delete
            </button>
            <button
              onClick={() => toast.dismiss(DELETE_CONFIRM_TOAST_ID)}
              className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        id: DELETE_CONFIRM_TOAST_ID,
        duration: 8000,
      }
    );
  };

  const totalPosts = blogs.length;
  const totalViews = blogs.reduce((sum, blog) => sum + (blog.views || 0), 0);
  const totalLikes = blogs.reduce((sum, blog) => sum + (blog.likes?.length || 0), 0);
  const totalComments = blogs.reduce(
    (sum, blog) => sum + (blog.comments?.length || 0),
    0
  );
  const totalEngagement = totalLikes + totalComments;

  const topPost = [...blogs].sort((a, b) => {
    const aScore = (a.views || 0) * 10 + (a.likes?.length || 0) + (a.comments?.length || 0);
    const bScore = (b.views || 0) * 10 + (b.likes?.length || 0) + (b.comments?.length || 0);
    return bScore - aScore;
  })[0];

  return (
    <MainLayout>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-600">
              Dashboard
            </p>
            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Welcome back, {user?.username || "Writer"}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Track your post performance and manage your latest writing.
            </p>
          </div>

          <button
            onClick={() => navigate("/create")}
            className="rounded-2xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            New Post
          </button>
        </div>

        <StatsCards
          data={{
            totalPosts,
            totalViews,
            totalEngagement,
            totalLikes,
            totalComments,
          }}
        />

        <div className="mb-8 grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_360px]">
          <WeeklyStats blogs={blogs} />

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-1">
            <TopPostCard post={topPost} />
            <EngagementCard
              posts={totalPosts}
              likes={totalLikes}
              comments={totalComments}
            />
          </div>
        </div>

        <div className="mb-8">
          <ViewsChart blogs={blogs} />
        </div>

        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-400">Loading your posts...</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-600">
              No Posts Yet
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
              Start your dashboard with your first story
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
              Once you publish, your post analytics and management tools will
              appear here.
            </p>
            <button
              onClick={() => navigate("/create")}
              className="mt-6 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Write your first post
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-slate-900">Your Posts</h2>
              <p className="text-sm text-slate-500">
                Edit, review, or remove posts from your library.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog) => (
                <div
                  key={blog._id}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-sky-600">
                      {new Date(blog.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                      Post
                    </span>
                  </div>

                  <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-slate-900">
                    {blog.title}
                  </h3>

                  <p className="mb-4 line-clamp-3 text-sm leading-6 text-slate-500">
                    {blog.content}
                  </p>

                  <div className="mb-5 flex flex-wrap gap-2 text-xs text-slate-500">
                    <span className="rounded-full bg-cyan-50 px-2.5 py-1 font-medium text-cyan-700">
                      {blog.views || 0} views
                    </span>
                    <span className="rounded-full bg-rose-50 px-2.5 py-1 font-medium text-rose-600">
                      {blog.likes?.length || 0} likes
                    </span>
                    <span className="rounded-full bg-amber-50 px-2.5 py-1 font-medium text-amber-600">
                      {blog.comments?.length || 0} comments
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/blog/${blog._id}`)}
                      className="flex-1 rounded-2xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      View
                    </button>
                    <button
                      onClick={() => navigate(`/edit/${blog._id}`)}
                      className="flex-1 rounded-2xl bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(blog._id)}
                      disabled={deletingId === blog._id}
                      className="rounded-2xl border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deletingId === blog._id ? "..." : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Dashboard;
