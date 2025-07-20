import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ConnectionsSection = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('followers');
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([fetchFollowers(), fetchFollowing()]);
    } catch (error) {
      console.error("Error fetching connections:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFollowers = async () => {
    const res = await fetch(`http://localhost:3000/profile/followers`, {
      method: 'GET',
      credentials: 'include'
    });
    const data = await res.json();
    setFollowers(data);
  };

  const fetchFollowing = async () => {
    const res = await fetch(`http://localhost:3000/profile/followings`, {
      method: 'GET',
      credentials: 'include'
    });
    const data = await res.json();
    setFollowing(data);
  };

  const handleFollow = async (username) => {
    try {
      await fetch(`http://localhost:3000/profile/follow/${username}`, {
        method: 'POST',
        credentials: 'include'
      });
      fetchData(); // Refresh data after follow
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const handleUnfollow = async (username) => {
    try {
      await fetch(`http://localhost:3000/profile/unfollow/${username}`, {
        method: 'POST',
        credentials: 'include'
      });
      fetchData(); // Refresh data after unfollow
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  const navigateToProfile = (username) => {
    navigate(`/profile/${username}`);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-md p-6 transition-colors">
      <div className="flex border-b border-slate-200 dark:border-gray-700 mb-6">
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'followers' 
            ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' 
            : 'text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-300'}`}
          onClick={() => setActiveTab('followers')}
        >
          Followers ({isLoading ? '...' : followers?.length || 0})
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'following' 
            ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' 
            : 'text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-300'}`}
          onClick={() => setActiveTab('following')}
        >
          Following ({isLoading ? '...' : following?.length || 0})
        </button>
      </div>

      <div className="max-h-96 overflow-y-auto pr-2">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : activeTab === 'followers' ? (
          <FollowerList 
            followers={followers}
            following={following}
            onFollow={handleFollow} 
            onProfileClick={navigateToProfile}
          />
        ) : (
          <FollowingList 
            following={following} 
            onUnfollow={handleUnfollow} 
            onProfileClick={navigateToProfile}
          />
        )}
      </div>
    </div>
  );
};

const FollowerList = ({ followers, following ,onFollow, onProfileClick }) => {
  if (!followers?.length) {
    return (
      <div className="text-center py-8">
        <div className="bg-slate-100 dark:bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-slate-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-slate-700 dark:text-gray-300">No followers yet</h3>
        <p className="text-slate-500 dark:text-gray-500 mt-1">Your followers will appear here</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {followers.map((follower) => (
        
        <div key={follower._id} className="flex items-center p-3 border border-slate-200 dark:border-gray-700 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-700/50 transition-colors">
          
          <div 
            className="relative cursor-pointer"
            onClick={() => onProfileClick(follower.username)}
          >
            {follower.sender.profilePicture ? (
              <img 
                src={follower.sender.profilePicture} 
                alt={follower.sender.username} 
                className="w-12 h-12 rounded-full object-cover border-2 border-indigo-100 dark:border-gray-600"
              />
            ) : (
              <div className="bg-gray-200 border-2 border-dashed rounded-full w-12 h-12 flex items-center justify-center">
                <span className="text-lg font-bold text-gray-500">
                  {follower.sender.username.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            {/* Ranking badge */}
            {follower.ranking && (
              <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {follower.ranking}
              </div>
            )}
          </div>
          
          <div 
            className="ml-3 overflow-hidden cursor-pointer flex-1"
            onClick={() => onProfileClick(follower.username)}
          >
            <h3 className="font-medium text-slate-800 dark:text-gray-200 truncate">
              {follower.sender.username || follower.username}
            </h3>
            <p className="text-slate-500 dark:text-gray-400 text-sm truncate">
              @{follower.sender.username}
            </p>
            {follower.sender.email && (
              <p className="text-xs text-slate-500 dark:text-gray-500 truncate mt-1">
                {follower.sender.email}
              </p>
            )}
          </div>
          
          {<button 
            onClick={() => onFollow(follower.sender.username)}
            className="ml-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg transition-colors"
          >
            Follow
          </button>}
        </div>
      ))}
    </div>
  );
};

const FollowingList = ({ following, onUnfollow, onProfileClick }) => {
  if (!following?.length) {
    return (
      <div className="text-center py-8">
        <div className="bg-slate-100 dark:bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-slate-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-slate-700 dark:text-gray-300">Not following anyone</h3>
        <p className="text-slate-500 dark:text-gray-500 mt-1">People you follow will appear here</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {following.map((connection) => {
        const user = connection.reciever;
        return (
          <div key={connection._id} className="flex items-center p-3 border border-slate-200 dark:border-gray-700 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-700/50 transition-colors">
            {/* Profile picture with fallback */}
            <div 
              className="relative cursor-pointer"
              onClick={() => onProfileClick(user.username)}
            >
              {user.profilePicture ? (
                <img 
                  src={user.profilePicture} 
                  alt={user.username} 
                  className="w-12 h-12 rounded-full object-cover border-2 border-indigo-100 dark:border-gray-600"
                />
              ) : (
                <div className="bg-gray-200 border-2 border-dashed rounded-full w-12 h-12 flex items-center justify-center">
                  <span className="text-lg font-bold text-gray-500">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              {/* Ranking badge */}
              {user.ranking && (
                <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {user.ranking}
                </div>
              )}
            </div>
            
            <div 
              className="ml-3 overflow-hidden cursor-pointer flex-1"
              onClick={() => onProfileClick(user.username)}
            >
              <h3 className="font-medium text-slate-800 dark:text-gray-200 truncate">
                {user.name || user.username}
              </h3>
              <p className="text-slate-500 dark:text-gray-400 text-sm truncate">
                @{user.username}
              </p>
              {user.email && (
                <p className="text-xs text-slate-500 dark:text-gray-500 truncate mt-1">
                  {user.email}
                </p>
              )}
              {user.bio && (
                <p className="text-xs text-slate-500 dark:text-gray-400 mt-1 truncate">
                  {user.bio}
                </p>
              )}
            </div>
            
            <button 
              onClick={() => onUnfollow(user.username)}
              className="ml-2 text-sm bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-lg transition-colors"
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