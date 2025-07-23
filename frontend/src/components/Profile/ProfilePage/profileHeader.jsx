import React from "react";
import { FiEdit, FiUserPlus, FiCheck } from "react-icons/fi";

// --- RETRO THEME DEFINITIONS ---
// This theme is consistent with the other retro components.
const retroThemeColors = {
    bgPrimary: "bg-stone-100",
    textPrimary: "text-stone-800",
    textSecondary: "text-stone-500",
    textAccent: "text-teal-600",
    panelBg: "bg-white",
    panelBorder: "border-stone-800",
    buttonPrimaryBg: "bg-teal-400 hover:bg-teal-500",
    buttonSecondaryBg: "bg-stone-200 hover:bg-stone-300",
    buttonText: "text-stone-800",
    accentBg: "bg-amber-100",
};

// --- Reusable UI Components ---
const Button = ({ children, onClick, disabled, className = '', small = false, type = 'primary' }) => {
    const sizeStyle = small ? 'px-4 py-2 text-base' : 'px-5 py-2.5 text-lg';
    const baseStyle = `border-2 ${retroThemeColors.panelBorder} ${retroThemeColors.buttonText} shadow-chunky transition-all hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] disabled:opacity-70 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0 flex items-center justify-center gap-2`;
    const typeStyle = disabled ? "bg-stone-300" : (type === 'primary' ? retroThemeColors.buttonPrimaryBg : retroThemeColors.buttonSecondaryBg);
    return (
        <button onClick={onClick} disabled={disabled} className={`${baseStyle} ${sizeStyle} ${typeStyle} ${className}`}>
            {children}
        </button>
    );
};

const RetroCard = ({ children, className = '' }) => (
    <div className={`border-4 ${retroThemeColors.panelBorder} bg-white shadow-chunky ${className}`}>
        {children}
    </div>
);

const DetailItem = ({ label, value }) => {
    if (!value || value === "Not specified") return null;
    return (
        <div>
            <p className={`text-sm ${retroThemeColors.textSecondary}`}>{label}</p>
            <p className={`font-bold text-base ${retroThemeColors.textPrimary}`}>{value}</p>
        </div>
    );
};


// ================
// MAIN COMPONENT
// ================
export default function ProfileHeader({
    profile,
    stats,
    isFollowing,
    setIsFollowing,
    onEditClick,
    isOwnProfile,
    isFollowingAllowed
}) {
    // --- LOGIC (Functionality Unchanged) ---
    const handleFollow = async () => {
        const url = isFollowing
            ? `http://localhost:3000/profile/unfollow/${profile.username}`
            : `http://localhost:3000/profile/follow/${profile.username}`;
        try {
            await fetch(url, { method: "POST", credentials: "include" });
            setIsFollowing(!isFollowing);
        } catch (error) {
            console.error("Error toggling follow status:", error);
        }
    };

    const displayName = profile?.firstName || profile?.lastName
        ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim()
        : profile?.username;

    return (
        <RetroCard>
            <div className="p-6">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                    {/* Profile Image & Rank */}
                    <div className="relative flex-shrink-0 text-center">
                        <img
                            src={profile.profilePicture || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.username}`}
                            alt="Profile"
                            className={`w-32 h-32 object-cover border-4 ${retroThemeColors.panelBorder}`}
                        />
                        <div className={`mt-2 px-3 py-1 border-2 ${retroThemeColors.panelBorder} ${retroThemeColors.accentBg} inline-block`}>
                            <p className="font-bold text-lg">RANK #{stats.ranking || "N/A"}</p>
                        </div>
                    </div>

                    {/* Profile Details & Actions */}
                    <div className="flex-1 w-full text-center md:text-left">
                        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4">
                            <div>
                                <h1 className="text-4xl font-bold">{displayName}</h1>
                                <p className={`text-xl ${retroThemeColors.textSecondary}`}>@{profile.username}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                {isOwnProfile ? (
                                    <Button onClick={onEditClick} type="secondary" small>
                                        <FiEdit /> Edit Profile
                                    </Button>
                                ) : isFollowingAllowed && (
                                    <Button onClick={handleFollow} type={isFollowing ? "secondary" : "primary"} small>
                                        {isFollowing ? <><FiCheck /> Following</> : <><FiUserPlus /> Follow</>}
                                    </Button>
                                )}
                            </div>
                        </div>
                        
                        <hr className={`my-4 border-t-2 border-dashed border-stone-300`} />

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
                            <DetailItem label="Location" value={profile.city && profile.country ? `${profile.city}, ${profile.country}` : profile.country} />
                            <DetailItem label="Institution" value={profile.college} />
                            <DetailItem label="Followers" value={stats.followers} />
                            <DetailItem label="Following" value={stats.following} />
                        </div>
                    </div>
                </div>
            </div>
        </RetroCard>
    );
};
