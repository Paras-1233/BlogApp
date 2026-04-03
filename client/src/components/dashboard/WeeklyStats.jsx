import { BarChart3, Eye, Heart, MessageCircle, PenSquare } from "lucide-react";

const Metric = ({ icon: Icon, label, value, tone }) => (
  <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
    <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}>
      <Icon size={18} />
    </div>
    <p className="text-2xl font-semibold text-slate-900">{value}</p>
    <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
      {label}
    </p>
  </div>
);

const WeeklyStats = ({ blogs = [] }) => {
  const recentBlogs = blogs.slice(0, 7);
  const recentLikes = recentBlogs.reduce(
    (sum, blog) => sum + (blog.likes?.length || 0),
    0
  );
  const recentComments = recentBlogs.reduce(
    (sum, blog) => sum + (blog.comments?.length || 0),
    0
  );
  const recentViews = recentBlogs.reduce(
    (sum, blog) => sum + (blog.views || 0),
    0
  );

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-600">
            Weekly Snapshot
          </p>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">
            Recent publishing momentum
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            A quick read on how your latest stories are performing across your
            most recent posts.
          </p>
        </div>

        <div className="hidden rounded-2xl bg-sky-50 p-3 text-sky-600 sm:flex">
          <BarChart3 size={20} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          icon={PenSquare}
          label="Recent Posts"
          value={recentBlogs.length}
          tone="bg-sky-100 text-sky-600"
        />
        <Metric
          icon={Eye}
          label="Recent Views"
          value={recentViews}
          tone="bg-cyan-100 text-cyan-600"
        />
        <Metric
          icon={Heart}
          label="Recent Likes"
          value={recentLikes}
          tone="bg-rose-100 text-rose-600"
        />
        <Metric
          icon={MessageCircle}
          label="Recent Comments"
          value={recentComments}
          tone="bg-amber-100 text-amber-600"
        />
      </div>
    </section>
  );
};

export default WeeklyStats;
