import { useNavigate } from "react-router-dom";

const BlogCard = ({ blog }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/blog/${blog._id}`)}
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 cursor-pointer group border border-gray-100"
    >
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={
            blog.image ||
            "https://images.unsplash.com/photo-1498050108023-c5249f4df085"
          }
          alt={blog.title}
          className="w-full h-56 object-cover group-hover:scale-110 transition duration-500"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Reading time indicator */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
          {Math.ceil((blog.content?.length || 0) / 200)} min read
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-bold text-xl mb-3 line-clamp-2 text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
          {blog.title}
        </h3>

        <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed mb-4">
          {blog.content}
        </p>

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                {blog.title?.charAt(0)?.toUpperCase() || 'B'}
              </span>
            </div>
            <div>
              <div className="text-xs text-gray-500">
                {new Date(blog.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-blue-500 group-hover:text-blue-600 transition-colors duration-300">
            <span className="text-sm font-medium">Read More</span>
            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;