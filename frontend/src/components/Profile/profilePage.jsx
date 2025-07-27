import React, { useState, useEffect, useCallback, useRef, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { useParams, Link } from "react-router-dom";

// --- Child Component Imports (Functionality Preserved) ---
import AchievementsSection from "./ProfilePage/achievementsSection";
import ActivityFeed from "./ProfilePage/activityFeed";
import BlogsSection from "./ProfilePage/blogSection";
import ConnectionsSection from "./ProfilePage/connectionsSections";
import ContributionGraph from "./ProfilePage/contributionGraph";
import EditProfileModal from "./ProfilePage/editProfileModal";
import ProfileHeader from "./ProfilePage/profileHeader";
import SkillsSection from "./ProfilePage/skillsSection";
import RecentAttempts from "./ProfilePage/recentAttempts";
import RecentSolvedProblems from "./ProfilePage/recentSolvedProblems";

// --- RETRO THEME DEFINITIONS ---
const retroThemeColors = {
    bgPrimary: "bg-stone-100",
    textPrimary: "text-stone-800",
    textSecondary: "text-stone-500",
    textAccent: "text-teal-600", // User's preferred green-blue accent
    panelBg: "bg-white",
    panelBorder: "border-stone-800",
    buttonPrimaryBg: "bg-teal-400 hover:bg-teal-500",
    buttonSecondaryBg: "bg-stone-200 hover:bg-stone-300",
    buttonText: "text-stone-800",
    successBg: "bg-emerald-200",
};

// --- Reusable UI Components ---
const RetroCard = ({ children, className = '' }) => (
    <div className={`border-4 ${retroThemeColors.panelBorder} bg-white shadow-chunky ${className}`}>
        {children}
    </div>
);

const TabButton = ({ label, tabName, activeTab, setActiveTab }) => {
    const isActive = activeTab === tabName;
    return (
        <button
            onClick={() => {
                setActiveTab(tabName);
                localStorage.setItem("activeTab", tabName);
            }}
            className={`px-4 py-2 text-base md:text-lg border-2 ${retroThemeColors.panelBorder} font-bold transition-all flex items-center gap-2
                ${isActive
                    ? `bg-teal-400 text-white shadow-chunky`
                    : `bg-stone-200 text-stone-800 shadow-chunky hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]`
                }`}
        >
            {label}
        </button>
    );
};


// ================
// MAIN COMPONENT
// ================
export default function ProfilePage() {
     const { user: currentUser } = useContext(UserContext);
  const { username: urlUsername } = useParams();
  const isOwnProfile = currentUser && currentUser.username === urlUsername;
  const isFollowingAllowed = currentUser != null;
    // --- State Management (Unchanged) ---
    const [profile, setProfile] = useState(null);
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activities, setActivities] = useState([]);
    const [activityLoading, setActivityLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(() => localStorage.getItem("activeTab") || "overview");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [isFollowing, setIsFollowing] = useState(false);
    const [recentAttempts, setRecentAttempts] = useState([]);
    const [solvedProblems, setSolvedProblems] = useState([]);
    const [problems, setProblems] = useState([]);
    const [stats, setStats] = useState({});
    
    // --- Logic Hooks (Functionality Unchanged) ---
    const fetchProfileData = useCallback(async () => {
        try {
            const url = `http://localhost:3000/profile/user/${urlUsername}`;
            const res = await fetch(url, { method: "GET", credentials: "include" });
            const data = await res.json();
            setProfile(data.profile || null);
            setIsFollowing(data.isFollowing || false);
            setStats(data.stats || {});
        } catch (err) { console.error("Error fetching profile:", err); }
    }, [urlUsername]);
    
     const fetchBlogs = useCallback(async () => {
    try {
      const url = `http://localhost:3000/blogs/${urlUsername}`;
      const res = await fetch(url, { method: "GET", credentials: "include" });
      const data = await res.json();
      
        setBlogs(data.blogs);
      
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  }, [urlUsername]);
    const fetchRecentAttempts = useCallback(async () => {
    try {
      const url = `http://localhost:3000/profile/recent-attempts/${urlUsername}`;
      const res = await fetch(url, { method: "GET", credentials: "include" });
      const data = await res.json();
     
        setRecentAttempts(data.attemptedProblems);
      
    } catch (error) {
      console.error("Error fetching recent attempts:", error);
    }
  }, [urlUsername]);
     const fetchSolvedProblems = useCallback(async () => {
    try {
      const url = `http://localhost:3000/profile/solved-problems/${urlUsername}`;
      const res = await fetch(url, { method: "GET", credentials: "include" });
      const data = await res.json();
      if ( data.success) {
        setSolvedProblems(data.solvedProblems);
      }
    } catch (err) {
      console.error("Error fetching solved problems:", err);
    }
  }, [urlUsername]);
    const fetchActivities = useCallback(async () => {
    try {
      setActivityLoading(true);
      const res = await fetch(`http://localhost:3000/profile/user-activities/${urlUsername}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if ( data.success) {
        const sortedActivities = data.activities.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        setActivities(sortedActivities);
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
       setActivityLoading(false);
    }
  }, [urlUsername]);

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            await Promise.all([
                fetchProfileData(),
                fetchActivities(),
                fetchSolvedProblems(),
                isOwnProfile ? fetchRecentAttempts() : Promise.resolve(),
                isOwnProfile ? fetchBlogs() : Promise.resolve(),
            ]);
            setLoading(false);
        };
        fetchAllData();
    }, [urlUsername, isOwnProfile, fetchProfileData, fetchActivities, fetchSolvedProblems, fetchRecentAttempts, fetchBlogs]);

    const handleProfileUpdate = useCallback((updatedProfile) => {
        setProfile(updatedProfile);
        setSuccessMessage("Profile updated successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
    }, []);

    if (loading) {
        return <div className={`min-h-screen flex items-center justify-center ${retroThemeColors.bgPrimary} font-retro text-2xl`}>LOADING PROFILE...</div>;
    }

    if (!profile) {
        return <div className={`min-h-screen flex items-center justify-center ${retroThemeColors.bgPrimary} font-retro text-2xl`}>PROFILE NOT FOUND</div>;
    }

    return (
        <div className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 ${retroThemeColors.bgPrimary} font-retro`}>
            {isOwnProfile && isEditModalOpen && (
                <EditProfileModal profile={profile} onClose={() => setIsEditModalOpen(false)} onUpdate={handleProfileUpdate} />
            )}

            {successMessage && (
                <div className="fixed top-6 right-6 z-50">
                    <div className={`${retroThemeColors.successBg} text-lg font-bold px-6 py-4 border-4 ${retroThemeColors.panelBorder} shadow-chunky`}>
                        {successMessage}
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto">
                {/* ProfileHeader is an external component, wrapped in our retro style */}
                <RetroCard>
                    <ProfileHeader
                        profile={profile}
                        stats={stats}
                        isOwnProfile={isOwnProfile}
                        isFollowing={isFollowing}
                        setIsFollowing={setIsFollowing}
                        onEditClick={() => setIsEditModalOpen(true)}
                        isFollowingAllowed = {isFollowingAllowed}
                        solvedProblems={solvedProblems}
                    />
                </RetroCard>

                <RetroCard className="mt-8 p-4">
                    <ContributionGraph data={activities || []} />
                </RetroCard>

                {/* Tab Navigation */}
                <div className="flex flex-wrap gap-2 sm:gap-4 my-8">
                    <TabButton label="Overview" tabName="overview" activeTab={activeTab} setActiveTab={setActiveTab} />
                    {isOwnProfile && <TabButton label="Activity" tabName="activity" activeTab={activeTab} setActiveTab={setActiveTab} />}
                    {isOwnProfile && <TabButton label="Connections" tabName="connections" activeTab={activeTab} setActiveTab={setActiveTab} />}
                    {isOwnProfile && <TabButton label="Recent Attempts" tabName="attempts" activeTab={activeTab} setActiveTab={setActiveTab} />}
                    <TabButton label="Solved Problems" tabName="problems" activeTab={activeTab} setActiveTab={setActiveTab} />
                    {isOwnProfile && <TabButton label="Settings" tabName="settings" activeTab={activeTab} setActiveTab={setActiveTab} />}
                </div>

                {/* Tab Content */}
                {activeTab === "overview" && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <RetroCard className="p-6">
                                <h2 className="text-2xl font-bold mb-4">About Me</h2>
                                <p className="text-lg leading-relaxed">{profile.about || "This user is still crafting their bio..."}</p>
                            </RetroCard>
                            <RetroCard className="p-6">
                                <SkillsSection skills={profile.skills || []} />
                            </RetroCard>
                        </div>
                        <div className="space-y-8">
                            <RetroCard className="p-6">
                                <AchievementsSection achievements={profile.achievements || []} />
                            </RetroCard>
                        </div>
                    </div>
                )}

                {activeTab === "activity" && isOwnProfile && (
                    <RetroCard className="p-6">
                        <ActivityFeed activities={activities} loading={activityLoading} />
                    </RetroCard>
                )}
                
                {activeTab === "connections" && isOwnProfile && (
                     <RetroCard className="p-6">
                        <ConnectionsSection />
                    </RetroCard>
                )}

                {activeTab === "attempts" && isOwnProfile && (
                     <RetroCard className="p-6">
                        <RecentAttempts attempts={recentAttempts} />
                    </RetroCard>
                )}

                {activeTab === "problems" && (
                    <RetroCard className="p-6">
                        <RecentSolvedProblems problems={solvedProblems} />
                    </RetroCard>
                )}

                
                
                {isOwnProfile && (
                    <div className="mt-8">
                        <RetroCard className="p-6">
                             <BlogsSection blogs={blogs || []} />
                        </RetroCard>
                    </div>
                )}
            </div>
        </div>
    );
};
