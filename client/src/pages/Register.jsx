import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import toast from "react-hot-toast";
import API from "../services/api";
import { useAuth } from "../contexts/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // 🔥 same as login page

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.username) newErrors.username = "Username is required";
    if (!form.email) newErrors.email = "Email is required";
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/register", form); // ✅ SAME as login style

      if (res.data?.token) {
        login(res.data); // 🔥 store globally (NO localStorage)

        toast.success("Registered successfully 🎉");

        navigate("/dashboard"); // ✅ direct login after register
      }
    } catch (err) {
      const message =
        err.response?.data?.message || "Register failed ❌";

      toast.error(message);

      if (message.toLowerCase().includes("username")) {
  setErrors({ username: message });
} else if (message.toLowerCase().includes("email")) {
  setErrors({ email: message });
} else {
  toast.error(message);
}
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-md mx-auto mt-16 px-4">
        <div className="bg-white shadow-lg rounded-2xl p-6">

          <h2 className="text-2xl font-bold text-center mb-6">
            Create Account 🚀
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name */}
            <div>
              <label className="text-sm text-gray-600">Full Name</label>
              <input
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={`w-full mt-1 px-4 py-2 border rounded-lg outline-none ${
                  errors.name
                    ? "border-red-500"
                    : "focus:ring-2 focus:ring-blue-500"
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Username */}
            <div>
              <label className="text-sm text-gray-600">Username</label>
              <input
                name="username"
                type="text"
                value={form.username}
                onChange={handleChange}
                placeholder="Enter username"
                className={`w-full mt-1 px-4 py-2 border rounded-lg outline-none ${
                  errors.username
                    ? "border-red-500"
                    : "focus:ring-2 focus:ring-blue-500"
                }`}
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.username}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter email"
                className={`w-full mt-1 px-4 py-2 border rounded-lg outline-none ${
                  errors.email
                    ? "border-red-500"
                    : "focus:ring-2 focus:ring-blue-500"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-gray-600">Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter password"
                className={`w-full mt-1 px-4 py-2 border rounded-lg outline-none ${
                  errors.password
                    ? "border-red-500"
                    : "focus:ring-2 focus:ring-blue-500"
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
            >
              {loading ? "Registering..." : "Register"}
            </button>

          </form>

          {/* Switch */}
          <p className="text-sm text-center mt-4 text-gray-500">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-blue-600 cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>

        </div>
      </div>
    </MainLayout>
  );
};

export default Register;