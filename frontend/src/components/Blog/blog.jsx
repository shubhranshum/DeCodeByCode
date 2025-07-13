import { motion, AnimatePresence } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FaArrowUp, FaSearch } from 'react-icons/fa';
import { FiEdit2, FiTag } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import BlogCard from './BlogUIElements/blogCard';
import FeaturedBlogCard from './BlogUIElements/featuredBlogCard';

// Theme management hook
const useTheme = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark'); // Default to dark

  useEffect(() => {
    // Get theme from localStorage or use system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    localStorage.setItem('theme', initialTheme);
    document.documentElement.className = initialTheme;
  }, []);

  // Apply theme whenever it changes
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.className = theme;
  }, [theme]);

  return theme;
};

// Blog data fetching hook
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
      setLoading(page === 1);
      
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
      }
      
    } catch (err) {
      console.error(err);
      setError('Failed to load content. Please try again later.');
      setHasMore(false);
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  }, [page]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  return { blogs, loading, error, page, hasMore, setPage };
};

// Scroll management hook
const useScroll = (hasMore, loading) => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const scrollTimer = useRef(null);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    setShowScrollTop(currentScrollY > 300);
    
    // Check if we're near the bottom
    const isNearBottom = window.innerHeight + currentScrollY >= 
      document.body.offsetHeight - 500;
    
    if (isNearBottom && hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  }, [hasMore, loading]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimer.current);
    };
  }, [handleScroll]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return { showScrollTop, scrollToTop };
};

// Blog interaction handlers
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
      if (!res.ok) return;
      return await res.json();
    } catch (err) {
      console.error('Failed to like blog', err);
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

// Blog filtering logic
const useBlogFilters = (blogs, search, selectedTag) => {
  const filteredBlogs = useMemo(() => {
    return blogs.filter(blog => {
      const matchesSearch = blog.title.toLowerCase().includes(search.toLowerCase());
      const matchesTag = selectedTag ? blog.tags.includes(selectedTag) : true;
      const isPublished = blog.status !== 'Draft';
      return matchesSearch && matchesTag && isPublished;
    });
  }, [blogs, search, selectedTag]);

  const allTags = useMemo(() => {
    const tags = new Set();
    blogs.forEach(blog => {
      (blog.tags || []).forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, [blogs]);

  const featuredBlog = useMemo(() => {
    const featured = filteredBlogs.filter(blog => blog.isFeatured);
    if (featured.length === 0) return null;
    
    return featured.sort((a, b) => {
      if (b.viewsCount !== a.viewsCount) return b.viewsCount - a.viewsCount;
      if (b.likesCount !== a.likesCount) return b.likesCount - a.likesCount;
      return new Date(b.createdAt) - new Date(a.createdAt);
    })[0];
  }, [filteredBlogs]);

  return { filteredBlogs, allTags, featuredBlog };
};

// ==============
// UI COMPONENTS
// ==============

const BlogHeader = ({ handleCreateBlog }) => (
  <motion.div 
    className="flex flex-col md:flex-row md:justify-between md:items-center mb-12"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="mb-6 md:mb-0">
      <motion.h1 
        className="text-3xl md:text-4xl font-bold mb-2 text-white dark:text-gray-900"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        Stories & <span className="text-orange-400 dark:text-blue-500">Insights</span>
      </motion.h1>
      <motion.p 
        className="text-gray-400 dark:text-gray-600 font-light max-w-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Discover thoughtful articles and creative perspectives
      </motion.p>
    </div>
    <motion.button
      onClick={handleCreateBlog}
      className="bg-orange-500 dark:bg-blue-500 hover:bg-orange-600 dark:hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-lg shadow-orange-500/20 dark:shadow-blue-500/20 flex items-center justify-center gap-2"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <FiEdit2 className="w-5 h-5" />
      Write a Story
    </motion.button>
  </motion.div>
);

const SearchFilter = ({ search, setSearch, selectedTag, setSelectedTag, allTags }) => (
  <motion.div 
    className="flex flex-col md:flex-row gap-4 mb-12"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.1 }}
  >
    <div className="flex-1 relative">
      <FaSearch className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
      <motion.input
        type="text"
        placeholder="Search articles..."
        className="w-full pl-12 pr-4 py-3 bg-[#1e293b] dark:bg-white border border-white/10 dark:border-gray-300 rounded-lg text-white dark:text-gray-900 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-blue-500 focus:border-transparent font-light"
        value={search}
        onChange={e => setSearch(e.target.value)}
        whileFocus={{ scale: 1.01 }}
      />
    </div>
    <div className="md:w-48">
      <div className="relative">
        <FiTag className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" />
        <select
          className="w-full pl-12 pr-4 py-3 bg-[#1e293b] dark:bg-white border border-white/10 dark:border-gray-300 rounded-lg text-white dark:text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-blue-500 focus:border-transparent font-light appearance-none"
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

const TagCloud = ({ allTags, selectedTag, setSelectedTag }) => (
  <motion.div 
    className="flex flex-wrap gap-2 mb-12"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.2 }}
  >
    <motion.button 
      onClick={() => setSelectedTag('')}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
        selectedTag === '' 
          ? 'bg-orange-500 dark:bg-blue-500 text-white' 
          : 'bg-[#1e293b] dark:bg-gray-100 text-gray-300 dark:text-gray-700 hover:bg-orange-500/20 dark:hover:bg-blue-500/20'
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      All Topics
    </motion.button>
    {allTags.slice(0, 8).map(tag => (
      <motion.button 
        key={tag} 
        onClick={() => setSelectedTag(tag)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
          selectedTag === tag 
            ? 'bg-orange-500 dark:bg-blue-500 text-white' 
            : 'bg-[#1e293b] dark:bg-gray-100 text-gray-300 dark:text-gray-700 hover:bg-orange-500/20 dark:hover:bg-blue-500/20'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        {tag}
      </motion.button>
    ))}
  </motion.div>
);

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
    {[1, 2, 3].map((item) => (
      <motion.div
        key={item}
        className="bg-[#1e293b] dark:bg-gray-100 rounded-xl shadow-sm border border-white/5 dark:border-gray-300 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: item * 0.1 }}
      >
        <div className="animate-pulse">
          <div className="bg-gray-700 dark:bg-gray-300 h-48 w-full"></div>
          <div className="p-6">
            <div className="h-4 bg-gray-700 dark:bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="h-3 bg-gray-700 dark:bg-gray-300 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-700 dark:bg-gray-300 rounded w-5/6 mb-4"></div>
            <div className="flex gap-2 mb-4">
              {[1, 2].map(i => (
                <div key={i} className="h-6 bg-gray-700 dark:bg-gray-300 rounded-full w-16"></div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="h-3 bg-gray-700 dark:bg-gray-300 rounded w-16"></div>
              <div className="h-8 bg-gray-700 dark:bg-gray-300 rounded w-20"></div>
            </div>
          </div>
        </div>
      </motion.div>
    ))}
  </div>
);

const ErrorState = ({ error }) => (
  <motion.div 
    className="bg-red-500/10 border border-red-500/30 text-red-300 dark:text-red-500 px-6 py-4 rounded-lg mb-10 flex items-start gap-3"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ type: 'spring', stiffness: 300 }}
  >
    <div className="bg-red-500/20 dark:bg-red-500/10 p-2 rounded-full">
      <svg className="w-6 h-6 text-red-400 dark:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <div>
      <h3 className="font-medium text-white dark:text-gray-900">Something went wrong</h3>
      <p className="mt-1 text-sm">{error}</p>
    </div>
  </motion.div>
);

const NoResultsState = ({ setSearch, setSelectedTag }) => (
  <motion.div 
    className="text-center py-20"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <motion.div 
      className="bg-orange-500/10 dark:bg-blue-500/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
      animate={{ rotate: [0, 10, 0] }}
      transition={{ repeat: Infinity, duration: 2 }}
    >
      <svg className="w-10 h-10 text-orange-500 dark:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </motion.div>
    <h3 className="text-xl font-medium text-white dark:text-gray-900 mb-2">No articles found</h3>
    <p className="text-gray-400 dark:text-gray-600 mb-6 max-w-md mx-auto">
      Try different search terms or filters
    </p>
    <motion.button
      onClick={() => {
        setSearch('');
        setSelectedTag('');
      }}
      className="bg-orange-500 dark:bg-blue-500 hover:bg-orange-600 dark:hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-lg shadow-orange-500/20 dark:shadow-blue-500/20"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      Clear filters
    </motion.button>
  </motion.div>
);

const EndOfContent = ({ scrollToTop }) => (
  <motion.div 
    className="text-center py-12 border-t border-white/10 dark:border-gray-300"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <motion.div 
      className="text-gray-500 font-light mb-2"
      animate={{ y: [0, -5, 0] }}
      transition={{ repeat: Infinity, duration: 2 }}
    >
      You've reached the end
    </motion.div>
    <p className="text-gray-600 text-sm mb-4">No more articles to load</p>
    <motion.button 
      onClick={scrollToTop}
      className="text-orange-500 dark:text-blue-500 hover:text-orange-400 dark:hover:text-blue-400 font-medium flex items-center justify-center gap-2 mx-auto"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <FaArrowUp className="w-5 h-5" />
      Back to top
    </motion.button>
  </motion.div>
);

// ================
// MAIN COMPONENT
// ================

const Blog = () => {
  const theme = useTheme();
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  
  const { blogs, loading, error, page, hasMore, setPage } = useBlogData();
  const { showScrollTop, scrollToTop } = useScroll(hasMore, loading);
  const { handleCreateBlog, handleLike, handleViewCount } = useBlogInteractions();
  const { filteredBlogs, allTags, featuredBlog } = useBlogFilters(blogs, search, selectedTag);

  // Update page when reaching bottom
  useEffect(() => {
    if (hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  }, [hasMore, loading]);

  return (
    <div className="min-h-screen pt-0 bg-gradient-to-br from-[#0f172a] to-[#1e293b] dark:from-gray-100 dark:to-gray-200 text-white dark:text-gray-900">
      {/* Floating Back to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-lg hover:bg-orange-600 dark:hover:bg-blue-600 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            style={{
              backgroundColor: theme === 'dark' ? '#f97316' : '#3b82f6',
              color: 'white'
            }}
            aria-label="Scroll to top"
          >
            <FaArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <AnimatePresence>
        {featuredBlog && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <FeaturedBlogCard 
              featuredBlog={featuredBlog}  
              handleViewCount={handleViewCount} 
              theme={theme}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <BlogHeader handleCreateBlog={handleCreateBlog} />
        
        <SearchFilter 
          search={search}
          setSearch={setSearch}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
          allTags={allTags}
        />
        
        <TagCloud 
          allTags={allTags}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
        />

        {/* Error State */}
        {error && <ErrorState error={error} />}

        {/* Loading State */}
        {loading && blogs.length === 0 && <LoadingSkeleton />}

        {/* Blog Cards */}
        <AnimatePresence>
          {filteredBlogs.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
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

        {/* End of Content */}
        {!hasMore && filteredBlogs.length > 0 && (
          <EndOfContent scrollToTop={scrollToTop} />
        )}

        {/* No Results */}
        {filteredBlogs.length === 0 && !loading && (
          <NoResultsState 
            setSearch={setSearch} 
            setSelectedTag={setSelectedTag} 
          />
        )}
      </div>
    </div>
  );
};

export default Blog;