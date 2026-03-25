import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { getBlogById } from "../services/blogService";

const BlogDetails = () => {
  const { id } = useParams();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <MainLayout>
        <p className="text-center mt-10 text-gray-500">
          Loading blog...
        </p>
      </MainLayout>
    );
  }

  if (!blog) {
    return (
      <MainLayout>
        <p className="text-center mt-10 text-red-500">
          Blog not found
        </p>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* 🔥 HERO SECTION */}
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

      {/* 📖 CONTENT */}
      <div className="max-w-3xl mx-auto px-6 py-10">
        <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
          {blog.content}
        </p>
      </div>
    </MainLayout>
  );
};

export default BlogDetails;