import { useState } from "react";
import { createBlog } from "../services/blogService";
import MainLayout from "../layouts/MainLayout";

const CreateBlog = () => {
  const [form, setForm] = useState({
    title: "",
    content: "",
    image: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("FORM DATA:", form); // 👈 MUST SHOW VALUES

    if (!form.title || !form.content) {
      alert("Please fill all fields");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to create a blog.");
      return;
    }

    try {
      const res = await createBlog(form);

  console.log("FULL RESPONSE:", res); // 👈 debug
  

  if (res && res.data) {
    alert("Blog created successfully!");
  }
} catch (err) {
  console.error("ERROR:", err.response?.data || err.message);
}
  };

  return (
    <MainLayout>
      <form onSubmit={handleSubmit} className="space-y-4 p-10">

        <input
          type="text"
          name="title"   // ✅ IMPORTANT
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <input
          type="text"
          name="image"   // ✅ IMPORTANT
          placeholder="Image URL"
          value={form.image}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <textarea
          name="content"   // ✅ IMPORTANT
          placeholder="Content"
          value={form.content}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <button type="submit" className="bg-blue-600 text-white px-4 py-2">
          Publish
        </button>

      </form>
    </MainLayout>
  );
};

export default CreateBlog;