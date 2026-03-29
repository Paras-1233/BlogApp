const colors = [
  "bg-indigo-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-blue-500",
];
const Hero = ({ navigate }) => {
  return (
    <section className="relative overflow-hidden font-sans">

      {/* Background */}
      <div className="absolute inset-0 -z-10">

        {/* Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.07)_1px,transparent_1px)] bg-[size:40px_40px]" />

        {/* Fade */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/60 to-white" />

        {/* Blob A */}
        <div className="absolute top-[-80px] left-[10%] w-[520px] h-[520px] rounded-full bg-gradient-to-br from-blue-400/25 to-violet-400/20 blur-3xl animate-[blob_14s_ease-in-out_infinite]" />

        {/* Blob B */}
        <div className="absolute top-[60px] right-[5%] w-[420px] h-[420px] rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/15 blur-3xl animate-[blob_18s_ease-in-out_infinite_reverse]" />

        {/* Center Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[240px] bg-gradient-to-r from-blue-300/15 via-violet-300/20 to-purple-300/15 blur-3xl rounded-full" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-20 pb-24 text-center">

        {/* Label */}
        <div className="flex justify-center mb-6 animate-[fadeUp_0.6s_ease_0.05s_both]">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm text-[11px] font-bold tracking-[0.2em] text-slate-500 uppercase animate-[float_4s_ease-in-out_infinite]">
            <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 animate-pulse" />
            Blogify
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-[2.6rem] md:text-[3.75rem] lg:text-[4.25rem] font-extrabold leading-[1.1] tracking-tight text-slate-900 mb-6 animate-[fadeUp_0.6s_ease_0.18s_both]">
          Turn your thoughts into{" "}
<br className="hidden sm:block" />
<span className="relative inline-block mt-1 sm:mt-2">
            <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-600 bg-clip-text text-transparent">
              Powerful stories
            </span>
            <span className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 opacity-40" />
          </span>
        </h1>

        {/* Subtext */}
        <p className="text-base md:text-lg text-slate-500 max-w-xl mx-auto leading-relaxed mb-10 font-medium animate-[fadeUp_0.6s_ease_0.30s_both]">
          Your space to write freely, share ideas, and connect
          with readers who care about what you have to say.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12 animate-[fadeUp_0.6s_ease_0.42s_both]">

          <button
            onClick={() => navigate("/create")}
            className="flex items-center gap-2.5 px-7 py-3.5 rounded-full text-white text-[14px] font-semibold bg-gradient-to-r from-blue-500 to-purple-600 shadow-[0_4px_20px_rgba(99,60,220,0.25)] hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_12px_32px_rgba(99,60,220,0.35)] transition"
          >
              {/* ✏️ Icon */}
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
            Start Writing
          </button>

          <button
            onClick={() =>
              document.getElementById("blogs")?.scrollIntoView({ behavior: "smooth" })
            }
            className="flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 text-[14px] font-semibold hover:-translate-y-1 hover:scale-[1.02] hover:shadow-md transition"
          >
            {/* 📚 Icon */}
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
            Explore Stories
          </button>
        </div>

        {/* Social Proof */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-[fadeUp_0.6s_ease_0.54s_both]">

          <div className="flex items-center gap-3">
  
  <div className="flex -space-x-2.5">
    {["P", "A", "J", "M"].map((l, i) => (
      <div
        key={i}
        className={`w-8 h-8 rounded-full ${colors[i % colors.length]} 
          ring-2 ring-white flex items-center justify-center 
          text-white text-[11px] font-bold shadow-sm`}
      >
        {l}
      </div>
    ))}
  </div>  {/* ✅ CLOSE THIS */}

  <p className="text-[12px] text-slate-500 font-medium">
    <span className="font-bold text-slate-700">2,400+</span> writers joined
  </p>

</div>

          <span className="hidden sm:block w-px h-4 bg-slate-200" />

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 border border-slate-100 shadow-sm text-[12px]">
              📝 <span className="font-bold">1.2K</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 border border-slate-100 shadow-sm text-[12px]">
              ❤️ <span className="font-bold">48K</span>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/60 to-transparent" />
    </section>
  );
};

export default Hero;