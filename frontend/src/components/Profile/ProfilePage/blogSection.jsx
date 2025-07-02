import React from 'react';
import { Link } from 'react-router-dom';

const BlogsSection = ({ blogs }) => {
  // Sort blogs by date and get the 4 most recent
  const recentBlogs = [...blogs]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-md p-6 mt-8 transition-colors">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-gray-100">My Blogs</h2>
        <Link 
          to="/profile/userblogs" 
          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium flex items-center gap-1"
        >
          View all
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recentBlogs.length > 0 ? (
          recentBlogs.map(blog => (
            <div key={blog.id} className="border border-slate-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="font-bold text-slate-800 dark:text-gray-100 mb-2">{blog.title}</h3>
              <div className="flex justify-between text-sm text-slate-500 dark:text-gray-400 mb-3">
                <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {blog.viewedBy.length}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {blog.likedBy.length}
                  </span>
                </div>
              </div>
              <p className="text-slate-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">{blog.summary}</p>
              <div className="flex flex-wrap gap-2">
                {blog.tags.slice(0, 2).map(tag => (
                  <span key={tag} className="bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-gray-300 text-xs px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
                {blog.tags.length > 2 && (
                  <span className="bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-gray-300 text-xs px-2 py-1 rounded">
                    +{blog.tags.length - 2}
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 col-span-2">
            <div className="bg-slate-100 dark:bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-800 dark:text-gray-100 mb-2">No blogs yet</h3>
            <p className="text-slate-600 dark:text-gray-400 mb-4">Start sharing your knowledge with the community</p>
            <Link 
              to="/create-blog" 
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium"
            >
              Write Your First Blog
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogsSection;