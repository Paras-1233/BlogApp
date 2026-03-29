import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toggleLike } from "../services/blogService";

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */

const FALLBACK_IMG = "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80";

const CATEGORY_PALETTE = {
  React:      "bg-sky-50 text-sky-600 border-sky-200",
  JavaScript: "bg-amber-50 text-amber-600 border-amber-200",
  MERN:       "bg-emerald-50 text-emerald-600 border-emerald-200",
  TypeScript: "bg-blue-50 text-blue-600 border-blue-200",
  CSS:        "bg-rose-50 text-rose-600 border-rose-200",
  "Node.js":  "bg-green-50 text-green-600 border-green-200",
  default:    "bg-violet-50 text-violet-600 border-violet-200",
};

const AVATAR_GRADIENTS = [
  "from-blue-500 to-indigo-500",
  "from-indigo-500 to-purple-500",
  "from-blue-600 to-purple-600",
];

function categoryStyle(tag) {
  return CATEGORY_PALETTE[tag] ?? CATEGORY_PALETTE.default;
}

function avatarGradient(name = "") {
  const idx = (name.charCodeAt(0) || 0) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[idx];
}

function readTime(content = "") {
  return Math.max(1, Math.ceil(content.length / 1000));
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/* ─────────────────────────────────────────────
   Skeleton (loading state)
───────────────────────────────────────────── */
export const BlogCardSkeleton = () => (
  <div className="flex flex-col bg-white/70 backdrop-blur-xl rounded-2xl border border-white/60 shadow-[0_2px_16px_rgba(0,0,0,0.06)] overflow-hidden animate-pulse">
    <div className="h-48 bg-slate-200" />
    <div className="p-5 flex flex-col gap-3 flex-1">
      <div className="h-3 w-16 bg-slate-200 rounded-full" />
      <div className="space-y-2">
        <div className="h-4 bg-slate-200 rounded-full w-full" />
        <div className="h-4 bg-slate-200 rounded-full w-4/5" />
      </div>
      <div className="space-y-1.5">
        <div className="h-3 bg-slate-100 rounded-full w-full" />
        <div className="h-3 bg-slate-100 rounded-full w-3/4" />
      </div>
      <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-slate-200" />
          <div className="h-3 w-20 bg-slate-200 rounded-full" />
        </div>
        <div className="h-3 w-14 bg-slate-100 rounded-full" />
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   BlogCard
───────────────────────────────────────────── */
const BlogCard = ({ blog, refreshBlogs }) => {
  const navigate = useNavigate();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [likeAnim, setLikeAnim] = useState(false);

  const user   = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?._id || user?.id;

  const isLiked = blog.likes?.some((id) => {
    const likeId = typeof id === "object" ? id._id : id;
    return likeId?.toString() === userId?.toString();
  });

  const authorName =
    blog.user?.name || blog.user?.username || blog.user?.email || "Anonymous";

  const tag     = blog.category || blog.tags?.[0] || null;
  const minRead = readTime(blog.content);

  /* handlers */
  const handleLike = async (e) => {
    e.stopPropagation();
    setLikeAnim(true);
    setTimeout(() => setLikeAnim(false), 400);
    try {
      await toggleLike(blog._id);
      refreshBlogs?.();
    } catch (err) {
      console.error(err);
    }
  };

  const handleNavigate = () => navigate(`/blog/${blog._id}`);

  /* ── render ── */
  return (
    <>
      {/* Font import (injected once globally is fine; safe to keep here for isolation) */}
      <style>{`
       className="text-base font-semibold leading-snug text-slate-800 group-hover:text-indigo-600 line-clamp-2 transition-colors duration-200"

        @keyframes bc-enter {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .bc-card { animation: bc-enter 0.45s cubic-bezier(0.22,1,0.36,1) both; }

        @keyframes bc-pop {
          0%   { transform: scale(1); }
          40%  { transform: scale(1.35); }
          100% { transform: scale(1); }
        }
        .bc-pop { animation: bc-pop 0.38s cubic-bezier(0.34,1.56,0.64,1); }
      `}</style>

      <article
        onClick={handleNavigate}
        className="
          bc-card group
          flex flex-col h-full
          bg-white/70 backdrop-blur-xl
          rounded-2xl border border-white/60
          shadow-[0_2px_16px_rgba(0,0,0,0.06)]
          hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)]
          hover:-translate-y-1
          transition-all duration-300 ease-out
          cursor-pointer overflow-hidden
        "
      >
        {/* ── Image ── */}
        <div className="relative overflow-hidden shrink-0 h-48 bg-slate-100">
          {/* Skeleton shimmer until image loads */}
          {!imgLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse" />
          )}

          <img
            src={blog.image || FALLBACK_IMG}
            alt={blog.title}
            onLoad={() => setImgLoaded(true)}
            className={`
              w-full h-full object-cover
              group-hover:scale-[1.04] transition-transform duration-500 ease-out
              ${imgLoaded ? "opacity-100" : "opacity-0"}
            `}
          />

          {/* Read time pill */}
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-[11px] font-semibold text-slate-600 shadow-sm">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {minRead} min
          </div>

          {/* Category badge */}
          {tag && (
            <div className={`absolute top-3 left-3 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${categoryStyle(tag)} bg-opacity-90 backdrop-blur-sm`}>
              {tag}
            </div>
          )}

          {/* Bottom gradient overlay */}
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        {/* ── Body ── */}
        <div className="flex flex-col flex-1 p-5 gap-3">

          {/* Title */}
          <h3 className="
            bc-title text-base font-semibold  leading-snug
            text-slate-800 group-hover:text-indigo-600
            line-clamp-2 transition-colors duration-200
          ">
            {blog.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 flex-1">
            {blog.content}
          </p>

          {/* ── Footer ── */}
          <div className="mt-auto pt-3 border-t border-slate-100/80">

            {/* Author row */}
            <div className="flex items-center justify-between">

              {/* Author */}
              <div className="flex items-center gap-2 min-w-0">
  <div
    className={`w-8 h-8 rounded-full bg-gradient-to-br ${avatarGradient(
      authorName
    )} flex items-center justify-center text-white text-xs font-semibold shadow-sm`}
  >
    {authorName[0].toUpperCase()}
  </div>

  <div className="flex flex-col gap-1 min-w-0">
    <p className="text-sm font-medium text-slate-800 truncate">
      {authorName}
    </p>
    <p className="text-xs text-slate-400">
      {formatDate(blog.createdAt)}
    </p>
  </div>
</div>

              {/* Actions */}
              <div className="flex items-center gap-3 shrink-0">

                {/* Like */}
                <button
                  onClick={handleLike}
                  aria-label="Like"
                  className={`
                    flex items-center gap-1 text-[12px] font-medium
                    transition-colors duration-150 select-none
                   ${isLiked ? "text-rose-500" : "text-slate-400 hover:text-rose-500"}
                  `}
                >
                  <span className={likeAnim ? "bc-pop inline-block" : "inline-block"}>
                    {isLiked ? "❤️" : "🤍"}
                  </span>
                  <span>{blog.likes?.length || 0}</span>
                </button>

                {/* Comments */}
                <div className="flex items-center gap-1 text-[12px] text-slate-400 font-medium">
                  <span>💬</span>
                  <span>{blog.comments?.length || 0}</span>
                </div>

                {/* Read more */}
                <span className="text-[12px] font-semiboldtext-indigo-600 group-hover:text-indigo-700 transition-colors duration-150 flex items-center gap-0.5">
                  Read
                  <svg
                    width="12" height="12" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    className="group-hover:translate-x-0.5 transition-transform duration-200"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </span>

              </div>
            </div>
          </div>
        </div>
      </article>
    </>
  );
};

export default BlogCard;