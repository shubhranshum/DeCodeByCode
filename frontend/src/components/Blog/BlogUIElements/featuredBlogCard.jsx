// FeaturedBlogCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEye } from 'react-icons/fa';

const FeaturedBlogCard = ({ featuredBlog, handleViewCount, theme }) => {
  const navigate = useNavigate();

  return (
    <div className={`py-16 px-4 ${
      theme === 'dark' 
        ? "bg-gradient-to-r from-gray-900 via-indigo-900 to-violet-900 border-b border-gray-700" 
        : "bg-gradient-to-r from-purple-50 via-white to-purple-50 border-b border-gray-200"
    }`}>
      <div className="max-w-6xl mx-auto">
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div>
            <div className={`inline-block text-white text-xs px-3 py-1 rounded-full mb-4 ${
              theme === 'dark' 
                ? "bg-indigo-600" 
                : "bg-purple-600"
            }`}>
              Featured Story
            </div>
            <motion.h1 
              className={`text-4xl md:text-5xl font-bold mb-4 leading-tight ${
                theme === 'dark' 
                  ? "text-white" 
                  : "text-gray-900"
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {featuredBlog.title}
            </motion.h1>
            <motion.p 
              className={`text-lg mb-6 max-w-2xl ${
                theme === 'dark' 
                  ? "text-gray-300" 
                  : "text-gray-700"
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {featuredBlog.summary || featuredBlog.content?.slice(0, 200) + '...'}
            </motion.p>
            <motion.div 
              className="flex flex-wrap items-center gap-4 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center">
                <div className={`border-2 border-dashed rounded-xl w-10 h-10 ${
                  theme === 'dark' 
                    ? "bg-gray-700 border-gray-600" 
                    : "bg-gray-200 border-gray-300"
                }`} />
                <div className="ml-3">
                  <p className={`font-medium ${
                    theme === 'dark' 
                      ? "text-white" 
                      : "text-gray-900"
                  }`}>
                    {featuredBlog.author?.username || 'Anonymous'}
                  </p>
                  <p className={`text-sm ${
                    theme === 'dark' 
                      ? "text-gray-400" 
                      : "text-gray-600"
                  }`}>
                    {new Date(featuredBlog.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              <div className={`flex items-center text-sm ${
                theme === 'dark' 
                  ? "text-gray-400" 
                  : "text-gray-600"
              }`}>
                <FaEye className="w-4 h-4 mr-1" />
                <span>{featuredBlog.viewsCount || 0} views</span>
              </div>
            </motion.div>
            <motion.button
              onClick={() => {
                handleViewCount(featuredBlog._id);
                navigate(`/blog/${featuredBlog._id}`);
              }}
              className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-lg text-white ${
                theme === 'dark' 
                  ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20" 
                  : "bg-purple-600 hover:bg-purple-700 shadow-purple-500/20"
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Read Full Story
            </motion.button>
          </div>
          <motion.div
            className="rounded-xl overflow-hidden shadow-xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            <img
              src={featuredBlog.thumbnailUrl}
              alt={featuredBlog.title}
              className="w-full h-auto rounded-xl transform transition-transform duration-500 hover:scale-105"
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default FeaturedBlogCard;