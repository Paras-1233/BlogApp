const ViewsChart = ({ blogs = [] }) => {
  const topViewedBlogs = [...blogs]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5);

  const maxViews = topViewedBlogs[0]?.views || 1;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-600">
          Views Overview
        </p>
        <h2 className="mt-2 text-xl font-semibold text-slate-900">
          Most viewed stories
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Your highest-traffic posts based on tracked blog detail views.
        </p>
      </div>

      {topViewedBlogs.length === 0 ? (
        <div className="rounded-2xl bg-slate-50 px-4 py-5 text-sm text-slate-500">
          No view data yet. Open a post to start tracking readership.
        </div>
      ) : (
        <div className="space-y-4">
          {topViewedBlogs.map((blog) => {
            const width = `${Math.max(((blog.views || 0) / maxViews) * 100, 8)}%`;

            return (
              <div key={blog._id}>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className="line-clamp-1 text-sm font-medium text-slate-700">
                    {blog.title}
                  </p>
                  <span className="text-sm font-semibold text-slate-900">
                    {blog.views || 0}
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-sky-500"
                    style={{ width }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default ViewsChart;
