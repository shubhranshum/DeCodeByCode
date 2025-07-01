import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaHeart, FaEye, FaSearch, FaArrowUp, FaSun, FaMoon } from 'react-icons/fa';
import { FiEdit2, FiTag } from 'react-icons/fi';
import BlogCard from './BlogUIElements/blogCard';
import FeaturedBlogCard from './BlogUIElements/featuredBlogCard';
const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(true);
  const [theme, setTheme] = useState('dark');
  const navigate = useNavigate();
  const isFetching = useRef(false);
  const scrollTimer = useRef(null);
  const lastScrollPosition = useRef(0);
  const isLoadingMore = useRef(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme(systemPrefersDark ? 'dark' : 'light');
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      if (isFetching.current) return;
      
      try {
        isFetching.current = true;
        if (page === 1) {
          setLoading(true);
        } else {
          isLoadingMore.current = true;
        }
        
        const response = await fetch(`http://localhost:3000/blogs?page=${page}&limit=6`, {
          method: "GET",
          credentials: "include",
        });
        console.log( response);

        if (!response.ok) throw new Error('Server error while fetching blogs');

        const data = await response.json();
        
        if (data.length === 0 || data.length < 6) {
          setHasMore(false);
        }
        
        if (data.length > 0) {
          setBlogs(prev => {
            const seen = new Set(prev.map(b => b._id));
            const uniqueNew = data.filter(b => !seen.has(b._id));
            return [...prev, ...uniqueNew];
          });
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch blogs. Please try again later.');
        setHasMore(false);
      } finally {
        setLoading(false);
        isLoadingMore.current = false;
        isFetching.current = false;
      }
    };

    fetchBlogs();
  }, [page]);
  
  // const checkLogin = async () => {
  //   try {
  //     const res = await fetch('http://localhost:3000/check/auth', {
  //       method: 'GET',
  //       credentials: 'include'
  //     });
  //     const data = await res.json();
  //     setIsUserLoggedIn(data.isAuthenticated);
  //   } catch (err) {
  //     console.error('Failed to check login status:', err);
  //   }
  // }
  
  // useEffect(() => {
  //   checkLogin();
  // }, []);
  
  const handleCreateBlog = () => {
    navigate('/create-blog');
  }

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    
    if (Math.abs(currentScrollY - lastScrollPosition.current) < 10) return;
    lastScrollPosition.current = currentScrollY;
    
    if (scrollTimer.current) clearTimeout(scrollTimer.current);
    
    scrollTimer.current = setTimeout(() => {
      setShowScrollTop(currentScrollY > 300);
      
      const isNearBottom = window.innerHeight + currentScrollY >= document.body.offsetHeight - 1000;
      
      if (
        isNearBottom &&
        hasMore && 
        !loading && 
        !isFetching.current &&
        !isLoadingMore.current
      ) {
        setPage(prev => prev + 1);
      }
    }, 150);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimer.current) clearTimeout(scrollTimer.current);
    };
  }, [loading, hasMore]);

  const handleLike = async (id, e) => {
    e.stopPropagation();
    try {
      const res = await fetch(`http://localhost:3000/blog/${id}/like`, {
        method: 'POST',
        credentials: 'include'
      });

      if (!res.ok) return;

      const updated = await res.json();

      setBlogs(prev =>
        prev.map(b =>
          b._id === id ? { ...b, likesCount: updated.likesCount } : b
        )
      );
    } catch (err) {
      console.error('Failed to like blog', err);
    }
  };

  const handleViewCount = async (id) => {
    try {
      await fetch(`http://localhost:3000/blog/${id}/view`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (err) {
      console.error('Failed to count view', err);
    }
  };

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(search.toLowerCase());
    const matchesTag = selectedTag ? blog.tags.includes(selectedTag) : true;
    const isPublished = blog.status !== 'Draft';
    
    return matchesSearch && matchesTag && isPublished;
  });
  
  const allTags = [...new Set(blogs.flatMap(blog => blog.tags || []))];
  
  // Featured blog for hero section
  const featuredBlogs = filteredBlogs.filter(blog => blog.isFeatured);

  const featuredBlog = featuredBlogs.length > 0
    ? featuredBlogs.sort((a, b) => {
        if (b.likesCount !== a.likesCount) {
          return b.likesCount - a.likesCount;
        } else if (b.viewsCount !== a.viewsCount) {
          return b.viewsCount - a.viewsCount;
        } else {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
      })[0]
    : null;

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen pt-0 bg-gradient-to-br from-[#0f172a] to-[#1e293b] dark:from-gray-100 dark:to-gray-200 text-white dark:text-gray-900">
      {/* Theme Toggle Button */}
      <motion.button
        onClick={toggleTheme}
        className="fixed top-6 right-6 z-50 p-3 rounded-full shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        style={{
          backgroundColor: theme === 'dark' ? '#f97316' : '#3b82f6',
          color: 'white'
        }}
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? <FaSun size={20} /> : <FaMoon size={20} />}
      </motion.button>

      {/* Floating Back to Top Button */}
      {showScrollTop && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-lg hover:bg-orange-600 dark:hover:bg-blue-600 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          style={{
            backgroundColor: theme === 'dark' ? '#f97316' : '#3b82f6',
            color: 'white'
          }}
          aria-label="Scroll to top"
        >
          <FaArrowUp className="w-5 h-5" />
        </motion.button>
      )}

      {/* Hero Section */}
      {featuredBlog && <FeaturedBlogCard featuredBlog={featuredBlog}  handleViewCount={handleViewCount} />}

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div 
          className="flex flex-col md:flex-row md:justify-between md:items-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6 md:mb-0">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white dark:text-gray-900">
              Stories & <span className="text-orange-400 dark:text-blue-500">Insights</span>
            </h1>
            <p className="text-gray-400 dark:text-gray-600 font-light max-w-2xl">
              Discover thoughtful articles and creative perspectives from our community of writers
            </p>
          </div>
          <motion.button
            onClick={handleCreateBlog}
            className="bg-orange-500 dark:bg-blue-500 hover:bg-orange-600 dark:hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-lg shadow-orange-500/20 dark:shadow-blue-500/20 flex items-center justify-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiEdit2 className="w-5 h-5" />
            Write a Story
          </motion.button>
        </motion.div>

        {/* Search and Filter */}
        <motion.div 
          className="flex flex-col md:flex-row gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex-1 relative">
            <FaSearch className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full pl-12 pr-4 py-3 bg-[#1e293b] dark:bg-white border border-white/10 dark:border-gray-300 rounded-lg text-white dark:text-gray-900 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-blue-500 focus:border-transparent font-light"
              value={search}
              onChange={e => setSearch(e.target.value)}
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

        {/* Tag Cloud */}
        <motion.div 
          className="flex flex-wrap gap-2 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <button 
            onClick={() => setSelectedTag('')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedTag === '' 
                ? 'bg-orange-500 dark:bg-blue-500 text-white' 
                : 'bg-[#1e293b] dark:bg-gray-100 text-gray-300 dark:text-gray-700 hover:bg-orange-500/20 dark:hover:bg-blue-500/20'
            }`}
          >
            All Topics
          </button>
          {allTags.slice(0, 8).map(tag => (
            <button 
              key={tag} 
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedTag === tag 
                  ? 'bg-orange-500 dark:bg-blue-500 text-white' 
                  : 'bg-[#1e293b] dark:bg-gray-100 text-gray-300 dark:text-gray-700 hover:bg-orange-500/20 dark:hover:bg-blue-500/20'
              }`}
            >
              {tag}
            </button>
          ))}
        </motion.div>

        {/* Error State */}
        {error && (
          <motion.div 
            className="bg-red-500/10 border border-red-500/30 text-red-300 dark:text-red-500 px-6 py-4 rounded-lg mb-10 flex items-start gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="bg-red-500/20 dark:bg-red-500/10 p-2 rounded-full">
              <svg className="w-6 h-6 text-red-400 dark:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-white dark:text-gray-900">Error loading content</h3>
              <p className="mt-1 text-sm">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && blogs.length === 0 && (
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
                      <div className="h-6 bg-gray-700 dark:bg-gray-300 rounded-full w-16"></div>
                      <div className="h-6 bg-gray-700 dark:bg-gray-300 rounded-full w-16"></div>
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
        )}

        {/* Blog Cards */}
        {filteredBlogs.length > 0 && <BlogCard blogs={filteredBlogs} handleLike={handleLike} handleViewCount={handleViewCount} />}

        {/* End of Content */}
        {!hasMore && filteredBlogs.length > 0 && (
          <motion.div 
            className="text-center py-12 border-t border-white/10 dark:border-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-gray-500 font-light mb-2">You've reached the end</div>
            <p className="text-gray-600 text-sm">No more articles to load</p>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="mt-6 text-orange-500 dark:text-blue-500 hover:text-orange-400 dark:hover:text-blue-400 font-medium flex items-center justify-center gap-2 mx-auto"
            >
              <FaArrowUp className="w-5 h-5" />
              Back to top
            </button>
          </motion.div>
        )}

        {/* No Results */}
        {filteredBlogs.length === 0 && !loading && (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="bg-orange-500/10 dark:bg-blue-500/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-orange-500 dark:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-white dark:text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-400 dark:text-gray-600 mb-6 max-w-md mx-auto">
              We couldn't find any articles matching your search. Try adjusting your filters or search terms.
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
        )}
      </div>
    </div>
  );
};

export default Blog;