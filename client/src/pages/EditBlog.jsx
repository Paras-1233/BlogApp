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

  // Fetch blog
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await getBlogById(id);
        const data = res.data;

        setTitle(data.title);
        setImage(data.image);
        setContent(data.content);
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

    try {
      await updateBlog(id, { title, image, content });
      alert("Blog updated ✅");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Error updating blog ❌");
    }
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* 🔙 Back */}
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-500 hover:text-black mb-4"
        >
          ← Back
        </button>

        {/* 🔥 Form Card */}
        <div className="bg-white/80 backdrop-blur-lg shadow-lg rounded-2xl p-6">

          <h1 className="text-2xl font-bold mb-6">
            ✏️ Edit Blog
          </h1>

          {loading ? (
            <p className="text-gray-500">Loading blog...</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Title */}
              <div>
                <label className="text-sm text-gray-600">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter blog title"
                  required
                />
              </div>

              {/* Image */}
              <div>
                <label className="text-sm text-gray-600">Image URL</label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter image URL"
                />
              </div>

              {/* Content */}
              <div>
                <label className="text-sm text-gray-600">Content</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows="6"
                  className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Write your blog..."
                  required
                />
              </div>

              {/* Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition shadow"
              >
                Update Blog
              </button>

            </form>
          )}
        </div>

      </div>
    </MainLayout>
  );
};

export default EditBlog;