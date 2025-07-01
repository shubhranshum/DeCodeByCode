import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEye, FaHeart } from 'react-icons/fa';

const BlogCard = ({ blogs, handleLike, handleViewCount }) => {
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
          className="bg-[#1e293b] dark:bg-white rounded-xl shadow-sm hover:shadow-lg cursor-pointer transition-all duration-300 border border-white/5 dark:border-gray-300 overflow-hidden group flex flex-col h-full"
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
              <div className="flex items-center text-xs text-gray-400 dark:text-gray-500 font-medium mb-3">
                <span className="font-medium text-gray-300 dark:text-gray-700">
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
              <h2 className="text-xl font-bold text-white dark:text-gray-900 mb-3 leading-tight group-hover:text-orange-400 dark:group-hover:text-blue-500 transition-colors">
                {blog.title}
              </h2>
            </div>

            <div className="mb-4 flex-grow">
              <p className="text-gray-400 dark:text-gray-600 leading-relaxed font-light">
                {blog.summary || blog.content?.slice(0, 120) + '...'}
              </p>
            </div>

            {blog.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {blog.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="bg-orange-500/10 dark:bg-blue-500/10 text-orange-400 dark:text-blue-500 text-xs px-3 py-1 rounded-full font-medium"
                  >
                    {tag}
                  </span>
                ))}
                {blog.tags.length > 2 && (
                  <span className="bg-orange-500/10 dark:bg-blue-500/10 text-orange-400 dark:text-blue-500 text-xs px-3 py-1 rounded-full font-medium">
                    +{blog.tags.length - 2}
                  </span>
                )}
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-white/10 dark:border-gray-300 mt-auto">
              <div className="flex items-center space-x-4 text-sm text-gray-400 dark:text-gray-500">
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
