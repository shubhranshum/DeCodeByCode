import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiEye, FiHeart, FiFileText } from 'react-icons/fi';

// --- RETRO THEME DEFINITIONS ---
// Consistent with the main Profile Page
const retroThemeColors = {
    textPrimary: "text-stone-800",
    textSecondary: "text-stone-500",
    textAccent: "text-teal-600",
    panelBorder: "border-stone-800",
    buttonPrimaryBg: "bg-teal-400 hover:bg-teal-500",
    buttonText: "text-stone-800",
    accentBg: "bg-amber-100",
};

// --- Reusable UI Components ---
const Button = ({ children, onClick, className = '', as: Component = 'button' }) => {
    return (
        <Component onClick={onClick} className={`w-full px-5 py-2.5 text-base border-2 ${retroThemeColors.panelBorder} ${retroThemeColors.buttonText} shadow-chunky transition-all hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] flex items-center justify-center gap-2 ${retroThemeColors.buttonPrimaryBg} ${className}`}>
            {children}
        </Component>
    );
};

const RetroCard = ({ children, className = '' }) => (
    <div className={`border-4 ${retroThemeColors.panelBorder} bg-white shadow-chunky ${className}`}>
        {children}
    </div>
);

// --- Blog Card Sub-component ---
const BlogCard = ({ blog }) => (
    <motion.div
        variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
        }}
        whileHover={{ y: -5 }}
        className={`border-2 ${retroThemeColors.panelBorder} bg-stone-50 p-4 flex flex-col h-full transition-colors hover:bg-amber-100`}
    >
        <div className="flex-grow">
            <p className={`text-sm font-bold ${retroThemeColors.textAccent}`}>{blog.tags?.[0] || 'General'}</p>
            <h3 className={`text-xl font-bold mt-1 ${retroThemeColors.textPrimary}`}>{blog.title}</h3>
            <p className={`text-base mt-2 line-clamp-3 ${retroThemeColors.textSecondary}`}>
                {blog.summary || 'No summary available.'}
            </p>
        </div>
        <div className="mt-4 pt-3 border-t-2 border-dashed border-stone-300">
            <div className="flex justify-between items-center text-sm text-stone-600 mb-3">
                <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><FiEye /> {blog.viewedBy?.length || 0}</span>
                    <span className="flex items-center gap-1"><FiHeart /> {blog.likedBy?.length || 0}</span>
                </div>
            </div>
            <Link to={`/blog/${blog._id}`} className={`block w-full text-center px-4 py-2 text-base border-2 ${retroThemeColors.panelBorder} ${retroThemeColors.buttonSecondaryBg} font-bold`}>
                Read Post
            </Link>
        </div>
    </motion.div>
);

// ================
// MAIN COMPONENT
// ================
const BlogsSection = ({ blogs }) => {
    // Sort blogs by date and get the 4 most recent
    const recentBlogs = [...(blogs || [])]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 4);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Recent Blogs</h2>
                <Link to="/profile/userblogs" className={`text-lg font-bold ${retroThemeColors.textAccent} hover:underline`}>
                    View all &rarr;
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recentBlogs.length > 0 ? (
                    recentBlogs.map((blog) => (
                        <BlogCard key={blog._id} blog={blog} />
                    ))
                ) : (
                    <div className={`md:col-span-2 text-center p-12 border-2 border-dashed ${retroThemeColors.panelBorder} ${retroThemeColors.accentBg}`}>
                        <FiFileText className={`mx-auto h-16 w-16 mb-4 ${retroThemeColors.textSecondary}`} />
                        <h3 className="text-2xl font-bold">Your Story Starts Here</h3>
                        <p className={`text-lg mt-2 mb-6 ${retroThemeColors.textSecondary}`}>
                            Share your unique perspective with the community.
                        </p>
                        <div className="flex justify-center">
                             <Button as={Link} to="/create-blog" className="w-auto">
                                Create Your First Post
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogsSection;
