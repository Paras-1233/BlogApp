const Hero = ({ navigate }) => {
  return (
    <div className="text-center py-24 relative overflow-hidden">

      {/* Glow */}
      <div className="absolute inset-0 -z-10 flex justify-center">
        <div className="w-[400px] h-[400px] bg-gradient-to-r from-blue-400/30 to-purple-400/30 blur-3xl rounded-full"></div>
      </div>

      {/* Brand */}
      <p className="text-sm text-blue-600 font-semibold mb-4 tracking-widest">
        BLOGIFY
      </p>

      {/* Heading */}
      <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6 max-w-3xl mx-auto">
        Turn your thoughts into
        <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
          {" "}powerful stories
        </span>
      </h1>

      {/* Subtext */}
      <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-10">
        Blogify is your space to write freely, share ideas, and connect with readers.
      </p>

      {/* CTA */}
      <div className="flex justify-center gap-4 flex-wrap">
        <button
          onClick={() => navigate("/create")}
          className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg hover:scale-105 transition"
        >
          ✍️ Start Writing
        </button>

        <button
          onClick={() =>
            document
              .getElementById("blogs")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className="px-8 py-3 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
        >
          📖 Explore Stories
        </button>
      </div>

      {/* Trust line */}
      <p className="text-xs text-gray-400 mt-6">
        Join writers sharing ideas every day on Blogify
      </p>
    </div>
  );
};

export default Hero;