import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, X } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import toast from "react-hot-toast";
import API from "../services/api";
import { useAuth } from "../contexts/AuthContext";

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
        className={`w-full mt-0.5 px-4 py-2.5 ${children ? "pr-11" : ""} border rounded-lg text-sm outline-none transition-all duration-200 ${
          error
            ? "border-red-400 bg-red-50/40 focus:ring-2 focus:ring-red-200 focus:border-red-400"
            : "border-slate-200 bg-white focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500"
        } placeholder:text-slate-400 text-slate-800`}
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

const LoginCard = ({
  form,
  errors,
  loading,
  showPassword,
  handleChange,
  handleSubmit,
  setShowPassword,
  navigate,
  embedded,
  onClose,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    className="w-full max-w-md"
  >
    <div className="relative rounded-2xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/60">
      {embedded && onClose ? (
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          aria-label="Close login"
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.12, duration: 0.35 }}
        className="mb-7 text-center"
      >
        <h2 className="flex items-center justify-center gap-2 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-4xl">
          Welcome Back
          <LogIn className="h-7 w-7 text-indigo-600 md:h-8 md:w-8" />
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Sign in to continue reading and writing
        </p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.18, duration: 0.35 }}
        onSubmit={handleSubmit}
        noValidate
        className="space-y-5"
      >
        <InputField
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter your email"
          error={errors.email}
        />

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700">
              Password
            </label>
            <button
              type="button"
              className="text-xs font-medium text-indigo-600 transition-colors duration-150 hover:text-indigo-700 hover:underline"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={`w-full mt-0.5 px-4 py-2.5 pr-11 border rounded-lg text-sm outline-none transition-all duration-200 ${
                errors.password
                  ? "border-red-400 bg-red-50/40 focus:ring-2 focus:ring-red-200 focus:border-red-400"
                  : "border-slate-200 bg-white focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500"
              } placeholder:text-slate-400 text-slate-800`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
              className="absolute right-3 top-1/2 mt-0.5 -translate-y-1/2 text-slate-400 transition-colors duration-150 hover:text-slate-600"
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

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.018 }}
          whileTap={{ scale: loading ? 1 : 0.982 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="mt-1 flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-100 transition-colors duration-200 hover:bg-indigo-700 active:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-60"
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
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="3"
                  />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Logging in...
              </motion.span>
            ) : (
              <motion.span
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Login
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.form>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-100" />
        <span className="text-xs text-slate-400">or</span>
        <div className="h-px flex-1 bg-slate-100" />
      </div>

      <p className="text-center text-sm text-slate-600">
        Don't have an account?{" "}
        <span
          onClick={() => navigate("/register")}
          className="cursor-pointer font-medium text-indigo-600 transition-colors duration-150 hover:text-indigo-700 hover:underline"
        >
          Register
        </span>
      </p>
    </div>

    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="mt-5 text-center text-xs text-slate-500"
    >
      By signing in you agree to our{" "}
      <span className="cursor-pointer underline underline-offset-2 transition-colors hover:text-slate-700">
        Terms
      </span>{" "}
      and{" "}
      <span className="cursor-pointer underline underline-offset-2 transition-colors hover:text-slate-700">
        Privacy Policy
      </span>
    </motion.p>
  </motion.div>
);

const Login = ({ embedded = false, onSuccess, onClose }) => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Enter a valid email address";
    }
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
      const res = await API.post("/auth/login", form);

      if (res.data?.token) {
        login(res.data);
        toast.success("Welcome back!");
        onSuccess?.(res.data);

        if (!embedded) {
          navigate("/dashboard");
        }
      }
    } catch (err) {
      const message =
        err.response?.data?.message || "Invalid email or password";
      toast.error(message);
      setErrors({ password: "Invalid email or password" });
    } finally {
      setLoading(false);
    }
  };

  const card = (
    <LoginCard
      form={form}
      errors={errors}
      loading={loading}
      showPassword={showPassword}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      setShowPassword={setShowPassword}
      navigate={navigate}
      embedded={embedded}
      onClose={onClose}
    />
  );

  if (embedded) {
    return card;
  }

  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4 py-12">
        {card}
      </div>
    </MainLayout>
  );
};

export default Login;
