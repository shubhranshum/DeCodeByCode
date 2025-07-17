import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiEdit2, 
  FiTrash2, 
  FiEye, 
  FiHeart, 
  FiSearch, 
  FiPlus,
  FiMoon,
  FiSun
} from 'react-icons/fi';

const UserBlogs = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Blog');
  const [allBlogs, setAllBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  
  // Theme state management
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  // Apply theme on initial load and when theme changes
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  // Toggle between dark/light themes
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const fetchUserBlogs = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3000/profile/user-blogs', {
        method: 'GET',
        credentials: 'include'
      });
      const data = await res.json();
      setAllBlogs(data);
    } catch (err) {
      console.error('Error fetching user blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserBlogs();
  }, [username]);

  const filteredByStatus = allBlogs.filter(blog => {
    if (activeTab === 'Blog') return blog.status === 'Published';
    if (activeTab === 'DraftBlogs') return blog.status === 'Draft';
    if (activeTab === 'ArchivedBlogs') return blog.status === 'Archived';
    return false;
  });

  // Apply search filter
  const filteredBlogs = filteredByStatus.filter(blog => 
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (blog.summary && blog.summary.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const tabs = [
    { key: 'Blog', label: 'Published', count: allBlogs.filter(b => b.status === 'Published').length },
    { key: 'DraftBlogs', label: 'Drafts', count: allBlogs.filter(b => b.status === 'Draft').length },
    { key: 'ArchivedBlogs', label: 'Archived', count: allBlogs.filter(b => b.status === 'Archived').length },
  ];

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleDeleteBlog = async (blogId) => {
    setDeletingId(blogId);
    try {
      const res = await fetch(`http://localhost:3000/blog/${blogId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (res.ok) {
        setAllBlogs(prev => prev.filter(blog => blog._id !== blogId));
      } else {
        console.error('Failed to delete blog');
      }
    } catch (err) {
      console.error('Error deleting blog:', err);
    } finally {
      setDeletingId(null);
      setShowDeleteConfirm(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Published': return { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-800 dark:text-green-200' };
      case 'Draft': return { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-800 dark:text-yellow-200' };
      case 'Archived': return { bg: 'bg-slate-100 dark:bg-slate-700', text: 'text-slate-800 dark:text-slate-200' };
      default: return { bg: 'bg-slate-100 dark:bg-slate-700', text: 'text-slate-800 dark:text-slate-200' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12 px-4 bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-5xl mx-auto">
          <div className="animate-pulse">
            <div className="h-10 bg-indigo-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="flex gap-4 mb-8">
              <div className="h-10 bg-indigo-200 dark:bg-gray-700 rounded-full w-24"></div>
              <div className="h-10 bg-indigo-200 dark:bg-gray-700 rounded-full w-24"></div>
              <div className="h-10 bg-indigo-200 dark:bg-gray-700 rounded-full w-24"></div>
            </div>
            <div className="h-10 bg-indigo-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="border rounded-xl p-6 bg-white dark:bg-gray-800">
                  <div className="h-6 bg-indigo-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-indigo-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                  <div className="h-4 bg-indigo-200 dark:bg-gray-700 rounded w-5/6 mb-6"></div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-indigo-200 dark:bg-gray-700 rounded w-32"></div>
                    <div className="flex gap-2">
                      <div className="h-8 bg-indigo-200 dark:bg-gray-700 rounded w-16"></div>
                      <div className="h-8 bg-indigo-200 dark:bg-gray-700 rounded w-16"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-5xl mx-auto">
        {/* Header with theme toggle */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-indigo-900 dark:text-orange-300 mb-1">
              Your Content Hub
            </h1>
            <p className="text-indigo-700/90 dark:text-orange-300/80">
              Manage all your blog content in one place
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className="p-3 rounded-full bg-indigo-100 dark:bg-orange-900/20 text-indigo-700 dark:text-orange-300 hover:bg-indigo-200 dark:hover:bg-orange-800/30 transition-all shadow-sm"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <FiMoon className="w-5 h-5" /> : <FiSun className="w-5 h-5" />}
          </button>
        </div>

        {/* Tabs and Search */}
        <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
          <div className="flex flex-wrap gap-2">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 transition-all ${
                  activeTab === tab.key
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-orange-600 dark:to-amber-600 text-white shadow-md'
                    : 'bg-white dark:bg-gray-800 text-indigo-700 dark:text-orange-300 hover:bg-indigo-50 dark:hover:bg-gray-700 border border-indigo-200 dark:border-orange-900/30'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.key 
                      ? 'bg-white/20 text-white' 
                      : 'bg-indigo-100 dark:bg-orange-900/30 text-indigo-800 dark:text-orange-300'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
          
          <div className="relative w-full md:w-72">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FiSearch className="w-5 h-5 text-indigo-400 dark:text-orange-400" />
            </div>
            <input
              type="text"
              placeholder="Search your blogs..."
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-indigo-200 dark:border-orange-900/30 rounded-full text-indigo-900 dark:text-orange-200 placeholder:text-indigo-400 dark:placeholder:text-orange-500 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-orange-500 focus:border-transparent transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Create New Blog Button */}
        <div className="mb-10">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/create-blog')}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-orange-600 dark:to-amber-600 hover:from-indigo-700 hover:to-purple-700 dark:hover:from-orange-700 dark:hover:to-amber-700 text-white px-6 py-3.5 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl"
          >
            <FiPlus className="w-5 h-5" />
            Create New Blog
          </motion.button>
        </div>

        {/* Blog Cards Grid */}
        {filteredBlogs.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-12 text-center border border-indigo-100 dark:border-orange-900/30"
          >
            <div className="bg-indigo-50 dark:bg-orange-900/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="bg-indigo-100 dark:bg-orange-800/30 w-16 h-16 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-indigo-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-indigo-900 dark:text-orange-300 mb-2">
              {searchQuery ? "No matches found" : "Your creative space is empty"}
            </h3>
            <p className="text-indigo-700/90 dark:text-orange-300/80 max-w-md mx-auto mb-6">
              {searchQuery 
                ? `No blogs match your search for "${searchQuery}"`
                : `You haven't created any ${activeTab === 'Blog' ? 'published' : activeTab === 'DraftBlogs' ? 'draft' : 'archived'} content yet`}
            </p>
            {!searchQuery && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/create-blog')}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-orange-600 dark:to-amber-600 hover:from-indigo-700 hover:to-purple-700 dark:hover:from-orange-700 dark:hover:to-amber-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-md"
              >
                Start Creating
              </motion.button>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence>
              {filteredBlogs.map((blog, idx) => (
                <motion.div
                  key={blog._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  whileHover={{ y: -5 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow border border-indigo-100 dark:border-orange-900/30 overflow-hidden hover:shadow-lg transition-all flex flex-col relative"
                >
                  {deletingId === blog._id && (
                    <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 flex items-center justify-center z-10 backdrop-blur-sm">
                      <div className="w-8 h-8 border-4 border-indigo-600 dark:border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  
                  <div className="p-6 flex-1 cursor-pointer" onClick={() => navigate(`/blog/${blog._id}`)}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className={`inline-block px-3 py-1 text-xs rounded-full ${getStatusColor(blog.status).bg} ${getStatusColor(blog.status).text} font-medium`}>
                          {blog.status}
                        </span>
                      </div>
                      <span className="text-xs text-indigo-600/90 dark:text-orange-400/90">
                        {formatDate(blog.createdAt)}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-indigo-900 dark:text-orange-300 mb-3 line-clamp-2">
                      {blog.title}
                    </h3>
                    
                    <p className="text-indigo-800/90 dark:text-white/90 mb-4 line-clamp-3">
                      {blog.summary || 'No summary available.'}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {blog.tags?.slice(0, 3).map(tag => (
                        <span key={tag} className="bg-indigo-100 dark:bg-orange-900/30 text-indigo-800 dark:text-orange-300 text-xs px-2.5 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                      {blog.tags?.length > 3 && (
                        <span className="bg-indigo-100 dark:bg-orange-900/30 text-indigo-800 dark:text-orange-300 text-xs px-2.5 py-1 rounded-full">
                          +{blog.tags.length - 3}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center text-sm text-indigo-600/90 dark:text-orange-400/90">
                      <span className="flex items-center mr-4">
                        <FiEye className="w-4 h-4 mr-1.5" />
                        {blog.viewsCount || 0} views
                      </span>
                      <span className="flex items-center">
                        <FiHeart className="w-4 h-4 mr-1.5" />
                        {blog.likesCount || 0} likes
                      </span>
                    </div>
                  </div>
                  
                  <div className="border-t border-indigo-100 dark:border-orange-900/30 p-4 bg-indigo-50/50 dark:bg-orange-900/10 flex justify-end gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={e => {
                        e.stopPropagation();
                        navigate(`/edit-blog/${blog._id}`);
                      }}
                      className="flex items-center gap-1.5 text-sm font-medium text-indigo-700 dark:text-orange-300 hover:text-indigo-900 dark:hover:text-orange-200 px-3.5 py-1.5 rounded-lg hover:bg-indigo-100 dark:hover:bg-orange-900/20 transition-colors"
                    >
                      <FiEdit2 className="w-4 h-4" />
                      Edit
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={e => {
                        e.stopPropagation();
                        setShowDeleteConfirm(blog._id);
                      }}
                      className="flex items-center gap-1.5 text-sm font-medium text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-300 px-3.5 py-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                    >
                      <FiTrash2 className="w-4 h-4" />
                      Delete
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowDeleteConfirm(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 max-w-md w-full border border-indigo-100 dark:border-orange-900/30"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="mx-auto bg-rose-100 dark:bg-rose-900/30 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <FiTrash2 className="w-8 h-8 text-rose-600 dark:text-rose-400" />
                </div>
                <h3 className="text-xl font-bold text-indigo-900 dark:text-orange-300 mb-2">Confirm Deletion</h3>
                <p className="text-indigo-700/90 dark:text-orange-300/80 mb-6">
                  Are you sure you want to permanently delete this blog? This action cannot be undone.
                </p>
                <div className="flex justify-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowDeleteConfirm(null)}
                    className="px-5 py-2.5 rounded-lg border border-indigo-200 dark:border-orange-900/30 text-indigo-800 dark:text-orange-300 hover:bg-indigo-50 dark:hover:bg-orange-900/20 font-medium transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDeleteBlog(showDeleteConfirm)}
                    className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-medium transition-colors shadow-md"
                  >
                    {deletingId === showDeleteConfirm ? (
                      <span className="flex items-center justify-center">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                        Deleting...
                      </span>
                    ) : (
                      "Delete Permanently"
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserBlogs;