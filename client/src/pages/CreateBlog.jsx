import { useState, useRef, useEffect } from "react";
import { createBlog } from "../services/blogService";
import MainLayout from "../layouts/MainLayout";
import { useNavigate } from "react-router-dom";
import Tag from "../components/editor/Tag";
import Toast from "../components/editor/Toast";
import { wordCount, readTime } from "../utils/helpers";
import Toolbar from "../components/editor/Toolbar";
import { uploadToCloudinary } from "../utils/cloudinary";
import ImageUpload from "../components/editor/ImageUpload";

// ─── Toast notification ────────────────────────────────────────────────────────


// ─── Toolbar button ────────────────────────────────────────────────────────────


// ─── Tag chip ──────────────────────────────────────────────────────────────────


// ─── Word / char counts ────────────────────────────────────────────────────────

// ─── Main component ────────────────────────────────────────────────────────────
const CreateBlog = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ title: "", content: "", image: "" });
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState("");
  const [mounted, setMounted] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const contentRef = useRef(null);


  const TITLE_MAX = 120;

  useEffect(() => {
    setTimeout(() => setMounted(true), 30);
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    const el = contentRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.max(320, el.scrollHeight)}px`;
    }
  }, [form.content]);

  const showToast = (message, type = "success") => setToast({ message, type });

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.content.trim()) e.content = "Content is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "title" && value.length > TITLE_MAX) return;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  // Tag handling
  const addTag = (raw) => {
    const t = raw.trim().replace(/,+$/, "");
    if (t && !tags.includes(t) && tags.length < 5) {
      setTags((prev) => [...prev, t]);
    }
    setTagInput("");
  };

  const handleTagKey = (e) => {
    if (["Enter", ",", "Tab"].includes(e.key)) {
      e.preventDefault();
      addTag(tagInput);
    } else if (e.key === "Backspace" && !tagInput) {
      setTags((prev) => prev.slice(0, -1));
    }
  };

  // Image handling
  const handleImageFile = async (file) => {
  if (!file || !file.type.startsWith("image/")) {
    showToast("Please upload a valid image file.", "error");
    return;
  }

  try {
    showToast("Uploading image...");

    const imageUrl = await uploadToCloudinary(file);

    setImagePreview(imageUrl);
    setForm((prev) => ({ ...prev, image: imageUrl }));

    showToast("Image uploaded successfully ✅");
  } catch (err) {
    showToast("Image upload failed ❌", "error");
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






  // Toolbar formatting
  const insertFormat = (before, after = before) => {
    const el = contentRef.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e, value } = el;
    const selected = value.slice(s, e) || "text";
    const newVal = value.slice(0, s) + before + selected + after + value.slice(e);
    setForm((prev) => ({ ...prev, content: newVal }));
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(s + before.length, s + before.length + selected.length);
    }, 0);
  };

  const insertLine = (prefix) => {
    const el = contentRef.current;
    if (!el) return;
    const { selectionStart: s, value } = el;
    const lineStart = value.lastIndexOf("\n", s - 1) + 1;
    const newVal = value.slice(0, lineStart) + prefix + value.slice(lineStart);
    setForm((prev) => ({ ...prev, content: newVal }));
    setTimeout(() => { el.focus(); el.setSelectionRange(s + prefix.length, s + prefix.length); }, 0);
  };

  const handleSubmit = async (isDraft = false) => {
    if (!validate()) {
      showToast("Please fix the errors before publishing.", "error");
      return;
    }
    setLoading(true);
    try {
      const payload = { ...form, tags, status: isDraft ? "draft" : "published" };
      const res = await createBlog(payload);
      if (res?.data) {
        showToast(isDraft ? "Draft saved!" : "Blog published successfully! 🎉");
        setTimeout(() => navigate("/dashboard"), 1800);
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Something went wrong.", "error");
    } finally {
      setLoading(false);
    }
  };

  const toolbarGroups = [
    [
      { title: "Bold", label: <span className="font-bold text-[13px]">B</span>, action: () => insertFormat("**") },
      { title: "Italic", label: <span className="italic text-[13px]">I</span>, action: () => insertFormat("*") },
      { title: "Strikethrough", label: <span className="line-through text-[13px]">S</span>, action: () => insertFormat("~~") },
    ],
    [
      { title: "Heading 1", label: <span className="text-[11px] font-bold">H1</span>, action: () => insertLine("# ") },
      { title: "Heading 2", label: <span className="text-[11px] font-bold">H2</span>, action: () => insertLine("## ") },
      { title: "Heading 3", label: <span className="text-[11px] font-bold">H3</span>, action: () => insertLine("### ") },
    ],
    [
      {
        title: "Bullet list", action: () => insertLine("- "),
        label: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>,
      },
      {
        title: "Blockquote", action: () => insertLine("> "),
        label: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>,
      },
      {
        title: "Code block", action: () => insertFormat("```\n", "\n```"),
        label: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>,
      },
    ],
  ];

  return (
    <MainLayout>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div
        className={`max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 transition-all duration-500
          ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      >

        {/* ── Top bar ──────────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back
          </button>

          <div className="flex items-center gap-2">
            {/* Preview toggle */}
            <button
              type="button"
              onClick={() => setPreview(!preview)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-sm font-medium transition-all duration-200
                ${preview
                  ? "bg-gray-900 text-white border-gray-900"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {preview ? "Edit" : "Preview"}
            </button>

            <button
              type="button"
              onClick={() => handleSubmit(true)}
              disabled={loading}
              className="px-3.5 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600
                hover:bg-gray-50 transition-all duration-200 disabled:opacity-40"
            >
              Save draft
            </button>

            <button
              type="button"
              onClick={() => handleSubmit(false)}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold
                hover:bg-blue-700 hover:shadow-md hover:-translate-y-px active:translate-y-0
                transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Publishing…
                </>
              ) : "Publish"}
            </button>
          </div>
        </div>

        {/* ── PREVIEW MODE ────────────────────────────────────────── */}
        {preview ? (
          <article className="prose prose-gray max-w-none">
            {imagePreview && (
              <img src={imagePreview} alt="cover" className="w-full h-64 object-cover rounded-2xl mb-8" />
            )}
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {form.title || <span className="text-gray-300">Untitled post</span>}
            </h1>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {tags.map((t) => <Tag key={t} label={t} onRemove={() => {}} />)}
              </div>
            )}
            <div className="text-sm text-gray-400 font-medium mb-8 flex items-center gap-3">
              <span>{wordCount(form.content)} words</span>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span>{readTime(form.content)} min read</span>
            </div>
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed text-[1.05rem]">
              {form.content || <span className="text-gray-300 italic">Nothing written yet…</span>}
            </div>
          </article>
        ) : (
          /* ── EDITOR MODE ──────────────────────────────────────── */
          <div className="space-y-6">

            {/* Cover image */}
            <ImageUpload
  imagePreview={imagePreview}
  setImagePreview={setImagePreview}
  setForm={setForm}
  handleImageFile={handleImageFile}
  handleDrop={handleDrop}
  dragOver={dragOver}
  setDragOver={setDragOver}
/>

            {/* Title */}
            <div>
              <input
                type="text"
                name="title"
                placeholder="Enter your title…"
                value={form.title}
                onChange={handleChange}
                className={`w-full text-3xl sm:text-4xl font-bold text-gray-900 placeholder-gray-200
                  bg-transparent border-0 outline-none focus:ring-0 py-1 leading-tight
                  transition-colors duration-200
                  ${errors.title ? "placeholder-red-300" : ""}`}
              />
              <div className="flex items-center justify-between mt-1.5">
                {errors.title ? (
                  <p className="text-xs text-red-400 font-medium">{errors.title}</p>
                ) : <span />}
                <span className={`text-xs font-medium tabular-nums ${form.title.length > TITLE_MAX * 0.85 ? "text-amber-500" : "text-gray-300"}`}>
                  {form.title.length}/{TITLE_MAX}
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100" />

            {/* Tags */}
            <div>
              <div className="flex flex-wrap items-center gap-2 min-h-[32px]">
                {tags.map((t) => (
                  <Tag key={t} label={t} onRemove={() => setTags((prev) => prev.filter((x) => x !== t))} />
                ))}
                {tags.length < 5 && (
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKey}
                    onBlur={() => tagInput && addTag(tagInput)}
                    placeholder={tags.length === 0 ? "Add tags (press Enter or comma)…" : "Add tag…"}
                    className="flex-1 min-w-[160px] text-sm text-gray-600 placeholder-gray-300 bg-transparent border-0 outline-none focus:ring-0"
                  />
                )}
              </div>
              {tags.length >= 5 && (
                <p className="text-xs text-gray-400 mt-1">Maximum 5 tags</p>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100" />

            {/* Toolbar */}
              <Toolbar
  toolbarGroups={toolbarGroups}
  wordCount={wordCount}
  readTime={readTime}
  content={form.content}
/>

            {/* Content textarea */}
            <div>
              <textarea
                ref={contentRef}
                name="content"
                placeholder="Start writing your story…"
                value={form.content}
                onChange={handleChange}
                rows={14}
                className={`w-full text-[1.05rem] text-gray-700 leading-relaxed placeholder-gray-200
                  bg-transparent border-0 outline-none focus:ring-0 resize-none py-0
                  transition-colors duration-200 font-[inherit]
                  ${errors.content ? "placeholder-red-300" : ""}`}
              />
              {errors.content && (
                <p className="text-xs text-red-400 font-medium mt-1">{errors.content}</p>
              )}
            </div>

            {/* Image URL fallback */}
            {!imagePreview && (
              <div className="pt-4 border-t border-gray-100">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Or paste a cover image URL
                </label>
                <input
                  type="url"
                  name="image"
                  placeholder="https://images.unsplash.com/…"
                  value={form.image}
                  onChange={(e) => {
                    handleChange(e);
                    if (e.target.value) setImagePreview(e.target.value);
                  }}
                  className="mt-2 w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700
                    placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    transition-all duration-200"
                />
              </div>
            )}

            {/* Mobile publish buttons */}
            <div className="flex gap-3 pt-2 sm:hidden">
              <button
                type="button"
                onClick={() => handleSubmit(true)}
                disabled={loading}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600
                  hover:bg-gray-50 transition-colors disabled:opacity-40"
              >
                Save draft
              </button>
              <button
                type="button"
                onClick={() => handleSubmit(false)}
                disabled={loading}
                className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold
                  hover:bg-blue-700 transition-all disabled:opacity-50"
              >
                {loading ? "Publishing…" : "Publish"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </MainLayout>
  );
};

export default CreateBlog; 