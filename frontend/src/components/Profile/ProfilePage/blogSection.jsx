import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiEye, FiHeart, FiFileText } from 'react-icons/fi'; // Import icons

const BlogsSection = ({ blogs, theme, themeStyles }) => {
  // Ensure themeStyles is available, providing a robust default if not passed
  // In a real application, consider using React Context for global theme access
  const defaultThemes = {
    light: {
      background: 'bg-gradient-to-br from-teal-50 to-cyan-50', // Updated: More pronounced green-blue gradient
      card: 'bg-white',
      border: 'border-gray-200',
      text: 'text-gray-800',
      secondaryText: 'text-gray-500',
      primaryAccent: 'text-purple-700',
      secondaryAccent: 'text-teal-600', // Green-blue accent
      primaryAccentBg: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700',
      secondaryAccentBg: 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600', // Green-blue button
      secondaryAccentText: 'text-white', // Text for green-blue buttons
      sectionTitle: 'text-teal-700', // Updated: Section title in teal
      subCardBg: 'bg-teal-50', // Lighter background for nested cards with teal tint
      shadow: 'shadow-xl',
      linkHoverText: 'hover:text-teal-700', // Link hover text
      tagBg: 'bg-teal-100', // Updated: Teal background for tags
      tagText: 'text-teal-800', // Updated: Teal text for tags
    },
    dark: {
      background: 'bg-gradient-to-br from-gray-900 to-gray-800', // Main background is still neutral, cards get the color
      card: 'bg-gray-800', // Cards remain neutral dark base
      border: 'border-gray-700',
      text: 'text-gray-100',
      secondaryText: 'text-gray-400',
      primaryAccent: 'text-indigo-400',
      secondaryAccent: 'text-cyan-400', // Green-blue accent
      primaryAccentBg: 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500',
      secondaryAccentBg: 'bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500', // Green-blue button
      secondaryAccentText: 'text-white', // Text for green-blue buttons
      sectionTitle: 'text-cyan-400', // Updated: Section title in cyan
      subCardBg: 'bg-gray-750', // Still a darker grey for nested cards
      shadow: 'shadow-xl',
      linkHoverText: 'hover:text-cyan-300', // Link hover text
      tagBg: 'bg-gray-700', // Tags are slightly more neutral in dark mode for contrast
      tagText: 'text-gray-300',
    }
  };
  const currentThemeStyles = themeStyles || defaultThemes[theme];


  // Sort blogs by date and get the 4 most recent
  const recentBlogs = [...blogs]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
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
    <div className={`rounded-2xl ${currentThemeStyles.card} ${currentThemeStyles.shadow} p-8 mt-8 transition-colors duration-300 border ${currentThemeStyles.border}`}>
      <div className="flex justify-between items-center mb-8">
        <h2 className={`text-3xl font-bold ${currentThemeStyles.sectionTitle}`}>Your Recent Blogs</h2>
        <Link
          to="/profile/userblogs"
          className={`group ${currentThemeStyles.secondaryText} ${currentThemeStyles.linkHoverText} font-semibold flex items-center gap-2 transition-colors`}
        >
          View all blogs
          <motion.svg
            className={`w-6 h-6 ${currentThemeStyles.secondaryText} group-hover:${currentThemeStyles.secondaryAccent}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            animate={{ x: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </motion.svg>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recentBlogs.length > 0 ? (
          recentBlogs.map((blog, index) => (
            <motion.div
              key={blog._id} // Changed from blog.id to blog._id for consistency with backend
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.15 }}
              whileHover={{ y: -8, boxShadow: currentThemeStyles.shadow === 'shadow-xl' ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' : currentThemeStyles.shadow, transition: { duration: 0.3 } }}
              className={`border ${currentThemeStyles.border} rounded-xl p-6 transition-all duration-300 ${currentThemeStyles.card} hover:${currentThemeStyles.card} overflow-hidden flex flex-col`}
            >
              <div className="flex flex-col h-full">
                <div className="flex-1">
                  <h3 className={`font-bold text-xl ${currentThemeStyles.secondaryAccent} mb-3 group-hover:${currentThemeStyles.primaryAccent} transition-colors line-clamp-2`}>
                    <Link to={`/blog/${blog._id}`} className="hover:underline">
                      {blog.title}
                    </Link>
                  </h3>
                  <div className={`flex justify-between text-sm ${currentThemeStyles.secondaryText} mb-4`}>
                    <span className="font-medium">
                      {new Date(blog.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <FiEye className="w-4 h-4" />
                        {blog.viewedBy?.length || 0} {/* Use optional chaining */}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiHeart className="w-4 h-4" />
                        {blog.likedBy?.length || 0} {/* Use optional chaining */}
                      </span>
                    </div>
                  </div>
                  <p className={`${currentThemeStyles.secondaryText} text-base mb-4 line-clamp-3 flex-1`}>
                    {blog.summary || 'No summary available.'}
                  </p>
                </div>

                <div className="mt-auto"> {/* Pushes tags and button to the bottom */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {blog.tags?.slice(0, 3).map(tag => ( // Use optional chaining
                      <span
                        key={tag}
                        className={`${currentThemeStyles.tagBg} ${currentThemeStyles.tagText} text-xs px-3 py-1 rounded-full`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Link
                      to={`/blog/${blog._id}`}
                      className={`block w-full text-center ${currentThemeStyles.secondaryAccentBg} ${currentThemeStyles.secondaryAccentText} px-5 py-2.5 rounded-lg font-semibold transition-all duration-300 ${currentThemeStyles.shadow} hover:shadow-xl`}
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
            className={`rounded-2xl ${currentThemeStyles.card} ${currentThemeStyles.shadow} p-12 text-center border ${currentThemeStyles.border} col-span-1 md:col-span-2`} // Spans full width
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className={`${currentThemeStyles.subCardBg} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner`}>
              <FiFileText className={`w-10 h-10 ${currentThemeStyles.secondaryAccent}`} /> {/* Icon with green-blue accent */}
            </div>
            <h3 className={`text-xl font-semibold ${currentThemeStyles.text} mb-3`}>Your Story Starts Here</h3>
            <p className={`${currentThemeStyles.secondaryText} text-base mb-6 max-w-md mx-auto`}>
              Share your unique perspective and experiences with our community.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to="/create-blog"
                className={`inline-block ${currentThemeStyles.secondaryAccentBg} ${currentThemeStyles.secondaryAccentText} px-8 py-3 rounded-lg font-semibold text-base uppercase tracking-wider ${currentThemeStyles.shadow} hover:shadow-xl transition-all duration-300`}
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