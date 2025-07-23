import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// --- RETRO THEME DEFINITIONS ---
const retroThemeColors = {
    textPrimary: "text-stone-800",
    textSecondary: "text-stone-500",
    textAccent: "text-teal-600",
    panelBorder: "border-stone-800",
    buttonPrimaryBg: "bg-teal-400 hover:bg-teal-500",
    buttonSecondaryBg: "bg-stone-200 hover:bg-stone-300",
    buttonText: "text-stone-800",
    accentBg: "bg-amber-100",
    unfollowButtonBg: "bg-rose-200 hover:bg-rose-300",
};

// --- Reusable UI Components ---
const Button = ({ children, onClick, disabled, className = '', small = false, type = 'primary' }) => {
    const sizeStyle = small ? 'px-3 py-1 text-sm' : 'px-4 py-2 text-base';
    const baseStyle = `border-2 ${retroThemeColors.panelBorder} ${retroThemeColors.buttonText} shadow-chunky transition-all hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] disabled:opacity-70 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0 flex items-center justify-center gap-2 font-bold`;
    const typeStyle = disabled ? "bg-stone-300" : (type === 'primary' ? retroThemeColors.buttonPrimaryBg : retroThemeColors.buttonSecondaryBg);
    return (
        <button onClick={onClick} disabled={disabled} className={`${baseStyle} ${sizeStyle} ${typeStyle} ${className}`}>
            {children}
        </button>
    );
};

const TabButton = ({ children, isActive, onClick }) => (
    <button onClick={onClick} className={`flex-1 p-3 text-lg border-r-2 last:border-r-0 ${retroThemeColors.panelBorder} transition-colors ${isActive ? `bg-white ${retroThemeColors.textAccent}` : `${retroThemeColors.buttonSecondaryBg} ${retroThemeColors.textPrimary} hover:bg-stone-300`}`}>
        {children}
    </button>
);

// --- List Components ---
const FollowerList = ({ followers, followingUsernames, onFollow, onProfileClick }) => {
    if (!followers?.length) {
        return <div className="p-8 text-center text-lg text-stone-500">No followers yet.</div>;
    }
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {followers.map(({ sender }) => (
                <div key={sender._id} className={`flex items-center p-3 border-2 ${retroThemeColors.panelBorder} bg-stone-50`}>
                    <img
                        src={sender.profilePicture || `https://api.dicebear.com/7.x/initials/svg?seed=${sender.username}`}
                        alt={sender.username}
                        className={`w-12 h-12 border-2 ${retroThemeColors.panelBorder} cursor-pointer`}
                        onClick={() => onProfileClick(sender.username)}
                    />
                    <div className="ml-3 flex-1 overflow-hidden cursor-pointer" onClick={() => onProfileClick(sender.username)}>
                        <h3 className="font-bold truncate">{sender.username}</h3>
                        <p className={`text-sm ${retroThemeColors.textSecondary} truncate`}>Rank: {sender.ranking || 'N/A'}</p>
                    </div>
                    {!followingUsernames.includes(sender.username) && (
                        <Button onClick={(e) => { e.stopPropagation(); onFollow(sender.username); }} small>Follow</Button>
                    )}
                </div>
            ))}
        </div>
    );
};

const FollowingList = ({ following, onUnfollow, onProfileClick }) => {
    if (!following?.length) {
        return <div className="p-8 text-center text-lg text-stone-500">Not following anyone.</div>;
    }
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {following.map(({ reciever }) => (
                <div key={reciever._id} className={`flex items-center p-3 border-2 ${retroThemeColors.panelBorder} bg-stone-50`}>
                    <img
                        src={reciever.profilePicture || `https://api.dicebear.com/7.x/initials/svg?seed=${reciever.username}`}
                        alt={reciever.username}
                        className={`w-12 h-12 border-2 ${retroThemeColors.panelBorder} cursor-pointer`}
                        onClick={() => onProfileClick(reciever.username)}
                    />
                    <div className="ml-3 flex-1 overflow-hidden cursor-pointer" onClick={() => onProfileClick(reciever.username)}>
                        <h3 className="font-bold truncate">{reciever.username}</h3>
                        <p className={`text-sm ${retroThemeColors.textSecondary} truncate`}>Rank: {reciever.ranking || 'N/A'}</p>
                    </div>
                    <Button onClick={(e) => { e.stopPropagation(); onUnfollow(reciever.username); }} small type="secondary" className={retroThemeColors.unfollowButtonBg}>Unfollow</Button>
                </div>
            ))}
        </div>
    );
};


// ================
// MAIN COMPONENT
// ================
const ConnectionsSection = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('followers');
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // --- LOGIC (Functionality Unchanged) ---
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [followersRes, followingRes] = await Promise.all([
                fetch(`http://localhost:3000/profile/followers`, { credentials: 'include' }),
                fetch(`http://localhost:3000/profile/followings`, { credentials: 'include' })
            ]);
            const followersData = await followersRes.json();
            const followingData = await followingRes.json();
            setFollowers(followersData || []);
            setFollowing(followingData || []);
        } catch (error) {
            console.error("Error fetching connections:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleFollow = useCallback(async (username) => {
        try {
            await fetch(`http://localhost:3000/profile/follow/${username}`, { method: 'POST', credentials: 'include' });
            fetchData(); // Re-fetch all data to update both lists
        } catch (error) { console.error("Error following user:", error); }
    }, [fetchData]);

    const handleUnfollow = useCallback(async (username) => {
        try {
            await fetch(`http://localhost:3000/profile/unfollow/${username}`, { method: 'POST', credentials: 'include' });
            fetchData(); // Re-fetch all data to update both lists
        } catch (error) { console.error("Error unfollowing user:", error); }
    }, [fetchData]);

    const navigateToProfile = useCallback((username) => {
        navigate(`/profile/${username}`);
    }, [navigate]);

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Connections</h2>
            <div className={`border-4 ${retroThemeColors.panelBorder} bg-white shadow-chunky`}>
                <div className="flex border-b-4 border-stone-800">
                    <TabButton isActive={activeTab === 'followers'} onClick={() => setActiveTab('followers')}>
                        Followers ({isLoading ? '...' : followers?.length || 0})
                    </TabButton>
                    <TabButton isActive={activeTab === 'following'} onClick={() => setActiveTab('following')}>
                        Following ({isLoading ? '...' : following?.length || 0})
                    </TabButton>
                </div>

                <div className="p-6 min-h-[24rem]">
                    {isLoading ? (
                        <div className="flex justify-center py-10">
                            <div className={`animate-spin rounded-full h-12 w-12 border-b-4 ${retroThemeColors.panelBorder}`}></div>
                        </div>
                    ) : activeTab === 'followers' ? (
                        <FollowerList
                            followers={followers}
                            followingUsernames={following.map(connection => connection?.reciever?.username)}
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
        </div>
    );
};

export default ConnectionsSection;
