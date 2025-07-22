// FeaturedBlogCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEye, FaArrowRight } from 'react-icons/fa'; // Added FaArrowRight for the button

// Define theme colors for the featured card
const featuredThemeColors = {
    light: {
        background: "bg-gradient-to-br from-indigo-50 to-purple-50 via-blue-50", // Softer, brighter blend
        border: "border-gray-200",
        badgeBg: "bg-indigo-600",
        badgeText: "text-white",
        titleText: "text-gray-900",
        summaryText: "text-gray-700",
        authorNameText: "text-gray-900",
        metaText: "text-gray-600",
        buttonBg: "bg-indigo-600",
        buttonHoverBg: "hover:bg-indigo-700",
        buttonShadow: "shadow-indigo-500/30",
        imageOverlay: "via-indigo-500/10", // Subtle overlay for light theme image
        authorAvatarRing: "ring-indigo-300",
        authorAvatarFallbackBg: "bg-indigo-100",
        authorAvatarFallbackText: "text-indigo-700",
    },
    dark: {
        background: "bg-gradient-to-br from-gray-900 via-slate-900 to-zinc-900", // Deeper, more sophisticated dark gradient
        border: "border-gray-800",
        badgeBg: "bg-sky-600",
        badgeText: "text-white",
        titleText: "text-white",
        summaryText: "text-gray-300",
        authorNameText: "text-white",
        metaText: "text-gray-400",
        buttonBg: "bg-sky-600",
        buttonHoverBg: "hover:bg-sky-700",
        buttonShadow: "shadow-sky-500/20",
        imageOverlay: "via-sky-500/10", // Subtle overlay for dark theme image
        authorAvatarRing: "ring-sky-500",
        authorAvatarFallbackBg: "bg-slate-700",
        authorAvatarFallbackText: "text-slate-300",
    }
};

const FeaturedBlogCard = ({ featuredBlog, handleViewCount, theme }) => {
    const navigate = useNavigate();
    const colors = featuredThemeColors[theme];

    // Animation variants for more fluid entry
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15, // Stagger children for sequential reveal
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 10,
            },
        },
    };

    return (
        <div className={`py-16 px-4 md:px-6 lg:px-8 ${colors.background} border-b ${colors.border}`}>
            <div className="max-w-7xl mx-auto relative z-10"> {/* Added relative z-10 for any absolute elements */}
                <motion.div 
                    className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Left side: Content */}
                    <div className="order-2 lg:order-1">
                        <motion.div variants={itemVariants} className={`inline-block text-xs md:text-sm px-4 py-1.5 rounded-full font-semibold mb-4 ${colors.badgeBg} ${colors.badgeText}`}>
                            Featured Story
                        </motion.div>
                        <motion.h1 
                            className={`text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight ${colors.titleText}`}
                            variants={itemVariants}
                        >
                            {featuredBlog.title}
                        </motion.h1>
                        <motion.p 
                            className={`text-lg md:text-xl mb-6 max-w-2xl font-light ${colors.summaryText}`}
                            variants={itemVariants}
                        >
                            {featuredBlog.summary || featuredBlog.content?.slice(0, 200) + '...'}
                        </motion.p>
                        <motion.div 
                            className="flex flex-wrap items-center gap-6 mb-8"
                            variants={itemVariants}
                        >
                            {/* Author section */}
                            <div className="flex items-center">
                                <div className={`relative w-12 h-12 rounded-full overflow-hidden ring-2 ${colors.authorAvatarRing}`}>
                                    {featuredBlog.author?.profilePicture ? (
                                        <img 
                                            src={featuredBlog.author.profilePicture} 
                                            alt={featuredBlog.author.username || 'Anonymous'} 
                                            className="w-full h-full object-cover" 
                                        />
                                    ) : (
                                        <div className={`w-full h-full flex items-center justify-center ${colors.authorAvatarFallbackBg}`}>
                                            <span className={`font-semibold text-lg ${colors.authorAvatarFallbackText}`}>
                                                {featuredBlog.author?.username?.charAt(0).toUpperCase() || 'A'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="ml-4">
                                    <p className={`font-semibold text-lg ${colors.authorNameText}`}>
                                        {featuredBlog.author?.username || 'Anonymous Writer'}
                                    </p>
                                    <p className={`text-sm ${colors.metaText}`}>
                                        {new Date(featuredBlog.createdAt).toLocaleDateString('en-US', {
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                            {/* Views count */}
                            <div className={`flex items-center text-base ${colors.metaText}`}>
                                <FaEye className="w-5 h-5 mr-2" />
                                <span>{featuredBlog.viewsCount || 0} views</span>
                            </div>
                        </motion.div>
                        <motion.button
                            onClick={() => {
                                handleViewCount(featuredBlog._id);
                                navigate(`/blog/${featuredBlog._id}`);
                            }}
                            className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-xl ${colors.buttonBg} ${colors.buttonHoverBg} text-white ${colors.buttonShadow}`}
                            variants={itemVariants}
                            whileHover={{ scale: 1.05, boxShadow: "0 15px 30px rgba(0,0,0,0.3)" }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Read Full Story <FaArrowRight className="inline-block ml-3 -mt-0.5" />
                        </motion.button>
                    </div>

                    {/* Right side: Image */}
                    <motion.div
                        className="order-1 lg:order-2 rounded-2xl overflow-hidden shadow-2xl relative group"
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }} // Subtle scale for the entire image container
                        transition={{ type: "spring", stiffness: 100, damping: 10 }}
                    >
                        <img
                            src={featuredBlog.thumbnailUrl}
                            alt={featuredBlog.title}
                            className="w-full h-full object-cover aspect-[16/10] transform transition-transform duration-500 group-hover:scale-110 rounded-2xl"
                        />
                        {/* Gradient overlay for visual appeal */}
                        <div className={`absolute inset-0 bg-gradient-to-tr from-transparent ${colors.imageOverlay} to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl`}></div>
                        {/* Optional subtle light/dark flares */}
                        {theme === 'dark' && (
                            <>
                                <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-500 opacity-20 blur-2xl rounded-full group-hover:scale-150 transition-transform duration-500 pointer-events-none"></div>
                                <div className="absolute -bottom-10 -right-10 w-50 h-50 bg-sky-500 opacity-20 blur-2xl rounded-full group-hover:scale-150 transition-transform duration-500 pointer-events-none"></div>
                            </>
                        )}
                         {theme === 'light' && (
                            <>
                                <div className="absolute -top-10 -left-10 w-40 h-40 bg-pink-300 opacity-20 blur-2xl rounded-full group-hover:scale-150 transition-transform duration-500 pointer-events-none"></div>
                                <div className="absolute -bottom-10 -right-10 w-50 h-50 bg-blue-300 opacity-20 blur-2xl rounded-full group-hover:scale-150 transition-transform duration-500 pointer-events-none"></div>
                            </>
                        )}
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default FeaturedBlogCard;