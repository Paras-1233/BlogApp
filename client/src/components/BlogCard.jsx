import { useNavigate } from "react-router-dom";
import { toggleLike } from "../services/blogService";

const BlogCard = ({ blog, refreshBlogs }) => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id || user?.id;

  // ❤️ check liked
  const isLiked = blog.likes?.some((id) => {
    const likeId = typeof id === "object" ? id._id : id;
    return likeId?.toString() === userId?.toString();
  });

  const handleLike = async (e) => {
    e.stopPropagation();
    try {
      await toggleLike(blog._id);
      refreshBlogs && refreshBlogs();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      onClick={() => navigate(`/blog/${blog._id}`)}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
    >
      {/* IMAGE */}
      <div className="relative overflow-hidden">
        <img
          src={
            blog.image ||
            "https://images.unsplash.com/photo-1498050108023-c5249f4df085"
          }
          alt={blog.title}
          className="w-full h-52 object-cover group-hover:scale-105 transition duration-500"
        />

        {/* READ TIME */}
        <div className="absolute top-3 right-3 bg-white/90 px-3 py-1 rounded-full text-xs font-medium shadow">
          {Math.ceil((blog.content?.length || 0) / 200)} min read
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-5">

        {/* 👤 AUTHOR (FIXED) */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center text-xs font-bold">
            {blog.user?.name?.[0] ||
              blog.user?.username?.[0] ||
              blog.user?.email?.[0] ||
              "U"}
          </div>

          <p className="text-sm text-gray-600">
            {blog.user?.name ||
              blog.user?.username ||
              blog.user?.email ||
              "Anonymous"}
          </p>
        </div>

        {/* TITLE */}
        <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition">
          {blog.title}
        </h3>

        {/* DESC */}
        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
          {blog.content}
        </p>

        {/* ACTION BAR */}
        <div className="flex items-center justify-between mb-4">

          {/* ❤️ LIKE */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 text-sm transition ${
              isLiked ? "text-red-500" : "text-gray-400"
            } hover:scale-110`}
          >
            <span>{isLiked ? "❤️" : "🤍"}</span>
            {blog.likes?.length || 0}
          </button>

          {/* 💬 COMMENTS */}
          <div className="text-gray-500 text-sm">
            💬 {blog.comments?.length || 0}
          </div>

        </div>

        {/* FOOTER */}
        <div className="flex justify-between items-center text-xs text-gray-500 border-t pt-3">
          <span>
            {new Date(blog.createdAt).toLocaleDateString()}
          </span>

          <span className="text-blue-500 font-medium group-hover:underline">
            Read More →
          </span>
        </div>

      </div>
    </div>
  );
};

export default BlogCard;