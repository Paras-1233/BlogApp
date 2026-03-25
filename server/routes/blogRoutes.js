import express from "express";
import {
  createBlog,
  getBlogs,
  getBlog,
  getMyBlogs,
  updateBlog,
  deleteBlog,
} from "../controllers/BlogController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔥 PROTECT CREATE
router.post("/", protect, createBlog);

// public routes
router.get("/", getBlogs);
router.get("/myblogs", protect, getMyBlogs); // must be before /:id
router.get("/:id", getBlog);

// protected routes
router.put("/:id", protect, updateBlog);
router.delete("/:id", protect, deleteBlog);

export default router;