import API from "./api";

// GET all blogs
export const getBlogs = () => API.get("/blogs");

// CREATE blog
export const createBlog = (data) => API.post("/blogs", data);

// GET single blog
export const getBlogById = (id) => API.get(`/blogs/${id}`);

// UPDATE blog
export const updateBlog = (id, data) =>
  API.put(`/blogs/${id}`, data);

// DELETE blog
export const deleteBlog = (id) => API.delete(`/blogs/${id}`);

// GET logged-in user's blogs
export const getMyBlogs = () => API.get("/blogs/myblogs");