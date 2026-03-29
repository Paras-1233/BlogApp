import ToolBtn from "./ToolBtn";

const Toolbar = ({ toolbarGroups, wordCount, readTime, content }) => {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {toolbarGroups.map((group, gi) => (
        <div key={gi} className="flex items-center gap-0.5">
          {gi > 0 && <div className="w-px h-5 bg-gray-200 mx-1" />}
          
          {group.map((btn) => (
            <ToolBtn key={btn.title} title={btn.title} onClick={btn.action}>
              {btn.label}
            </ToolBtn>
          ))}
        </div>
      ))}

      {/* Word count (RIGHT SIDE) */}
      <div className="ml-auto text-xs text-gray-300 font-medium flex items-center gap-2">
        <span>{wordCount(content)} words</span>
        <span className="w-1 h-1 rounded-full bg-gray-200" />
        <span>{readTime(content)} min read</span>
      </div>
    </div>
  );
};

export default Toolbar;