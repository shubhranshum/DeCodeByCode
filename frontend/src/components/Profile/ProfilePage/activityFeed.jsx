import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();

  const fetchActivities = async () => {
    try {
      const res = await fetch(`http://localhost:3000/profile/user-activities`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        const sortedActivities = data.activities.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        setActivities(sortedActivities);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  // Enhanced SVG icons
  const renderIcon = (type) => {
    const iconClass = "w-5 h-5";
    
    switch (type) {
      case 'BLOG_POSTED':
      case 'BLOG_EDITED':
        return (
          <div className="bg-blue-100 text-blue-700 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
        );
      case 'COMMENT_ADDED':
        return (
          <div className="bg-purple-100 text-purple-700 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
        );
      case 'PROBLEM_SOLVED':
        return (
          <div className="bg-green-100 text-green-700 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="bg-slate-100 text-slate-700 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        );
    }
  };

  // Improved time formatter
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

  // Enhanced activity text generation
  const getActivityText = (activity) => {
    const details = activity.details || {};
    
    switch (activity.type) {
      case 'BLOG_POSTED':
        return {
          title: `Published "${details.title || 'New Blog'}"`,
          summary: details.excerpt || 'You shared your knowledge with the community'
        };
      case 'BLOG_EDITED':
        return {
          title: `Updated "${details.title || 'Your Blog'}"`,
          summary: 'You improved your content for better clarity'
        };
      case 'COMMENT_ADDED':
        return {
          title: `Commented on ${details.parentTitle || 'a post'}`,
          summary: details.content || 'You shared your perspective'
        };
      case 'PROBLEM_SOLVED':
        return {
          title: `Solved "${details.title || 'Coding Problem'}"`,
          summary: `${details.category || 'Problem'} • ${details.difficulty || 'Difficulty'}`
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
        navigate(`/problems/${activity.refId}`);
        break;
      default:
        navigate(`/activity/${activity._id}`);
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-start gap-4 animate-pulse">
              <div className="bg-slate-200 w-10 h-10 rounded-full flex-shrink-0"></div>
              <div className="flex-1">
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-full"></div>
                <div className="h-3 bg-slate-200 rounded w-1/4 mt-2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Determine which activities to show
  const displayedActivities = showAll ? activities : activities.slice(0, 4);
  const hasMoreActivities = activities.length > 4;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">Recent Activity</h2>
        <div className="flex items-center gap-3">
          {hasMoreActivities && !showAll && (
            <button 
              onClick={() => setShowAll(true)}
              className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
            >
              View All
            </button>
          )}
          <button 
            onClick={fetchActivities}
            className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {displayedActivities.length === 0 ? (
          <div className="text-center py-8">
            <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-700">No activity yet</h3>
            <p className="text-slate-500 mt-1">Your activities will appear here</p>
          </div>
        ) : (
          displayedActivities.map((activity) => {
            const { title, summary } = getActivityText(activity);
            
            return (
              <div
                key={activity._id}
                onClick={() => handleActivityClick(activity)}
                className="flex items-start gap-4 p-4 rounded-lg cursor-pointer transition-all 
                          hover:bg-slate-50 active:bg-slate-100 border border-slate-100"
              >
                {renderIcon(activity.type)}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-slate-800 truncate">{title}</div>
                  <p className="text-slate-600 text-sm truncate mb-1">{summary}</p>
                  <div className="text-slate-400 text-xs">
                    {formatTimeAgo(activity.timestamp)}
                  </div>
                </div>
                <div className="flex-shrink-0 text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Show Less button when expanded */}
      {showAll && hasMoreActivities && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setShowAll(false)}
            className="text-sm text-indigo-600 hover:text-indigo-800 px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors"
          >
            Show Less
          </button>
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;