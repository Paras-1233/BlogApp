import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import {
  getBlogById,
  toggleLike,
  addComment,
  updateComment,
  deleteComment,
} from "../services/blogService";

const BlogDetails = () => {
  const { id } = useParams();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id || user?.id;

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      const res = await getBlogById(id);
      setBlog(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      await toggleLike(blog._id);
      fetchBlog();
    } catch (err) {
      console.error(err);
    }
  };

  const handleComment = async () => {
    if (!comment.trim()) return;

    try {
      await addComment(blog._id, comment);
      setComment("");
      fetchBlog();
    } catch (err) {
      console.error(err);
    }
  };

  // ✏️ START EDIT
  const startEdit = (c) => {
    setEditingId(c._id);
    setEditText(c.text);
  };

  // 💾 SAVE EDIT
  const handleUpdate = async (commentId) => {
    try {
      await updateComment(blog._id, commentId, editText);
      setEditingId(null);
      setEditText("");
      fetchBlog();
    } catch (err) {
      console.error(err);
    }
  };

  // 🗑 DELETE
  const handleDelete = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;

    try {
      await deleteComment(blog._id, commentId);
      fetchBlog();
    } catch (err) {
      console.error(err);
    }
  };

  const isLiked = blog?.likes?.some((id) => {
    const likeId = typeof id === "object" ? id._id : id;
    return likeId?.toString() === userId?.toString();
  });

  if (loading) {
    return (
      <MainLayout>
        <p className="text-center mt-10 text-gray-500">Loading blog...</p>
      </MainLayout>
    );
  }

  if (!blog) {
    return (
      <MainLayout>
        <p className="text-center mt-10 text-red-500">Blog not found</p>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* HERO */}
      <div className="relative h-80 w-full overflow-hidden">
        <img
          src={
            blog.image ||
            "https://images.unsplash.com/photo-1498050108023-c5249f4df085"
          }
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 flex items-end">
          <div className="max-w-4xl mx-auto px-6 pb-6 text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {blog.title}
            </h1>
            <p className="text-sm text-gray-300">
              {new Date(blog.createdAt).toDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-3xl mx-auto px-6 py-10">

        <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line mb-6">
          {blog.content}
        </p>

        {/* LIKE */}
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 mb-6 ${
            isLiked ? "text-red-500" : "text-gray-400"
          }`}
        >
          <span className="text-2xl">
            {isLiked ? "❤️" : "🤍"}
          </span>
          <span>{blog.likes?.length || 0} Likes</span>
        </button>

        {/* COMMENTS */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">
            Comments ({blog.comments?.length || 0})
          </h3>

          {/* INPUT */}
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              className="border px-4 py-2 rounded-lg w-full"
            />
            <button
              onClick={handleComment}
              className="bg-blue-500 text-white px-5 rounded-lg"
            >
              Post
            </button>
          </div>

          {/* LIST */}
          <div className="space-y-4">
            {[...(blog.comments || [])].reverse().map((c) => {
              const isOwner =
                (c.user?._id || c.user) === userId;

              return (
                <div
                  key={c._id}
                  className="flex items-start gap-3 bg-white p-4 rounded-xl shadow-sm border"
                >
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                    {c.user?.username?.[0]?.toUpperCase() || "U"}
                  </div>

                  <div className="flex-1">

                    {/* Username */}
                    <p className="font-semibold text-sm text-gray-800">
                      {c.user?.username || "User"}
                    </p>

                    {/* EDIT MODE */}
                    {editingId === c._id ? (
                      <div className="mt-2">
                        <input
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="border px-3 py-1 rounded w-full mb-2"
                        />

                        <div className="flex gap-2 text-sm">
                          <button
                            onClick={() => handleUpdate(c._id)}
                            className="text-green-600"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-gray-500"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-600 text-sm mt-1">
                        {c.text}
                      </p>
                    )}

                    {/* ACTIONS */}
                    {isOwner && editingId !== c._id && (
                      <div className="flex gap-4 mt-2 text-xs text-gray-500">
                        <button
                          onClick={() => startEdit(c)}
                          className="hover:text-blue-600"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(c._id)}
                          className="hover:text-red-500"
                        >
                          🗑 Delete
                        </button>
                      </div>
                    )}

                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default BlogDetails;