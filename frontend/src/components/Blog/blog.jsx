import { motion, AnimatePresence } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FaArrowUp, FaSearch } from 'react-icons/fa';
import { FiEdit2, FiTag } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import BlogCard from './BlogUIElements/blogCard';
import FeaturedBlogCard from './BlogUIElements/featuredBlogCard';

// Theme management hook
const useTheme = () => {
  const [theme, setTheme] = useState('dark'); // Default to dark

  useEffect(() => {
    // Get theme from localStorage or use system preference
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

const BlogHeader = ({ handleCreateBlog, theme }) => (
  <motion.div 
    className="flex flex-col md:flex-row md:justify-between md:items-center mb-12"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="mb-6 md:mb-0">
      <motion.h1 
        className="text-3xl md:text-4xl font-bold mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        Stories & <span className={theme === 'dark' ? "text-violet-400" : "text-purple-600"}>Insights</span>
      </motion.h1>
      <motion.p 
        className="font-light max-w-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Discover thoughtful articles and creative perspectives
      </motion.p>
    </div>
    <motion.button
      onClick={handleCreateBlog}
      className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-lg flex items-center justify-center gap-2 ${
        theme === 'dark' 
          ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20" 
          : "bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/20"
      }`}
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

const SearchFilter = ({ search, setSearch, selectedTag, setSelectedTag, allTags, theme }) => (
  <motion.div 
    className="flex flex-col md:flex-row gap-4 mb-12"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.1 }}
  >
    <div className="flex-1 relative">
      <FaSearch className={`w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 ${
        theme === 'dark' ? "text-gray-400" : "text-gray-500"
      }`} />
      <motion.input
        type="text"
        placeholder="Search articles..."
        className={`w-full pl-12 pr-4 py-3 border rounded-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent font-light ${
          theme === 'dark' 
            ? "bg-gray-800 border-gray-700 text-white focus:ring-indigo-500" 
            : "bg-white border-gray-300 text-gray-900 focus:ring-purple-500"
        }`}
        value={search}
        onChange={e => setSearch(e.target.value)}
        whileFocus={{ scale: 1.01 }}
      />
    </div>
    <div className="md:w-48">
      <div className="relative">
        <FiTag className={`w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 ${
          theme === 'dark' ? "text-gray-400" : "text-gray-500"
        }`} />
        <select
          className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent font-light appearance-none ${
            theme === 'dark' 
              ? "bg-gray-800 border-gray-700 text-white focus:ring-indigo-500" 
              : "bg-white border-gray-300 text-gray-900 focus:ring-purple-500"
          }`}
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

const TagCloud = ({ allTags, selectedTag, setSelectedTag, theme }) => (
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
          ? (theme === 'dark' ? 'bg-indigo-600 text-white' : 'bg-purple-600 text-white')
          : (theme === 'dark' 
              ? 'bg-gray-800 text-gray-300 hover:bg-indigo-500/20' 
              : 'bg-gray-100 text-gray-700 hover:bg-purple-500/20')
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
            ? (theme === 'dark' ? 'bg-indigo-600 text-white' : 'bg-purple-600 text-white')
            : (theme === 'dark' 
                ? 'bg-gray-800 text-gray-300 hover:bg-indigo-500/20' 
                : 'bg-gray-100 text-gray-700 hover:bg-purple-500/20')
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

const LoadingSkeleton = ({ theme }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
    {[1, 2, 3].map((item) => (
      <motion.div
        key={item}
        className={`rounded-xl shadow-sm border overflow-hidden ${
          theme === 'dark' 
            ? "bg-gray-800 border-gray-700" 
            : "bg-white border-gray-200"
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: item * 0.1 }}
      >
        <div className="animate-pulse">
          <div className={theme === 'dark' ? "bg-gray-700 h-48 w-full" : "bg-gray-300 h-48 w-full"}></div>
          <div className="p-6">
            <div className={theme === 'dark' ? "bg-gray-700 rounded w-3/4 mb-4 h-4" : "bg-gray-300 rounded w-3/4 mb-4 h-4"}></div>
            <div className={theme === 'dark' ? "bg-gray-700 rounded w-full mb-2 h-3" : "bg-gray-300 rounded w-full mb-2 h-3"}></div>
            <div className={theme === 'dark' ? "bg-gray-700 rounded w-5/6 mb-4 h-3" : "bg-gray-300 rounded w-5/6 mb-4 h-3"}></div>
            <div className="flex gap-2 mb-4">
              {[1, 2].map(i => (
                <div key={i} className={theme === 'dark' ? "h-6 bg-gray-700 rounded-full w-16" : "h-6 bg-gray-300 rounded-full w-16"}></div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className={theme === 'dark' ? "h-3 bg-gray-700 rounded w-16" : "h-3 bg-gray-300 rounded w-16"}></div>
              <div className={theme === 'dark' ? "h-8 bg-gray-700 rounded w-20" : "h-8 bg-gray-300 rounded w-20"}></div>
            </div>
          </div>
        </div>
      </motion.div>
    ))}
  </div>
);

const ErrorState = ({ error, theme }) => (
  <motion.div 
    className={`px-6 py-4 rounded-lg mb-10 flex items-start gap-3 ${
      theme === 'dark' 
        ? "bg-red-500/10 border border-red-500/30 text-red-300" 
        : "bg-red-100 border border-red-200 text-red-700"
    }`}
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ type: 'spring', stiffness: 300 }}
  >
    <div className={theme === 'dark' ? "bg-red-500/20 p-2 rounded-full" : "bg-red-500/10 p-2 rounded-full"}>
      <svg className={theme === 'dark' ? "w-6 h-6 text-red-400" : "w-6 h-6 text-red-500"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <div>
      <h3 className={theme === 'dark' ? "font-medium text-white" : "font-medium text-gray-900"}>Something went wrong</h3>
      <p className="mt-1 text-sm">{error}</p>
    </div>
  </motion.div>
);

const NoResultsState = ({ setSearch, setSelectedTag, theme }) => (
  <motion.div 
    className="text-center py-20"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <motion.div 
      className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
        theme === 'dark' 
          ? "bg-indigo-500/10" 
          : "bg-purple-500/10"
      }`}
      animate={{ rotate: [0, 10, 0] }}
      transition={{ repeat: Infinity, duration: 2 }}
    >
      <svg className={theme === 'dark' ? "w-10 h-10 text-indigo-500" : "w-10 h-10 text-purple-500"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </motion.div>
    <h3 className={`text-xl font-medium mb-2 ${theme === 'dark' ? "text-white" : "text-gray-900"}`}>No articles found</h3>
    <p className={`mb-6 max-w-md mx-auto ${
      theme === 'dark' ? "text-gray-400" : "text-gray-600"
    }`}>
      Try different search terms or filters
    </p>
    <motion.button
      onClick={() => {
        setSearch('');
        setSelectedTag('');
      }}
      className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-lg ${
        theme === 'dark' 
          ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20" 
          : "bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/20"
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      Clear filters
    </motion.button>
  </motion.div>
);

const EndOfContent = ({ scrollToTop, theme }) => (
  <motion.div 
    className={`text-center py-12 border-t ${
      theme === 'dark' ? "border-gray-700" : "border-gray-200"
    }`}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <motion.div 
      className={`font-light mb-2 ${
        theme === 'dark' ? "text-gray-500" : "text-gray-400"
      }`}
      animate={{ y: [0, -5, 0] }}
      transition={{ repeat: Infinity, duration: 2 }}
    >
      You've reached the end
    </motion.div>
    <p className={`text-sm mb-4 ${
      theme === 'dark' ? "text-gray-600" : "text-gray-500"
    }`}>No more articles to load</p>
    <motion.button 
      onClick={scrollToTop}
      className={`font-medium flex items-center justify-center gap-2 mx-auto ${
        theme === 'dark' ? "text-indigo-400 hover:text-indigo-300" : "text-purple-600 hover:text-purple-700"
      }`}
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
  const { theme, toggleTheme } = useTheme();
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
    <div className={`min-h-screen pt-0 text-gray-900 dark:text-gray-100 ${
      theme === 'dark' 
        ? "bg-gradient-to-br from-gray-900 via-indigo-900 to-violet-900" 
        : "bg-gradient-to-br from-white via-purple-50 to-white"
    }`}>
      {/* Floating Back to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-lg transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            style={{
              backgroundColor: theme === 'dark' ? '#6366f1' : '#8b5cf6',
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

        {/* Loading State */}
        {loading && blogs.length === 0 && <LoadingSkeleton theme={theme} />}

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
          <EndOfContent scrollToTop={scrollToTop} theme={theme} />
        )}

        {/* No Results */}
        {filteredBlogs.length === 0 && !loading && (
          <NoResultsState 
            setSearch={setSearch} 
            setSelectedTag={setSelectedTag} 
            theme={theme}
          />
        )}
      </div>
    </div>
  );
};

export default Blog;