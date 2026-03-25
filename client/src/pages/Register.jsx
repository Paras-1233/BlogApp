import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import axios from "axios";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
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

    // clear error while typing
    setErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

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

      const res = await axios.post(
  "https://blog-backend-wcnx.onrender.com/api/auth/register",
  form
);
      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
      }

      toast.success("Registered successfully 🎉");
      navigate("/dashboard");
    } catch (err) {
      const message =
        err.response?.data?.message || "Register failed ❌";

      toast.error(message);

      // show inline error (example: email already exists)
      setErrors({
        email: message,
      });
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