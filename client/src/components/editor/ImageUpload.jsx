import { useRef } from "react";

const ImageUpload = ({
  imagePreview,
  setImagePreview,
  setForm,
  handleImageFile,
  handleDrop,
  dragOver,
  setDragOver,
}) => {
  const fileInputRef = useRef(null);

  return (
    <>
      {imagePreview ? (
        <div className="relative group rounded-2xl overflow-hidden h-56">
          <img
            src={imagePreview}
            alt="cover"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-white/90 text-gray-800 text-xs font-semibold rounded-lg hover:bg-white"
            >
              Change
            </button>

            <button
              type="button"
              onClick={() => {
                setImagePreview("");
                setForm((p) => ({ ...p, image: "" }));
              }}
              className="px-3 py-1.5 bg-red-500 text-white text-xs rounded-lg"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`h-36 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition
            ${
              dragOver
                ? "border-blue-400 bg-blue-50"
                : "border-gray-200 bg-gray-50 hover:bg-gray-100"
            }`}
        >
          <p className="text-sm text-gray-400">
            <span className="font-medium text-gray-600">
              Add a cover image
            </span>{" "}
            — drag & drop or click
          </p>
          <p className="text-xs text-gray-400">
            PNG, JPG, WEBP up to 10MB
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        hidden
        accept="image/*"
        onChange={(e) => handleImageFile(e.target.files[0])}
      />
    </>
  );
};

export default ImageUpload;