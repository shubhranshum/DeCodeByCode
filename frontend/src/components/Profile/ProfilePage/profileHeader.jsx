import React, { useState } from "react";

const ProfileHeader = ({ profile, isFollowing , setIsFollowing, onEditClick, theme, toggleTheme, isOwnProfile,isFollowingAllowed }) => {
  
  
  const handleFollow = async() =>{
    const url = isFollowing ? `http://localhost:3000/profile/unfollow/${profile.username}` : `http://localhost:3000/profile/follow/${profile.username}`;
    await fetch(url, {
      method: "POST",
      credentials: "include",
    });
    setIsFollowing(!isFollowing);
  };

  return (
    <div className={`rounded-xl shadow-sm p-6 mb-8 transition-colors border ${
      theme === "dark" 
        ? "bg-gray-800 border-gray-700" 
        : "bg-white border-gray-200"
    }`}>
      <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
        {/* Profile Image */}
        <div className="relative shrink-0">
          <div className="relative">
            <img
              src={profile?.profilePicture || "https://via.placeholder.com/150"}
              alt="Profile"
              className="w-36 h-36 rounded-full object-cover border-4 shadow-lg"
              style={{
                borderColor: theme === "dark" ? "#374151" : "#f3f4f6"
              }}
            />
            {isOwnProfile && (
              <div 
                className={`absolute bottom-2 right-2 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                  theme === "dark" 
                    ? "bg-indigo-600 hover:bg-indigo-700" 
                    : "bg-indigo-500 hover:bg-indigo-600"
                } text-white`}
                onClick={onEditClick}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Rank Badge */}
          <div className={`absolute -top-2 -right-2 text-xs font-bold px-3 py-1 rounded-full shadow-md ${
            theme === "dark" 
              ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white" 
              : "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
          }`}>
            #{profile?.stats?.ranking || "N/A"} Rank
          </div>
        </div>

        {/* Profile Details */}
        <div className="flex-1 w-full">
          <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
            <div>
              {/* Full Name */}
              <h1 className={`text-3xl font-bold mb-1 ${
                theme === "dark" ? "text-gray-100" : "text-gray-900"
              }`}>
                {profile?.firstName} {profile?.lastName}
              </h1>

              {/* Username */}
              <div className="flex items-center gap-3 mb-4">
                <span className={`font-medium ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}>
                  @{profile?.username}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    profile.isAdmin
                      ? theme === "dark" 
                          ? "bg-yellow-900/30 text-yellow-300" 
                          : "bg-yellow-100 text-yellow-800"
                      : theme === "dark" 
                          ? "bg-green-900/30 text-green-300" 
                          : "bg-green-100 text-green-800"
                  }`}
                >
                  {profile.isAdmin ? "Admin" : "User"}
                </span>
              </div>

              {/* Personal Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div className="flex items-start">
                  <svg
                    className={`w-5 h-5 mr-2 mt-0.5 flex-shrink-0 ${
                      theme === "dark" ? "text-gray-500" : "text-gray-400"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <div>
                    <div className={`text-xs ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}>
                      Age
                    </div>
                    <div className={theme === "dark" ? "text-gray-200" : "text-gray-700"}>
                      {profile?.age || "Not specified"}
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <svg
                    className={`w-5 h-5 mr-2 mt-0.5 flex-shrink-0 ${
                      theme === "dark" ? "text-gray-500" : "text-gray-400"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <div>
                    <div className={`text-xs ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}>
                      Email
                    </div>
                    <div className={theme === "dark" ? "text-gray-200" : "text-gray-700"}>
                      {profile?.email}
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <svg
                    className={`w-5 h-5 mr-2 mt-0.5 flex-shrink-0 ${
                      theme === "dark" ? "text-gray-500" : "text-gray-400"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  <div>
                    <div className={`text-xs ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}>
                      College
                    </div>
                    <div className={theme === "dark" ? "text-gray-200" : "text-gray-700"}>
                      {profile?.college || "Not specified"}
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <svg
                    className={`w-5 h-5 mr-2 mt-0.5 flex-shrink-0 ${
                      theme === "dark" ? "text-gray-500" : "text-gray-400"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <div>
                    <div className={`text-xs ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}>
                      Location
                    </div>
                    <div className={theme === "dark" ? "text-gray-200" : "text-gray-700"}>
                      {profile?.city
                        ? `${profile.city}, ${profile.state}, ${profile.country}`
                        : "Not specified"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full transition-colors ${
                  theme === "dark" 
                    ? "bg-gray-700 hover:bg-gray-600 text-gray-300" 
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
                aria-label="Toggle theme"
              >
                {theme === "light" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>

              {isOwnProfile ? (
                <button
                  onClick={onEditClick}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors shadow-md hover:shadow-lg ${
                    theme === "dark" 
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white" 
                      : "bg-indigo-500 hover:bg-indigo-600 text-white"
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit Profile
                </button>
              ) : isFollowingAllowed ?(
                <button
                  onClick={handleFollow}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors shadow-md hover:shadow-lg ${
                    isFollowing
                      ? theme === "dark" 
                          ? "bg-gray-700 hover:bg-gray-600 text-gray-200" 
                          : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                      : theme === "dark" 
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white" 
                          : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style={{ display: isFollowing ? 'none' : 'block' }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style={{ display: isFollowing ? 'block' : 'none' }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {isFollowing ? "Following" : "Follow"}
                </button>
              ):
               ""
              }
            </div>
          </div>

          {/* Additional Info */}
          <div className="flex flex-wrap gap-4 border-t pt-4"
            style={{
              borderColor: theme === "dark" ? "#374151" : "#e5e7eb"
            }}>
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                theme === "dark" 
                  ? "bg-indigo-900/30" 
                  : "bg-indigo-100"
              }`}>
                <svg
                  className={`w-5 h-5 ${
                    theme === "dark" 
                      ? "text-indigo-400" 
                      : "text-indigo-600"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <div className={`text-xs ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}>
                  Member since
                </div>
                <div className={`font-medium ${
                  theme === "dark" ? "text-gray-200" : "text-gray-800"
                }`}>
                  {profile &&
                    new Date(profile.joinedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                    })}
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                theme === "dark" 
                  ? "bg-green-900/30" 
                  : "bg-green-100"
              }`}>
                <svg
                  className={`w-5 h-5 ${
                    theme === "dark" 
                      ? "text-green-400" 
                      : "text-green-600"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div>
                <div className={`text-xs ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}>
                  Last active
                </div>
                <div className={`font-medium ${
                  theme === "dark" ? "text-gray-200" : "text-gray-800"
                }`}>
                  {profile &&
                    new Date(profile.lastSeenAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                </div>
              </div>
            </div>

            {profile?.company && (
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                  theme === "dark" 
                    ? "bg-purple-900/30" 
                    : "bg-purple-100"
                }`}>
                  <svg
                    className={`w-5 h-5 ${
                      theme === "dark" 
                        ? "text-purple-400" 
                        : "text-purple-600"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <div className={`text-xs ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}>
                    Company
                  </div>
                  <div className={`font-medium ${
                    theme === "dark" ? "text-gray-200" : "text-gray-800"
                  }`}>
                    {profile?.company}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;