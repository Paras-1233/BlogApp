import MainLayout from "../layouts/MainLayout";
import { useNavigate } from "react-router-dom";

const blogs = [
  { id: 1, title: "MERN Guide", date: "Jan 2026" },
  { id: 2, title: "React Tips", date: "Feb 2026" },
];

const Dashboard = () => {
  const navigate = useNavigate();

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Delete this blog?");
    if (confirmDelete) {
      console.log("Deleted blog:", id);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>

          <button
            onClick={() => navigate("/create")}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + New Blog
          </button>
        </div>

        {/* Empty State */}
        {blogs.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            No blogs yet. Create your first one 🚀
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">

            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4">Title</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {blogs.map((blog) => (
                  <tr key={blog.id} className="border-t hover:bg-gray-50 transition">

                    <td className="p-4 font-medium">{blog.title}</td>

                    <td className="p-4 text-gray-500">
                      {blog.date}
                    </td>

                    <td className="p-4 space-x-4">
                      <button
                        onClick={() => navigate(`/edit/${blog.id}`)}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(blog.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        )}

      </div>
    </MainLayout>
  );
};

export default Dashboard;