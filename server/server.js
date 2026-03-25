import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import blogRoutes from "./routes/blogRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

// ✅ THIS MUST BE FIRST MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

// DEBUG
app.use((req, res, next) => {
  console.log("BODY:", req.body);
  next();
});

// ROUTES
app.use("/api/blogs", blogRoutes);

app.use("/api/auth", authRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.log(err));

app.listen(5000, () => {
  console.log("Server running on port 5000");
});