import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const ActivityFeed = ({ 
  activities, 
  theme, 
  loading = false,
  mode = 'summary' // 'summary' or 'full'
}) => {
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();
  const darkMode = theme === 'dark';

  const renderIcon = (type) => {
    const iconClass = "w-4 h-4";
    
    switch (type) {
      case 'BLOG_POSTED':
      case 'BLOG_EDITED':
        return (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={`${darkMode ? 'bg-gradient-to-br from-blue-900/30 to-indigo-900/30 text-blue-400' : 'bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600'} w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </motion.div>
        );
      case 'COMMENT_ADDED':
        return (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={`${darkMode ? 'bg-gradient-to-br from-purple-900/30 to-indigo-900/30 text-purple-400' : 'bg-gradient-to-br from-purple-100 to-indigo-100 text-purple-600'} w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </motion.div>
        );
      case 'PROBLEM_SOLVED':
        return (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={`${darkMode ? 'bg-gradient-to-br from-emerald-900/30 to-teal-900/30 text-emerald-400' : 'bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-600'} w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </motion.div>
        );
      default:
        return (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={`${darkMode ? 'bg-gradient-to-br from-gray-700/30 to-slate-800/30 text-gray-300' : 'bg-gradient-to-br from-slate-100 to-gray-100 text-slate-600'} w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </motion.div>
        );
    }
  };
  
  const formatTimeAgo = (timestamp) => {
    const time = new Date(timestamp);
    const now = new Date();
    const seconds = Math.floor((now - time) / 1000);
    
    if (seconds < 60) return 'Just now';
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hr ago`;
    
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`;
    
    return time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getActivityText = (activity) => {
    const details = activity || {};
    
    switch (activity.type) {
      case 'BLOG_POSTED':
        return {
          title: "Shared a Blog",
          summary: details.details || 'You shared your knowledge with the community'
        };
      case 'BLOG_EDITED':
        return {
          title: `Updated Your Blog`,
          summary: details.details
        };
      case 'COMMENT_ADDED':
        return {
          title: `Commented on a post`,
          summary: details.details || 'You shared your perspective'
        };
      case 'PROBLEM_SOLVED':
        return {
          title: `Solved Problem`,
          summary: details.details || 'You solved a coding challenge'
        };
      default:
        return {
          title: activity.type.split('_').join(' '),
          summary: activity.details || 'New activity'
        };
    }
  };

  const handleActivityClick = (activity) => {
    switch (activity.type) {
      case 'BLOG_POSTED':
      case 'BLOG_EDITED':
      case 'BLOG_DELETED':
        navigate(`/blog/${activity.refId}`);
        break;
      case 'COMMENT_ADDED':
        navigate(`/blog/${activity.refId}`);
        break;
      case 'PROBLEM_SOLVED':
      case 'PROBLEM_ATTEMPTED':
        navigate(`/problems/${activity.refId}`);
        break;
      default:
        navigate(`/activity/${activity._id}`);
    }
  };

  if (loading) {
    const bgClass = darkMode ? 'bg-gray-700' : 'bg-slate-200';
    
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-start gap-3"
          >
            <div className={`${bgClass} w-7 h-7 rounded-full flex-shrink-0 animate-pulse`}></div>
            <div className="flex-1">
              <div className={`h-3 ${bgClass} rounded w-3/4 mb-1.5`}></div>
              <div className={`h-2.5 ${bgClass} rounded w-full`}></div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  // FIXED: Sort by actual date value instead of formatted string
  const sortedActivities = [...activities].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  
  const maxItems = 3;
  const hasMoreActivities = sortedActivities.length > maxItems;
  const displayedActivities = showAll ? sortedActivities : sortedActivities.slice(0, maxItems);

  return (
    <div className="w-full">
      {/* Toggle button at the top */}
      {hasMoreActivities && (
        <div className="flex justify-end mb-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowAll(!showAll)}
            className={`text-xs px-3 py-1.5 rounded-md transition-colors ${
              darkMode 
                ? 'bg-gradient-to-r from-indigo-800/30 to-purple-800/30 text-indigo-300 hover:from-indigo-700/40 hover:to-purple-700/40' 
                : 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 hover:from-indigo-200 hover:to-purple-200'
            }`}
          >
            {showAll ? 'View Less' : 'View All'}
          </motion.button>
        </div>
      )}

      <div className="space-y-3">
        {displayedActivities.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-4"
          >
            <div className={`${darkMode ? 'bg-gradient-to-br from-gray-700/30 to-slate-800/30' : 'bg-gradient-to-br from-slate-100 to-gray-100'} w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3`}>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${darkMode ? 'text-gray-400' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className={`text-base font-medium ${darkMode ? 'text-gray-200' : 'text-slate-800'}`}>No activity yet</h3>
            <p className={`${darkMode ? 'text-gray-400' : 'text-slate-500'} text-sm mt-1`}>Your activities will appear here</p>
          </motion.div>
        ) : (
          <AnimatePresence>
            {displayedActivities.map((activity, index) => {
              const { title, summary } = getActivityText(activity);
              
              return (
                <motion.div
                  key={activity._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleActivityClick(activity)}
                  className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all 
                            ${darkMode 
                              ? 'bg-gradient-to-br from-gray-800/30 to-slate-900/30 hover:from-gray-700/40 hover:to-slate-800/40' 
                              : 'bg-gradient-to-br from-slate-50 to-gray-50 hover:from-slate-100 hover:to-gray-100'}`}
                >
                  {renderIcon(activity.type)}
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium truncate ${darkMode ? 'text-gray-200' : 'text-slate-800'}`}>
                      {title}
                    </div>
                    <p className={`text-xs truncate ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                      {summary}
                    </p>
                    <div className={`text-[0.7rem] mt-1 ${darkMode ? 'text-gray-500' : 'text-slate-500'}`}>
                      {formatTimeAgo(activity.createdAt)}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;