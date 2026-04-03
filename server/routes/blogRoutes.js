import express from "express";
import {
  createBlog,
  getBlogs,
  getBlog,
  getMyBlogs,
  incrementBlogView,
  updateBlog,
  deleteBlog,
} from "../controllers/BlogController.js";

import { protect } from "../middleware/authMiddleware.js";
import Blog from "../models/Blog.js";

const router = express.Router();

// 🔥 CREATE
router.post("/", protect, createBlog);

// 🌐 PUBLIC
router.get("/", getBlogs);
router.get("/myblogs", protect, getMyBlogs);
router.get("/:id", getBlog);
router.post("/:id/view", incrementBlogView);

// 🔐 PROTECTED
router.put("/:id", protect, updateBlog);
router.delete("/:id", protect, deleteBlog);

// ===============================
// ❤️ LIKE / UNLIKE (FIXED)
// ===============================
router.post("/:id/like", protect, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const userId = req.user._id; // ✅ FIXED

    const alreadyLiked = blog.likes.some(
      (id) => id.toString() === userId.toString()
    );

    if (alreadyLiked) {
      blog.likes = blog.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      blog.likes.push(userId);
    }

    await blog.save();

    res.json({
      message: alreadyLiked ? "Unliked" : "Liked",
      likes: blog.likes.length,
    });
  } catch (error) {
    console.error("LIKE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

// ===============================
// 💬 ADD COMMENT (ALREADY GOOD)
// ===============================
router.post("/:id/comment", protect, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const newComment = {
      user: req.user._id,
      text: req.body.text,
    };

    blog.comments.push(newComment);
    await blog.save();

    const updatedBlog = await Blog.findById(req.params.id)
      .populate("comments.user", "username"); // ✅ correct

    res.json(updatedBlog.comments);
  } catch (error) {
    console.error("COMMENT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});
// ===============================
// 🗑 DELETE COMMENT
// ===============================
router.delete("/:blogId/comments/:commentId", protect, async (req, res) => {
  try {
    const { blogId, commentId } = req.params;

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const comment = blog.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // 🔐 Only owner can delete
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    comment.deleteOne(); // ✅ remove comment
    await blog.save();

    res.json({ message: "Comment deleted" });
  } catch (error) {
    console.error("DELETE COMMENT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});
// ===============================
// ✏️ UPDATE COMMENT
// ===============================
router.put("/:blogId/comments/:commentId", protect, async (req, res) => {
  try {
    const { blogId, commentId } = req.params;
    const { text } = req.body;

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const comment = blog.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // 🔐 Only owner can edit
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    comment.text = text;

    await blog.save();

    res.json({ message: "Comment updated" });
  } catch (error) {
    console.error("UPDATE COMMENT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
