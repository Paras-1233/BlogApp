import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import MainLayout from "../layouts/MainLayout";
import ImageUpload from "../components/editor/ImageUpload";
import { getBlogById, updateBlog } from "../services/blogService";
import { uploadToCloudinary } from "../utils/cloudinary";
import { readTime, wordCount } from "../utils/helpers";

const TITLE_MAX = 120;

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({ title: "", image: "", content: "" });
  const [originalBlog, setOriginalBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [error, setError] = useState("");
  const [imageError, setImageError] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setError("");
        const res = await getBlogById(id);
        const data = res.data;

        setOriginalBlog(data);
        setForm({
          title: data.title || "",
          image: data.image || "",
          content: data.content || "",
        });
      } catch (err) {
        console.error(err);
        setError("We couldn't load this post right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const imagePreview = form.image;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "title" && value.length > TITLE_MAX) return;
    if (name === "image") setImageError(false);

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageFile = async (file) => {
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.");
      return;
    }

    setImageUploading(true);
    setImageError(false);

    try {
      toast.loading("Uploading image...", { id: "edit-blog-image-upload" });
      const imageUrl = await uploadToCloudinary(file);

      setForm((prev) => ({
        ...prev,
        image: imageUrl,
      }));

      toast.success("Cover image uploaded.", {
        id: "edit-blog-image-upload",
      });
    } catch (err) {
      console.error(err);
      toast.error("Image upload failed. Please try again.", {
        id: "edit-blog-image-upload",
      });
    } finally {
      setImageUploading(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setDragOver(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      await handleImageFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (!form.title.trim() || !form.content.trim()) {
      toast.error("Title and content are required.");
      return;
    }

    setUpdating(true);

    try {
      await updateBlog(id, {
        title: form.title.trim(),
        image: form.image.trim(),
        content: form.content.trim(),
      });

      toast.success("Post updated successfully.");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Couldn't update the post. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const createdLabel = originalBlog?.createdAt
    ? new Date(originalBlog.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Draft";

  const updatedLabel = originalBlog?.updatedAt
    ? new Date(originalBlog.updatedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <MainLayout>
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-12">
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
              Back
            </button>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-sky-600">
              Edit Post
            </p>
            <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-4xl">
              Refine your story before it goes back out
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
              Update the headline, cover image, and content in one place with a
              cleaner editing workspace.
            </p>
          </div>

          {!loading && !error && (
            <div className="grid grid-cols-1 gap-2 text-xs font-medium text-slate-500 sm:flex sm:flex-wrap">
              <span className="rounded-full bg-white px-3 py-1.5 shadow-sm ring-1 ring-slate-200">
                {wordCount(form.content)} words
              </span>
              <span className="rounded-full bg-white px-3 py-1.5 shadow-sm ring-1 ring-slate-200">
                {readTime(form.content)} min read
              </span>
              <span className="rounded-full bg-white px-3 py-1.5 shadow-sm ring-1 ring-slate-200">
                Created {createdLabel}
              </span>
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_320px]">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="h-10 w-2/3 animate-pulse rounded-2xl bg-slate-100" />
              <div className="mt-6 h-14 animate-pulse rounded-2xl bg-slate-100" />
              <div className="mt-4 h-56 animate-pulse rounded-3xl bg-slate-100" />
              <div className="mt-4 h-64 animate-pulse rounded-3xl bg-slate-100" />
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="h-8 w-1/2 animate-pulse rounded-2xl bg-slate-100" />
              <div className="mt-4 h-48 animate-pulse rounded-3xl bg-slate-100" />
              <div className="mt-4 h-24 animate-pulse rounded-3xl bg-slate-100" />
            </div>
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-100 bg-white p-10 text-center shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-500">
              Unable To Load
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
              This post couldn&apos;t be opened
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
              {error}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Try again
              </button>
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                Back to dashboard
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_320px] lg:gap-6"
          >
            <div className="order-2 rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm sm:p-8 lg:order-1">
              <div>
                <label
                  htmlFor="title"
                  className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400"
                >
                  Title
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter your title"
                  className="mt-3 w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-xl font-semibold text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-sky-500 focus:ring-4 focus:ring-sky-100 sm:py-4 sm:text-3xl"
                  required
                />
                <div className="mt-2 flex justify-end">
                  <span
                    className={`text-xs font-medium ${
                      form.title.length > TITLE_MAX * 0.85
                        ? "text-amber-500"
                        : "text-slate-400"
                    }`}
                  >
                    {form.title.length}/{TITLE_MAX}
                  </span>
                </div>
              </div>

              <div className="mt-8">
                <div className="flex items-center justify-between gap-3">
                  <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Cover Image
                  </label>
                  {imageUploading && (
                    <span className="text-xs font-medium text-sky-600">
                      Uploading...
                    </span>
                  )}
                </div>

                <div className="mt-3">
                  <ImageUpload
                    imagePreview={imagePreview}
                    setImagePreview={(value) =>
                      setForm((prev) => ({ ...prev, image: value }))
                    }
                    setForm={setForm}
                    handleImageFile={handleImageFile}
                    handleDrop={handleDrop}
                    dragOver={dragOver}
                    setDragOver={setDragOver}
                  />
                </div>

                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                  <label
                    htmlFor="image"
                    className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400"
                  >
                    Or paste an image URL
                  </label>
                  <input
                    id="image"
                    name="image"
                    type="url"
                    value={form.image}
                    onChange={handleChange}
                    placeholder="https://example.com/cover-image.jpg"
                    className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                  />
                </div>
              </div>

              <div className="mt-8">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <label
                    htmlFor="content"
                    className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400"
                  >
                    Content
                  </label>
                  <span className="text-xs font-medium text-slate-400">
                    {form.content.length} characters
                  </span>
                </div>
                <textarea
                  id="content"
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  rows={14}
                  placeholder="Continue writing your story..."
                  className="min-h-[320px] w-full rounded-3xl border border-slate-200 px-4 py-4 text-[15px] leading-7 text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-sky-500 focus:ring-4 focus:ring-sky-100 sm:text-base"
                  required
                />
              </div>

              <div className="mt-8 hidden flex-col gap-3 border-t border-slate-100 pt-6 sm:flex sm:flex-row">
                <button
                  type="submit"
                  disabled={updating}
                  className="inline-flex flex-1 items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {updating ? "Saving changes..." : "Save changes"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </div>

            <aside className="order-1 space-y-5 lg:order-2 lg:space-y-6">
              <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-6 py-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-600">
                    Live Preview
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-slate-900">
                    How this post is shaping up
                  </h2>
                </div>

                {form.image && !imageError ? (
                  <img
                    src={form.image}
                    alt={form.title || "Blog cover preview"}
                    className="h-52 w-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="flex h-52 items-center justify-center bg-slate-100 px-6 text-center text-sm text-slate-400">
                    {form.image
                      ? "The image URL could not be previewed."
                      : "Add a cover image to make the post card feel more complete."}
                  </div>
                )}

                <div className="px-6 py-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    {createdLabel}
                    {updatedLabel ? ` | Updated ${updatedLabel}` : ""}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold leading-tight text-slate-900 sm:text-2xl">
                    {form.title || "Untitled post"}
                  </h3>
                  <p className="mt-4 line-clamp-6 whitespace-pre-wrap text-sm leading-6 text-slate-500">
                    {form.content || "Your content preview will appear here as you edit."}
                  </p>
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-600">
                  Post Snapshot
                </p>
                <div className="mt-4 grid gap-3">
                  <div className="rounded-2xl bg-slate-50 px-4 py-3">
                    <p className="text-xs font-medium text-slate-400">Word count</p>
                    <p className="mt-1 text-lg font-semibold text-slate-900">
                      {wordCount(form.content)}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-4 py-3">
                    <p className="text-xs font-medium text-slate-400">Read time</p>
                    <p className="mt-1 text-lg font-semibold text-slate-900">
                      {readTime(form.content)} min
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-4 py-3">
                    <p className="text-xs font-medium text-slate-400">Status</p>
                    <p className="mt-1 text-lg font-semibold text-slate-900">
                      Ready to update
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </form>
        )}
      </div>

      {!loading && !error && (
        <div className="sticky bottom-0 z-20 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-[0_-10px_30px_rgba(15,23,42,0.08)] backdrop-blur sm:hidden">
          <div className="mx-auto flex max-w-6xl gap-3">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="inline-flex flex-1 items-center justify-center rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={updating}
              className="inline-flex flex-1 items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {updating ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default EditBlog;
