export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "BlogiFy");
  formData.append("folder", "profile_avatars"); // ✅ ADD THIS

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dhuumeqq0/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();

  if (!data.secure_url) {
    console.error("Cloudinary error:", data);
    throw new Error("Upload failed");
  }

  return data.secure_url;
};