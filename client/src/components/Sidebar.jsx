const Sidebar = ({ blogs, setSearch }) => {
  return (
    <aside className="space-y-6 sticky top-24 h-fit hidden md:block">

      {/* 🔥 Trending */}
      <div className="bg-white/70 backdrop-blur-md p-5 rounded-2xl shadow-md">
        <h3 className="font-semibold mb-4">🔥 Trending</h3>

        <div className="space-y-4 text-sm">
          {blogs.slice(0, 3).map((b, index) => (
            <div key={b._id} className="flex gap-3">
              <span className="font-bold text-gray-400">
                0{index + 1}
              </span>
              <p className="text-gray-700 hover:text-black cursor-pointer line-clamp-2">
                {b.title}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 🧑‍💻 Top Authors */}
      <div className="bg-white/70 backdrop-blur-md p-5 rounded-2xl shadow-md">
        <h3 className="font-semibold mb-4">🧑‍💻 Top Authors</h3>

        <div className="space-y-3">
          {["Paras", "Alex", "John"].map((author, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center text-sm font-bold">
                {author[0]}
              </div>
              <p className="text-sm text-gray-700">{author}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 🏷 Tags */}
      <div className="bg-white/70 backdrop-blur-md p-5 rounded-2xl shadow-md">
        <h3 className="font-semibold mb-4">🏷 Tags</h3>

        <div className="flex flex-wrap gap-2">
          {["React", "MERN", "JavaScript"].map((tag) => (
            <span
              key={tag}
              onClick={() => setSearch(tag)}
              className="bg-gray-100 px-3 py-1 text-xs rounded-full hover:bg-gray-200 cursor-pointer"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* 📬 Newsletter */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-5 rounded-2xl shadow-md text-white">
        <h3 className="font-semibold mb-2">📬 Stay Updated</h3>
        <p className="text-sm mb-4 text-white/80">
          Get latest blogs directly in your inbox.
        </p>

        <input
          type="email"
          placeholder="Enter email"
          className="w-full px-3 py-2 rounded-lg text-black mb-3 outline-none"
        />

        <button className="w-full bg-white text-black py-2 rounded-lg font-medium hover:bg-gray-200 transition">
          Subscribe
        </button>
      </div>

      {/* 📊 Stats */}
      <div className="bg-white/70 backdrop-blur-md p-5 rounded-2xl shadow-md">
        <h3 className="font-semibold mb-4">📊 Stats</h3>

        <div className="space-y-2 text-sm text-gray-600">
          <p>📄 {blogs.length} Articles</p>
          <p>👀 1.2K Readers</p>
          <p>✍️ 25 Writers</p>
        </div>
      </div>

    </aside>
  );
};

export default Sidebar;