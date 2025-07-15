import { useEffect, useState, useRef, useContext } from "react";
import {UserContext} from "../../context/UserContext";
import { useParams } from "react-router-dom";
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
import SettingsTab from "./ProfilePage/settingsTab";
import SkillsSection from "./ProfilePage/skillsSection";
import SocialLinks from "./ProfilePage/socialLinks";
import StatsSection from "./ProfilePage/statsSection";
import RecentAttempts from "./ProfilePage/recentAttempts";
import RecentSolvedProblems from "./ProfilePage/recentSolvedProblems";
// import { useUser } from "../../context/userContext";

const ProfilePage = () => {
  const { user: currentUser} = useContext(UserContext);
  const { username: urlUsername } = useParams();
  // const { user: currentUser } = useUser();
  const isOwnProfile = currentUser && currentUser.username === urlUsername;

  // Track mounted state to prevent state updates on unmounted component
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

  // Apply theme on initial load
  useEffect(() => {
    const savedTheme = getTheme();
    setTheme(savedTheme);
    localStorage.setItem("theme", savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");

    // Cleanup function
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const fetchBlogs = async () => {
    try {
      const url = `http://localhost:3000/blogs/${urlUsername}`;
      const res = await fetch(url, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();
      console.log(data.blogs);

      setBlogs(data.blogs);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  const fetchRecentAttempts = async () => {
    try {
      const url = `http://localhost:3000/profile/recent-attempts/${urlUsername}`;
      const res = await fetch(url, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();

      setRecentAttempts(data.attemptedProblems);
    } catch (error) {
      console.error("Error fetching recent attempts:", error);
    }
  };

  const fetchSolvedProblems = async () => {
    try {
      const url = `http://localhost:3000/profile/solved-problems/${urlUsername}`;
      const res = await fetch(url, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();

      if (isMounted.current && data.success) {
        setSolvedProblems(data.solvedProblems);
      }
    } catch (err) {
      console.error("Error fetching solved problems:", err);
    }
  };

  const fetchProfile = async () => {
    try {
      if (isMounted.current) setLoading(true);
      const url = `http://localhost:3000/profile/user/${urlUsername}`;
      const res = await fetch(url, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();
      if (isMounted.current) {
        setProfile(data);
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
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  const fetchActivities = async () => {
    // Compute isOwnProfile inside the function using latest context
    const isOwn = currentUser?.username === urlUsername;

    if (!isOwn) {
      if (isMounted.current) setActivityLoading(false);
      return;
    }

    try {
      if (isMounted.current) setActivityLoading(true);
      const res = await fetch(`http://localhost:3000/profile/user-activities`, {
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
  };
  useEffect(() => {
    isMounted.current = true;

    // In fetchAllData
    const fetchAllData = async () => {
      await fetchProfile();

      // Only fetch activities if it's the user's own profile
      if (currentUser?.username === urlUsername) {
        await fetchActivities();
        await fetchRecentAttempts();
        await fetchBlogs();
      }

      await fetchSolvedProblems();
    };

    fetchAllData();

    return () => {
      isMounted.current = false;
    };
  }, [urlUsername, currentUser]);

  const handleProfileUpdate = (updatedProfile) => {
    if (isMounted.current) {
      setProfile(updatedProfile);
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => {
        if (isMounted.current) setSuccessMessage("");
      }, 5000);
    }
  };

  if (loading || (isOwnProfile && activityLoading)) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          theme === "dark" ? "bg-gray-900" : "bg-slate-50"
        }`}
      >
        <div
          className={`w-16 h-16 border-4 ${
            theme === "dark" ? "border-indigo-500" : "border-indigo-600"
          } border-t-transparent rounded-full animate-spin`}
        ></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div
        className={`min-h-screen flex flex-col items-center justify-center px-4 text-center ${
          theme === "dark" ? "bg-gray-900" : "bg-slate-50"
        }`}
      >
        <div
          className={`rounded-full p-4 mb-6 ${
            theme === "dark" ? "bg-gray-800" : "bg-slate-100"
          }`}
        >
          <svg
            className="w-16 h-16 text-slate-400"
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
          className={`text-2xl font-bold mb-2 ${
            theme === "dark" ? "text-gray-100" : "text-slate-800"
          }`}
        >
          Profile Not Found
        </h2>
        <p
          className={`mb-8 max-w-md ${
            theme === "dark" ? "text-gray-400" : "text-slate-600"
          }`}
        >
          We couldn't find this profile information.
        </p>
        <button
          onClick={fetchProfile}
          className={`px-6 py-3 rounded-lg font-medium ${
            theme === "dark"
              ? "bg-indigo-700 hover:bg-indigo-600"
              : "bg-indigo-600 hover:bg-indigo-700"
          } text-white`}
        >
          Reload Profile
        </button>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen py-8 px-4 sm:px-6 transition-colors duration-200 ${
        theme === "dark" ? "bg-gray-900" : "bg-slate-50"
      }`}
    >
      {isOwnProfile && isEditModalOpen && (
        <EditProfileModal
          profile={profile}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={handleProfileUpdate}
          theme={theme}
        />
      )}

      {isOwnProfile && successMessage && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center animate-fadeInOut">
            <svg
              className="w-6 h-6 mr-2"
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

      <div className="max-w-5xl mx-auto">
        <ProfileHeader
          profile={profile}
          onEditClick={() => setIsEditModalOpen(true)}
          theme={theme}
          toggleTheme={toggleTheme}
          isOwnProfile={isOwnProfile}
        />

        <div
          className={`flex flex-wrap border-b mb-8 ${
            theme === "dark" ? "border-gray-700" : "border-slate-200"
          }`}
        >
          <button
            className={`px-4 py-3 font-medium ${
              activeTab === "overview"
                ? theme === "dark"
                  ? "text-indigo-400 border-b-2 border-indigo-400"
                  : "text-indigo-600 border-b-2 border-indigo-600"
                : theme === "dark"
                ? "text-gray-400 hover:text-gray-300"
                : "text-slate-500 hover:text-slate-700"
            }`}
            onClick={() => {
              setActiveTab("overview");
              localStorage.setItem("activeTab", "overview");
            }}
          >
            Overview
          </button>

          {isOwnProfile && (
            <button
              className={`px-4 py-3 font-medium ${
                activeTab === "activity"
                  ? theme === "dark"
                    ? "text-indigo-400 border-b-2 border-indigo-400"
                    : "text-indigo-600 border-b-2 border-indigo-600"
                  : theme === "dark"
                  ? "text-gray-400 hover:text-gray-300"
                  : "text-slate-500 hover:text-slate-700"
              }`}
              onClick={() => {
                setActiveTab("activity");
                localStorage.setItem("activeTab", "activity");
              }}
            >
              Activity
            </button>
          )}

          <button
            className={`px-4 py-3 font-medium ${
              activeTab === "connections"
                ? theme === "dark"
                  ? "text-indigo-400 border-b-2 border-indigo-400"
                  : "text-indigo-600 border-b-2 border-indigo-600"
                : theme === "dark"
                ? "text-gray-400 hover:text-gray-300"
                : "text-slate-500 hover:text-slate-700"
            }`}
            onClick={() => {
              setActiveTab("connections");
              localStorage.setItem("activeTab", "connections");
            }}
          >
            Connections
          </button>

          {isOwnProfile && (
            <button
              className={`px-4 py-3 font-medium ${
                activeTab === "attempts"
                  ? theme === "dark"
                    ? "text-indigo-400 border-b-2 border-indigo-400"
                    : "text-indigo-600 border-b-2 border-indigo-600"
                  : theme === "dark"
                  ? "text-gray-400 hover:text-gray-300"
                  : "text-slate-500 hover:text-slate-700"
              }`}
              onClick={() => {
                setActiveTab("attempts");
                localStorage.setItem("activeTab", "attempts");
              }}
            >
              Recent Attempts
            </button>
          )}

          <button
            className={`px-4 py-3 font-medium ${
              activeTab === "problems"
                ? theme === "dark"
                  ? "text-indigo-400 border-b-2 border-indigo-400"
                  : "text-indigo-600 border-b-2 border-indigo-600"
                : theme === "dark"
                ? "text-gray-400 hover:text-gray-300"
                : "text-slate-500 hover:text-slate-700"
            }`}
            onClick={() => {
              setActiveTab("problems");
              localStorage.setItem("activeTab", "problems");
            }}
          >
            Solved Problems
          </button>

          {isOwnProfile && (
            <button
              className={`px-4 py-3 font-medium ${
                activeTab === "settings"
                  ? theme === "dark"
                    ? "text-indigo-400 border-b-2 border-indigo-400"
                    : "text-indigo-600 border-b-2 border-indigo-600"
                  : theme === "dark"
                  ? "text-gray-400 hover:text-gray-300"
                  : "text-slate-500 hover:text-slate-700"
              }`}
              onClick={() => {
                setActiveTab("settings");
                localStorage.setItem("activeTab", "settings");
              }}
            >
              Settings
            </button>
          )}
        </div>

        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <div
                className={`rounded-xl shadow-sm p-6 transition-colors ${
                  theme === "dark" ? "bg-gray-800" : "bg-white"
                }`}
              >
                <h2
                  className={`text-xl font-bold mb-4 ${
                    theme === "dark" ? "text-gray-100" : "text-slate-800"
                  }`}
                >
                  About Me
                </h2>
                <p
                  className={`mb-4 ${
                    theme === "dark" ? "text-gray-300" : "text-slate-600"
                  }`}
                >
                  {profile.about ||
                    "This user hasn't written anything about themselves yet."}
                </p>

                <SocialLinks
                  socialLinks={profile.socialLinks || {}}
                  theme={theme}
                />

                {isOwnProfile && (
                  <button
                    className={`font-medium flex items-center gap-1 mt-4 ${
                      theme === "dark"
                        ? "text-indigo-400 hover:text-indigo-300"
                        : "text-indigo-600 hover:text-indigo-800"
                    }`}
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
                    Edit bio
                  </button>
                )}
              </div>

              <div
                className={`rounded-xl shadow-sm p-6 transition-colors ${
                  theme === "dark" ? "bg-gray-800" : "bg-white"
                }`}
              >
                <h2
                  className={`text-xl font-bold mb-4 ${
                    theme === "dark" ? "text-gray-100" : "text-slate-800"
                  }`}
                >
                  Activity Heatmap
                </h2>
                <ContributionGraph
                  data={profile.activityData || []}
                  theme={theme}
                />
                <p
                  className={`text-sm mt-3 ${
                    theme === "dark" ? "text-gray-400" : "text-slate-500"
                  }`}
                >
                  Shows activity over the past year. Darker squares indicate
                  more activity.
                </p>
              </div>

              <SkillsSection
                skills={profile.Skills || []}
                onEditClick={() => setIsEditModalOpen(true)}
                allowEdit={isOwnProfile}
                theme={theme}
              />
            </div>

            <div className="space-y-8">
              <StatsSection stats={stats} theme={theme} />
              <BadgesSection badges={profile.badges || []} theme={theme} />
              <AchievementsSection
                achievements={profile.achievements || []}
                theme={theme}
              />
              <CertificationsSection
                certifications={profile.certifications || []}
                theme={theme}
              />
            </div>
          </div>
        )}

        {isOwnProfile && activeTab === "activity" && (
          <div
            className={`rounded-xl shadow-sm p-6 transition-colors ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            }`}
          >
            {activityLoading ? (
              <div className="flex justify-center py-10">
                <div
                  className={`w-12 h-12 border-4 ${
                    theme === "dark" ? "border-indigo-500" : "border-indigo-600"
                  } border-t-transparent rounded-full animate-spin`}
                ></div>
              </div>
            ) : (
              <ActivityFeed
                activities={activities}
                theme={theme}
                loading={activityLoading}
                mode="full"
              />
            )}
          </div>
        )}

        {activeTab === "connections" && (
          <ConnectionsSection
            followers={profile.followers || []}
            following={profile.following || []}
            isOwnProfile={isOwnProfile}
            theme={theme}
          />
        )}

        {isOwnProfile && activeTab === "attempts" && (
          <RecentAttempts attempts={recentAttempts} theme={theme} />
        )}

        {activeTab === "problems" && (
          <RecentSolvedProblems problems={solvedProblems} theme={theme} />
        )}

        {isOwnProfile && activeTab === "settings" && (
          <SettingsTab
            profile={profile}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        )}

        {isOwnProfile && <BlogsSection blogs={blogs || []} theme={theme} />}
      </div>
    </div>
  );
};

export default ProfilePage;
