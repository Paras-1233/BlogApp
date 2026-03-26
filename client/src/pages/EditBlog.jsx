import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { getBlogById, updateBlog } from "../services/blogService";

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Fetch blog
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await getBlogById(id);
        const data = res.data;

        setTitle(data.title || "");
        setImage(data.image || "");
        setContent(data.content || "");
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  // Update blog
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      await updateBlog(id, { title, image, content });
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Error updating blog ❌");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-12">

        {/* 🔙 Back */}
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-500 hover:text-black mb-6"
        >
          ← Back
        </button>

        {/* 🔥 Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800">
            Edit Your Story ✏️
          </h1>
          <p className="text-gray-500 mt-1">
            Refine your ideas and make your story better.
          </p>
        </div>

        {/* FORM CARD */}
        <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-3xl p-8 border border-gray-100">

          {loading ? (
            <p className="text-gray-500">Loading blog...</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* TITLE */}
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full mt-2 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter blog title"
                  required
                />
              </div>

              {/* IMAGE */}
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Image URL
                </label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full mt-2 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Paste image URL"
                />

                {/* 🖼 LIVE PREVIEW */}
                {image && (
                  <img
                    src={image}
                    alt="preview"
                    className="mt-4 w-full h-56 object-cover rounded-xl border"
                  />
                )}
              </div>

              {/* CONTENT */}
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Content
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows="8"
                  className="w-full mt-2 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  placeholder="Write your blog..."
                  required
                />
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-4 pt-4">

                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-medium shadow-lg hover:scale-[1.02] transition disabled:opacity-70"
                >
                  {updating ? "Updating..." : "Update Blog"}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="px-6 py-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                >
                  Cancel
                </button>

              </div>

            </form>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default EditBlog;