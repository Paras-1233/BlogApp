import MainLayout from "../layouts/MainLayout";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { getMyBlogs } from "../services/blogService";
import { uploadToCloudinary } from "../utils/cloudinary";
import { updateProfile, getMyProfile } from "../services/userServices";
/* ─── tiny toast hook ──────────────────────────────────────────────── */
const useToast = () => {
  const [toasts, setToasts] = useState([]);
  const show = (message, type = "success") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000);
  };
  return { toasts, show };
};

/* ─── skeleton block ────────────────────────────────────────────────── */
const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />
);

/* ─── tab definitions ───────────────────────────────────────────────── */
const TABS = ["Posts", "Saved", "Settings"];

/* ════════════════════════════════════════════════════════════════════ */
const Profile = () => {
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Posts");
  const [avatarPreview, setAvatarPreview] = useState(null);

  /* edit-profile state (UI only) */
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", bio: "", role: "" });

  const { toasts, show: showToast } = useToast();

  const [user, setUser] = useState(null);
 useEffect(() => {
  fetchProfile();
}, []);

const fetchMyBlogs = async () => {
  try {
    const res = await getMyBlogs();
    setBlogs(res.data || []);
  } catch (err) {
    console.error("Failed to fetch blogs:", err);
  }
};

const fetchProfile = async () => {
  setLoading(true);
  try {
    const res = await getMyProfile();

    const userData = res.data;
    setUser(userData);

    setFormData({
      name: userData.name || userData.username || "",
      bio: userData.bio || "No bio yet.",
      role: userData.role || "Author",
    });

    if (userData.avatar) {
      setAvatarPreview(userData.avatar);
    }

    await fetchMyBlogs();
  } catch (err) {
    console.error(err);
    navigate("/login");
  } finally {
    setLoading(false);
  }
};

const handleAvatarChange = async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  setLoading(true);
  try {
    const imageUrl = await uploadToCloudinary(file);

    const res = await updateProfile({
      ...formData,
      avatar: imageUrl,
    });

    setUser(res.data);
    setAvatarPreview(imageUrl);
    setFormData((prev) => ({ ...prev, avatar: imageUrl }));

    localStorage.setItem("user", JSON.stringify(res.data));

    showToast("Avatar updated successfully!");
  } catch (err) {
    console.error(err);
    showToast("Failed to upload avatar", "error");
  } finally {
    setLoading(false);
  }
};

const handleSaveProfile = async () => {
  setLoading(true);
  try {
    const res = await updateProfile(formData);

    setUser(res.data);
    setFormData({
      name: res.data.name || res.data.username || "",
      bio: res.data.bio || "No bio yet.",
      role: res.data.role || "Author",
    });

    localStorage.setItem("user", JSON.stringify(res.data));

    setEditMode(false);
    showToast("Profile saved successfully!");
  } catch (err) {
    console.error(err);
    showToast("Failed to save profile", "error");
  } finally {
    setLoading(false);
  }
};

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (!user) return null;

  const initials =
    (user.name || user.username || "U").charAt(0).toUpperCase();

  /* ── render ─────────────────────────────────────────────────────── */
  return (
    <MainLayout>
      {/* ── toast stack ─────────────────────────────────────────────── */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-3 rounded-xl text-sm font-medium shadow-lg text-white transition-all duration-300 pointer-events-auto
              ${t.type === "error" ? "bg-red-500" : "bg-emerald-500"}`}
          >
            {t.type === "error" ? "✕ " : "✓ "}
            {t.message}
          </div>
        ))}
      </div>

      <div className="min-h-screen bg-gray-50">
        {/* ── hero banner ───────────────────────────────────────────── */}
        <div className="h-40 bg-gradient-to-r from-violet-600 via-indigo-500 to-sky-500 relative overflow-hidden">
          {/* subtle pattern overlay */}
          <svg
            className="absolute inset-0 w-full h-full opacity-10"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="dots"
                x="0"
                y="0"
                width="24"
                height="24"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="4" cy="4" r="1.5" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>

        <div className="max-w-4xl mx-auto px-4 pb-16 -mt-16">
          {/* ── profile card ──────────────────────────────────────── */}
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-end gap-5">
              {/* avatar */}
              <div className="relative w-24 h-24 flex-shrink-0">
                {loading ? (
                  <Skeleton className="w-24 h-24 rounded-full" />
                ) : avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="avatar"
                    className="w-24 h-24 rounded-full object-cover ring-4 ring-white shadow-md"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white text-3xl font-bold ring-4 ring-white shadow-md select-none">
                    {initials}
                  </div>
                )}
                {/* upload trigger */}
                <button
                  onClick={() => fileRef.current?.click()}
                  aria-label="Change profile picture"
                  className="absolute bottom-0 right-0 w-7 h-7 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow hover:bg-gray-50 transition"
                >
                  <svg
                    className="w-3.5 h-3.5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536M9 11l6-6 3 3-6 6H9v-3z"
                    />
                  </svg>
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>

              {/* name / role / actions */}
              <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  {loading ? (
                    <>
                      <Skeleton className="h-6 w-40 mb-2" />
                      <Skeleton className="h-4 w-24" />
                    </>
                  ) : (
                    <>
                      <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                        {formData.name}
                      </h1>
                      <p className="text-sm text-gray-500 mt-0.5">
                        @{user.username}{" "}
                        <span className="mx-1 text-gray-300">·</span>
                        <span className="text-violet-600 font-medium">
                          {formData.role}
                        </span>
                      </p>
                    </>
                  )}
                </div>

                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setEditMode((v) => !v)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition shadow-sm"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536M9 11l6-6 3 3-6 6H9v-3z"
                      />
                    </svg>
                    Edit Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-50 text-sm font-medium text-red-600 hover:bg-red-100 transition border border-red-100"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
                      />
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            </div>

            {/* bio */}
            <div className="mt-5 border-t pt-5 text-sm text-gray-600 leading-relaxed">
              {loading ? (
                <Skeleton className="h-4 w-3/4" />
              ) : (
                <p>{formData.bio}</p>
              )}
              <p className="text-xs text-gray-400 mt-1">{user.email}</p>
            </div>

            {/* stats row */}
            <div className="mt-5 border-t pt-5 grid grid-cols-3 divide-x divide-gray-100 text-center">
              {[
                { label: "Posts", value: loading ? "—" : blogs.length },
                { label: "Followers", value: "0" },
                { label: "Likes", value: "0" },
              ].map(({ label, value }) => (
                <div key={label} className="px-4">
                  <p className="text-xl font-bold text-gray-900">{value}</p>
                  <p className="text-xs text-gray-500 mt-0.5 uppercase tracking-wide">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── edit panel (slide-in style) ────────────────────────── */}
          {editMode && (
            <div className="mt-4 bg-white rounded-2xl shadow-xl p-6 border border-violet-100 animate-fadeIn">
              <h2 className="text-base font-semibold text-gray-800 mb-4">
                Edit Profile
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((f) => ({ ...f, name: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Role / Title
                  </label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData((f) => ({ ...f, role: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Bio
                  </label>
                  <textarea
                    rows={3}
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData((f) => ({ ...f, bio: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition resize-none"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button
                  onClick={handleSaveProfile}
                  className="px-5 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 transition shadow-sm"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* ── tabs ──────────────────────────────────────────────── */}
          <div className="mt-6 flex gap-1 bg-gray-100 p-1 rounded-xl w-full sm:w-fit">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 sm:flex-none px-5 py-2 rounded-lg text-sm font-medium transition
                  ${
                    activeTab === tab
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* ── tab: Posts ────────────────────────────────────────── */}
          {activeTab === "Posts" && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-gray-800">
                  Your Posts
                </h2>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="text-xs font-medium text-violet-600 hover:underline"
                >
                  View all →
                </button>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="p-4 bg-white rounded-2xl shadow-sm flex gap-4"
                    >
                      <Skeleton className="h-12 w-12 rounded-xl flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : blogs.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
                  <div className="text-4xl mb-3">📝</div>
                  <p className="text-gray-500 text-sm">
                    No posts yet. Start writing!
                  </p>
                  <button
                    onClick={() => navigate("/create")}
                    className="mt-4 px-5 py-2 rounded-xl bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 transition"
                  >
                    Create your first post
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {blogs.slice(0, 3).map((blog, i) => (
                    <div
                      key={blog._id}
                      onClick={() => navigate(`/blog/${blog._id}`)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) =>
                        e.key === "Enter" && navigate(`/blog/${blog._id}`)
                      }
                      className="group p-4 bg-white rounded-2xl shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 flex items-center gap-4 border border-transparent hover:border-violet-100"
                    >
                      {/* numbered badge */}
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 text-violet-600 flex items-center justify-center text-sm font-bold flex-shrink-0 group-hover:from-violet-200 group-hover:to-indigo-200 transition">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate group-hover:text-violet-700 transition text-sm">
                          {blog.title}
                        </h4>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {new Date(blog.createdAt).toDateString()}
                        </p>
                      </div>
                      <svg
                        className="w-4 h-4 text-gray-300 group-hover:text-violet-400 flex-shrink-0 transition"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── tab: Saved ────────────────────────────────────────── */}
          {activeTab === "Saved" && (
            <div className="mt-6 text-center py-16 bg-white rounded-2xl shadow-sm">
              <div className="text-4xl mb-3">🔖</div>
              <p className="text-gray-500 text-sm">
                No saved posts yet.
              </p>
            </div>
          )}

          {/* ── tab: Settings ─────────────────────────────────────── */}
          {activeTab === "Settings" && (
            <div className="mt-6 bg-white rounded-2xl shadow-sm p-6 space-y-5">
              <h2 className="text-base font-semibold text-gray-800">
                Account Settings
              </h2>

              {/* email row */}
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="text-sm font-medium text-gray-700">Email</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
                <span className="text-xs text-green-600 font-medium bg-green-50 px-2.5 py-1 rounded-full">
                  Verified
                </span>
              </div>

              {/* change password row */}
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Password
                  </p>
                  <p className="text-xs text-gray-400">
                    Last changed: never
                  </p>
                </div>
                <button
                  onClick={() => showToast("Password reset link sent!")}
                  className="text-xs font-medium text-violet-600 hover:underline"
                >
                  Change
                </button>
              </div>

              {/* danger zone */}
              <div className="pt-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-red-400 mb-3">
                  Danger Zone
                </p>
                <button
                  onClick={handleLogout}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition"
                >
                  Log out of all devices
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── inline keyframe for fadeIn ─────────────────────────────── */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out both; }
      `}</style>
    </MainLayout>
  );
};

export default Profile;