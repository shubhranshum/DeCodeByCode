import React, { useState } from "react";

const ProfileHeader = ({ 
  profile, 
  isFollowing, 
  setIsFollowing, 
  onEditClick, 
  theme, 
  toggleTheme, 
  isOwnProfile,
  isFollowingAllowed,
  themeStyles // Passed from parent for consistent styling
}) => {
  const handleFollow = async () => {
    const url = isFollowing 
      ? `http://localhost:3000/profile/unfollow/${profile.username}` 
      : `http://localhost:3000/profile/follow/${profile.username}`;
    try {
      await fetch(url, {
        method: "POST",
        credentials: "include",
      });
      setIsFollowing(!isFollowing);
      // Optionally, add a small toast notification here
    } catch (error) {
      console.error("Error toggling follow status:", error);
      // Optionally, show an error message to the user
    }
  };

  const displayName = profile?.firstName || profile?.lastName 
    ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim()
    : profile?.username;

  return (
    <div className={`rounded-2xl ${themeStyles.card} ${themeStyles.shadow} p-8 mb-10 transition-colors border ${themeStyles.border}`}>
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10">
        {/* Profile Image & Rank */}
        <div className="relative flex-shrink-0">
          <div className="relative group">
            {profile?.profilePicture ? (
              <img
                src={profile.profilePicture}
                alt="Profile"
                className={`w-40 h-40 rounded-full object-cover border-4 ${themeStyles.primaryAccentBorder} shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl`}
              />
            ) : (
              <div className={`w-40 h-40 rounded-full flex items-center justify-center text-5xl font-bold ${themeStyles.subCardBg} ${themeStyles.secondaryText} border-4 ${themeStyles.primaryAccentBorder} shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl`}>
                {profile?.username ? profile.username.charAt(0).toUpperCase() : '?'}
              </div>
            )}
            
            {isOwnProfile && (
              <button 
                className={`absolute bottom-2 right-2 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 transform group-hover:scale-110 
                  ${themeStyles.secondaryAccentBg || 'bg-teal-500'} ${themeStyles.buttonPrimaryText} shadow-md hover:shadow-lg`}
                onClick={onEditClick}
                aria-label="Edit Profile"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            )}
          </div>

          {/* Rank Badge */}
          <div className={`absolute -top-2 -right-4 px-4 py-2 rounded-full font-bold text-lg shadow-xl transform rotate-3 transition-transform duration-300 group-hover:rotate-0
            ${themeStyles.buttonPrimaryBg} ${themeStyles.buttonPrimaryText}`}>
            #{profile?.stats?.ranking || "N/A"} Rank
          </div>
        </div>

        {/* Profile Details & Actions */}
        <div className="flex-1 w-full text-center lg:text-left">
          <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start gap-4 mb-6">
            <div>
              {/* Full Name */}
              <h1 className={`text-4xl font-extrabold mb-1 leading-tight ${themeStyles.text}`}>
                {displayName}
              </h1>

              {/* Username & Role */}
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                <span className={`text-xl font-medium ${themeStyles.secondaryText}`}>
                  @{profile?.username}
                </span>
                <span
                  className={`text-sm px-3 py-1 rounded-full font-semibold border ${
                    profile.isAdmin
                      ? (theme === "dark" ? "bg-yellow-900/30 text-yellow-300 border-yellow-500" : "bg-yellow-100 text-yellow-800 border-yellow-300")
                      : (theme === "dark" ? "bg-cyan-900/30 text-cyan-300 border-cyan-500" : "bg-teal-100 text-teal-700 border-teal-300") // Green-blue for user role
                  }`}
                >
                  {profile.isAdmin ? "Admin" : "User"}
                </span>
              </div>

              {/* Personal Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-left">
                <DetailItem icon="user" label="Age" value={profile?.age || "Not specified"} themeStyles={themeStyles} />
                <DetailItem icon="mail" label="Email" value={profile?.email} themeStyles={themeStyles} />
                <DetailItem icon="college" label="College" value={profile?.college || "Not specified"} themeStyles={themeStyles} />
                <DetailItem icon="location" label="Location" value={profile?.city ? `${profile.city}, ${profile.state}, ${profile.country}` : "Not specified"} themeStyles={themeStyles} />
                {profile?.company && <DetailItem icon="company" label="Company" value={profile.company} themeStyles={themeStyles} />}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col items-center lg:items-end gap-3 mt-4 lg:mt-0">
              <button
                onClick={toggleTheme}
                className={`p-3 rounded-full transition-colors duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  theme === "dark" 
                    ? "bg-gray-700 hover:bg-gray-600 text-gray-300 focus:ring-gray-500" 
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700 focus:ring-gray-300"
                }`}
                aria-label="Toggle theme"
              >
                {theme === "light" ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 20 20" fill="currentColor"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" /></svg>
                )}
              </button>

              {!isOwnProfile && isFollowingAllowed && (
                <button
                  onClick={handleFollow}
                  className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    isFollowing
                      ? `${themeStyles.buttonSecondaryBg} ${themeStyles.buttonSecondaryText} focus:ring-gray-500`
                      : `${themeStyles.buttonPrimaryBg} ${themeStyles.buttonPrimaryText} focus:ring-indigo-500`
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      Following
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                      Follow
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Helper Component for Detail Items ---
const DetailItem = ({ icon, label, value, themeStyles }) => {
  if (!value || value === "Not specified") return null; // Don't render if value is missing

  let svgPath = "";
  switch (icon) {
    case "user": svgPath = "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"; break;
    case "mail": svgPath = "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"; break;
    case "college": svgPath = "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"; break;
    case "location": svgPath = "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z"; break;
    case "company": svgPath = "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"; break;
    default: svgPath = "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"; // Generic icon
  }

  return (
    <div className="flex items-start">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 flex-shrink-0
        ${themeStyles.subCardBg} ${themeStyles.secondaryAccentText} `} // Using subCardBg and secondaryAccentText for icon container
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
            d={svgPath}
          />
        </svg>
      </div>
      <div>
        <div className={`text-sm ${themeStyles.secondaryText}`}>
          {label}
        </div>
        <div className={`font-medium text-base ${themeStyles.text}`}>
          {value}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;