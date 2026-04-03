import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BarChart2,
  ChevronDown,
  Flame,
  Hash,
  Sparkles,
} from "lucide-react";

const AUTHOR_GRADIENTS = [
  "from-sky-500 to-indigo-500",
  "from-indigo-500 to-violet-500",
  "from-emerald-500 to-teal-500",
  "from-amber-400 to-orange-500",
];

const TAG_PALETTE = [
  "bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100",
  "bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100",
  "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
  "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
  "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100",
  "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200 hover:bg-fuchsia-100",
];

const DEFAULT_TAGS = [
  "React",
  "MERN",
  "JavaScript",
  "TypeScript",
  "Node.js",
  "CSS",
  "Next.js",
  "MongoDB",
];

const ShellCard = ({ children, className = "" }) => (
  <section
    className={`overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/92 shadow-[0_12px_36px_rgba(15,23,42,0.08)] backdrop-blur-sm ${className}`}
  >
    {children}
  </section>
);

const SectionHeader = ({
  icon: Icon,
  label,
  description,
  tone = "bg-slate-100 text-slate-600",
}) => (
  <div className="flex items-start gap-3 px-5 pt-5 pb-3">
    <span
      className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl ${tone}`}
    >
      <Icon size={16} strokeWidth={2.2} />
    </span>
    <div>
      <h3 className="text-sm font-semibold tracking-tight text-slate-900">
        {label}
      </h3>
      {description && (
        <p className="mt-1 text-xs leading-5 text-slate-400">{description}</p>
      )}
    </div>
  </div>
);

const PulseCard = ({ blogs = [] }) => {
  const stats = useMemo(() => {
    const authors = new Set(blogs.map((blog) => blog.user?._id).filter(Boolean))
      .size;
    const interactions = blogs.reduce(
      (sum, blog) => sum + (blog.likes?.length || 0) + (blog.comments?.length || 0),
      0
    );
    const activeToday = blogs.slice(0, 5).length;

    return [
      { label: "Stories", value: blogs.length },
      { label: "Authors", value: authors },
      { label: "Activity", value: interactions },
      { label: "Fresh", value: activeToday },
    ];
  }, [blogs]);

  return (
    <section className="relative overflow-hidden rounded-[30px] border border-slate-200 bg-[linear-gradient(145deg,#ffffff_0%,#f8fbff_52%,#eef6ff_100%)] p-5 shadow-[0_20px_50px_rgba(59,130,246,0.10)]">
      <div className="absolute -right-12 -top-12 h-28 w-28 rounded-full bg-sky-200/35 blur-3xl" />
      <div className="absolute -bottom-16 left-0 h-28 w-28 rounded-full bg-indigo-200/30 blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-900/15">
            <Sparkles size={17} strokeWidth={2.2} />
          </span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-600">
              Community Pulse
            </p>
            <h3 className="mt-1 text-lg font-semibold text-slate-900">
              Readers are leaning into thoughtful, practical stories this week.
            </h3>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/70 bg-white/75 px-4 py-3"
            >
              <p className="text-lg font-bold text-slate-900">{stat.value}</p>
              <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.14em] text-slate-400">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TrendingSection = ({ blogs = [] }) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const visibleBlogs = expanded ? blogs.slice(0, 6) : blogs.slice(0, 4);

  return (
    <ShellCard>
      <SectionHeader
        icon={Flame}
        label="Trending Reads"
        description="The posts people are opening and engaging with first."
        tone="bg-orange-50 text-orange-500"
      />

      <div className="space-y-2 px-4 pb-4">
        {visibleBlogs.map((blog, index) => (
          <button
            key={blog._id ?? index}
            onClick={() => navigate(`/blog/${blog._id}`)}
            className="group flex w-full items-start gap-3 rounded-2xl border border-transparent px-3 py-3 text-left transition-all duration-150 hover:border-slate-100 hover:bg-slate-50"
          >
            <span className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-500">
              {index + 1}
            </span>

            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-sm font-medium leading-snug text-slate-700 transition-colors duration-150 group-hover:text-slate-900">
                {blog.title}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                {blog.likes?.length || 0} likes · {blog.comments?.length || 0} comments
              </p>
            </div>

            <ArrowRight
              size={14}
              className="mt-1 flex-shrink-0 text-slate-300 transition-all duration-150 group-hover:translate-x-0.5 group-hover:text-slate-500"
            />
          </button>
        ))}

        {blogs.length > 4 && (
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="flex items-center gap-1 px-3 pt-1 text-[12px] font-medium text-slate-400 transition-colors duration-150 hover:text-slate-700"
          >
            <ChevronDown
              size={13}
              className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
            />
            {expanded ? "Show less" : `+${Math.min(blogs.length, 6) - 4} more`}
          </button>
        )}
      </div>
    </ShellCard>
  );
};

const AuthorsSection = ({ blogs = [] }) => {
  const topAuthors = useMemo(() => {
    const authorMap = {};

    blogs.forEach((blog) => {
      const user = blog.user;
      if (!user?._id) return;

      if (!authorMap[user._id]) {
        authorMap[user._id] = {
          id: user._id,
          name: user.name || user.username || "Anonymous",
          posts: 0,
          likes: 0,
          comments: 0,
        };
      }

      authorMap[user._id].posts += 1;
      authorMap[user._id].likes += blog.likes?.length || 0;
      authorMap[user._id].comments += blog.comments?.length || 0;
    });

    return Object.values(authorMap)
      .map((author) => ({
        ...author,
        score: author.posts + author.likes + author.comments,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);
  }, [blogs]);

  return (
    <ShellCard>
      <SectionHeader
        icon={BarChart2}
        label="Writers To Watch"
        description="Authors consistently earning attention across the feed."
        tone="bg-violet-50 text-violet-500"
      />

      <div className="space-y-3 px-5 pb-5">
        {topAuthors.map((author, index) => (
          <div
            key={author.id}
            className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 px-3 py-3"
          >
            <div
              className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r ${
                AUTHOR_GRADIENTS[index % AUTHOR_GRADIENTS.length]
              } text-sm font-bold text-white`}
            >
              {author.name[0].toUpperCase()}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-800">
                {author.name}
              </p>
              <p className="text-xs text-slate-400">
                {author.posts} posts · {author.likes} likes
              </p>
            </div>

            <span className="text-[11px] font-semibold text-slate-300">
              0{index + 1}
            </span>
          </div>
        ))}
      </div>
    </ShellCard>
  );
};

const TopicsSection = ({ blogs = [], setSearch }) => {
  const tags = useMemo(() => {
    const collected = new Set();

    blogs.forEach((blog) => {
      if (Array.isArray(blog.tags)) {
        blog.tags.forEach((tag) => collected.add(tag));
      }
      if (blog.category) {
        collected.add(blog.category);
      }
    });

    return [...collected];
  }, [blogs]);

  const list = tags.length ? tags.slice(0, 8) : DEFAULT_TAGS;

  return (
    <ShellCard>
      <SectionHeader
        icon={Hash}
        label="Explore Topics"
        description="Fast ways to narrow the feed without using search."
        tone="bg-sky-50 text-sky-500"
      />

      <div className="flex flex-wrap gap-2 px-5 pb-5">
        {list.map((tag, index) => (
          <button
            key={tag}
            onClick={() => setSearch?.(tag)}
            className={`rounded-full border px-3 py-1.5 text-[12px] font-medium transition-all duration-150 ${
              TAG_PALETTE[index % TAG_PALETTE.length]
            }`}
          >
            #{tag}
          </button>
        ))}
      </div>
    </ShellCard>
  );
};

const InsightStrip = ({ blogs = [] }) => {
  const insights = useMemo(() => {
    const interactionCount = blogs.reduce(
      (sum, blog) => sum + (blog.likes?.length || 0) + (blog.comments?.length || 0),
      0
    );
    const avgInteraction =
      blogs.length > 0 ? Math.round(interactionCount / blogs.length) : 0;

    return [
      {
        label: "Avg. engagement",
        value: avgInteraction,
        note: "per post",
      },
      {
        label: "Live posts",
        value: blogs.length,
        note: "published",
      },
      {
        label: "Contributors",
        value: new Set(blogs.map((blog) => blog.user?._id).filter(Boolean)).size,
        note: "writing now",
      },
    ];
  }, [blogs]);

  return (
    <ShellCard>
      <SectionHeader
        icon={BarChart2}
        label="At A Glance"
        description="Compact feed health snapshot."
        tone="bg-emerald-50 text-emerald-500"
      />

      <div className="px-5 pb-5">
        <div className="rounded-[24px] border border-slate-100 bg-slate-50/90 p-3">
          <div className="grid gap-2">
            {insights.map((item, index) => (
              <div
                key={item.label}
                className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100 text-[11px] font-bold text-slate-500">
                    0{index + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                      {item.label}
                    </p>
                    <p className="truncate text-xs text-slate-500">{item.note}</p>
                  </div>
                </div>

                <p className="text-base font-bold text-slate-900">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ShellCard>
  );
};

const Sidebar = ({ blogs = [], setSearch }) => {
  return (
    <>
      <style>{`
        @keyframes sidebarFadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .sidebar-item {
          animation: sidebarFadeUp 0.42s cubic-bezier(0.22,1,0.36,1) both;
        }

        .sidebar-scroll::-webkit-scrollbar { width: 4px; }
        .sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
        .sidebar-scroll::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 99px; }
        .sidebar-scroll::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>

      <div className="mt-10 xl:mt-0">
        <div className="xl:hidden">
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-600">
              Discover
            </p>
            <h3 className="mt-1 text-lg font-semibold text-slate-900">
              A better way to browse the feed
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sidebar-item sm:col-span-2" style={{ animationDelay: "0ms" }}>
              <PulseCard blogs={blogs} />
            </div>
            <div className="sidebar-item sm:col-span-2" style={{ animationDelay: "70ms" }}>
              <TrendingSection blogs={blogs} />
            </div>
            <div className="sidebar-item" style={{ animationDelay: "140ms" }}>
              <AuthorsSection blogs={blogs} />
            </div>
            <div className="sidebar-item" style={{ animationDelay: "210ms" }}>
              <TopicsSection blogs={blogs} setSearch={setSearch} />
            </div>
            <div className="sidebar-item sm:col-span-2" style={{ animationDelay: "280ms" }}>
              <InsightStrip blogs={blogs} />
            </div>
          </div>
        </div>

        <aside className="sidebar-scroll hidden xl:flex xl:w-full xl:flex-col xl:gap-4 xl:sticky xl:top-24 xl:max-h-[calc(100vh-6.5rem)] xl:overflow-y-auto xl:pb-6">
          <div className="sidebar-item" style={{ animationDelay: "0ms" }}>
            <PulseCard blogs={blogs} />
          </div>
          <div className="sidebar-item" style={{ animationDelay: "70ms" }}>
            <TrendingSection blogs={blogs} />
          </div>
          <div className="sidebar-item" style={{ animationDelay: "140ms" }}>
            <AuthorsSection blogs={blogs} />
          </div>
          <div className="sidebar-item" style={{ animationDelay: "210ms" }}>
            <TopicsSection blogs={blogs} setSearch={setSearch} />
          </div>
          <div className="sidebar-item" style={{ animationDelay: "280ms" }}>
            <InsightStrip blogs={blogs} />
          </div>
        </aside>
      </div>
    </>
  );
};

export default Sidebar;
