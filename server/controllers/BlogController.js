import Blog from "../models/Blog.js";

// CREATE BLOG
export const createBlog = async (req, res) => {
  try {
    const { title, content, image } = req.body;

    const blog = await Blog.create({
      title,
      content,
      image,
      user: req.user._id,
    });

    res.status(201).json(blog);
  } catch (err) {
    console.error("CREATE BLOG ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// GET ALL BLOGS (✅ UPDATED)
export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("user", "username name avatar") // blog author
      .populate("comments.user", "username name avatar") // 🔥 comment user
      .sort({ createdAt: -1 });

    res.json(blogs);
  } catch (err) {
    console.error("GET BLOGS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// GET SINGLE BLOG (✅ UPDATED)
export const getBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate("user", "username name avatar")
      .populate("comments.user", "username name avatar");

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json(blog);
  } catch (err) {
    console.error("GET BLOG ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

export const incrementBlogView = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate("user", "username name avatar")
      .populate("comments.user", "username name avatar");

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json({ views: blog.views });
  } catch (err) {
    console.error("INCREMENT VIEW ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// GET MY BLOGS (✅ UPDATED)
export const getMyBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ user: req.user._id })
      .populate("user", "username name avatar")
      .populate("comments.user", "username name avatar")
      .sort({ createdAt: -1 });

    res.json(blogs);
  } catch (err) {
    console.error("GET MY BLOGS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// UPDATE BLOG
export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (blog.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    blog.title = req.body.title || blog.title;
    blog.content = req.body.content || blog.content;
    blog.image = req.body.image || blog.image;

    const updated = await blog.save();
    res.json(updated);
  } catch (err) {
    console.error("UPDATE BLOG ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// DELETE BLOG
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (blog.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Blog.findByIdAndDelete(req.params.id);

    res.json({ message: "Blog deleted" });
  } catch (err) {
    console.error("DELETE BLOG ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

