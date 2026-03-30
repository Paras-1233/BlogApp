import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import toast from "react-hot-toast";
import API from "../services/api";
import { useAuth } from "../contexts/AuthContext";

/* ─── Eye Icon ───────────────────────────────────────────────────────── */
const EyeIcon = ({ open }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-4 h-4"
  >
    {open ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    )}
  </svg>
);

/* ─── Input Field Component ──────────────────────────────────────────── */
const InputField = ({
  label,
  name,
  type,
  value,
  onChange,
  placeholder,
  error,
  children,
}) => (
  <div className="space-y-1">
    <label className="text-sm font-medium text-slate-700">{label}</label>
    <div className="relative">
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full mt-0.5 px-4 py-2.5 ${children ? "pr-11" : ""} border rounded-lg text-sm outline-none transition-all duration-200
          ${
            error
              ? "border-red-400 bg-red-50/40 focus:ring-2 focus:ring-red-200 focus:border-red-400"
              : "border-slate-200 bg-white focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500"
          }
          placeholder:text-slate-400 text-slate-800`}
      />
      {children}
    </div>
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -4, height: 0 }}
          transition={{ duration: 0.18 }}
          className="text-red-500 text-xs flex items-center gap-1.5 pt-0.5"
        >
          <svg
            className="w-3 h-3 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);

/* ─── Register Page ──────────────────────────────────────────────────── */
const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Enter a valid email address";
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

      const res = await API.post("/auth/register", form);

      if (res.data?.token) {
        login(res.data);

        toast.success("Account created successfully! 🎉");

        navigate("/dashboard");
      }
    } catch (err) {
      const message =
        err.response?.data?.message || "Registration failed";

      toast.error(message);

      if (message.toLowerCase().includes("username")) {
        setErrors({ username: message });
      } else if (message.toLowerCase().includes("email")) {
        setErrors({ email: message });
      } else {
        setErrors({ email: message });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      {/* Page background */}
      <div className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4 py-12">

        {/* Card — fade + slide up on mount */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          {/* White card */}
          <div className="bg-white shadow-xl shadow-slate-200/60 rounded-2xl p-8 border border-slate-100">

            {/* Heading */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.12, duration: 0.35 }}
              className="text-center mb-7"
            >
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight flex items-center justify-center gap-2">
                Create Account
                <UserPlus className="w-7 h-7 md:w-8 md:h-8 text-indigo-600" />
              </h2>
              <p className="text-sm text-slate-600 mt-2">
                Join us to start your blogging journey
              </p>
            </motion.div>

            {/* Form */}
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.18, duration: 0.35 }}
              onSubmit={handleSubmit}
              noValidate
              className="space-y-5"
            >
              {/* Name */}
              <InputField
                label="Full Name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                error={errors.name}
              />

              {/* Username */}
              <InputField
                label="Username"
                name="username"
                type="text"
                value={form.username}
                onChange={handleChange}
                placeholder="Choose a username"
                error={errors.username}
              />

              {/* Email */}
              <InputField
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                error={errors.email}
              />

              {/* Password */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Create a password (min 6 characters)"
                    className={`w-full mt-0.5 px-4 py-2.5 pr-11 border rounded-lg text-sm outline-none transition-all duration-200
                      ${
                        errors.password
                          ? "border-red-400 bg-red-50/40 focus:ring-2 focus:ring-red-200 focus:border-red-400"
                          : "border-slate-200 bg-white focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500"
                      }
                      placeholder:text-slate-400 text-slate-800`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 mt-0.5 text-slate-400 hover:text-slate-600 transition-colors duration-150"
                  >
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
                <AnimatePresence>
                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -4, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, y: -4, height: 0 }}
                      transition={{ duration: 0.18 }}
                      className="text-red-500 text-xs flex items-center gap-1.5 pt-0.5"
                    >
                      <svg
                        className="w-3 h-3 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.password}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Submit button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.018 }}
                whileTap={{ scale: loading ? 1 : 0.982 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="w-full bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 active:bg-indigo-800 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm shadow-indigo-100 mt-1"
              >
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.span
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <svg
                        className="w-4 h-4 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="3"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        />
                      </svg>
                      Creating account...
                    </motion.span>
                  ) : (
                    <motion.span
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      Create Account
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-slate-100" />
              <span className="text-xs text-slate-400">or</span>
              <div className="flex-1 h-px bg-slate-100" />
            </div>

            {/* Login link */}
            <p className="text-sm text-center text-slate-600">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-indigo-600 font-medium cursor-pointer hover:text-indigo-700 hover:underline transition-colors duration-150"
              >
                Login
              </span>
            </p>
          </div>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-xs text-slate-500 mt-5"
          >
            By signing up you agree to our{" "}
            <span className="hover:text-slate-700 cursor-pointer underline underline-offset-2 transition-colors">
              Terms
            </span>{" "}
            and{" "}
            <span className="hover:text-slate-700 cursor-pointer underline underline-offset-2 transition-colors">
              Privacy Policy
            </span>
          </motion.p>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default Register;