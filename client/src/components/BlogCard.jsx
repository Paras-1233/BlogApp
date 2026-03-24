import { useNavigate } from "react-router-dom";

const BlogCard = ({ blog }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/blog/${blog._id}`)}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-1 transition duration-300 cursor-pointer"
    >
      <img
        src={
          blog.image ||
          "https://images.unsplash.com/photo-1498050108023-c5249f4df085"
        }
        alt={blog.title}
        className="w-full h-48 object-cover"
      />

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">
          {blog.title}
        </h3>

        <p className="text-gray-600 text-sm">
          {blog.content?.slice(0, 80)}...
        </p>
      </div>
    </div>
  );
};

export default BlogCard;