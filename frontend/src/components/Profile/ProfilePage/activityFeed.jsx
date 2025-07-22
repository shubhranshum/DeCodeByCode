import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const ActivityFeed = ({
  activities,
  theme,
  loading = false,
  mode = 'summary', // 'summary' or 'full'
  themeStyles // Passed from parent (ProfilePage) for consistent styling
}) => {
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();
  const darkMode = theme === 'dark';

  // Ensure themeStyles is available, defaulting if not provided (though it should be)
  const currentThemeStyles = themeStyles || (darkMode ? {} : {}); // Provide actual default themes if not passed

  const renderIcon = (type) => {
    const iconClass = "w-4 h-4";
    let bgColorClass, textColorClass;

    switch (type) {
      case 'BLOG_POSTED':
      case 'BLOG_EDITED':
        // Use primary accent (purple/indigo) for blog related
        bgColorClass = darkMode ? 'bg-gradient-to-br from-indigo-900/40 to-purple-900/40' : 'bg-gradient-to-br from-indigo-100 to-purple-100';
        textColorClass = darkMode ? 'text-indigo-300' : 'text-purple-600';
        return (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={`${bgColorClass} ${textColorClass} w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 shadow-md`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </motion.div>
        );
      case 'COMMENT_ADDED':
        // Use a variant of primary accent for comments
        bgColorClass = darkMode ? 'bg-gradient-to-br from-blue-900/40 to-cyan-900/40' : 'bg-gradient-to-br from-blue-100 to-cyan-100';
        textColorClass = darkMode ? 'text-blue-300' : 'text-cyan-600';
        return (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={`${bgColorClass} ${textColorClass} w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 shadow-md`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </motion.div>
        );
      case 'PROBLEM_SOLVED':
        // Use secondary accent (green-blue) for solved problems
        bgColorClass = darkMode ? 'bg-gradient-to-br from-emerald-900/40 to-teal-900/40' : 'bg-gradient-to-br from-emerald-100 to-teal-100';
        textColorClass = darkMode ? 'text-emerald-400' : 'text-emerald-600';
        return (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={`${bgColorClass} ${textColorClass} w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 shadow-md`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </motion.div>
        );
      case 'PROBLEM_ATTEMPTED':
        // Use a slightly different accent for attempted problems
        bgColorClass = darkMode ? 'bg-gradient-to-br from-red-900/40 to-pink-900/40' : 'bg-gradient-to-br from-red-100 to-pink-100';
        textColorClass = darkMode ? 'text-red-400' : 'text-red-600';
        return (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={`${bgColorClass} ${textColorClass} w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 shadow-md`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.div>
        );
      case 'FOLLOWED':
      case 'UNFOLLOWED':
        // Use secondary accent for connection activities
        bgColorClass = darkMode ? 'bg-gradient-to-br from-sky-900/40 to-cyan-900/40' : 'bg-gradient-to-br from-sky-100 to-cyan-100';
        textColorClass = darkMode ? 'text-sky-300' : 'text-sky-600';
        return (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={`${bgColorClass} ${textColorClass} w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 shadow-md`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM12 18H8a2 2 0 00-2 2v1h10v-1a2 2 0 00-2-2z" />
            </svg>
          </motion.div>
        );
      default:
        // Default icon for other or unknown activities
        bgColorClass = darkMode ? 'bg-gradient-to-br from-gray-700/30 to-slate-800/30' : 'bg-gradient-to-br from-slate-100 to-gray-100';
        textColorClass = darkMode ? 'text-gray-300' : 'text-slate-600';
        return (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={`${bgColorClass} ${textColorClass} w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 shadow-md`}
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

    return time.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getActivityText = (activity) => {
    const details = activity || {};

    switch (activity.type) {
      case 'BLOG_POSTED':
        return {
          title: "Shared a New Blog Post",
          summary: activity.details?.title ? `"${activity.details.title}"` : 'You shared your knowledge with the community'
        };
      case 'BLOG_EDITED':
        return {
          title: `Updated a Blog Post`,
          summary: activity.details?.title ? `"${activity.details.title}" was updated` : 'You refined your content'
        };
      case 'COMMENT_ADDED':
        return {
          title: `Commented on a Blog`,
          summary: activity.details?.blogTitle ? `On "${activity.details.blogTitle}"` : 'You shared your perspective'
        };
      case 'PROBLEM_SOLVED':
        return {
          title: `Solved Problem`,
          summary: activity.details?.problemTitle ? `"${activity.details.problemTitle}"` : 'You conquered a coding challenge!'
        };
      case 'PROBLEM_ATTEMPTED':
        return {
          title: `Attempted Problem`,
          summary: activity.details?.problemTitle ? `"${activity.details.problemTitle}"` : 'You tackled a coding problem.'
        };
      case 'FOLLOWED':
        return {
          title: `Started Following`,
          summary: activity.details?.followedUsername ? `You're now following ${activity.details.followedUsername}` : 'A new connection was made.'
        };
      case 'UNFOLLOWED':
        return {
          title: `Unfollowed User`,
          summary: activity.details?.unfollowedUsername ? `You unfollowed ${activity.details.unfollowedUsername}` : 'A connection was removed.'
        };
      default:
        return {
          title: activity.type.split('_').join(' ').replace(/\b\w/g, char => char.toUpperCase()), // Capitalize each word
          summary: activity.details || 'New activity'
        };
    }
  };

  const handleActivityClick = (activity) => {
    switch (activity.type) {
      case 'BLOG_POSTED':
      case 'BLOG_EDITED':
      case 'BLOG_DELETED':
      case 'COMMENT_ADDED':
        if (activity.refId) navigate(`/blog/${activity.refId}`);
        break;
      case 'PROBLEM_SOLVED':
      case 'PROBLEM_ATTEMPTED':
        if (activity.refId) navigate(`/problems/${activity.refId}`);
        break;
      case 'FOLLOWED':
      case 'UNFOLLOWED':
        if (activity.details?.followedUsername) navigate(`/profile/${activity.details.followedUsername}`);
        if (activity.details?.unfollowedUsername) navigate(`/profile/${activity.details.unfollowedUsername}`);
        break;
      default:
        if (activity._id) navigate(`/activity/${activity._id}`);
        break;
    }
  };

  const maxSummaryItems = 3;

  if (loading) {
    const bgClass = darkMode ? 'bg-gray-700' : 'bg-slate-200';
    // The accentColor below is for the loading spinner itself, if it were part of this component.
    // However, the loading spinner is likely handled by the parent 'ProfilePage' component,
    // which already uses the correct themeStyles.secondaryAccentBorder.
    // I'll keep this variable for consistency in styling if the spinner were to be here.
    const accentColor = darkMode ? 'border-cyan-500' : 'border-teal-600';

    return (
      <div className="space-y-4 py-4">
        {[...Array(mode === 'summary' ? 3 : 5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`flex items-start gap-4 p-4 rounded-xl ${bgClass} shadow-md animate-pulse`}
          >
            <div className={`w-8 h-8 rounded-full flex-shrink-0 ${bgClass}`}></div>
            <div className="flex-1 space-y-2">
              <div className={`h-4 ${bgClass} rounded-md w-3/4`}></div>
              <div className={`h-3 ${bgClass} rounded-md w-full`}></div>
              <div className={`h-3 ${bgClass} rounded-md w-1/2`}></div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  const sortedActivities = [...activities].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  // FIX: Correctly determine if there are more activities for the button
  const hasMoreActivities = sortedActivities.length > maxSummaryItems && mode === 'summary';
  const displayedActivities = showAll ? sortedActivities : sortedActivities.slice(0, maxSummaryItems);


  return (
    <div className="w-full">
      {/* Toggle button at the top, only shown if hasMoreActivities is true */}
      {hasMoreActivities && (
        <div className="flex justify-end mb-4">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowAll(!showAll)}
            // Apply the actual button primary styles from themeStyles
            className={`text-sm px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${currentThemeStyles.buttonPrimaryBg} ${currentThemeStyles.buttonPrimaryText} shadow-md`}
          >
            {showAll ? 'View Less' : `View All ${sortedActivities.length} Activities`}
          </motion.button>
        </div>
      )}

      <div className="space-y-4"> {/* Increased spacing between items */}
        {displayedActivities.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <div className={`${currentThemeStyles.subCardBg} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner`}>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${currentThemeStyles.secondaryText}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className={`text-xl font-semibold ${currentThemeStyles.text}`}>No activity yet</h3>
            <p className={`${currentThemeStyles.secondaryText} text-base mt-2`}>Your activities will appear here as you interact with the platform.</p>
          </motion.div>
        ) : (
          <AnimatePresence>
            {displayedActivities.map((activity, index) => {
              const { title, summary } = getActivityText(activity);

              return (
                <motion.div
                  key={activity._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0, margin: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  onClick={() => handleActivityClick(activity)}
                  className={`flex items-start gap-4 p-5 rounded-xl cursor-pointer transition-all duration-200 ease-in-out transform ${currentThemeStyles.card} shadow-md
                    ${darkMode
                      ? 'hover:scale-[1.01] hover:shadow-lg bg-gradient-to-br from-gray-800/50 to-gray-900/50 hover:from-gray-700/60 hover:to-gray-800/60'
                      : 'hover:scale-[1.01] hover:shadow-lg bg-gradient-to-br from-white to-gray-50 hover:from-gray-50 hover:to-gray-100'}
                  `}
                >
                  {renderIcon(activity.type)}
                  <div className="flex-1 min-w-0">
                    <div className={`text-lg font-semibold truncate ${currentThemeStyles.text}`}>
                      {title}
                    </div>
                    <p className={`text-sm mt-1 truncate ${currentThemeStyles.secondaryText}`}>
                      {summary}
                    </p>
                    <div className={`text-xs mt-2 ${currentThemeStyles.secondaryText} opacity-80`}>
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