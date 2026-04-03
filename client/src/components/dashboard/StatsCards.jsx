import { Activity, Eye, Heart, MessageCircle, FileText } from "lucide-react";

const StatItem = ({ label, value, icon: Icon, color }) => (
  <div className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
    <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${color}`}>
      <Icon size={18} />
    </div>
    <div>
      <p className="text-3xl font-semibold text-slate-900">{value}</p>
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-[11px] text-slate-400">Live dashboard total</p>
    </div>
  </div>
);

const StatsCards = ({ data }) => {
  return (
    <div className="mb-8 grid grid-cols-2 gap-4 xl:grid-cols-5">
      <StatItem
        label="Posts"
        value={data.totalPosts}
        icon={FileText}
        color="bg-blue-50 text-blue-500"
      />
      <StatItem
        label="Views"
        value={data.totalViews}
        icon={Eye}
        color="bg-cyan-50 text-cyan-600"
      />
      <StatItem
        label="Engagement"
        value={data.totalEngagement}
        icon={Activity}
        color="bg-emerald-50 text-emerald-500"
      />
      <StatItem
        label="Likes"
        value={data.totalLikes}
        icon={Heart}
        color="bg-rose-50 text-rose-500"
      />
      <StatItem
        label="Comments"
        value={data.totalComments}
        icon={MessageCircle}
        color="bg-violet-50 text-violet-500"
      />
    </div>
  );
};

export default StatsCards;
