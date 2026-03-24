import express from "express";
import {
  createBlog,
  getBlogs,
  getBlog,
  deleteBlog,
} from "../controllers/BlogController.js";

const router = express.Router();

router.post("/", createBlog);
router.get("/", getBlogs);
router.get("/:id", getBlog);
router.delete("/:id", deleteBlog);

export default router;