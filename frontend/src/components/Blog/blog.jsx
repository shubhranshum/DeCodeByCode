import { motion, AnimatePresence } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FaArrowUp, FaSearch } from 'react-icons/fa';
import { FiEdit2, FiTag } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import BlogCard from './BlogUIElements/blogCard';
import FeaturedBlogCard from './BlogUIElements/featuredBlogCard';

// --- Theme management hook ---
const useTheme = () => {
    const [theme, setTheme] = useState('dark'); // Default to dark

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
        setTheme(initialTheme);
        applyTheme(initialTheme);
    }, []);

    const applyTheme = (themeName) => {
        localStorage.setItem('theme', themeName);
        document.documentElement.classList.toggle('dark', themeName === 'dark');
    };

    const toggleTheme = useCallback(() => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        applyTheme(newTheme);
    }, [theme]);

    return { theme, toggleTheme };
};

// --- Blog data fetching hook ---
const useBlogData = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const isFetching = useRef(false);

    const fetchBlogs = useCallback(async () => {
        if (isFetching.current) return;
        
        try {
            isFetching.current = true;
            setLoading(blogs.length === 0); 
            
            const response = await fetch(`http://localhost:3000/blogs?page=${page}&limit=6`, {
                method: "GET",
                credentials: "include",
            });

            if (!response.ok) throw new Error('Failed to fetch blogs');
            
            const data = await response.json();
            setHasMore(data.length === 6); 
            
            if (data.length > 0) {
                setBlogs(prev => {
                    const seen = new Set(prev.map(b => b._id));
                    const uniqueNew = data.filter(b => !seen.has(b._id));
                    return [...prev, ...uniqueNew];
                });
            } else if (page === 1) {
                setBlogs([]); 
            }
            
        } catch (err) {
            console.error(err);
            setError('Failed to load content. Please try again later.');
            setHasMore(false);
        } finally {
            setLoading(false);
            isFetching.current = false;
        }
    }, [page, blogs.length]); 

    useEffect(() => {
        fetchBlogs();
    }, [fetchBlogs]);

    return { blogs, loading, error, page, hasMore, setPage };
};

// --- Scroll management hook ---
const useScroll = (setPage, hasMore, loading) => {
    const [showScrollTop, setShowScrollTop] = useState(false);

    const handleScroll = useCallback(() => {
        const currentScrollY = window.scrollY;
        setShowScrollTop(currentScrollY > 300); 
        
        const isNearBottom = window.innerHeight + currentScrollY >= 
            document.body.offsetHeight - 500;
        
        if (isNearBottom && hasMore && !loading) {
            setPage(prev => prev + 1);
        }
    }, [setPage, hasMore, loading]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll]);

    const scrollToTop = useCallback(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return { showScrollTop, scrollToTop };
};

// --- Blog interaction handlers ---
const useBlogInteractions = () => {
    const navigate = useNavigate();

    const handleCreateBlog = useCallback(() => {
        navigate('/create-blog');
    }, [navigate]);

    const handleLike = useCallback(async (id, e) => {
        e.stopPropagation(); 
        try {
            const res = await fetch(`http://localhost:3000/blog/${id}/like`, {
                method: 'POST',
                credentials: 'include'
            });
            if (!res.ok) {
                const errorData = await res.json();
                console.error('Failed to like blog:', errorData.message);
                return null;
            }
            return await res.json();
        } catch (err) {
            console.error('Network error liking blog:', err);
            return null;
        }
    }, []);

    const handleViewCount = useCallback(async (id) => {
        try {
            await fetch(`http://localhost:3000/blog/${id}/view`, {
                method: 'POST',
                credentials: 'include'
            });
        } catch (err) {
            console.error('Failed to count view', err);
        }
    }, []);

    return { handleCreateBlog, handleLike, handleViewCount };
};

// --- Blog filtering logic ---
const useBlogFilters = (blogs, search, selectedTag) => {
    const filteredBlogs = useMemo(() => {
        return blogs.filter(blog => {
            const matchesSearch = blog.title.toLowerCase().includes(search.toLowerCase()) ||
                                  (blog.summary?.toLowerCase() || '').includes(search.toLowerCase()) || 
                                  (blog.content?.toLowerCase() || '').includes(search.toLowerCase()); 
            const matchesTag = selectedTag ? (blog.tags || []).includes(selectedTag) : true;
            const isPublished = blog.status !== 'Draft'; 
            return matchesSearch && matchesTag && isPublished;
        });
    }, [blogs, search, selectedTag]);

    const allTags = useMemo(() => {
        const tags = new Set();
        blogs.forEach(blog => {
            (blog.tags || []).forEach(tag => tags.add(tag));
        });
        return Array.from(tags).sort(); 
    }, [blogs]);

    const featuredBlog = useMemo(() => {
        const publishedBlogs = blogs.filter(blog => blog.status !== 'Draft');
        const featured = publishedBlogs.filter(blog => blog.isFeatured);
        if (featured.length === 0) return null;
        
        return featured.sort((a, b) => {
            if (b.viewsCount !== a.viewsCount) return b.viewsCount - a.viewsCount;
            if (b.likesCount !== a.likesCount) return b.likesCount - a.likesCount;
            return new Date(b.createdAt) - new Date(a.createdAt);
        })[0];
    }, [blogs]); 

    return { filteredBlogs, allTags, featuredBlog };
};

// --- THEME COLOR DEFINITIONS for Blog Component ---
const blogThemeColors = {
    light: {
        backgroundPrimary: "bg-gradient-to-br from-white via-indigo-50 to-white",
        textPrimary: "text-gray-900",
        textSecondary: "text-gray-600",
        headingAccent: "text-indigo-600",
        buttonPrimaryBg: "bg-indigo-600",
        buttonPrimaryHover: "hover:bg-indigo-700",
        buttonPrimaryShadow: "shadow-indigo-500/20",
        buttonPrimaryText: "text-white",
        searchBg: "bg-white",
        searchBorder: "border-gray-300",
        searchText: "text-gray-900",
        searchPlaceholder: "placeholder-gray-400",
        searchFocusRing: "focus:ring-indigo-500",
        searchIcon: "text-gray-500",
        tagButtonActiveBg: "bg-indigo-600",
        tagButtonActiveText: "text-white",
        tagButtonInactiveBg: "bg-gray-100",
        tagButtonInactiveHover: "hover:bg-indigo-50",
        tagButtonInactiveText: "text-gray-700",
        errorBg: "bg-red-100",
        errorBorder: "border-red-200",
        errorText: "text-red-700",
        errorIconBg: "bg-red-500/10",
        errorIcon: "text-red-500",
        errorHeading: "text-gray-900",
        skeletonBg: "bg-gray-100",
        skeletonInnerBg: "bg-gray-300",
        noResultsIconBg: "bg-indigo-500/10",
        noResultsIcon: "text-indigo-500",
        noResultsText: "text-gray-900",
        noResultsSubtext: "text-gray-600",
        endOfContentBorder: "border-gray-200",
        endOfContentText: "text-gray-500",
        endOfContentSubtext: "text-gray-400",
        endOfContentLink: "text-indigo-600 hover:text-indigo-700",
        scrollTopBg: "#8b5cf6", 
    },
    dark: {
        backgroundPrimary: "bg-gradient-to-br from-gray-950 via-slate-900 to-gray-900",
        textPrimary: "text-gray-50",
        textSecondary: "text-gray-400",
        headingAccent: "text-sky-400",
        buttonPrimaryBg: "bg-sky-600",
        buttonPrimaryHover: "hover:bg-sky-700",
        buttonPrimaryShadow: "shadow-sky-500/20",
        buttonPrimaryText: "text-white",
        searchBg: "bg-gray-800",
        searchBorder: "border-gray-700",
        searchText: "text-white",
        searchPlaceholder: "placeholder-gray-500",
        searchFocusRing: "focus:ring-sky-500",
        searchIcon: "text-gray-400",
        tagButtonActiveBg: "bg-sky-600",
        tagButtonActiveText: "text-white",
        tagButtonInactiveBg: "bg-gray-800",
        tagButtonInactiveHover: "hover:bg-sky-500/20",
        tagButtonInactiveText: "text-gray-300",
        errorBg: "bg-red-900/10",
        errorBorder: "border-red-900/30",
        errorText: "text-red-300",
        errorIconBg: "bg-red-500/20",
        errorIcon: "text-red-400",
        errorHeading: "text-white",
        skeletonBg: "bg-gray-800",
        skeletonInnerBg: "bg-gray-700",
        noResultsIconBg: "bg-sky-500/10",
        noResultsIcon: "text-sky-500",
        noResultsText: "text-white",
        noResultsSubtext: "text-gray-400",
        endOfContentBorder: "border-gray-700",
        endOfContentText: "text-gray-500",
        endOfContentSubtext: "text-gray-600",
        endOfContentLink: "text-sky-400 hover:text-sky-300",
        scrollTopBg: "#0ea5e9", 
    },
};

// ==============
// UI COMPONENTS
// ==============

const BlogHeader = ({ handleCreateBlog, theme }) => {
    const colors = blogThemeColors[theme];
    return (
        <motion.div 
            className="flex flex-col md:flex-row md:justify-between md:items-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            <div className="mb-8 md:mb-0">
                <motion.h1 
                    className={`text-4xl md:text-5xl font-extrabold mb-3 leading-tight ${colors.textPrimary}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                >
                    Stories & <span className={colors.headingAccent}>Insights</span>
                </motion.h1>
                <motion.p 
                    className={`text-lg md:text-xl font-light max-w-2xl ${colors.textSecondary}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                >
                    Discover thoughtful articles, creative perspectives, and valuable knowledge from our community.
                </motion.p>
            </div>
            <motion.button
                onClick={handleCreateBlog}
                className={`px-8 py-4 rounded-xl font-semibold text-lg transition-colors duration-200 shadow-xl flex items-center justify-center gap-3 ${colors.buttonPrimaryBg} ${colors.buttonPrimaryHover} ${colors.buttonPrimaryText} ${colors.buttonPrimaryShadow}`}
                whileHover={{ scale: 1.05, boxShadow: "0 15px 30px rgba(0,0,0,0.2)" }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
            >
                <FiEdit2 className="w-6 h-6" />
                Write a Story
            </motion.button>
        </motion.div>
    );
};

const SearchFilter = ({ search, setSearch, selectedTag, setSelectedTag, allTags, theme }) => {
    const colors = blogThemeColors[theme];
    return (
        <motion.div 
            className="flex flex-col md:flex-row gap-6 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
        >
            <div className="flex-1 relative">
                <FaSearch className={`w-5 h-5 absolute left-5 top-1/2 transform -translate-y-1/2 ${colors.searchIcon}`} />
                <motion.input
                    type="text"
                    placeholder="Search articles by title, content, or author..."
                    className={`w-full pl-14 pr-6 py-4 border rounded-xl focus:ring-2 focus:border-transparent font-light transition-all duration-200 ${colors.searchBg} ${colors.searchBorder} ${colors.searchText} ${colors.searchPlaceholder} ${colors.searchFocusRing}`}
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    whileFocus={{ scale: 1.01 }}
                />
            </div>
            <div className="md:w-64">
                <div className="relative">
                    <FiTag className={`w-5 h-5 absolute left-5 top-1/2 transform -translate-y-1/2 ${colors.searchIcon}`} />
                    <select
                        className={`w-full pl-14 pr-6 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent font-light appearance-none transition-all duration-200 ${colors.searchBg} ${colors.searchBorder} ${colors.searchText} ${colors.searchFocusRing}`}
                        value={selectedTag}
                        onChange={e => setSelectedTag(e.target.value)}
                    >
                        <option value="">All topics</option>
                        {allTags.map(tag => (
                            <option key={tag} value={tag}>{tag}</option>
                        ))}
                    </select>
                </div>
            </div>
        </motion.div>
    );
};

const TagCloud = ({ allTags, selectedTag, setSelectedTag, theme }) => {
    const colors = blogThemeColors[theme];
    return (
        <motion.div 
            className="flex flex-wrap gap-3 mb-16 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
        >
            <motion.button 
                onClick={() => setSelectedTag('')}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-md ${
                    selectedTag === '' 
                        ? `${colors.tagButtonActiveBg} ${colors.tagButtonActiveText}`
                        : `${colors.tagButtonInactiveBg} ${colors.tagButtonInactiveText} ${colors.tagButtonInactiveHover}`
                }`}
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.95 }}
            >
                All Topics
            </motion.button>
            {allTags.slice(0, 10).map((tag, index) => ( 
                <motion.button 
                    key={tag} 
                    onClick={() => setSelectedTag(tag)}
                    className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-sm ${
                        selectedTag === tag 
                            ? `${colors.tagButtonActiveBg} ${colors.tagButtonActiveText}`
                            : `${colors.tagButtonInactiveBg} ${colors.tagButtonInactiveText} ${colors.tagButtonInactiveHover}`
                    }`}
                    whileHover={{ scale: 1.07 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                    {tag}
                </motion.button>
            ))}
        </motion.div>
    );
};

const LoadingSkeleton = ({ theme }) => {
    const colors = blogThemeColors[theme];
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 mb-12">
            {[1, 2, 3, 4, 5, 6].map((item) => ( 
                <motion.div
                    key={item}
                    className={`rounded-2xl shadow-sm border ${colors.skeletonBg} ${colors.searchBorder} overflow-hidden flex flex-col h-full`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: item * 0.08, duration: 0.4 }}
                >
                    <div className="animate-pulse flex flex-col h-full"> {/* Ensure inner content also stretches */}
                        <div className={`${colors.skeletonInnerBg} h-48 w-full`}></div>
                        <div className="p-6 flex-grow flex flex-col justify-between"> {/* Added flex-grow and flex-col for inner content */}
                            <div>
                                <div className={`${colors.skeletonInnerBg} rounded w-3/4 mb-4 h-5`}></div>
                                <div className={`${colors.skeletonInnerBg} rounded w-full mb-2 h-3`}></div>
                                <div className={`${colors.skeletonInnerBg} rounded w-5/6 mb-4 h-3`}></div>
                            </div>
                            <div className="flex gap-2 mt-4">
                                {[1, 2].map(i => (
                                    <div key={i} className={`h-7 ${colors.skeletonInnerBg} rounded-full w-20`}></div>
                                ))}
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-dashed border-gray-600/30 mt-4"> {/* Adjusted margin-top */}
                                <div className={`h-4 ${colors.skeletonInnerBg} rounded w-24`}></div>
                                <div className={`h-10 ${colors.skeletonInnerBg} rounded-lg w-28`}></div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

const ErrorState = ({ error, theme }) => {
    const colors = blogThemeColors[theme];
    return (
        <motion.div 
            className={`px-8 py-6 rounded-xl mb-10 flex items-start gap-4 ${colors.errorBg} ${colors.errorBorder} border`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
        >
            <div className={`p-3 rounded-full ${colors.errorIconBg}`}>
                <svg className={`w-7 h-7 ${colors.errorIcon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <div>
                <h3 className={`text-xl font-semibold ${colors.errorHeading}`}>Oops! Something went wrong.</h3>
                <p className={`mt-1 text-base ${colors.errorText}`}>{error}</p>
                <p className={`mt-2 text-sm ${colors.errorText}`}>Please refresh the page or try again later.</p>
            </div>
        </motion.div>
    );
};

const NoResultsState = ({ setSearch, setSelectedTag, theme }) => {
    const colors = blogThemeColors[theme];
    return (
        <motion.div 
            className="text-center py-20 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
        >
            <motion.div 
                className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 ${colors.noResultsIconBg}`}
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
                <svg className={`w-12 h-12 ${colors.noResultsIcon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </motion.div>
            <h3 className={`text-2xl font-semibold mb-3 ${colors.noResultsText}`}>No articles found</h3>
            <p className={`mb-8 max-w-lg mx-auto text-lg ${colors.noResultsSubtext}`}>
                It seems like your search or filter criteria didn't match any stories. Try adjusting them!
            </p>
            <motion.button
                onClick={() => {
                    setSearch('');
                    setSelectedTag('');
                }}
                className={`px-8 py-4 rounded-xl font-semibold text-lg transition-colors duration-200 shadow-xl ${colors.buttonPrimaryBg} ${colors.buttonPrimaryHover} ${colors.buttonPrimaryText} ${colors.buttonPrimaryShadow}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                Clear Filters
            </motion.button>
        </motion.div>
    );
};

const EndOfContent = ({ scrollToTop, theme }) => {
    const colors = blogThemeColors[theme];
    return (
        <motion.div 
            className={`text-center py-16 border-t ${colors.endOfContentBorder} mt-12`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <motion.div 
                className={`font-light mb-3 text-lg ${colors.endOfContentSubtext}`}
                animate={{ y: [0, -8, 0] }} 
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            >
                You've reached the end of the journey!
            </motion.div>
            <p className={`text-base mb-6 ${colors.endOfContentText}`}>
                No more articles to load at this time.
            </p>
            <motion.button 
                onClick={scrollToTop}
                className={`font-semibold text-lg flex items-center justify-center gap-3 mx-auto ${colors.endOfContentLink}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <FaArrowUp className="w-5 h-5" />
                Back to Top
            </motion.button>
        </motion.div>
    );
};

// ================
// MAIN COMPONENT
// ================

const Blog = () => {
    const { theme } = useTheme(); 
    const [search, setSearch] = useState('');
    const [selectedTag, setSelectedTag] = useState('');
    
    const { blogs, loading, error, page, hasMore, setPage } = useBlogData();
    const { showScrollTop, scrollToTop } = useScroll(setPage, hasMore, loading);
    const { handleCreateBlog, handleLike, handleViewCount } = useBlogInteractions();
    const { filteredBlogs, allTags, featuredBlog } = useBlogFilters(blogs, search, selectedTag);

    const colors = blogThemeColors[theme];

    return (
        // Adjusted padding-top to account for fixed navbar height
        <div className={`min-h-screen pt-16 ${colors.textPrimary} ${colors.backgroundPrimary} font-sans`}> 
            {/* Floating Back to Top Button */}
            <AnimatePresence>
                {showScrollTop && (
                    <motion.button
                        onClick={scrollToTop}
                        className="fixed bottom-8 right-8 z-50 p-4 rounded-full shadow-xl transition-colors text-white"
                        style={{ backgroundColor: colors.scrollTopBg }}
                        whileHover={{ scale: 1.1, boxShadow: "0 8px 25px rgba(0,0,0,0.3)" }}
                        whileTap={{ scale: 0.9 }}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        aria-label="Scroll to top"
                    >
                        <FaArrowUp className="w-6 h-6" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Hero Section (Featured Blog) */}
            <AnimatePresence>
                {featuredBlog && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <FeaturedBlogCard 
                            featuredBlog={featuredBlog} 
                            handleViewCount={handleViewCount} 
                            theme={theme}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-7xl mx-auto px-6 py-16"> 
                <BlogHeader 
                    handleCreateBlog={handleCreateBlog} 
                    theme={theme}
                />
                
                <SearchFilter 
                    search={search}
                    setSearch={setSearch}
                    selectedTag={selectedTag}
                    setSelectedTag={setSelectedTag}
                    allTags={allTags}
                    theme={theme}
                />
                
                <TagCloud 
                    allTags={allTags}
                    selectedTag={selectedTag}
                    setSelectedTag={setSelectedTag}
                    theme={theme}
                />

                {/* Error State */}
                {error && <ErrorState error={error} theme={theme} />}

                {/* Loading State for initial fetch or subsequent pages */}
                {loading && blogs.length === 0 && <LoadingSkeleton theme={theme} />}

                {/* Blog Cards Grid */}
                <AnimatePresence>
                    {filteredBlogs.length > 0 && (
                        <motion.div
                            // Removed top-level grid and moved to BlogCard itself for consistency
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ staggerChildren: 0.05, delayChildren: 0.2 }}
                        >
                            <BlogCard 
                                blogs={filteredBlogs} 
                                handleLike={handleLike} 
                                handleViewCount={handleViewCount} 
                                theme={theme}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* End of Content or No Results Message */}
                {!loading && filteredBlogs.length === 0 && !error && (
                    <NoResultsState 
                        setSearch={setSearch} 
                        setSelectedTag={setSelectedTag} 
                        theme={theme}
                    />
                )}

                {/* Infinite Scroll Loader / End of Content */}
                {loading && page > 1 && (
                    <div className="text-center py-8">
                        <motion.div 
                            className={`w-10 h-10 border-4 rounded-full inline-block animate-spin ${theme === 'dark' ? 'border-sky-500 border-t-transparent' : 'border-indigo-600 border-t-transparent'}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        ></motion.div>
                        <p className={`mt-4 text-sm ${colors.textSecondary}`}>Loading more articles...</p>
                    </div>
                )}
                
                {!hasMore && filteredBlogs.length > 0 && !loading && (
                    <EndOfContent scrollToTop={scrollToTop} theme={theme} />
                )}
            </div>
        </div>
    );
};

export default Blog;