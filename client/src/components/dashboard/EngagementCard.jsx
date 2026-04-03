const EngagementCard = ({ posts, likes, comments }) => {
  const rate = posts > 0 ? ((likes + comments) / posts).toFixed(1) : 0;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-600">
        Engagement
      </p>

      <h3 className="mt-3 text-3xl font-semibold text-slate-900">{rate}</h3>

      <p className="mt-1 text-sm text-slate-500">
        Average interactions per post
      </p>
    </div>
  );
};

export default EngagementCard;
