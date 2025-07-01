import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar, FaHeart, FaEye, FaSearch, FaArrowUp, FaSun, FaMoon } from 'react-icons/fa';
import { FiEdit2, FiTag } from 'react-icons/fi';
const FeaturedBlogCard = ({ featuredBlog, handleViewCount }) => {
    const navigate = useNavigate();

    return(
            <div className="bg-gradient-to-r from-[#1e293b] to-[#0f172a] dark:from-blue-100 dark:to-blue-200 py-16 px-4 border-b border-white/10 dark:border-gray-300">
              <div className="max-w-6xl mx-auto">
                <motion.div 
                  className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <div>
                    <div className="inline-block bg-orange-500 dark:bg-blue-500 text-white text-xs px-3 py-1 rounded-full mb-4">
                      Featured Story
                    </div>
                    <motion.h1 
                      className="text-4xl md:text-5xl font-bold mb-4 leading-tight text-white dark:text-gray-900"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {featuredBlog.title}
                    </motion.h1>
                    <motion.p 
                      className="text-gray-300 dark:text-gray-700 text-lg mb-6 max-w-2xl"
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
                        <div className="bg-gray-200 dark:bg-gray-400 border-2 border-dashed rounded-xl w-10 h-10" />
                        <div className="ml-3">
                          <p className="font-medium text-white dark:text-gray-900">{featuredBlog.author?.username || 'Anonymous'}</p>
                          <p className="text-sm text-gray-400 dark:text-gray-600">
                            {new Date(featuredBlog.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-gray-400 dark:text-gray-600">
                        <FaEye className="w-4 h-4 mr-1" />
                        <span>{featuredBlog.viewsCount || 0} views</span>
                      </div>
                    </motion.div>
                    <motion.button
                      onClick={() => {
                        handleViewCount(featuredBlog._id);
                        navigate(`/blog/${featuredBlog._id}`);
                      }}
                      className="bg-orange-500 dark:bg-blue-500 hover:bg-orange-600 dark:hover:bg-blue-600 px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-lg shadow-orange-500/20 dark:shadow-blue-500/20 text-white"
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
          )
}
export default FeaturedBlogCard