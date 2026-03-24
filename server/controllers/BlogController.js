import Blog from "../models/Blog.js";

// CREATE BLOG
export const createBlog = async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL BLOGS
export const getBlogs = async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 });
  res.json(blogs);
};

// GET SINGLE BLOG
export const getBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  res.json(blog);
};

// DELETE BLOG
export const deleteBlog = async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.json({ message: "Blog deleted" });
};