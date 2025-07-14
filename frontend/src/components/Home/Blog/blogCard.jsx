import { Link } from "react-router-dom";
const BlogCard = ({ blog }) => (
  <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/70 hover:from-gray-700/50 hover:to-gray-800/70 transition-all rounded-xl p-5 border border-gray-700 hover:border-orange-500/30 shadow-lg hover:shadow-orange-500/10">
    <div className="flex justify-between items-start gap-3">
      <Link
        to={`/blog/${blog?._id}`}
        className="text-orange-300 hover:text-orange-400 transition-colors font-bold text-lg cursor-pointer line-clamp-2 "
      >
        {blog?.title || "Untitled Blog"}
      </Link>
      <div className="flex items-center gap-1 text-gray-400">
        <span className="text-xs">♡</span>
        <span className="text-sm">{blog?.likedBy.length || 0}</span>
      </div>
    </div>
    
    {blog?.tags && (
      <div className="mt-3 flex flex-wrap gap-2">
        {blog.tags.slice(0, 3).map((tag, index) => (
          <span 
            key={index} 
            className="text-xs bg-gray-700 hover:bg-orange-500/20 px-2 py-1 rounded transition-colors"
          >
            #{tag}
          </span>
        ))}
      </div>
    )}
    <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
      <span> {blog?.author?.username || "Anonymous"}</span>
      <span>{formatDateToDMY(blog?.createdAt) || "Recently"}</span>
    </div>
  </div>
);
function formatDateToDMY(isoDateStr) {
  const date = new Date(isoDateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();


  return `${day}/${month}/${year}`;
}
function formatDateToDMYHM(isoDateStr) {
  const date = new Date(isoDateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  

  return `${day}/${month}/${year} - ${hours}:${minutes}`;
}

export default BlogCard;