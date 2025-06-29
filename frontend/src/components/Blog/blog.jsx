import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const navigate = useNavigate();
  const isFetching = useRef(false);
  const scrollTimer = useRef(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      // Prevent multiple simultaneous requests
      if (isFetching.current) return;
      
      try {
        isFetching.current = true;
        setLoading(true);
        const response = await fetch(`http://localhost:3000/blogs?page=${page}&limit=6`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) throw new Error('Server error while fetching blogs');

        const data = await response.json();
        if (data.length === 0) {
          setHasMore(false);
        } else {
          setBlogs(prev => {
            const seen = new Set(prev.map(b => b._id));
            const uniqueNew = data.filter(b => !seen.has(b._id));
            return [...prev, ...uniqueNew];
          });
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch blogs. Please try again later.');
      } finally {
        setLoading(false);
        isFetching.current = false;
      }
    };

    fetchBlogs();
  }, [page]);

  const handleCreateBlog = () => navigate('/create-blog');

  const handleScroll = () => {
    // Clear any existing timeout
    if (scrollTimer.current) clearTimeout(scrollTimer.current);
    
    // Throttle scroll events to prevent excessive calls
    scrollTimer.current = setTimeout(() => {
      // Show/hide scroll to top button
      setShowScrollTop(window.scrollY > 300);
      
      // Check if we should load more blogs
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && 
        hasMore && 
        !loading && 
        !isFetching.current
      ) {
        setPage(prev => prev + 1);
      }
    }, 100);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
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
    
    return matchesSearch && matchesTag && isPublished ;
    
  });
  
  const allTags = [...new Set(blogs.flatMap(blog => blog.tags || []))];
  
  // Featured blog for hero section
  const featuresdBlogs = filteredBlogs.filter(blog => blog.isFeatured);
  const featuredBlog = featuresdBlogs[Math.random() * featuresdBlogs.length-1 | 0];

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen pt-0 bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Floating Back to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-indigo-600 text-white p-3 rounded-full shadow-lg z-50 hover:bg-indigo-700 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}

      {/* Hero Section */}
      {featuredBlog && (
        <div className="bg-slate-900 text-white py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-block bg-indigo-600 text-xs px-3 py-1 rounded-full mb-4">
                  Featured Story
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                  {featuredBlog.title}
                </h1>
                <p className="text-slate-300 text-lg mb-6 max-w-2xl">
                  {featuredBlog.summary || featuredBlog.content?.slice(0, 200) + '...'}
                </p>
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="flex items-center">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                    <div className="ml-3">
                      <p className="font-medium">{featuredBlog.author?.username || 'Anonymous'}</p>
                      <p className="text-sm text-slate-300">
                        {new Date(featuredBlog.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center text-sm">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>{featuredBlog.viewsCount || 0} views</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    handleViewCount(featuredBlog._id);
                    navigate(`/blog/${featuredBlog._id}`);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Read Full Story
                </button>
              </div>
              <div>
                <img
                  src={featuredBlog.thumbnailUrl}
                  alt={featuredBlog.title}
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-12">
          <div className="mb-6 md:mb-0">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
              Stories & Insights
            </h1>
            <p className="text-slate-600 font-light max-w-2xl">
              Discover thoughtful articles and creative perspectives from our community of writers
            </p>
          </div>
          <button
            onClick={handleCreateBlog}
            className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Write a Story
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="flex-1 relative">
            <svg className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent font-light"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="md:w-48">
            <select
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent font-light"
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

        {/* Tag Cloud */}
        <div className="flex flex-wrap gap-2 mb-12">
          <button 
            onClick={() => setSelectedTag('')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedTag === '' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
          >
            All Topics
          </button>
          {allTags.slice(0, 8).map(tag => (
            <button 
              key={tag} 
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedTag === tag ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-10 flex items-start gap-3">
            <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-medium">Error loading content</h3>
              <p className="mt-1 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && blogs.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="animate-pulse">
                  <div className="bg-slate-200 h-48 w-full"></div>
                  <div className="p-6">
                    <div className="h-4 bg-slate-200 rounded w-3/4 mb-4"></div>
                    <div className="h-3 bg-slate-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-slate-200 rounded w-5/6 mb-4"></div>
                    <div className="flex gap-2 mb-4">
                      <div className="h-6 bg-slate-200 rounded-full w-16"></div>
                      <div className="h-6 bg-slate-200 rounded-full w-16"></div>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div className="h-3 bg-slate-200 rounded w-16"></div>
                      <div className="h-8 bg-slate-200 rounded w-20"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Blog Cards */}
        {filteredBlogs.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {filteredBlogs.slice(featuredBlog ? 1 : 0).map((blog, index) => (
                <motion.article
                  key={blog._id}
                  onClick={() => {
                    handleViewCount(blog._id);
                    navigate(`/blog/${blog._id}`);
                  }}
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg cursor-pointer transition-all duration-300 border border-slate-100 overflow-hidden group flex flex-col h-full"
                  whileHover={{ y: -5 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <div>
                    <img
                      src={blog.thumbnailUrl}
                      alt={blog.title}
                      className="w-full h-auto rounded-lg shadow-lg"
                    />
                  </div>
                  
                  <div className="p-6 flex flex-col flex-grow">
                    {/* Article Header */}
                    <div className="mb-4">
                      <div className="flex items-center text-xs text-slate-500 font-medium mb-3">
                        <span className="font-medium text-slate-600">
                          {blog.author?.username || 'Anonymous'}
                        </span>
                        <span className="mx-2">•</span>
                        <time>
                          {new Date(blog.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </time>
                      </div>
                      <h2 className="text-xl font-bold text-slate-800 mb-3 leading-tight group-hover:text-indigo-600 transition-colors">
                        {blog.title}
                      </h2>
                    </div>

                    {/* Article Preview */}
                    <div className="mb-4 flex-grow">
                      <p className="text-slate-600 leading-relaxed font-light">
                        {blog.summary || blog.content?.slice(0, 120) + '...'}
                      </p>
                    </div>

                    {/* Tags */}
                    {blog.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {blog.tags.slice(0, 2).map(tag => (
                          <span 
                            key={tag} 
                            className="bg-slate-100 text-slate-600 text-xs px-3 py-1 rounded-full font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                        {blog.tags.length > 2 && (
                          <span className="bg-slate-100 text-slate-600 text-xs px-3 py-1 rounded-full font-medium">
                            +{blog.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Article Meta */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                      <div className="flex items-center space-x-4 text-sm text-slate-500">
                        <span className="flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span>{blog.viewsCount || 0}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          <span>{blog.likesCount || 0}</span>
                        </span>
                      </div>
                      
                      <button
                        onClick={(e) => handleLike(blog._id, e)}
                        className="text-slate-500 hover:text-indigo-600 text-sm font-medium transition-colors px-3 py-1 rounded-md hover:bg-slate-50 flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                        </svg>
                        Like
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>

            {/* Loading more indicator */}
            {loading && blogs.length > 0 && (
              <div className="flex justify-center py-8">
                <div className="w-12 h-12 border-t-2 border-indigo-600 border-solid rounded-full animate-spin"></div>
              </div>
            )}
          </>
        )}

        {/* End of Content */}
        {!hasMore && filteredBlogs.length > 0 && (
          <div className="text-center py-12 border-t border-slate-200">
            <div className="text-slate-500 font-light mb-2">You've reached the end</div>
            <p className="text-slate-400 text-sm">No more articles to load</p>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="mt-6 text-indigo-600 hover:text-indigo-800 font-medium flex items-center justify-center gap-2 mx-auto"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
              Back to top
            </button>
          </div>
        )}

        {/* No Results */}
        {filteredBlogs.length === 0 && !loading && (
          <div className="text-center py-20">
            <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-slate-800 mb-2">No articles found</h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              We couldn't find any articles matching your search. Try adjusting your filters or search terms.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedTag('');
              }}
              className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;