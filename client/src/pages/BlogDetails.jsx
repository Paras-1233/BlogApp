import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { getBlogById } from "../services/blogService";

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlog();
  }, []);

  const fetchBlog = async () => {
    try {
      const res = await getBlogById(id);
      setBlog(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (!blog) {
    return <div className="text-center mt-10">Blog not found</div>;
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* Image */}
        <img
          src={
            blog.image ||
            "https://images.unsplash.com/photo-1498050108023-c5249f4df085"
          }
          alt={blog.title}
          className="w-full h-96 object-cover rounded-xl mb-6"
        />

        {/* Title */}
        <h1 className="text-3xl font-bold mb-2">
          {blog.title}
        </h1>

        {/* Date */}
        <p className="text-gray-500 mb-6">
          {new Date(blog.createdAt).toDateString()}
        </p>

        {/* Content */}
        <p className="text-gray-700 leading-relaxed">
          {blog.content}
        </p>

      </div>
    </MainLayout>
  );
};

export default BlogDetail;