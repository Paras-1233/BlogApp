import API from "./api";

// ✅ GET all blogs
export const getBlogs = () => API.get("api/blogs");

// ✅ CREATE blog
export const createBlog = (data) => API.post("api/blogs", data);

// ✅ GET single blog
export const getBlogById = (id) => API.get(`api/blogs/${id}`);

// ✅ UPDATE blog
export const updateBlog = (id, data) =>
  API.put(`api/blogs/${id}`, data);

// ✅ DELETE blog
export const deleteBlog = (id) =>
  API.delete(`api/blogs/${id}`);

// ✅ GET logged-in user's blogs
export const getMyBlogs = () =>
  API.get("api/blogs/myblogs");

// ❤️ LIKE
export const toggleLike = (id) =>
  API.post(`api/blogs/${id}/like`);

// 💬 COMMENT
export const addComment = (id, text) =>
  API.post(`api/blogs/${id}/comment`, { text });

// ✏️ UPDATE COMMENT
export const updateComment = (blogId, commentId, text) =>
  API.put(`api/blogs/${blogId}/comments/${commentId}`, { text });

// 🗑 DELETE COMMENT
export const deleteComment = (blogId, commentId) =>
  API.delete(`api/blogs/${blogId}/comments/${commentId}`);