import { useEffect } from "react";

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl
        text-sm font-medium transition-all duration-300 animate-[slideUp_0.3s_ease]
        ${
          type === "success"
            ? "bg-gray-900 text-white"
            : "bg-red-50 text-red-700 border border-red-100"
        }`}
    >
      {type === "success" ? (
        <span className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </span>
      ) : (
        <span className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </span>
      )}

      {message}

      <button
        onClick={onClose}
        className="ml-1 opacity-50 hover:opacity-100"
      >
        ✕
      </button>
    </div>
  );
};

export default Toast;