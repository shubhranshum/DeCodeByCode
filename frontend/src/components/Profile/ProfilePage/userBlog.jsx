import { useEffect, useState, useMemo, useCallback } from 'react';
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
  FiSun,
  FiFileText
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
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  // Apply theme on initial load and when theme changes
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  // Toggle between dark/light themes using useCallback for performance
  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  }, []);

  // Fetch user blogs from the API
  const fetchUserBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3000/profile/user-blogs', {
        method: 'GET',
        credentials: 'include'
      });
      const data = await res.json();
      setAllBlogs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching user blogs:', err);
      setAllBlogs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserBlogs();
  }, [fetchUserBlogs]);

  // Performance Tweak: Memoize the filtering logic to prevent re-calculation on every render.
  const filteredBlogs = useMemo(() => {
    return allBlogs
      .filter(blog => {
        if (activeTab === 'Blog') return blog.status === 'Published';
        if (activeTab === 'DraftBlogs') return blog.status === 'Draft';
        if (activeTab === 'ArchivedBlogs') return blog.status === 'Archived';
        return false;
      })
      .filter(blog => 
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (blog.summary && blog.summary.toLowerCase().includes(searchQuery.toLowerCase()))
      );
  }, [allBlogs, activeTab, searchQuery]);

  // Memoize tabs data to prevent recalculating counts unnecessarily
  const tabs = useMemo(() => [
    { key: 'Blog', label: 'Published', count: allBlogs.filter(b => b.status === 'Published').length },
    { key: 'DraftBlogs', label: 'Drafts', count: allBlogs.filter(b => b.status === 'Draft').length },
    { key: 'ArchivedBlogs', label: 'Archived', count: allBlogs.filter(b => b.status === 'Archived').length },
  ], [allBlogs]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Performance Tweak: useCallback to memoize the delete function.
  const handleDeleteBlog = useCallback(async (blogId) => {
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
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Published': return { bg: 'bg-emerald-100 dark:bg-emerald-900/40', text: 'text-emerald-800 dark:text-emerald-300' };
      case 'Draft': return { bg: 'bg-amber-100 dark:bg-amber-900/40', text: 'text-amber-800 dark:text-amber-300' };
      case 'Archived': return { bg: 'bg-slate-200 dark:bg-slate-700', text: 'text-slate-800 dark:text-slate-200' };
      default: return { bg: 'bg-slate-200 dark:bg-slate-700', text: 'text-slate-800 dark:text-slate-200' };
    }
  };

  // Loading Skeleton with updated, classier colors
  if (loading) {
    return (
      <div className="min-h-screen py-12 px-4 bg-slate-50 dark:bg-gray-900">
        <div className="max-w-5xl mx-auto">
          <div className="animate-pulse">
            <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-1/4 mb-10"></div>
            <div className="flex gap-4 mb-8">
              <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-full w-28"></div>
              <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-full w-24"></div>
              <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-full w-28"></div>
            </div>
            <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-xl w-48 mb-10"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="border rounded-xl p-6 bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800">
                  <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full mb-2"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6 mb-6"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3 mb-6"></div>
                  <div className="border-t border-slate-200/80 dark:border-slate-800 pt-4 flex justify-end gap-2">
                    <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-20"></div>
                    <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-20"></div>
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
    <div className="min-h-screen py-12 px-4 bg-slate-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        {/* Header with theme toggle */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-1">
              Your Content Hub
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Manage all your blog content in one place.
            </p>
          </div>
          <motion.button
            whileTap={{ scale: 0.9, rotate: 15 }}
            onClick={toggleTheme}
            className="p-3 rounded-full bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <FiMoon className="w-5 h-5" /> : <FiSun className="w-5 h-5" />}
          </motion.button>
        </div>

        {/* Tabs and Search */}
        <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
          <div className="flex flex-wrap gap-2">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative px-5 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 focus-visible:ring-slate-500 ${
                  activeTab === tab.key
                    ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 shadow-md'
                    : 'bg-white dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.key 
                      ? 'bg-white/20 text-white dark:bg-black/20 dark:text-slate-100' 
                      : 'bg-slate-200 dark:bg-slate-700/80 text-slate-600 dark:text-slate-300'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
          
          <div className="relative w-full md:w-72">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <FiSearch className="w-5 h-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search your blogs..."
              className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-full text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-400 focus:border-transparent transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Create New Blog Button */}
        <div className="mb-10">
          <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/create-blog')}
            className="flex items-center gap-2 bg-slate-800 dark:bg-slate-200 hover:bg-slate-900 dark:hover:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
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
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-12 text-center border border-slate-200/80 dark:border-slate-800"
          >
            <div className="bg-slate-100 dark:bg-slate-800/50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiFileText className="w-10 h-10 text-slate-500 dark:text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">
              {searchQuery ? "No matches found" : "Your creative space is empty"}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              {searchQuery 
                ? `We couldn't find any blogs matching "${searchQuery}".`
                : `You haven't created any ${activeTab === 'Blog' ? 'published articles' : activeTab.replace('Blogs', '').toLowerCase() + 's'} yet. Time to start writing!`}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence>
              {filteredBlogs.map((blog) => (
                <motion.div
                  key={blog._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="bg-white dark:bg-slate-900 rounded-xl shadow border border-slate-200/80 dark:border-slate-800 overflow-hidden hover:shadow-lg transition-shadow flex flex-col relative"
                >
                  {deletingId === blog._id && (
                    <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 flex items-center justify-center z-20 backdrop-blur-sm">
                      <div className="w-8 h-8 border-4 border-slate-600 dark:border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  
                  <div className="p-6 flex-1 flex flex-col cursor-pointer" onClick={() => navigate(`/blog/${blog._id}`)}>
                    <div className="flex justify-between items-start mb-4">
                      <span className={`inline-block px-3 py-1 text-xs rounded-full ${getStatusColor(blog.status).bg} ${getStatusColor(blog.status).text} font-semibold`}>
                        {blog.status}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {formatDate(blog.createdAt)}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-3 line-clamp-2 hover:text-slate-600 dark:hover:text-slate-400 transition-colors">
                      {blog.title}
                    </h3>
                    
                    <p className="text-slate-600 dark:text-slate-400 mb-5 line-clamp-3 flex-1">
                      {blog.summary || 'No summary available.'}
                    </p>
                    
                    <div className="flex items-center text-sm text-slate-500 dark:text-slate-500 mt-auto">
                      <span className="flex items-center mr-4">
                        <FiEye className="w-4 h-4 mr-1.5" />
                        {blog.viewsCount || 0}
                      </span>
                      <span className="flex items-center">
                        <FiHeart className="w-4 h-4 mr-1.5" />
                        {blog.likesCount || 0}
                      </span>
                    </div>
                  </div>
                  
                  <div className="border-t border-slate-200/80 dark:border-slate-800 p-3 bg-slate-50/70 dark:bg-slate-800/50 flex justify-end gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      onClick={(e) => { e.stopPropagation(); navigate(`/edit-blog/${blog._id}`); }}
                      className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 px-3.5 py-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      <FiEdit2 className="w-4 h-4" /> Edit
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(blog._id); }}
                      className="flex items-center gap-1.5 text-sm font-medium text-rose-600 dark:text-rose-500 hover:text-rose-800 dark:hover:text-rose-300 px-3.5 py-1.5 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors"
                    >
                      <FiTrash2 className="w-4 h-4" /> Delete
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
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
            onClick={() => setShowDeleteConfirm(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="mx-auto bg-rose-100 dark:bg-rose-900/30 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <FiTrash2 className="w-8 h-8 text-rose-600 dark:text-rose-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-200 mb-2">Confirm Deletion</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Are you sure you want to permanently delete this blog? This action cannot be undone.
                </p>
                <div className="flex justify-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => setShowDeleteConfirm(null)}
                    className="px-5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-medium transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => handleDeleteBlog(showDeleteConfirm)}
                    className="px-5 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-medium transition-colors shadow-md shadow-rose-500/30"
                  >
                    {deletingId === showDeleteConfirm ? (
                      <span className="flex items-center justify-center w-32">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                        Deleting...
                      </span>
                    ) : ( "Delete Permanently" )}
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