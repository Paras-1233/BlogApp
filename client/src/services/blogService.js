import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/blogs",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ MUST EXPORT THIS
export const getBlogs = () => API.get("/");

export const createBlog = (data) => API.post("/", data);

export const getBlogById = (id) => API.get(`/${id}`);

export const deleteBlog = (id) => API.delete(`/${id}`);