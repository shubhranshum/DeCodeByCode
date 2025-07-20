// BlogCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEye, FaHeart } from 'react-icons/fa';

const BlogCard = ({ blogs, handleLike, handleViewCount, theme }) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-5">
      {blogs.map((blog, index) => (
        <motion.article
          key={blog._id}
          onClick={() => {
            handleViewCount(blog._id);
            navigate(`/blog/${blog._id}`);
          }}
          className={`rounded-xl shadow-sm hover:shadow-lg cursor-pointer transition-all duration-300 overflow-hidden group flex flex-col h-full ${
            theme === 'dark' 
              ? "bg-gray-800 border border-gray-700" 
              : "bg-white border border-gray-200"
          }`}
          whileHover={{ y: -8, scale: 1.02 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
        >
          <div className="overflow-hidden">
            <img
              src={blog.thumbnailUrl}
              alt={blog.title}
              className="w-full h-48 object-cover rounded-t-xl transform transition-transform duration-500 group-hover:scale-110"
            />
          </div>

          <div className="p-6 flex flex-col flex-grow">
            <div className="mb-4">
              <div className={`flex items-center text-xs font-medium mb-3 ${
                theme === 'dark' 
                  ? "text-gray-400" 
                  : "text-gray-500"
              }`}>
                <span className={`font-medium ${
                  theme === 'dark' 
                    ? "text-gray-300" 
                    : "text-gray-700"
                }`}>
                  {blog.author?.username || 'Anonymous'}
                </span>
                <span className="mx-2">•</span>
                <time>
                  {new Date(blog.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </time>
              </div>
              <h2 className={`text-xl font-bold mb-3 leading-tight group-hover:${
                theme === 'dark' 
                  ? "text-indigo-400" 
                  : "text-purple-600"
              } transition-colors ${
                theme === 'dark' 
                  ? "text-white" 
                  : "text-gray-900"
              }`}>
                {blog.title}
              </h2>
            </div>

            <div className="mb-4 flex-grow">
              <p className={`leading-relaxed font-light ${
                theme === 'dark' 
                  ? "text-gray-400" 
                  : "text-gray-600"
              }`}>
                {blog.summary || blog.content?.slice(0, 120) + '...'}
              </p>
            </div>

            {blog.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {blog.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className={`text-xs px-3 py-1 rounded-full font-medium ${
                      theme === 'dark' 
                        ? "bg-indigo-500/10 text-indigo-400" 
                        : "bg-purple-500/10 text-purple-600"
                    }`}
                  >
                    {tag}
                  </span>
                ))}
                {blog.tags.length > 2 && (
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                    theme === 'dark' 
                      ? "bg-indigo-500/10 text-indigo-400" 
                      : "bg-purple-500/10 text-purple-600"
                  }`}>
                    +{blog.tags.length - 2}
                  </span>
                )}
              </div>
            )}

            <div className={`flex items-center justify-between pt-4 mt-auto ${
              theme === 'dark' 
                ? "border-t border-gray-700" 
                : "border-t border-gray-200"
            }`}>
              <div className={`flex items-center space-x-4 text-sm ${
                theme === 'dark' 
                  ? "text-gray-400" 
                  : "text-gray-500"
              }`}>
                <span className="flex items-center space-x-1">
                  <FaEye className="w-4 h-4" />
                  <span>{blog.viewsCount || 0}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <FaHeart className="w-4 h-4" />
                  <span>{blog.likesCount || 0}</span>
                </span>
              </div>
            </div>
          </div>
        </motion.article>
      ))}
    </div>
  );
};

export default BlogCard;