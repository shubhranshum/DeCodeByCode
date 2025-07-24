import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowUp, FaHeart, FaRegHeart, FaRegEye, FaSearch } from 'react-icons/fa';
import { FiEdit2, FiTag } from 'react-icons/fi';

// --- Blog data fetching hook (No changes needed) ---
const useBlogData = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const isFetching = useRef(false);

    const fetchBlogs = useCallback(async () => {
        if (isFetching.current || !hasMore) return;
        
        try {
            isFetching.current = true;
            if (page === 1) setLoading(true);
            
            const response = await fetch(`http://localhost:3000/blogs?page=${page}&limit=6`, {
                method: "GET", credentials: "include",
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
            }
            
        } catch (err) {
            console.error(err);
            setError('Failed to load content. Please try again later.');
            setHasMore(false);
        } finally {
            setLoading(false);
            isFetching.current = false;
        }
    }, [page, hasMore]); 

    useEffect(() => {
        fetchBlogs();
    }, [page, fetchBlogs]);

    return { blogs, loading, error, hasMore, setPage };
};


// --- Scroll management hook (No changes needed) ---
const useScroll = (setPage, hasMore, loading) => {
    const [showScrollTop, setShowScrollTop] = useState(false);
    const scrollTimeout = useRef(null);

    const handleScroll = useCallback(() => {
        if (scrollTimeout.current) {
            cancelAnimationFrame(scrollTimeout.current);
        }
        scrollTimeout.current = requestAnimationFrame(() => {
            const currentScrollY = window.scrollY;
            setShowScrollTop(currentScrollY > 300); 
            
            const isNearBottom = window.innerHeight + currentScrollY >= 
                document.body.offsetHeight - 500;
            
            if (isNearBottom && hasMore && !loading) {
                setPage(prev => prev + 1);
            }
        });
    }, [setPage, hasMore, loading]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (scrollTimeout.current) {
                cancelAnimationFrame(scrollTimeout.current);
            }
        };
    }, [handleScroll]);

    const scrollToTop = useCallback(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return { showScrollTop, scrollToTop };
};

// --- Blog interaction handlers (No changes needed) ---
const useBlogInteractions = () => {
    const navigate = useNavigate();

    const handleCreateBlog = useCallback(() => {
        navigate('/create-blog');
    }, [navigate]);

    const handleLike = useCallback(async (id, e) => {
        e.stopPropagation(); 
        try {
            const res = await fetch(`http://localhost:3000/blog/${id}/like`, { method: 'POST', credentials: 'include' });
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
            await fetch(`http://localhost:3000/blog/${id}/view`, { method: 'POST', credentials: 'include' });
        } catch (err) {
            console.error('Failed to count view', err);
        }
    }, []);

    return { handleCreateBlog, handleLike, handleViewCount };
};

// --- Blog filtering logic (No changes needed) ---
const useBlogFilters = (blogs, search, selectedTag) => {
    const { featuredBlog, remainingBlogs } = useMemo(() => {
        const featured = blogs.filter(blog => blog.isFeatured && blog.status !== 'Draft').sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0] || null;
        
        const filtered = blogs.filter(blog => {
            if (featured && blog._id === featured._id) return false; // Exclude featured from main list
            const matchesSearch = blog.title.toLowerCase().includes(search.toLowerCase());
            const matchesTag = selectedTag ? (blog.tags || []).includes(selectedTag) : true;
            return matchesSearch && matchesTag && blog.status !== 'Draft';
        });

        return { featuredBlog: featured, remainingBlogs: filtered };
    }, [blogs, search, selectedTag]);

    const allTags = useMemo(() => {
        const tags = new Set(blogs.flatMap(blog => blog.tags || []));
        return Array.from(tags).sort();
    }, [blogs]);

    return { filteredBlogs: remainingBlogs, allTags, featuredBlog };
};


// --- RETRO THEME DEFINITIONS ---
const retroBlogColors = {
    bgPrimary: "bg-stone-100",
    textPrimary: "text-stone-800",
    textSecondary: "text-stone-500",
    textAccent: "text-purple-600",
    panelBg: "bg-white",
    panelBorder: "border-stone-800",
    buttonPrimaryBg: "bg-purple-400 hover:bg-purple-500",
    buttonSecondaryBg: "bg-stone-200 hover:bg-stone-300",
    buttonText: "text-stone-800",
    errorBg: "bg-rose-100",
    errorText: "text-rose-700",
};


// ==============
// UI COMPONENTS
// ==============
const Button = ({ children, onClick, className = '' }) => (
    <button onClick={onClick} className={`px-6 py-3 text-lg border-2 ${retroBlogColors.panelBorder} shadow-chunky transition-all hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] ${className}`}>
        {children}
    </button>
);

const BlogHeader = ({ handleCreateBlog }) => (
    <div className="text-center mb-16">
        <h1 className={`text-5xl md:text-6xl mb-3 ${retroBlogColors.textPrimary}`}>
            Stories & <span className={retroBlogColors.textAccent}>Insights</span>
        </h1>
        <p className={`text-xl font-light max-w-2xl mx-auto ${retroBlogColors.textSecondary}`}>
            Your daily dose of code, creativity, and community thoughts.
        </p>
        <Button onClick={handleCreateBlog} className={`${retroBlogColors.buttonPrimaryBg} ${retroBlogColors.buttonText} mt-8`}>
            <FiEdit2 className="inline-block w-6 h-6 mr-2" /> Write a Story
        </Button>
    </div>
);

const SearchAndFilter = ({ search, setSearch, allTags, selectedTag, setSelectedTag }) => (
    <div className={`border-4 ${retroBlogColors.panelBorder} shadow-chunky bg-white p-4 md:p-6 mb-12`}>
        <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
                <FaSearch className={`w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 ${retroBlogColors.textSecondary}`} />
                <input type="text" placeholder="Search articles..." className={`w-full pl-12 pr-4 py-3 text-lg border-2 ${retroBlogColors.panelBorder} ${retroBlogColors.panelBg} focus:outline-none`} value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            {allTags.length > 0 && (
                <div className="md:w-64 relative">
                    <FiTag className={`w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 ${retroBlogColors.textSecondary}`} />
                    <select className={`w-full pl-12 pr-4 py-3 text-lg border-2 ${retroBlogColors.panelBorder} ${retroBlogColors.panelBg} focus:outline-none appearance-none`} value={selectedTag} onChange={e => setSelectedTag(e.target.value)}>
                        <option value="">All Topics</option>
                        {allTags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
                    </select>
                </div>
            )}
        </div>
    </div>
);

const LoadingState = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[...Array(4)].map((_, i) => (
            <div key={i} className={`border-4 ${retroBlogColors.panelBorder} bg-white shadow-chunky p-6 animate-pulse`}>
                <div className="h-48 bg-stone-200 mb-4"></div>
                <div className="h-6 w-3/4 bg-stone-200 mb-2"></div>
                <div className="h-4 w-5/6 bg-stone-200"></div>
            </div>
        ))}
    </div>
);

const MessageState = ({ title, message }) => (
    <div className={`text-center py-20 border-4 ${retroBlogColors.panelBorder} ${retroBlogColors.errorBg} shadow-chunky`}>
        <h3 className={`text-3xl mb-3 ${retroBlogColors.errorText}`}>{title}</h3>
        <p className={`max-w-lg mx-auto text-lg ${retroBlogColors.textSecondary}`}>{message}</p>
    </div>
);

const RetroBlogCard = ({ blog, handleLike, handleViewCount }) => {
    const [likes, setLikes] = useState(blog.likesCount);
    const [isLiked, setIsLiked] = useState(blog.isLiked);
    const navigate = useNavigate();

    const onLike = async (e) => {
        const updatedBlog = await handleLike(blog._id, e);
        if (updatedBlog) {
            setLikes(updatedBlog.likesCount);
            setIsLiked(updatedBlog.isLiked);
        }
    };
    
    const onView = () => {
        handleViewCount(blog._id);
        navigate(`/blog/${blog._id}`);
    };

    return (
        <motion.div onClick={onView} className={`flex flex-col border-4 ${retroBlogColors.panelBorder} bg-white shadow-chunky cursor-pointer transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_#27272a]`} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className={`w-full h-48 border-b-4 ${retroBlogColors.panelBorder} overflow-hidden`}>
                <img src={blog.thumbnailUrl} alt={blog.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-6 flex flex-col flex-grow">
                <div className="flex-grow">
                    <p className={`mb-2 text-base font-bold ${retroBlogColors.textAccent}`}>{blog.tags?.[0] || 'General'}</p>
                    <h3 className={`text-2xl mb-2 ${retroBlogColors.textPrimary}`}>{blog.title}</h3>
                </div>
                <div className="flex justify-between items-center pt-4 mt-4 border-t-2 border-dashed border-stone-300">
                    <div className="flex items-center gap-4 text-lg">
                        <span className="flex items-center gap-2"><FaRegEye /> {blog.viewsCount}</span>
                        <button onClick={onLike} className="flex items-center gap-2 z-10">{isLiked ? <FaHeart className="text-rose-500" /> : <FaRegHeart />} {likes}</button>
                    </div>
                    <span className={`text-sm ${retroBlogColors.textSecondary}`}>{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
            </div>
        </motion.div>
    );
};

const RetroFeaturedBlogCard = ({ blog, handleViewCount }) => {
    const navigate = useNavigate();
    const onView = () => {
        handleViewCount(blog._id);
        navigate(`/blog/${blog._id}`);
    };
    
    return (
        <div className="mb-16">
            <motion.div onClick={onView} className={`grid md:grid-cols-2 gap-0 border-4 ${retroBlogColors.panelBorder} bg-amber-100 shadow-chunky cursor-pointer transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_#27272a]`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className={`w-full md:h-full h-64 border-b-4 md:border-b-0 md:border-r-4 ${retroBlogColors.panelBorder} overflow-hidden`}>
                    <img src={blog.thumbnailUrl} alt={blog.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-8 flex flex-col justify-center">
                    <p className={`mb-2 text-lg font-bold ${retroBlogColors.textAccent}`}>✨ FEATURED STORY</p>
                    <h2 className={`text-4xl mb-3 ${retroBlogColors.textPrimary}`}>{blog.title}</h2>
                    <p className={`text-lg font-light mb-4 ${retroBlogColors.textSecondary}`}>{blog.summary}</p>
                    <div className="flex items-center gap-4 text-lg">
                        <span className="flex items-center gap-2"><FaRegEye /> {blog.viewsCount}</span>
                        <span className="flex items-center gap-2"><FaRegHeart /> {blog.likesCount}</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};


// ================
// MAIN COMPONENT
// ================
export default function Blog() {
    const [search, setSearch] = useState('');
    const [selectedTag, setSelectedTag] = useState('');
    
    const { blogs, loading, error, hasMore, setPage } = useBlogData();
    const { showScrollTop, scrollToTop } = useScroll(setPage, hasMore, loading);
    const { handleCreateBlog, handleLike, handleViewCount } = useBlogInteractions();
    const { filteredBlogs, allTags, featuredBlog } = useBlogFilters(blogs, search, selectedTag);

    const colors = retroBlogColors;

    return (
        <div className={`min-h-screen pt-24 ${colors.textPrimary} ${colors.bgPrimary} font-retro`}> 
            <AnimatePresence>
                {showScrollTop && (
                    <motion.button onClick={scrollToTop} className={`fixed bottom-8 right-8 z-50 w-16 h-16 border-2 ${colors.panelBorder} ${colors.buttonPrimaryBg} shadow-chunky`} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} aria-label="Scroll to top">
                        <FaArrowUp className="w-6 h-6 mx-auto text-white" />
                    </motion.button>
                )}
            </AnimatePresence>
            
            <div className="max-w-7xl mx-auto px-6 py-16"> 
                <BlogHeader handleCreateBlog={handleCreateBlog} />
                {featuredBlog && <RetroFeaturedBlogCard blog={featuredBlog} handleViewCount={handleViewCount} />}
                <SearchAndFilter search={search} setSearch={setSearch} allTags={allTags} selectedTag={selectedTag} setSelectedTag={setSelectedTag} />

                {error && <MessageState title="Oops! Something went wrong." message={error} />}
                
                {loading && blogs.length === 0 && <LoadingState />}
                
                {!loading && filteredBlogs.length > 0 && (
                    <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-8" variants={{ show: { transition: { staggerChildren: 0.07 } } }} initial="hidden" animate="show">
                        {filteredBlogs.map(blog => <RetroBlogCard key={blog._id} blog={blog} handleLike={handleLike} handleViewCount={handleViewCount} />)}
                    </motion.div>
                )}

                {!loading && blogs.length > 0 && filteredBlogs.length === 0 && (
                    <MessageState title="No articles found!" message="Your search or filter criteria didn't match any stories." onClear={() => { setSearch(''); setSelectedTag(''); }} />
                )}
                
                {loading && blogs.length > 0 && <div className="text-center text-xl mt-12">LOADING MORE...</div>}
                
                {!hasMore && blogs.length > 0 && (
                    <div className="text-center py-16 border-t-4 border-dashed border-stone-300 mt-12">
                        <p className={`text-xl mb-4 ${colors.textSecondary}`}>You've reached the end!</p>
                        <button onClick={scrollToTop} className={`text-lg ${colors.textAccent}`}>Back to Top</button>
                    </div>
                )}
            </div>
        </div>
    );
};
