import API from "./api";

// ✅ GET all blogs
export const getBlogs = () => API.get("/blogs");

// ✅ CREATE blog
export const createBlog = (data) => API.post("/blogs", data);

// ✅ GET single blog
export const getBlogById = (id) => API.get(`/blogs/${id}`);

export const incrementBlogView = (id) => API.post(`/blogs/${id}/view`);

// ✅ UPDATE blog
export const updateBlog = (id, data) =>
  API.put(`/blogs/${id}`, data);

// ✅ DELETE blog
export const deleteBlog = (id) =>
  API.delete(`/blogs/${id}`);

// ✅ GET logged-in user's blogs
export const getMyBlogs = () =>
  API.get("/blogs/myblogs");

// ❤️ LIKE
export const toggleLike = (id) =>
  API.post(`/blogs/${id}/like`);

// 💬 COMMENT
export const addComment = (id, text) =>
  API.post(`/blogs/${id}/comment`, { text });

// ✏️ UPDATE COMMENT
export const updateComment = (blogId, commentId, text) =>
  API.put(`/blogs/${blogId}/comments/${commentId}`, { text });

// 🗑 DELETE COMMENT
export const deleteComment = (blogId, commentId) =>
  API.delete(`/blogs/${blogId}/comments/${commentId}`);
