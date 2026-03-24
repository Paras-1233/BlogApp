import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import BlogDetail from "../pages/BlogDetails";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import CreateBlog from "../pages/CreateBlog";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/blog/:id" element={<BlogDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/create" element={<CreateBlog />} />
    </Routes>
  );
};

export default AppRoutes;