import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEye, FaHeart } from 'react-icons/fa';

// Define theme colors outside the component for clarity and reusability
const themeColors = {
    light: {
        cardBg: "bg-white",
        cardBorder: "border-gray-200",
        cardHoverBg: "hover:bg-blue-50",
        cardShadow: "shadow-md hover:shadow-lg",
        authorDateText: "text-gray-500",
        authorNameText: "text-gray-700",
        titleText: "text-gray-900",
        titleHoverText: "group-hover:text-indigo-600",
        summaryText: "text-gray-600",
        tagBg: "bg-indigo-500/10",
        tagText: "text-indigo-600",
        statsBorder: "border-gray-200",
        statsText: "text-gray-500",
    },
    dark: {
        cardBg: "bg-gray-800",
        cardBorder: "border-gray-700",
        cardHoverBg: "hover:bg-gray-700",
        cardShadow: "shadow-md shadow-gray-900/20 hover:shadow-lg hover:shadow-gray-900/30",
        authorDateText: "text-gray-400",
        authorNameText: "text-gray-300",
        titleText: "text-white",
        titleHoverText: "group-hover:text-sky-400",
        summaryText: "text-gray-400",
        tagBg: "bg-sky-500/10",
        tagText: "text-sky-400",
        statsBorder: "border-gray-700",
        statsText: "text-gray-400",
    },
};

const BlogCard = ({ blogs, handleLike, handleViewCount, theme }) => {
    const navigate = useNavigate();
    const colors = themeColors[theme];

    // Animation variants for staggered appearance
    const cardVariants = {
        hidden: { opacity: 0, y: 50, scale: 0.95 },
        visible: i => ({
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                delay: i * 0.1 + 0.2, // Staggered delay, plus a slight overall delay
                duration: 0.6,
                ease: [0.2, 0.7, 0.4, 1], // Custom spring-like ease for a more natural feel
            },
        }),
        hover: {
            y: -10, // Lift more on hover
            scale: 1.03, // Slight scale up
            boxShadow: theme === 'dark' ? "0 10px 15px -3px rgba(0,0,0,0.3), 0 4px 6px -2px rgba(0,0,0,0.15)" : "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 20,
            },
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 mb-5">
            {blogs.map((blog, index) => (
                <motion.article
                    key={blog._id}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    custom={index} // Pass index as custom prop for staggered animation
                    onClick={() => {
                        handleViewCount(blog._id);
                        navigate(`/blog/${blog._id}`);
                    }}
                    className={`rounded-2xl ${colors.cardBg} ${colors.cardBorder} border ${colors.cardShadow} cursor-pointer transition-all duration-300 overflow-hidden flex flex-col h-full`}
                >
                    <div className="relative overflow-hidden w-full h-48 sm:h-56">
                        <img
                            src={blog.thumbnailUrl}
                            alt={blog.title}
                            className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                        />
                        {/* Subtle overlay on hover */}
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <span className="text-white text-lg font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">Read More</span>
                        </div>
                    </div>

                    <div className="p-6 md:p-7 flex flex-col flex-grow">
                        <div className="mb-4">
                            <div className={`flex items-center text-xs font-medium mb-3 ${colors.authorDateText}`}>
                                <span className={`font-semibold ${colors.authorNameText}`}>
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
                            <h2 className={`text-xl md:text-2xl font-extrabold mb-3 leading-tight transition-colors ${colors.titleText} ${colors.titleHoverText}`}>
                                {blog.title}
                            </h2>
                        </div>

                        <div className="mb-4 flex-grow">
                            <p className={`leading-relaxed font-light line-clamp-3 ${colors.summaryText}`}>
                                {blog.summary || blog.content?.slice(0, 150) + '...'} {/* Increased slice for better preview */}
                            </p>
                        </div>

                        {blog.tags?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4 mt-auto"> {/* Added mt-auto to push tags/stats to bottom */}
                                {blog.tags.slice(0, 2).map((tag) => (
                                    <span
                                        key={tag}
                                        className={`text-xs px-3 py-1.5 rounded-full font-semibold ${colors.tagBg} ${colors.tagText}`}
                                    >
                                        {tag}
                                    </span>
                                ))}
                                {blog.tags.length > 2 && (
                                    <span className={`text-xs px-3 py-1.5 rounded-full font-semibold ${colors.tagBg} ${colors.tagText}`}>
                                        +{blog.tags.length - 2}
                                    </span>
                                )}
                            </div>
                        )}

                        <div className={`flex items-center justify-between pt-4 ${colors.statsBorder} border-t`}>
                            <div className={`flex items-center space-x-4 text-sm font-medium ${colors.statsText}`}>
                                <span className="flex items-center space-x-1">
                                    <FaEye className="w-4 h-4 text-blue-500" /> {/* Eye icon color */}
                                    <span>{blog.viewsCount || 0}</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                    <FaHeart className="w-4 h-4 text-red-500" /> {/* Heart icon color */}
                                    <span>{blog.likesCount || 0}</span>
                                </span>
                            </div>
                            {/* Optional: Add a "Read Blog" button here for explicit action if desired, but card click is also fine */}
                        </div>
                    </div>
                </motion.article>
            ))}
        </div>
    );
};

export default BlogCard;