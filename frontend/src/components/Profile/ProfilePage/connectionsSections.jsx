import React, { useEffect, useState, useCallback } from 'react'; // Added useCallback
import { useNavigate } from 'react-router-dom';

// It's crucial that `themeStyles` is passed as a prop from the parent
// (e.g., ProfilePage) that defines these themes.
// For demonstration purposes, I'll include a placeholder structure.
// In your actual setup, ensure these theme definitions are consistent
// across all components that use `themeStyles`.
const localThemes = {
  light: {
    card: 'bg-white',
    border: 'border-gray-200',
    text: 'text-gray-800',
    secondaryText: 'text-gray-500',
    primaryAccent: 'text-purple-700',
    secondaryAccent: 'text-teal-600', // Green-blue accent for light mode
    primaryAccentBorder: 'border-purple-600',
    secondaryAccentBorder: 'border-teal-600',
    buttonPrimaryBg: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700',
    buttonPrimaryText: 'text-white',
    buttonSecondaryBg: 'bg-gray-200 hover:bg-gray-300', // For "Following" button
    buttonSecondaryText: 'text-gray-800',
    tabActiveBorder: 'border-teal-600', // Tab active border using green-blue
    tabActiveText: 'text-teal-600',     // Tab active text using green-blue
    tabInactiveText: 'text-gray-500 hover:text-purple-700',
    sectionTitle: 'text-purple-800',
    subCardBg: 'bg-gray-50',
    shadow: 'shadow-xl',
    loaderColor: 'border-teal-600',
    emptyStateIconBg: 'bg-gray-100',
    unfollowButtonBg: 'bg-red-50 hover:bg-red-100', // Light red for unfollow
    unfollowButtonText: 'text-red-600',
    rankingBadgeBg: 'bg-amber-500', // Keep ranking badge color consistent
  },
  dark: {
    card: 'bg-gray-800',
    border: 'border-gray-700',
    text: 'text-gray-100',
    secondaryText: 'text-gray-400',
    primaryAccent: 'text-indigo-400',
    secondaryAccent: 'text-cyan-400', // Green-blue accent for dark mode
    primaryAccentBorder: 'border-indigo-500',
    secondaryAccentBorder: 'border-cyan-500',
    buttonPrimaryBg: 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500',
    buttonPrimaryText: 'text-white',
    buttonSecondaryBg: 'bg-gray-700 hover:bg-gray-600', // For "Following" button
    buttonSecondaryText: 'text-gray-100',
    tabActiveBorder: 'border-cyan-500', // Tab active border using green-blue
    tabActiveText: 'text-cyan-500',     // Tab active text using green-blue
    tabInactiveText: 'text-gray-400 hover:text-indigo-400',
    sectionTitle: 'text-indigo-300',
    subCardBg: 'bg-gray-750',
    shadow: 'shadow-xl',
    loaderColor: 'border-cyan-500',
    emptyStateIconBg: 'bg-gray-700',
    unfollowButtonBg: 'bg-red-900/30 hover:bg-red-900/50', // Dark red for unfollow
    unfollowButtonText: 'text-red-400',
    rankingBadgeBg: 'bg-amber-500', // Keep ranking badge color consistent
  }
};


// Main ConnectionsSection component
const ConnectionsSection = ({ theme = 'light', themeStyles }) => { // Accept theme and themeStyles props
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('followers');
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Use the passed themeStyles, or default to a local (less robust) version if not provided
  const currentThemeStyles = themeStyles || localThemes[theme];


  // Memoize fetchData for stability in useEffect
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Use Promise.all for concurrent fetching
      await Promise.all([fetchFollowers(), fetchFollowing()]);
    } catch (error) {
      console.error("Error fetching connections:", error);
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty dependency array as inner fetch functions are memoized

  const fetchFollowers = useCallback(async () => {
    try {
      const res = await fetch(`http://localhost:3000/profile/followers`, {
        method: 'GET',
        credentials: 'include'
      });
      const data = await res.json();
      setFollowers(data);
    } catch (error) {
      console.error("Error fetching followers:", error);
      setFollowers([]); // Ensure state is reset on error
    }
  }, []); // No dependencies for fetchFollowers itself

  const fetchFollowing = useCallback(async () => {
    try {
      const res = await fetch(`http://localhost:3000/profile/followings`, {
        method: 'GET',
        credentials: 'include'
      });
      const data = await res.json();
      setFollowing(data);
    } catch (error) {
      console.error("Error fetching following:", error);
      setFollowing([]); // Ensure state is reset on error
    }
  }, []); // No dependencies for fetchFollowing itself


  useEffect(() => {
    fetchData();
  }, [fetchData]); // Depend on memoized fetchData


  const handleFollow = useCallback(async (username) => {
    try {
      await fetch(`http://localhost:3000/profile/follow/${username}`, {
        method: 'POST',
        credentials: 'include'
      });
      fetchData(); // Re-fetch all data to update both lists
    } catch (error) {
      console.error("Error following user:", error);
    }
  }, [fetchData]);

  const handleUnfollow = useCallback(async (username) => {
    try {
      await fetch(`http://localhost:3000/profile/unfollow/${username}`, {
        method: 'POST',
        credentials: 'include'
      });
      fetchData(); // Re-fetch all data to update both lists
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  }, [fetchData]);

  const navigateToProfile = useCallback((username) => {
    navigate(`/profile/${username}`);
  }, [navigate]);

  return (
    <div className={`rounded-xl ${currentThemeStyles.card} ${currentThemeStyles.shadow} p-8 border ${currentThemeStyles.border} transition-colors duration-200`}>
      <h2 className={`text-2xl font-bold mb-6 ${currentThemeStyles.sectionTitle}`}>Connections</h2>

      <div className={`flex border-b ${currentThemeStyles.border} mb-6`}>
        <button
          className={`flex-1 px-4 py-3 text-lg font-semibold transition-colors duration-200 ${
            activeTab === 'followers'
              ? `${currentThemeStyles.tabActiveText} border-b-2 ${currentThemeStyles.tabActiveBorder}`
              : `${currentThemeStyles.tabInactiveText} hover:${currentThemeStyles.primaryAccent}`
          }`}
          onClick={() => setActiveTab('followers')}
        >
          Followers ({isLoading ? '...' : followers?.length || 0})
        </button>
        <button
          className={`flex-1 px-4 py-3 text-lg font-semibold transition-colors duration-200 ${
            activeTab === 'following'
              ? `${currentThemeStyles.tabActiveText} border-b-2 ${currentThemeStyles.tabActiveBorder}`
              : `${currentThemeStyles.tabInactiveText} hover:${currentThemeStyles.primaryAccent}`
          }`}
          onClick={() => setActiveTab('following')}
        >
          Following ({isLoading ? '...' : following?.length || 0})
        </button>
      </div>

      <div className="max-h-96 overflow-y-auto custom-scrollbar pr-2">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className={`animate-spin rounded-full h-12 w-12 border-b-4 ${currentThemeStyles.loaderColor}`}></div>
          </div>
        ) : activeTab === 'followers' ? (
          <FollowerList
            followers={followers}
            followingUsernames={following.map(connection => connection.reciever.username)} // Pass only usernames for simpler check
            onFollow={handleFollow}
            onProfileClick={navigateToProfile}
            themeStyles={currentThemeStyles}
          />
        ) : (
          <FollowingList
            following={following}
            onUnfollow={handleUnfollow}
            onProfileClick={navigateToProfile}
            themeStyles={currentThemeStyles}
          />
        )}
      </div>
    </div>
  );
};

// --- FollowerList Component ---
const FollowerList = ({ followers, followingUsernames, onFollow, onProfileClick, themeStyles }) => {
  if (!followers?.length) {
    return (
      <div className="text-center py-8">
        <div className={`${themeStyles.emptyStateIconBg} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner`}>
          <svg className={`w-8 h-8 ${themeStyles.secondaryText}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <h3 className={`text-lg font-medium ${themeStyles.text}`}>No followers yet</h3>
        <p className={`${themeStyles.secondaryText} mt-1`}>Your followers will appear here.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {followers.map((follower) => (
        <div key={follower._id} className={`flex items-center p-4 border ${themeStyles.border} rounded-lg ${themeStyles.subCardBg} hover:bg-opacity-80 transition-colors shadow-sm`}>
          {/* Profile picture with fallback */}
          <div
            className="relative flex-shrink-0 cursor-pointer"
            onClick={() => onProfileClick(follower.sender.username)}
          >
            {follower.sender.profilePicture ? (
              <img
                src={follower.sender.profilePicture}
                alt={follower.sender.username}
                className={`w-14 h-14 rounded-full object-cover border-2 ${themeStyles.primaryAccentBorder}`}
              />
            ) : (
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold ${themeStyles.subCardBg} ${themeStyles.secondaryText} border-2 border-dashed ${themeStyles.border}`}>
                {follower.sender.username.charAt(0).toUpperCase()}
              </div>
            )}
            {/* Ranking badge */}
            {follower.sender.ranking && (
              <div className={`${themeStyles.rankingBadgeBg} text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center absolute -bottom-1 -right-1 border-2 ${themeStyles.card}`}>
                {follower.sender.ranking}
              </div>
            )}
          </div>

          <div
            className="ml-4 overflow-hidden cursor-pointer flex-1"
            onClick={() => onProfileClick(follower.sender.username)}
          >
            <h3 className={`font-semibold text-lg ${themeStyles.text} truncate`}>
              {follower.sender.name || follower.sender.username}
            </h3>
            <p className={`${themeStyles.secondaryText} text-sm truncate`}>
              @{follower.sender.username}
            </p>
          </div>

          {followingUsernames.includes(follower.sender.username) ? (
            <button
              // This button means the current user is ALREADY following this follower
              className={`ml-2 text-sm font-semibold ${themeStyles.buttonSecondaryBg} ${themeStyles.buttonSecondaryText} px-4 py-2 rounded-lg transition-colors duration-200 cursor-not-allowed`}
              disabled // Disable if already following
            >
              Following
            </button>
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); onFollow(follower.sender.username); }}
              className={`ml-2 text-sm font-semibold ${themeStyles.buttonPrimaryBg} ${themeStyles.buttonPrimaryText} px-4 py-2 rounded-lg transition-colors duration-200 hover:scale-105`}
            >
              Follow
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

// --- FollowingList Component ---
const FollowingList = ({ following, onUnfollow, onProfileClick, themeStyles }) => {
  if (!following?.length) {
    return (
      <div className="text-center py-8">
        <div className={`${themeStyles.emptyStateIconBg} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner`}>
          <svg className={`w-8 h-8 ${themeStyles.secondaryText}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <h3 className={`text-lg font-medium ${themeStyles.text}`}>Not following anyone</h3>
        <p className={`${themeStyles.secondaryText} mt-1`}>People you follow will appear here.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {following.map((connection) => {
        const user = connection.reciever; // Correctly get the receiver user object
        return (
          <div key={connection._id} className={`flex items-center p-4 border ${themeStyles.border} rounded-lg ${themeStyles.subCardBg} hover:bg-opacity-80 transition-colors shadow-sm`}>
            {/* Profile picture with fallback */}
            <div
              className="relative flex-shrink-0 cursor-pointer"
              onClick={() => onProfileClick(user.username)}
            >
              {user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.username}
                  className={`w-14 h-14 rounded-full object-cover border-2 ${themeStyles.primaryAccentBorder}`}
                />
              ) : (
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold ${themeStyles.subCardBg} ${themeStyles.secondaryText} border-2 border-dashed ${themeStyles.border}`}>
                  <span className="text-lg font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              {/* Ranking badge */}
              {user.ranking && (
                <div className={`${themeStyles.rankingBadgeBg} text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center absolute -bottom-1 -right-1 border-2 ${themeStyles.card}`}>
                  {user.ranking}
                </div>
              )}
            </div>

            <div
              className="ml-4 overflow-hidden cursor-pointer flex-1"
              onClick={() => onProfileClick(user.username)}
            >
              <h3 className={`font-semibold text-lg ${themeStyles.text} truncate`}>
                {user.name || user.username}
              </h3>
              <p className={`${themeStyles.secondaryText} text-sm truncate`}>
                @{user.username}
              </p>
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); onUnfollow(user.username); }}
              className={`ml-2 text-sm font-semibold ${themeStyles.unfollowButtonBg} ${themeStyles.unfollowButtonText} px-4 py-2 rounded-lg transition-colors duration-200 hover:scale-105`}
            >
              Unfollow
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ConnectionsSection;