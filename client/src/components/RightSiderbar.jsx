import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Flame,
  Hash,
  Rss,
  BarChart2,
  Users,
  BookOpen,
  ExternalLink,
  ChevronDown,
  Star,
  Check,
  X,
} from "lucide-react";

/* ─────────────────────────────────────────────
   Constants
───────────────────────────────────────────── */

const AUTHOR_GRADIENTS = [
  "from-violet-500 to-indigo-500",
  "from-rose-500 to-pink-500",
  "from-amber-400 to-orange-500",
  "from-emerald-400 to-teal-500",
  "from-sky-400 to-blue-500",
];

const TAG_PALETTE = [
  "bg-violet-50 hover:bg-violet-100 text-violet-700 border-violet-200",
  "bg-sky-50    hover:bg-sky-100    text-sky-700    border-sky-200",
  "bg-rose-50   hover:bg-rose-100   text-rose-700   border-rose-200",
  "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200",
  "bg-amber-50  hover:bg-amber-100  text-amber-700  border-amber-200",
  "bg-fuchsia-50 hover:bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200",
];


const DEFAULT_TAGS = ["React", "MERN", "JavaScript", "TypeScript", "Node.js", "CSS", "Next.js", "MongoDB"];

/* ─────────────────────────────────────────────
   Shared: Card
───────────────────────────────────────────── */
const Card = ({ children, className = "" }) => (
  <div
    className={`
      bg-white/70 backdrop-blur-xl rounded-2xl
      border border-white/60
      shadow-[0_2px_16px_rgba(0,0,0,0.06)]
      hover:shadow-[0_4px_24px_rgba(0,0,0,0.10)]
      transition-shadow duration-300
      overflow-hidden
      ${className}
    `}
  >
    {children}
  </div>
);

/* ─────────────────────────────────────────────
   Shared: Section header
───────────────────────────────────────────── */
const SectionHeader = ({ icon: Icon, label, iconClass = "text-slate-500 bg-slate-100" }) => (
  <div className="flex items-center gap-2.5 px-5 pt-5 pb-1">
    <span className={`p-1.5 rounded-lg ${iconClass}`}>
      <Icon size={13} strokeWidth={2.5} />
    </span>
   <h3 className="text-sm font-semibold text-slate-900 tracking-tight lora">
      {label}
    </h3>
  </div>
);

/* ─────────────────────────────────────────────
   🔥 Trending
───────────────────────────────────────────── */
const TrendingSection = ({ blogs }) => {
  const [expanded, setExpanded] = useState(false);
  const visible = (expanded ? blogs.slice(0, 6) : blogs.slice(0, 3));
  const rankColors = ["#f97316", "#94a3b8", "#b45309"];
  const navigate = useNavigate();

  return (
    <Card>
      <SectionHeader icon={Flame} label="Trending" iconClass="text-orange-500 bg-orange-50" />
      <div className="px-5 pt-3 pb-5 space-y-0.5">
        {visible.map((b, i) => (
          <div
  key={b._id ?? i}
  onClick={() => navigate(`/blog/${b._id}`)}
  className="group flex items-start gap-3 py-2.5 px-3 -mx-3 rounded-xl hover:bg-slate-50/80 cursor-pointer transition-all duration-150 active:scale-[0.98]"
>
            <span
              className="mt-0.5 text-[11px] font-bold tabular-nums w-5 text-center shrink-0"
              style={{ color: rankColors[i] ?? "#cbd5e1" }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
           <p className="flex-1 text-sm text-slate-700 group-hover:text-slate-900 leading-snug font-medium transition-colors duration-150">
              {b.title}
            </p>
            <ExternalLink size={11} className="shrink-0 mt-0.5 text-slate-300 group-hover:text-slate-400 transition-colors" />
          </div>
        ))}

        {blogs.length > 3 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 mt-1 text-[12px] text-slate-400 hover:text-slate-700 font-medium transition-colors duration-150"
          >
            <ChevronDown size={13} className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
            {expanded ? "Show less" : `+${blogs.length - 3} more`}
          </button>
        )}
      </div>
    </Card>
  );
};

/* ─────────────────────────────────────────────
   🧑‍💻 Top Authors
───────────────────────────────────────────── */
const AuthorsSection = ({ blogs = [] }) => {
  const authorMap = {};

  blogs.forEach((blog) => {
    const user = blog.user;
    if (!user) return;

    const id = user._id;

    if (!authorMap[id]) {
      authorMap[id] = {
        name: user.name || user.username,
        posts: 0,
        likes: 0,
        comments: 0,
      };
    }

    authorMap[id].posts += 1;
    authorMap[id].likes += blog.likes?.length || 0;
    authorMap[id].comments += blog.comments?.length || 0;
  });

  // 🔥 Calculate score
  const topAuthors = Object.values(authorMap)
    .map((a) => ({
      ...a,
      score: a.posts + a.likes + a.comments,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
   
const navigate = useNavigate();

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-10 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">
        🧑‍💻 Top Authors
      </h3>

      <div className="space-y-3">
        {topAuthors.map((author, i) => (
          <div
            key={i}
            className="flex items-center gap-3 group hover:bg-gray-50 p-2 rounded-lg transition"
          >
            {/* Avatar */}
<div
  className={`w-9 h-9 rounded-full bg-gradient-to-r ${
    AUTHOR_GRADIENTS[i % AUTHOR_GRADIENTS.length]
  } text-white flex items-center justify-center text-sm font-bold`}
>
              {author.name[0].toUpperCase()}
            </div>

            {/* Info */}
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800 group-hover:text-black">
                {author.name}
              </p>
              <p className="text-xs text-gray-400">
                {author.posts} posts • {author.likes} ❤️ • {author.comments} 💬
              </p>
            </div>

            {/* Rank badge */}
            {i === 0 && (
              <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-semibold">
                Top
              </span>
            )}
          </div>
          
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   🏷 Tags
───────────────────────────────────────────── */
const TagsSection = ({ tags = [], setSearch }) => {
  const list = tags.length ? tags : DEFAULT_TAGS;
  return (
    <Card>
      <SectionHeader icon={Hash} label="Explore Topics" iconClass="text-sky-500 bg-sky-50" />
      <div className="px-5 pt-3 pb-5 flex flex-wrap gap-2">
        {list.map((tag, i) => (
          <button
            key={tag}
            onClick={() => setSearch?.(tag)}
            className={`text-[12px] font-medium px-3 py-1.5 rounded-full border transition-all duration-150 cursor-pointer ${TAG_PALETTE[i % TAG_PALETTE.length]}`}
          >
            #{tag}
          </button>
        ))}
      </div>
    </Card>
  );
};

/* ─────────────────────────────────────────────
   📬 Newsletter
───────────────────────────────────────────── */
const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | success | error

  const subscribe = () => {
    if (!email.includes("@")) { setStatus("error"); return; }
    setStatus("success");
    setEmail("");
    setTimeout(() => setStatus("idle"), 3500);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl p-5 shadow-[0_2px_16px_rgba(0,0,0,0.08)]">
      {/* BG */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600" />
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -bottom-10 -left-10 w-28 h-28 rounded-full bg-white/10 blur-2xl" />
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-1.5">
          <Rss size={15} className="text-white/90" />
          <h3 className="text-[13px] font-bold text-white lora">Stay Updated</h3>
        </div>
        <p className="text-[12px] text-white/65 mb-4 leading-relaxed">
          Weekly digest of the best articles — no spam, ever.
        </p>

        <div className="flex flex-col gap-2">
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
              onKeyDown={(e) => e.key === "Enter" && subscribe()}
              placeholder="your@email.com"
              className={`
                w-full px-3.5 py-2.5 rounded-xl text-[13px] text-slate-800 bg-white/95
                placeholder-slate-400 outline-none border-2 transition-all duration-150
                ${status === "error" ? "border-rose-400" : "border-transparent focus:border-white/80"}
              `}
            />
            {status === "error" && (
              <X size={13} className="absolute right-3 top-3.5 text-rose-500" />
            )}
          </div>

          <button
            onClick={subscribe}
            className={`
              w-full py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200
              ${status === "success"
                ? "bg-emerald-400 text-white"
                : "bg-white text-indigo-700 hover:bg-white/90 hover:shadow-lg hover:shadow-indigo-900/20 active:scale-[0.98]"
              }
            `}
          >
            {status === "success"
              ? <span className="flex items-center justify-center gap-1.5"><Check size={13} /> You're in!</span>
              : "Subscribe →"
            }
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   📊 Stats
───────────────────────────────────────────── */
const StatsSection = ({ blogs }) => {
  const stats = [
    { emoji: "📄", value: blogs.length || 48, label: "Articles", color: "bg-violet-50 text-violet-700" },
    { emoji: "👀", value: "1.2K",              label: "Readers",  color: "bg-sky-50 text-sky-700"     },
    { emoji: "✍️",  value: 25,                 label: "Writers",  color: "bg-rose-50 text-rose-700"   },
  ];

  return (
    <Card>
      <SectionHeader icon={BarChart2} label="Community" iconClass="text-emerald-500 bg-emerald-50" />
      <div className="px-5 pt-3 pb-5 grid grid-cols-3 gap-2">
        {stats.map((s) => (
          <div key={s.label} className={`flex flex-col items-center gap-1.5 py-3 rounded-xl ${s.color.split(" ")[0]}`}>
            <span className="text-xl leading-none">{s.emoji}</span>
            <span className={`text-base font-bold leading-none ${s.color.split(" ")[1]}`}>{s.value}</span>
            <span className="text-[10px] text-slate-500 font-medium">{s.label}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

/* ─────────────────────────────────────────────
   🏠 Main Sidebar export
───────────────────────────────────────────── */
const Sidebar = ({ blogs = [], setSearch }) => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@500;600;700&display=swap');
        .lora { font-family: 'Lora', serif; }

        /* Staggered entrance */
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .sb-item { animation: slideUp 0.42s cubic-bezier(0.22,1,0.36,1) both; }

        /* Thin scrollbar */
        .sb-scroll::-webkit-scrollbar { width: 4px; }
        .sb-scroll::-webkit-scrollbar-track { background: transparent; }
        .sb-scroll::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 99px; }
        .sb-scroll::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>

      <aside className="hidden md:flex flex-col gap-4 w-[400px] shrink-0 sticky top-24 max-h-[calc(100vh-6.5rem)] overflow-y-auto sb-scroll pb-6">
        <div className="sb-item" style={{ animationDelay: "0ms" }}>
          <TrendingSection blogs={blogs} />
        </div>
        <div className="sb-item" style={{ animationDelay: "70ms" }}>
          <AuthorsSection blogs={blogs} />
        </div>
        <div className="sb-item" style={{ animationDelay: "140ms" }}>
          <TagsSection setSearch={setSearch} />
        </div>
        <div className="sb-item" style={{ animationDelay: "210ms" }}>
          <NewsletterSection />
        </div>
        <div className="sb-item" style={{ animationDelay: "280ms" }}>
          <StatsSection blogs={blogs} />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;