import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TopPostCard = ({ post }) => {
  const navigate = useNavigate();

  if (!post) return null;

  return (
    <div
      onClick={() => navigate(`/blog/${post._id}`)}
      className="cursor-pointer rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-600">
        Top Post
      </p>

      <h3 className="mt-3 line-clamp-2 text-lg font-semibold text-slate-900">
        {post.title}
      </h3>

      <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1 rounded-full bg-cyan-50 px-2.5 py-1 font-medium text-cyan-700">
          <Eye size={13} />
          {post.views || 0} views
        </span>
        <span className="rounded-full bg-rose-50 px-2.5 py-1 font-medium text-rose-600">
          {post.likes?.length || 0} likes
        </span>
        <span className="rounded-full bg-amber-50 px-2.5 py-1 font-medium text-amber-600">
          {post.comments?.length || 0} comments
        </span>
      </div>
    </div>
  );
};

export default TopPostCard;
