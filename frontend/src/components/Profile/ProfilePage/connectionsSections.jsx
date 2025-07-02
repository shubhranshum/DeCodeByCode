import React, { useState } from 'react';

const ConnectionsSection = ({ followers, following }) => {
  const [activeTab, setActiveTab] = useState('followers');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-md p-6 transition-colors">
      <div className="flex border-b border-slate-200 dark:border-gray-700 mb-6">
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'followers' 
            ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' 
            : 'text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-300'}`}
          onClick={() => setActiveTab('followers')}
        >
          Followers ({followers?.length || 0})
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'following' 
            ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' 
            : 'text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-300'}`}
          onClick={() => setActiveTab('following')}
        >
          Following ({following?.length || 0})
        </button>
      </div>

      <div className="max-h-96 overflow-y-auto pr-2">
        {activeTab === 'followers' ? (
          <FollowerList followers={followers} />
        ) : (
          <FollowingList following={following} />
        )}
      </div>
    </div>
  );
};

const FollowerList = ({ followers }) => {
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
        <div key={follower.id} className="flex items-center p-3 border border-slate-200 dark:border-gray-700 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-700/50 transition-colors">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12" />
          <div className="ml-3 overflow-hidden">
            <h3 className="font-medium text-slate-800 dark:text-gray-200 truncate">{follower.name}</h3>
            <p className="text-slate-500 dark:text-gray-400 text-sm truncate">@{follower.username}</p>
          </div>
          <button className="ml-auto text-sm bg-slate-100 dark:bg-gray-700 hover:bg-slate-200 dark:hover:bg-gray-600 text-slate-800 dark:text-gray-200 px-3 py-1 rounded-lg">
            Follow
          </button>
        </div>
      ))}
    </div>
  );
};

const FollowingList = ({ following }) => {
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
      {following.map((user) => (
        <div key={user.id} className="flex items-center p-3 border border-slate-200 dark:border-gray-700 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-700/50 transition-colors">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12" />
          <div className="ml-3 overflow-hidden">
            <h3 className="font-medium text-slate-800 dark:text-gray-200 truncate">{user.name}</h3>
            <p className="text-slate-500 dark:text-gray-400 text-sm truncate">@{user.username}</p>
          </div>
          <button className="ml-auto text-sm bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 px-3 py-1 rounded-lg">
            Unfollow
          </button>
        </div>
      ))}
    </div>
  );
};

export default ConnectionsSection;