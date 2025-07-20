import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const BlogsSection = ({ blogs }) => {
  // Sort blogs by date and get the 4 most recent
  const recentBlogs = [...blogs]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.98
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-gray-900 rounded-2xl shadow-sm p-6 mt-8 transition-colors duration-300">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Latest Insights</h2>
        <Link 
          to="/profile/userblogs" 
          className="group text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium flex items-center gap-1 transition-colors"
        >
          View all blogs
          <motion.svg 
            className="w-5 h-5"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            animate={{ x: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </motion.svg>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recentBlogs.length > 0 ? (
          recentBlogs.map((blog, index) => (
            <motion.div 
              key={blog.id}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 hover:shadow-md transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900"
            >
              <div className="flex flex-col h-full">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 mb-3 group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-colors">
                    <Link to={`/blog/${blog._id}`} className="hover:underline">
                      {blog.title}
                    </Link>
                  </h3>
                  <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400 mb-4">
                    <span className="font-medium">
                      {new Date(blog.createdAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {blog.viewedBy.length}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        {blog.likedBy.length}
                      </span>
                    </div>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-3">
                    {blog.summary}
                  </p>
                </div>
                
                <div className="mt-auto">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {blog.tags.slice(0, 3).map(tag => (
                      <span 
                        key={tag} 
                        className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs px-3 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <motion.div
                    whileHover="hover"
                    whileTap="tap"
                    variants={buttonVariants}
                  >
                    <Link 
                      to={`/blog/${blog._id}`}
                      className="block w-full text-center bg-slate-800 hover:bg-slate-950 dark:bg-blue-300 dark:hover:bg-blue-400 dark:text-slate-900 text-white px-4 py-2.5 rounded-lg font-medium transition-colors duration-300 shadow"
                    >
                      Read Post
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <motion.div 
            className="text-center py-12 col-span-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-slate-100 dark:bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg 
                className="w-10 h-10 text-slate-500 dark:text-slate-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-slate-800 dark:text-slate-200 mb-3">Your Story Starts Here</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
              Share your unique perspective and experiences with our community.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link 
                to="/create-blog" 
                className="inline-block bg-slate-800 hover:bg-slate-950 dark:bg-slate-200 dark:hover:bg-white dark:text-slate-900 text-white px-8 py-3 rounded-lg font-medium text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Create Your First Post
              </Link>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BlogsSection;