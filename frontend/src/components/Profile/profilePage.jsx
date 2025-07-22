import { useEffect, useState, useRef, useContext, useCallback } from "react"; // Added useCallback
import { UserContext } from "../../context/UserContext";
import { useParams, Link } from "react-router-dom";
import { getTheme } from "../../utils/theme";
import AchievementsSection from "./ProfilePage/achievementsSection";
import ActivityFeed from "./ProfilePage/activityFeed";
import BadgesSection from "./ProfilePage/badgesSection";
import BlogsSection from "./ProfilePage/blogSection";
import CertificationsSection from "./ProfilePage/certificationSection";
import ConnectionsSection from "./ProfilePage/connectionsSections";
import ContributionGraph from "./ProfilePage/contributionGraph";
import EditProfileModal from "./ProfilePage/editProfileModal";
import ProfileHeader from "./ProfilePage/profileHeader";
import SettingsTab from "./ProfilePage/settingPage/UI/settingsTab";
import SkillsSection from "./ProfilePage/skillsSection";
import SocialLinks from "./ProfilePage/socialLinks";
// import StatsSection from "./ProfilePage/statsSection"; // Not used in provided code, but kept for context if needed
import RecentAttempts from "./ProfilePage/recentAttempts";
import RecentSolvedProblems from "./ProfilePage/recentSolvedProblems";

// Define a comprehensive theme object for light and dark modes with green-blue accent
const themes = {
  light: {
    background: 'bg-gradient-to-br from-purple-50 to-indigo-50',
    card: 'bg-white',
    border: 'border-gray-200',
    text: 'text-gray-800',
    secondaryText: 'text-gray-500',
    primaryAccent: 'text-purple-700', // Primary accent: Deeper purple
    secondaryAccent: 'text-teal-600', // Secondary accent: Teal green-blue
    primaryAccentBorder: 'border-purple-600',
    secondaryAccentBorder: 'border-teal-600', // Border for green-blue elements
    buttonPrimaryBg: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700',
    buttonPrimaryText: 'text-white',
    tabActiveBorder: 'border-teal-600', // Tab active border using green-blue
    tabActiveText: 'text-teal-600', // Tab active text using green-blue
    tabInactiveText: 'text-gray-500 hover:text-purple-700',
    sectionTitle: 'text-purple-800',
    subCardBg: 'bg-gray-50',
    shadow: 'shadow-xl',
    successBg: 'bg-teal-500', // Green-blue for success messages
  },
  dark: {
    background: 'bg-gradient-to-br from-gray-900 to-gray-850',
    card: 'bg-gray-800',
    border: 'border-gray-700',
    text: 'text-gray-100',
    secondaryText: 'text-gray-400',
    primaryAccent: 'text-indigo-400', // Primary accent: Indigo for dark mode
    secondaryAccent: 'text-cyan-400', // Secondary accent: Cyan green-blue for dark mode
    primaryAccentBorder: 'border-indigo-500',
    secondaryAccentBorder: 'border-cyan-500', // Border for green-blue elements
    buttonPrimaryBg: 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500',
    buttonPrimaryText: 'text-white',
    tabActiveBorder: 'border-cyan-500', // Tab active border using green-blue
    tabActiveText: 'text-cyan-500', // Tab active text using green-blue
    tabInactiveText: 'text-gray-400 hover:text-indigo-400',
    sectionTitle: 'text-indigo-300',
    subCardBg: 'bg-gray-750',
    shadow: 'shadow-xl',
    successBg: 'bg-cyan-600', // Green-blue for success messages
  }
};

const ProfilePage = () => {
  const { user: currentUser } = useContext(UserContext);
  const { username: urlUsername } = useParams();
  const isOwnProfile = currentUser && currentUser.username === urlUsername;
  const isFollowingAllowed = currentUser != null;

  const isMounted = useRef(true);

  const [profile, setProfile] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("activeTab") || "overview"
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [successMessage, setSuccessMessage] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const [recentAttempts, setRecentAttempts] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [stats, setStats] = useState({
    problemsSolved: 0,
    blogCount: 0,
    blogViews: 0,
    solutionsAccepted: 0,
    followers: 0,
    following: 0,
    ranking: 0,
  });

  const themeStyles = themes[theme];

  useEffect(() => {
    const savedTheme = getTheme();
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");

    return () => {
      isMounted.current = false;
    };
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  }, [theme]);

  const fetchBlogs = useCallback(async () => {
    try {
      const url = `http://localhost:3000/blogs/${urlUsername}`;
      const res = await fetch(url, { method: "GET", credentials: "include" });
      const data = await res.json();
      if (isMounted.current) {
        setBlogs(data.blogs);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  }, [urlUsername]);

  const fetchRecentAttempts = useCallback(async () => {
    try {
      const url = `http://localhost:3000/profile/recent-attempts/${urlUsername}`;
      const res = await fetch(url, { method: "GET", credentials: "include" });
      const data = await res.json();
      if (isMounted.current) {
        setRecentAttempts(data.attemptedProblems);
      }
    } catch (error) {
      console.error("Error fetching recent attempts:", error);
    }
  }, [urlUsername]);

  const fetchSolvedProblems = useCallback(async () => {
    try {
      const url = `http://localhost:3000/profile/solved-problems/${urlUsername}`;
      const res = await fetch(url, { method: "GET", credentials: "include" });
      const data = await res.json();
      if (isMounted.current && data.success) {
        setSolvedProblems(data.solvedProblems);
      }
    } catch (err) {
      console.error("Error fetching solved problems:", err);
    }
  }, [urlUsername]);

  const fetchProfile = useCallback(async () => {
    try {
      const url = `http://localhost:3000/profile/user/${urlUsername}`;
      const res = await fetch(url, { method: "GET", credentials: "include" });
      const data = await res.json();
      if (isMounted.current) {
        setProfile(data.profile || null);
        setIsFollowing(data.isFollowing || false);
        setStats({
          problemsSolved: data.stats?.problemsSolved || 0,
          blogCount: data.stats?.blogCount || 0,
          blogViews: data.stats?.blogViews || 0,
          solutionsAccepted: data.stats?.solutionsAccepted || 0,
          followers: data.stats?.followers || 0,
          following: data.stats?.following || 0,
          ranking: data.stats?.ranking || 0,
        });
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  }, [urlUsername]);

  const fetchActivities = useCallback(async () => {
    try {
      if (isMounted.current) setActivityLoading(true);
      const res = await fetch(`http://localhost:3000/profile/user-activities/${urlUsername}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (isMounted.current && data.success) {
        const sortedActivities = data.activities.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        setActivities(sortedActivities);
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      if (isMounted.current) setActivityLoading(false);
    }
  }, [urlUsername]);

  useEffect(() => {
    isMounted.current = true;

    const fetchAllData = async () => {
      if (isMounted.current) setLoading(true);
      await Promise.all([
        fetchProfile(),
        fetchActivities(),
        fetchSolvedProblems(),
        currentUser?.username === urlUsername ? fetchRecentAttempts() : Promise.resolve(),
        currentUser?.username === urlUsername ? fetchBlogs() : Promise.resolve(),
      ]);
      if (isMounted.current) setLoading(false);
    };

    fetchAllData();

    return () => {
      isMounted.current = false;
    };
  }, [urlUsername, currentUser, fetchProfile, fetchActivities, fetchSolvedProblems, fetchRecentAttempts, fetchBlogs]);

  const handleProfileUpdate = useCallback((updatedProfile) => {
    if (isMounted.current) {
      setProfile(updatedProfile);
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => {
        if (isMounted.current) setSuccessMessage("");
      }, 5000);
    }
  }, []);

  if (loading || (isOwnProfile && activityLoading)) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${themeStyles.background}`}
      >
        <div
          className={`w-16 h-16 border-4 ${themeStyles.primaryAccentBorder} border-t-transparent rounded-full animate-spin`}
        ></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div
        className={`min-h-screen flex flex-col items-center justify-center px-4 text-center ${themeStyles.background}`}
      >
        <div
          className={`rounded-full p-6 mb-6 ${themeStyles.card} shadow-lg`}
        >
          <svg
            className={`w-20 h-20 ${themeStyles.secondaryText}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2
          className={`text-3xl font-extrabold mb-3 ${themeStyles.text}`}
        >
          Profile Not Found
        </h2>
        <p
          className={`mb-8 max-w-md text-lg ${themeStyles.secondaryText}`}
        >
          We couldn't find a profile for the username "{urlUsername}".
          It might not exist or there was an issue loading it.
        </p>
        <button
          onClick={fetchProfile}
          className={`px-8 py-3 rounded-lg font-bold text-lg transition-all duration-300 ${themeStyles.buttonPrimaryBg} ${themeStyles.buttonPrimaryText} hover:scale-105`}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${themeStyles.background} font-sans`}
    >
      {isOwnProfile && isEditModalOpen && (
        <EditProfileModal
          profile={profile}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={handleProfileUpdate}
          theme={theme}
          themeStyles={themeStyles} // Pass themeStyles
        />
      )}

      {isOwnProfile && successMessage && (
        <div className="fixed top-6 right-6 z-50 animate-fadeInOut">
          <div className={`${themeStyles.successBg} ${themeStyles.buttonPrimaryText} px-6 py-4 rounded-lg shadow-xl flex items-center text-lg font-semibold`}>
            <svg
              className="w-7 h-7 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {successMessage}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <ProfileHeader
          profile={profile}
          isFollowing={isFollowing}
          setIsFollowing={setIsFollowing}
          onEditClick={() => setIsEditModalOpen(true)}
          toggleTheme={toggleTheme}
          theme={theme}
          isOwnProfile={isOwnProfile}
          isFollowingAllowed={isFollowingAllowed}
          themeStyles={themeStyles}
        />

        {/* Contribution Graph Section - Full Width */}
        <div className={`mt-8 p-4 rounded-xl ${themeStyles.card} ${themeStyles.shadow} overflow-x-auto border ${themeStyles.border}`}>
          <ContributionGraph
            data={activities || []}
            stats={stats}
            theme={theme}
            themeStyles={themeStyles}
          />
        </div>

        {/* Tab Navigation */}
        <div
          className={`flex flex-wrap gap-2 sm:gap-4 mt-8 mb-8 p-2 rounded-xl ${themeStyles.card} ${themeStyles.shadow} border ${themeStyles.border}`}
        >
          <TabButton
            label="Overview"
            tabName="overview"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            themeStyles={themeStyles}
          />
          {isOwnProfile && (
            <TabButton
              label="Activity"
              tabName="activity"
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              themeStyles={themeStyles}
            />
          )}
          {isOwnProfile && (
            <TabButton
              label="Connections"
              tabName="connections"
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              themeStyles={themeStyles}
            />
          )}
          {isOwnProfile && (
            <TabButton
              label="Recent Attempts"
              tabName="attempts"
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              themeStyles={themeStyles}
            />
          )}
          <TabButton
            label="Solved Problems"
            tabName="problems"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            themeStyles={themeStyles}
          />
          {isOwnProfile && (
            <TabButton
              label="Settings"
              tabName="settings"
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              themeStyles={themeStyles}
            />
          )}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* About Me Card */}
              <div
                className={`rounded-xl ${themeStyles.card} ${themeStyles.shadow} p-8 border ${themeStyles.border}`}
              >
                <div className="flex justify-between items-start mb-6">
                  <h2
                    className={`text-2xl font-bold  `}
                  >
                    About Me
                  </h2>
                  {isOwnProfile && (
                    <button
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${themeStyles.subCardBg} ${themeStyles.secondaryText} hover:${themeStyles.secondaryAccent} hover:scale-105`}
                      onClick={() => setIsEditModalOpen(true)}
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
                      Edit
                    </button>
                  )}
                </div>
                <p
                  className={`text-lg leading-relaxed ${themeStyles.text}`}
                >
                  {profile.about ||
                    "This user hasn't written anything about themselves yet. Time to get creative!"}
                </p>

                <div className={`mt-6 pt-6 border-t ${themeStyles.border}`}>
                  <SocialLinks
                    socialLinks={profile.socialLinks || {}}
                    theme={theme}
                    themeStyles={themeStyles}
                  />
                </div>
              </div>

              {/* Skills Card */}
              <SkillsSection
                skills={profile.skills || []}
                onEditClick={() => setIsEditModalOpen(true)}
                allowEdit={isOwnProfile}
                theme={theme}
                themeStyles={themeStyles}
              />
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Badges Card */}
              {/* <div
                className={`rounded-xl ${themeStyles.card} ${themeStyles.shadow} p-8 border ${themeStyles.border}`}
              >
                <h2
                  className={`text-2xl font-bold mb-6 ${themeStyles.sectionTitle}`}
                >
                  Badges
                </h2>
                <BadgesSection badges={profile.badges || []} theme={theme} themeStyles={themeStyles} />
              </div> */}

              {/* Achievements Card */}
              <AchievementsSection
                achievements={profile.achievements || []}
                theme={theme}
                themeStyles={themeStyles}
              />

              {/* Certifications Card */}
              <CertificationsSection
                certifications={profile.certifications || []}
                theme={theme}
                themeStyles={themeStyles}
              />
            </div>
          </div>
        )}

        {/* Other tabs */}
        {activeTab === "activity" && isOwnProfile && (
          <div
            className={`rounded-xl ${themeStyles.card} ${themeStyles.shadow} p-8 border ${themeStyles.border}`}
          >
            {activityLoading ? (
              <div className="flex justify-center py-12">
                <div
                  className={`w-16 h-16 border-4 ${themeStyles.secondaryAccentBorder} border-t-transparent rounded-full animate-spin`}
                ></div>
              </div>
            ) : (
              <ActivityFeed
                activities={activities}
                theme={theme}
                loading={activityLoading}
                mode="full"
                themeStyles={themeStyles}
              />
            )}
          </div>
        )}

        {activeTab === "connections" && isOwnProfile && (
          <ConnectionsSection
            isOwnProfile={isOwnProfile}
            theme={theme}
            themeStyles={themeStyles}
          />
        )}

        {activeTab === "attempts" && isOwnProfile && (
          <RecentAttempts attempts={recentAttempts} theme={theme} themeStyles={themeStyles} />
        )}

        {activeTab === "problems" && (
          <RecentSolvedProblems problems={solvedProblems} theme={theme} themeStyles={themeStyles} />
        )}

        {activeTab === "settings" && isOwnProfile && (
          <SettingsTab
            profile={profile}
            theme={theme}
            toggleTheme={toggleTheme}
            themeStyles={themeStyles}
          />
        )}

        {isOwnProfile && (
          <div className="mt-8">
            <BlogsSection blogs={blogs || []} theme={theme} themeStyles={themeStyles} />
          </div>
        )}
      </div>
    </div>
  );
};

// --- Helper TabButton Component for Cleaner Tab Navigation ---
const TabButton = ({ label, tabName, activeTab, setActiveTab, themeStyles }) => {
  return (
    <button
      className={`px-6 py-3 font-semibold text-lg transition-all duration-300 rounded-lg focus:outline-none ${
        activeTab === tabName
          ? `${themeStyles.tabActiveText} bg-opacity-10 ${themeStyles.tabActiveBorder} border-b-2`
          : `${themeStyles.tabInactiveText} hover:bg-opacity-5 hover:${themeStyles.tabActiveText}`
      }
      ${themeStyles.background.includes('gray-900') ? 'hover:bg-gray-700' : 'hover:bg-purple-100'}
      `}
      onClick={() => {
        setActiveTab(tabName);
        localStorage.setItem("activeTab", tabName);
      }}
    >
      {label}
    </button>
  );
};

export default ProfilePage;