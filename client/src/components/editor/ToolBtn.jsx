const ToolBtn = ({ onClick, title, children, active }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-150
        ${
          active
            ? "bg-blue-100 text-blue-600"
            : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
        }`}
    >
      {children}
    </button>
  );
};

export default ToolBtn;