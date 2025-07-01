import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyToggles, setReplyToggles] = useState({});
  const [replyTexts, setReplyTexts] = useState({});
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [readingProgress, setReadingProgress] = useState(0);
  const [showToc, setShowToc] = useState(false);
  const [headings, setHeadings] = useState([]);
  const contentRef = useRef(null);
 
  
  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Apply theme on initial load
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
  }, []);

  // Apply theme class to body
  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Check if user is logged in
  const checkLoginStatus = async () => {
    try {
      const res = await fetch('http://localhost:3000/check/auth', {
        method: 'GET',
        credentials: 'include',
      });
      
      if (res.ok) {
        const data = await res.json();
        setIsLoggedIn(data.isAuthenticated);
      }
    } catch (err) {
      console.error('Failed to check login status:', err);
    }
  };

  const fetchBlogAndComments = async () => {
    try {
      const [blogRes, commentRes] = await Promise.all([
        fetch(`http://localhost:3000/blog/${id}`, {
          method: 'GET',
          credentials: 'include',
        }),
        fetch(`http://localhost:3000/blog/comments/${id}`, {
          method: 'GET',
          credentials: 'include',
        })
      ]);

      const blogData = await blogRes.json();
      setBlog(blogData);
      
      const commentData = await commentRes.json();
     
      setComments(Array.isArray(commentData) ? commentData : []);
    } catch (err) {
      console.error('Failed to load blog or comments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkLoginStatus();
    fetchBlogAndComments();
    checkIfLiked();
  }, [id]);
  
  // Extract headings for table of contents
  useEffect(() => {
    if (blog && blog.content) {
      // Create a temporary element to parse the HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(blog.content, 'text/html');
      const headings = Array.from(doc.querySelectorAll('h1, h2, h3, h4, h5, h6'));
      
      const tocItems = headings.map(heading => ({
        id: heading.id || heading.textContent.toLowerCase().replace(/\s+/g, '-'),
        text: heading.textContent,
        level: parseInt(heading.tagName.substring(1), 10)
      }));
      
      setHeadings(tocItems);
    }
  }, [blog]);

  // Handle HTML content rendering safely
  const createMarkup = (htmlContent) => {
    return { __html: htmlContent };
  };
  

  // Handle scroll progress
  useEffect(() => {
    const handleScroll = () => {
    
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = (scrollTop / scrollHeight) * 100;
      setReadingProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
    try {
      await fetch(`http://localhost:3000/blog/${id}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newComment }),
      });
      setNewComment('');
      fetchBlogAndComments();
    } catch (err) {
      console.error('Failed to post comment:', err);
    }
  };

  const handleReplySubmit = async (parentCommentId) => {
    const replyText = replyTexts[parentCommentId];
    if (!replyText?.trim()) return;

    try {
      await fetch(`http://localhost:3000/blog/${id}/reply`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: replyText, parentCommentId }),
      });

      setReplyTexts(prev => ({ ...prev, [parentCommentId]: '' }));
      setReplyToggles(prev => ({ ...prev, [parentCommentId]: false }));
      fetchBlogAndComments();
    } catch (err) {
      console.error('Failed to post reply:', err);
    }
  };
  const checkIfLiked = async() => {
    try {
      const res = await fetch(`http://localhost:3000/blog/${id}/like`, {
        method: 'GET',
        credentials: 'include'
      });
      
      if (res.ok) {
        const data = await res.json();
        setLiked(data.liked);
      }
    } catch (err) {
      console.error('Failed to check if liked', err);
    }
  }

 


  const handleLike = async () => {
    try {
      const res = await fetch(`http://localhost:3000/blog/${id}/like`, {
        method: 'POST',
        credentials: 'include'
      });
      
      if (res.ok) {
        setLiked(!liked);
        setBlog(prev => ({
          ...prev,
          likesCount: liked ? prev.likesCount - 1 : prev.likesCount + 1
        }));
      }
    } catch (err) {
      console.error('Failed to like blog', err);
    }
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
  };

  const scrollToHeading = (id) => {

    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setShowToc(false);
    }
  };

  const renderComments = (commentList, level = 0) => {
    return commentList.map(comment => (
      <motion.div
        key={comment._id}
        className={`mt-6 ${level > 0 ? 'ml-8 pl-4 border-l border-slate-200 dark:border-gray-700' : ''}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-start gap-4">
          <div className="bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-indigo-700 dark:text-indigo-300 font-medium">
              {(comment.username || 'A').charAt(0).toUpperCase()}
            </span>
          </div>
          
          <div className="flex-1">
            <div className="mb-1 flex justify-between">
              <div>
                <span className="font-medium text-slate-800 dark:text-gray-100">
                  {comment.username || 'Anonymous'}
                </span>
                <span className="ml-2 text-xs text-slate-500 dark:text-gray-400">
                  {new Date(comment.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
            
            <div className="text-slate-700 dark:text-gray-300 mb-3">{comment.text}</div>
            
            <div className="flex gap-4">
              <button
                onClick={() => {
                  if (!isLoggedIn) {
                    navigate('/login');
                    return;
                  }
                  setReplyToggles(prev => ({
                    ...prev,
                    [comment._id]: !prev[comment._id],
                  }))
                }}
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                {replyToggles[comment._id] ? 'Cancel' : 'Reply'}
              </button>
            </div>

            {replyToggles[comment._id] && isLoggedIn && (
              <motion.div 
                className="mt-4"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                <textarea
                  rows="2"
                  value={replyTexts[comment._id] || ''}
                  onChange={e => setReplyTexts(prev => ({
                    ...prev,
                    [comment._id]: e.target.value,
                  }))}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-slate-300 dark:border-gray-700 rounded-lg text-slate-700 dark:text-gray-300 placeholder:text-slate-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-600 resize-none transition-colors"
                  placeholder="Write your reply..."
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => handleReplySubmit(comment._id)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Post Reply
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {comment.replies?.length > 0 && renderComments(comment.replies, level + 1)}
      </motion.div>
    ));
  };

  // Theme toggle button component
  const ThemeToggle = () => (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-slate-200 dark:bg-gray-700 text-slate-700 dark:text-gray-200 hover:bg-slate-300 dark:hover:bg-gray-600 transition-colors"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
        </svg>
      )}
    </button>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-gray-900">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-slate-50 dark:bg-gray-900">
        <div className="bg-slate-100 dark:bg-gray-800 rounded-full p-4 mb-6">
          <svg className="w-16 h-16 text-slate-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-gray-100 mb-2">Article Not Found</h2>
        <p className="text-slate-600 dark:text-gray-400 mb-8 max-w-md">
          The article you're looking for doesn't exist or may have been removed.
        </p>
        <button
          onClick={() => navigate('/blog')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Browse Articles
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 transition-colors duration-200 relative">
      {/* Reading progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50">
        <motion.div 
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-600"
          style={{ width: `${readingProgress}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${readingProgress}%` }}
          transition={{ duration: 0.2 }}
        />
      </div>
      
      {/* Floating TOC button */}
      <button
        onClick={() => setShowToc(true)}
        className="fixed right-6 bottom-6 bg-white dark:bg-gray-800 shadow-lg p-3 rounded-full z-40 hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors"
      >
        <svg className="w-6 h-6 text-slate-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      
      {/* Table of Contents */}
      {showToc && (
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowToc(false)}
        >
          <motion.div 
            className="bg-white dark:bg-gray-800 w-full max-w-xs h-full overflow-y-auto p-6"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800 dark:text-gray-100">Table of Contents</h3>
              <button 
                onClick={() => setShowToc(false)}
                className="text-slate-500 hover:text-slate-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <ul className="space-y-2">
              {headings.map((heading, index) => (
                <li key={index} className="ml-4">
                  <a 
                    onClick={() => scrollToHeading(heading.id)}
                    className={`block py-2 text-slate-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors ${
                      heading.level === 1 ? 'font-bold text-base' : 
                      heading.level === 2 ? 'font-medium text-base ml-2' : 
                      heading.level >= 3 ? 'text-sm ml-4' : ''
                    }`}
                  >
                    {heading.text}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
      
      <div className="py-12 px-4 sm:px-6 max-w-4xl mx-auto">
        {/* Top bar with back button and theme toggle */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-slate-600 dark:text-gray-400 hover:text-slate-800 dark:hover:text-gray-200 font-medium transition-colors"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to articles
          </button>
          <ThemeToggle />
        </div>

        {/* Blog Header */}
        <motion.article 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-lg p-6 md:p-8 mb-8 transition-colors"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex flex-wrap gap-2 mb-6">
            {blog.tags?.map(tag => (
              <span 
                key={tag} 
                className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-xs px-3 py-1 rounded-full font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-gray-100 mb-4 leading-tight">
            {blog.title}
          </h1>
          
          {/* Featured Image */}
          {blog.thumbnailUrl && !imageError ? (
            <motion.div 
              className="mb-6 rounded-xl overflow-hidden shadow-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <img 
                src={blog.thumbnailUrl} 
                alt={blog.title} 
                className="w-full h-auto max-h-[500px] object-cover"
                onError={() => setImageError(true)}
              />
            </motion.div>
          ) : (
            <motion.div 
              className="mb-6 bg-slate-100 dark:bg-gray-700 border-2 border-dashed border-slate-300 dark:border-gray-600 rounded-xl w-full h-64 flex flex-col items-center justify-center text-slate-500 dark:text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Featured image not available</span>
            </motion.div>
          )}
          
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full w-10 h-10 flex items-center justify-center text-white font-medium">
                {blog.author?.username?.charAt(0) || 'A'}
              </div>
              <div className="ml-3">
                <p className="font-medium text-slate-800 dark:text-gray-100">{blog.author?.username || 'Anonymous'}</p>
                <p className="text-sm text-slate-500 dark:text-gray-400">
                  {new Date(blog.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center text-sm text-slate-500 dark:text-gray-400">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{blog.readTime || 5} min read</span>
              </div>
              
              <div className="flex items-center text-sm text-slate-500 dark:text-gray-400">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>{blog.viewsCount || 0} views</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 mb-8">
            <button
              onClick={
                handleLike
            }
              className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-colors ${liked ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300' : 'bg-slate-100 dark:bg-gray-700 text-slate-700 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-gray-600'}`}
            >
              <svg className={`w-5 h-5 ${liked ? 'fill-indigo-600 dark:fill-indigo-400' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{blog.likesCount || 0}</span>
            </button>
            
            <button
              onClick={handleBookmark}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-colors ${bookmarked ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300' : 'bg-slate-100 dark:bg-gray-700 text-slate-700 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-gray-600'}`}
            >
              <svg className={`w-5 h-5 ${bookmarked ? 'fill-indigo-600 dark:fill-indigo-400' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
          </div>
          
          {/* HTML Content Rendering with proper styles */}
          <div 
            ref={contentRef}
            className="blog-content text-slate-700 dark:text-gray-300 mb-8"
            dangerouslySetInnerHTML={createMarkup(blog.content)}
          />
          
          <div className="border-t border-slate-200 dark:border-gray-700 pt-6">
            <div className="flex flex-wrap gap-2">
              {blog.tags?.map(tag => (
                <span 
                  key={tag} 
                  className="bg-slate-100 dark:bg-gray-700 text-slate-700 dark:text-gray-300 text-xs px-3 py-1 rounded-full font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </motion.article>

        {/* Comment Section */}
        {blog.allowComments && (
          <motion.section 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-lg p-6 md:p-8 transition-colors"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-gray-100">
                Discussion ({comments.length})
              </h2>
              <div className="text-sm text-slate-500 dark:text-gray-400">
                {comments.length === 0 ? 'Be the first to comment' : 'Join the conversation'}
              </div>
            </div>

            {/* New Top-Level Comment */}
            <div className="mb-8">
              {isLoggedIn ? (
                <>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-indigo-700 dark:text-indigo-300 font-medium">Y</span>
                    </div>
                    <div className="flex-1">
                      <textarea
                        rows="3"
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        placeholder="What are your thoughts?"
                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-slate-300 dark:border-gray-700 rounded-lg text-slate-700 dark:text-gray-300 placeholder:text-slate-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-600 resize-none transition-colors"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={handleCommentSubmit}
                      disabled={!newComment.trim()}
                      className={`px-6 py-2 rounded-lg font-medium transition-colors ${newComment.trim() ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-slate-200 dark:bg-gray-700 text-slate-500 dark:text-gray-400'}`}
                    >
                      Post Comment
                    </button>
                  </div>
                </>
              ) : (
                <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-lg p-6 text-center">
                  <svg className="w-12 h-12 mx-auto text-indigo-500 dark:text-indigo-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <h3 className="text-lg font-medium text-slate-800 dark:text-gray-100 mb-2">
                    Join the discussion
                  </h3>
                  <p className="text-slate-600 dark:text-gray-400 mb-4 max-w-md mx-auto">
                    Please log in to leave a comment and participate in the conversation.
                  </p>
                  <button
                    onClick={() => navigate('/login')}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Log In Now
                  </button>
                </div>
              )}
            </div>

            {/* Comments Tree */}
            <div className={comments.length > 0 ? 'border-t border-slate-200 dark:border-gray-700 pt-6' : ''}>
              {comments.length > 0 ? (
                renderComments(comments)
              ) : isLoggedIn ? (
                <div className="text-center py-8 text-slate-500 dark:text-gray-400">
                  <svg className="w-16 h-16 mx-auto text-slate-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  No comments yet. Start the conversation!
                </div>
              ) : null}
            </div>
          </motion.section>
        )}
      </div>
      
      {/* Custom CSS for TinyMCE content */}
      <style jsx global>{`
        .dark {
          --color-bg-primary: #111827;
          --color-bg-secondary: #1f2937;
          --color-bg-card: #1f2937;
          --color-text-primary: #f3f4f6;
          --color-text-secondary: #d1d5db;
          --color-text-muted: #9ca3af;
          --color-border: #374151;
          --color-indigo: #818cf8;
        }
        
        .blog-content {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          line-height: 1.7;
          color: #374151;
        }
        
        .dark .blog-content {
          color: #e5e7eb;
        }
        
        .blog-content h1 {
          font-size: 2.2rem;
          font-weight: 700;
          margin-top: 2.5rem;
          margin-bottom: 1.5rem;
          color: #1f2937;
        }
        
        .dark .blog-content h1 {
          color: #f9fafb;
        }
        
        .blog-content h2 {
          font-size: 1.8rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1.2rem;
          color: #1f2937;
        }
        
        .dark .blog-content h2 {
          color: #f9fafb;
        }
        
        .blog-content h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 1.8rem;
          margin-bottom: 1rem;
          color: #1f2937;
        }
        
        .dark .blog-content h3 {
          color: #f9fafb;
        }
        
        .blog-content p {
          margin-bottom: 1.5rem;
          font-size: 1.1rem;
          color: #4b5563;
        }
        
        .dark .blog-content p {
          color: #d1d5db;
        }
        
        .blog-content a {
          color: #4f46e5;
          text-decoration: underline;
          text-decoration-color: #c7d2fe;
          transition: all 0.2s ease;
        }
        
        .dark .blog-content a {
          color: #818cf8;
          text-decoration-color: #3730a3;
        }
        
        .blog-content a:hover {
          color: #4338ca;
          text-decoration-color: #4f46e5;
        }
        
        .dark .blog-content a:hover {
          color: #a5b4fc;
        }
        
        .blog-content ul, .blog-content ol {
          margin-left: 1.5rem;
          margin-bottom: 1.5rem;
        }
        
        .blog-content li {
          margin-bottom: 0.5rem;
        }
        
        .blog-content blockquote {
          border-left: 4px solid #818cf8;
          padding-left: 1.5rem;
          margin: 1.5rem 0;
          color: #4b5563;
          font-style: italic;
        }
        
        .dark .blog-content blockquote {
          color: #9ca3af;
          border-left-color: #818cf8;
        }
        
        .blog-content pre {
          background: #f9fafb;
          padding: 1.5rem;
          border-radius: 0.5rem;
          overflow: auto;
          margin: 1.5rem 0;
          font-size: 0.95rem;
          line-height: 1.5;
        }
        
        .dark .blog-content pre {
          background: #1f2937;
        }
        
        .blog-content code {
          background: #f3f4f6;
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
          font-family: 'Fira Code', 'SFMono-Regular', Menlo, Consolas, monospace;
          font-size: 0.9rem;
        }
        
        .dark .blog-content code {
          background: #1f2937;
        }
        
        .blog-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1.5rem 0;
        }
        
        .blog-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
        }
        
        .blog-content th, .blog-content td {
          border: 1px solid #e5e7eb;
          padding: 0.75rem;
          text-align: left;
        }
        
        .dark .blog-content th, .dark .blog-content td {
          border-color: #4b5563;
        }
        
        .blog-content th {
          background-color: #f3f4f6;
          font-weight: 600;
        }
        
        .dark .blog-content th {
          background-color: #1f2937;
        }
      `}</style>
    </div>
  );
};

export default BlogDetails;