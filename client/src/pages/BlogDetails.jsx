import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  addComment,
  getBlogById,
  toggleLike,
  deleteComment,
  updateComment,
} from "../services/blogService";

import { Heart ,MessageCircle} from "lucide-react";
import Navbar from "../components/Navbar";
const CURRENT_USER = JSON.parse(localStorage.getItem("user"));

// ─── Helpers ────────────────────────────────────────────────────────────────
function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function Avatar({ name, size = "md", color = "indigo" }) {
  const sizes = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-12 h-12 text-base" };
  const colors = {
    indigo: "bg-indigo-500",
    violet: "bg-violet-500",
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    rose: "bg-rose-500",
  };
  const initial = name?.[0]?.toUpperCase() || "U";
  return (
    <div
      className={`${sizes[size]} ${colors[color]} rounded-full flex items-center justify-center font-bold text-white shrink-0`}
    >
      {initial}
    </div>
  );
}

// ─── Skeleton ────────────────────────────────────────────────────────────────
function SkeletonLoader() {
  return (
    <div className="animate-pulse max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="h-72 bg-slate-200 rounded-2xl" />
      <div className="h-8 bg-slate-200 rounded-lg w-3/4" />
      <div className="h-4 bg-slate-200 rounded w-1/2" />
      <div className="flex gap-3 items-center">
        <div className="w-10 h-10 bg-slate-200 rounded-full" />
        <div className="space-y-2">
          <div className="h-3 bg-slate-200 rounded w-24" />
          <div className="h-3 bg-slate-200 rounded w-16" />
        </div>
      </div>
      <div className="space-y-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-4 bg-slate-200 rounded" style={{ width: `${85 + (i % 3) * 5}%` }} />
        ))}
      </div>
    </div>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────
function Hero({ blog }) {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl mb-8 shadow-xl">
      <img
        src={blog.image}
        alt={blog.title}
        className="w-full h-72 md:h-96 object-cover transition-transform duration-700 hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent" />
      {/* Category chip */}
      <div className="absolute top-5 left-5">
        <span className="bg-white/10 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20 tracking-wider uppercase">
          Design & Technology
        </span>
      </div>
    </div>
  );
}

// ─── Author ───────────────────────────────────────────────────────────────────
function Author({ blog }) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <Avatar name={blog.user?.username} size="lg" color="indigo" />
      <div>
        <p className="font-semibold text-slate-800 text-sm">{blog.user?.username || "Anonymous"}</p>
        <p className="text-slate-400 text-xs mt-0.5">
          {formatDate(blog.createdAt)} · {blog.readTime} min read
        </p>
      </div>
    </div>
  );
}

// ─── Actions Bar ─────────────────────────────────────────────────────────────
function ActionsBar({ blog, isLiked, onLike, commentsRef }) {
  const [shared, setShared] = useState(false);
  const [visible, setVisible] = useState(false);
  const barRef = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => setVisible(!e.isIntersecting), { threshold: 1 });
    if (barRef.current) obs.observe(barRef.current);
    return () => obs.disconnect();
  }, []);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  const scrollToComments = () => commentsRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      {/* Inline anchor (observe this to trigger sticky) */}
      <div ref={barRef} className="mb-6" />

      {/* Sticky bar */}
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-1 bg-white/80 backdrop-blur-xl border border-slate-200 shadow-xl rounded-full px-4 py-2.5">
          <button
            onClick={onLike}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95 ${
              isLiked
                ? "text-rose-500 bg-rose-50"
                : "text-slate-500 hover:text-rose-400 hover:bg-rose-50"
            }`}
          >
            <span className="inline-block transition-transform duration-150">
  <Heart
    className="w-4 h-4"
    fill={isLiked ? "currentColor" : "none"}
    stroke="currentColor"
  />
</span>
            <span>{blog.likes?.length || 0}</span>
          </button>

          <div className="w-px h-5 bg-slate-200 mx-1" />

          <button
            onClick={scrollToComments}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-slate-500 hover:text-indigo-500 hover:bg-indigo-50 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{blog.comments?.length || 0}</span>
          </button>

          <div className="w-px h-5 bg-slate-200 mx-1" />

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-slate-500 hover:text-emerald-500 hover:bg-emerald-50 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            {shared ? (
              <>
                <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-emerald-500 text-xs">Copied!</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span>Share</span>
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Blog Content ─────────────────────────────────────────────────────────────
function BlogContent({ content }) {
  const lines = content.split("\n");
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={i} className="text-2xl font-bold text-slate-800 mt-10 mb-4 tracking-tight">
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="text-xl font-semibold text-slate-700 mt-8 mb-3">
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith("- ")) {
      const items = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        const raw = lines[i].slice(2);
        const parts = raw.split(/(\*\*[^*]+\*\*)/g);
        items.push(
          <li key={i} className="text-slate-600 leading-relaxed">
            {parts.map((p, j) =>
              p.startsWith("**") ? <strong key={j} className="text-slate-800 font-semibold">{p.slice(2, -2)}</strong> : p
            )}
          </li>
        );
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="list-disc list-inside space-y-2 my-5 ml-4">
          {items}
        </ul>
      );
      continue;
    } else if (line.trim() === "") {
      // skip blank lines
    } else {
      elements.push(
        <p key={i} className="text-slate-600 leading-[1.9] text-[1.0625rem] mb-5">
          {line}
        </p>
      );
    }
    i++;
  }

  return <div className="mt-2">{elements}</div>;
}

// ─── Comments ─────────────────────────────────────────────────────────────────
function CommentItem({ c, userId, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(c.text);
  const isOwner =
  (c.user?._id?.toString() || c.user?.toString()) === userId?.toString();
  const colors = ["indigo", "violet", "emerald", "amber", "rose"];
  const color = colors[c.user?.username?.charCodeAt(0) % colors.length] || "indigo";

  return (
    <div className="flex gap-3 group">
      <Avatar name={c.user?.username} size="sm" color={color} />
      <div className="flex-1 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100 hover:border-slate-200 transition-colors duration-200">
        <div className="flex items-center justify-between mb-1">
          <span className="font-semibold text-slate-800 text-sm">{c.user?.username || "User"}</span>
          <span className="text-slate-400 text-xs">{timeAgo(c.createdAt || new Date())}</span>
        </div>

        {editing ? (
          <div className="mt-2 space-y-2">
            <input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={() => { onUpdate(c._id, editText); setEditing(false); }}
                className="text-xs bg-indigo-500 text-white px-3 py-1 rounded-lg hover:bg-indigo-600 transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => { setEditing(false); setEditText(c.text); }}
                className="text-xs text-slate-500 px-3 py-1 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-slate-600 text-sm leading-relaxed">{c.text}</p>
            {isOwner && (
              <div className="flex gap-3 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={() => setEditing(true)}
                  className="text-xs text-slate-400 hover:text-indigo-500 transition-colors font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(c._id)}
                  className="text-xs text-slate-400 hover:text-rose-500 transition-colors font-medium"
                >
                  Delete
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function CommentsSection({ blog, userId, commentsRef, onAddComment, onUpdateComment, onDeleteComment }) {
  const [comment, setComment] = useState("");
  const [posting, setPosting] = useState(false);

  const handlePost = async () => {
    if (!comment.trim()) return;
    setPosting(true);
    await onAddComment(comment);
    setComment("");
    setPosting(false);
  };

  return (
    <div ref={commentsRef} className="mt-14 pt-10 border-t border-slate-100">
      <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
        <MessageCircle className="w-5 h-5" />
        {blog.comments?.length || 0} Comments
      </h3>

      {/* Input */}
      <div className="flex gap-3 mb-8">
        <Avatar name={CURRENT_USER.username} size="sm" color="indigo" />
        <div className="flex-1 relative">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handlePost()}
            placeholder="Share your thoughts..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-24 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all duration-200"
          />
          <button
            onClick={handlePost}
            disabled={posting || !comment.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-300 text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition-all duration-200 active:scale-95"
          >
            {posting ? "Posting…" : "Post"}
          </button>
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {[...(blog.comments || [])].reverse().map((c) => (
          <CommentItem
            key={c._id}
            c={c}
            userId={userId}
            onUpdate={onUpdateComment}
            onDelete={onDeleteComment}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Main BlogDetails ─────────────────────────────────────────────────────────
const BlogDetails = () => {
  // Simulate useParams
 const { id } = useParams();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const commentsRef = useRef(null);

  const user = CURRENT_USER;
  const userId = user?._id;

 
    // Simulate fetch
useEffect(() => {
  const fetchBlog = async () => {
    try {
      const res = await getBlogById(id);

      setBlog({
        ...res.data,
        likes: res.data.likes || [],
        comments: res.data.comments || [],
      });

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  fetchBlog();
}, [id]);

  const isLiked = blog?.likes?.some((lid) => {
    const likeId = typeof lid === "object" ? lid._id : lid;
    return likeId?.toString() === userId?.toString();
  });

 

const handleLike = async () => {
  try {
    await toggleLike(blog._id);

    // ✅ fetch fresh data from backend
    const res = await getBlogById(blog._id);

    setBlog({
      ...res.data,
      likes: res.data.likes || [],
      comments: res.data.comments || [],
    });

  } catch (err) {
    console.error(err);
  }
};



  const handleAddComment = async (text) => {
  try {
    await addComment(blog._id, text); // ✅ save in DB

    // ✅ fetch fresh data
    const res = await getBlogById(blog._id);

    setBlog({
      ...res.data,
      likes: res.data.likes || [],
      comments: res.data.comments || [],
    });

  } catch (err) {
    console.error(err);
  }
};

const handleUpdateComment = async (commentId, newText) => {
  try {
    await updateComment(blog._id, commentId, newText); // ✅ backend

    // ✅ refresh data
    const res = await getBlogById(blog._id);

    setBlog({
      ...res.data,
      likes: res.data.likes || [],
      comments: res.data.comments || [],
    });

  } catch (err) {
    console.error(err);
  }
};



const handleDeleteComment = async (commentId) => {
  if (!window.confirm("Delete this comment?")) return;

  try {
    await deleteComment(blog._id, commentId); // ✅ backend

    // ✅ refresh data
    const res = await getBlogById(blog._id);

    setBlog({
      ...res.data,
      likes: res.data.likes || [],
      comments: res.data.comments || [],
    });

  } catch (err) {
    console.error(err);
  }
};

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
          <SkeletonLoader />
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-slate-400 text-lg">Blog not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top nav */}
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* Hero */}
        <Hero blog={blog} />

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 leading-tight tracking-tight">
          {blog.title}
        </h1>

        {/* Description */}
        {blog.description && (
          <p className="text-lg text-slate-500 mb-6 leading-relaxed font-light">{blog.description}</p>
        )}

        {/* Author */}
        <Author blog={blog} />

        {/* Inline actions (non-sticky) */}
        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-100">
       <button
  onClick={handleLike}
  aria-label="Like"
  className={`
    flex items-center gap-1 text-lg font-medium
    transition-colors duration-150 select-none
    ${isLiked ? "text-rose-500" : "text-slate-400 hover:text-rose-500"}
  `}
>
  <span className="inline-block transition-transform duration-150 active:scale-125">
    <Heart
      className="w-5 h-5"
      fill={isLiked ? "currentColor" : "none"}
      stroke="currentColor"
    />
  </span>

  <span>{blog.likes?.length || 0}</span>
</button>

          <button
            onClick={() => commentsRef.current?.scrollIntoView({ behavior: "smooth" })}
            className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full border bg-slate-50 border-slate-200 text-slate-500 hover:border-indigo-200 hover:text-indigo-400 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <MessageCircle className="w-5 h-5 text-indigo-400" />
            <span>{blog.comments?.length || 0} Comments</span>
          </button>
        </div>

        {/* Sticky floating pill */}
        <ActionsBar
          blog={blog}
          isLiked={isLiked}
          onLike={handleLike}
          commentsRef={commentsRef}
        />

        {/* Content */}
        <article>
          <BlogContent content={blog.content} />
        </article>

        {/* Comments */}
        <CommentsSection
          blog={blog}
          userId={userId}
          commentsRef={commentsRef}
          onAddComment={handleAddComment}
          onUpdateComment={handleUpdateComment}
          onDeleteComment={handleDeleteComment}
        />

        {/* Footer spacer */}
        <div className="h-24" />
      </main>
    </div>
  );
};

export default BlogDetails;