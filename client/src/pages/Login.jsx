import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import axios from "axios";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
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

    if (!form.email) newErrors.email = "Email is required";
    if (!form.password) newErrors.password = "Password is required";

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
        "https://blog-backend-wcnx.onrender.com/api/auth/login",
        form
      );

      console.log("LOGIN RESPONSE:", res.data);

      if (res.data?.token) {
        // ✅ Store token
        localStorage.setItem("token", res.data.token);

        // 🔥 FIX: Store user correctly
        localStorage.setItem(
          "user",
          JSON.stringify({
            _id: res.data._id,
            username: res.data.username,
            email: res.data.email,
          })
        );

        toast.success("Login successful 🎉");

        navigate("/dashboard");
      }
    } catch (err) {
      const message =
        err.response?.data?.message || "Invalid email or password";

      toast.error(message);

      setErrors({
        password: "Invalid email or password",
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
            Welcome Back 👋
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={`w-full mt-1 px-4 py-2 border rounded-lg ${
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
                placeholder="Enter your password"
                className={`w-full mt-1 px-4 py-2 border rounded-lg ${
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
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          {/* Switch */}
          <p className="text-sm text-center mt-4 text-gray-500">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-blue-600 cursor-pointer hover:underline"
            >
              Register
            </span>
          </p>

        </div>
      </div>
    </MainLayout>
  );
};

export default Login;