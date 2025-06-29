import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const UserBlogs = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Blog');
  const [allBlogs, setAllBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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

  if (loading) {
    return (
      <div className="min-h-screen py-12 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="animate-pulse">
            <div className="h-10 bg-slate-200 rounded w-1/4 mb-8"></div>
            <div className="flex gap-4 mb-8">
              <div className="h-10 bg-slate-200 rounded-full w-24"></div>
              <div className="h-10 bg-slate-200 rounded-full w-24"></div>
              <div className="h-10 bg-slate-200 rounded-full w-24"></div>
            </div>
            <div className="h-10 bg-slate-200 rounded w-1/3 mb-6"></div>
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border rounded-xl p-6 bg-white">
                  <div className="h-6 bg-slate-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded w-5/6 mb-6"></div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-slate-200 rounded w-32"></div>
                    <div className="h-8 bg-slate-200 rounded w-16"></div>
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
    <div className="min-h-screen py-12 px-4 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
            Your Blog Posts
          </h1>
          <p className="text-slate-600">
            Manage your published, draft, and archived blog posts
          </p>
        </motion.div>

        {/* Tabs and Search */}
        <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
          <div className="flex flex-wrap gap-2">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 transition-all ${
                  activeTab === tab.key
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.key 
                      ? 'bg-white text-indigo-600' 
                      : 'bg-slate-300 text-slate-700'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
          
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search your blogs..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-full text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Create New Blog Button */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/create-blog')}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create New Blog
          </button>
        </div>

        {/* Blog Cards Grid */}
        {filteredBlogs.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-sm p-12 text-center"
          >
            <div className="bg-slate-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">No blogs found</h3>
            <p className="text-slate-600 max-w-md mx-auto mb-6">
              {searchQuery 
                ? `No blogs match your search for "${searchQuery}"`
                : `You haven't created any ${activeTab === 'Blog' ? 'published' : activeTab === 'DraftBlogs' ? 'draft' : 'archived'} blogs yet`}
            </p>
            {!searchQuery && (
              <button
                onClick={() => navigate('/create-blog')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium"
              >
                Create Your First Blog
              </button>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredBlogs.map((blog, idx) => (
              <motion.div
                key={blog._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
              >
                <div className="p-6 flex-1 cursor-pointer" onClick={() => navigate(`/blog/${blog._id}`)}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className={`inline-block px-3 py-1 text-xs rounded-full ${
                        blog.status === 'Published' 
                          ? 'bg-green-100 text-green-800' 
                          : blog.status === 'Draft'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-slate-100 text-slate-800'
                      }`}>
                        {blog.status}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500">
                      {formatDate(blog.createdAt)}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-800 mb-3 line-clamp-2">
                    {blog.title}
                  </h3>
                  
                  <p className="text-slate-600 mb-4 line-clamp-3">
                    {blog.summary || 'No summary available.'}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {blog.tags?.slice(0, 3).map(tag => (
                      <span key={tag} className="bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                    {blog.tags?.length > 3 && (
                      <span className="bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded">
                        +{blog.tags.length - 3}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center text-sm text-slate-500">
                    <span className="flex items-center mr-4">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {blog.viewsCount || 0} views
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {blog.likesCount || 0} likes
                    </span>
                  </div>
                </div>
                
                <div className="border-t border-slate-100 p-4 bg-slate-50 flex justify-end">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      navigate(`/edit-blog/${blog._id}`);
                    }}
                    className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800 px-3 py-1.5 rounded hover:bg-indigo-50"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Blog
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserBlogs;