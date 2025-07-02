import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTheme, setTheme as themesetTheme } from '../../utils/theme';
import AchievementsSection from './ProfilePage/achievementsSection';
import ActivityFeed from './ProfilePage/activityFeed';
import BadgesSection from './ProfilePage/badgesSection';
import BlogsSection from './ProfilePage/blogSection';
import CertificationsSection from './ProfilePage/certificationSection';
import ConnectionsSection from './ProfilePage/connectionsSections';
import ContributionGraph from './ProfilePage/contributionGraph';
import EditProfileModal from './ProfilePage/editProfileModal';
import ProfileHeader from './ProfilePage/profileHeader';
import SettingsTab from './ProfilePage/settingsTab';
import SkillsSection from './ProfilePage/skillsSection';
import SocialLinks from './ProfilePage/socialLinks';
import StatsSection from './ProfilePage/statsSection';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [theme, setTheme] = useState(getTheme);
  const [successMessage, setSuccessMessage] = useState('');
  const [stats, setStats] = useState({
    problemsSolved: 0,
    blogCount: 0,
    blogViews: 0,
    solutionsAccepted: 0,
    followers: 0,
    following: 0,
    ranking: 0
  });

  // Apply theme on initial load
  useEffect(() => {
    const savedTheme = getTheme();
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    themesetTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3000/profile', {
        method: 'GET',
        credentials: 'include',
      });
      const data = await res.json();
      setProfile(data);
      
      // Set initial stats
      setStats({
        problemsSolved: data.stats?.problemSolved || 0,
        blogCount: data.stats?.blogCount || 0,
        blogViews: data.stats?.blogViews || 0,
        solutionsAccepted: data.stats?.solutionsAccepted || 0,
        followers: data.stats?.followers || 0,
        following: data.stats?.following || 0,
        ranking: data.stats?.ranking || 0
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchActivities = async () => {
    try {
      setActivityLoading(true);
      const res = await fetch(`http://localhost:3000/profile/user-activities`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        const sortedActivities = data.activities.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        setActivities(sortedActivities);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setActivityLoading(false);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      await fetchProfile();
      await fetchActivities();
    };
    fetchAllData();
  }, []);

  const handleProfileUpdate = (updatedProfile) => {
    setProfile(updatedProfile);
    setSuccessMessage('Profile updated successfully!');
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  if (loading || activityLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-gray-900">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-slate-50 dark:bg-gray-900">
        <div className="bg-slate-100 dark:bg-gray-800 rounded-full p-4 mb-6">
          <svg className="w-16 h-16 text-slate-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-gray-100 mb-2">Profile Not Found</h2>
        <p className="text-slate-600 dark:text-gray-400 mb-8 max-w-md">
          We couldn't find your profile information. Please try again later.
        </p>
        <button
          onClick={fetchProfile}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium"
        >
          Reload Profile
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 py-8 px-4 sm:px-6 transition-colors duration-200">
      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <EditProfileModal 
          profile={profile} 
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={handleProfileUpdate}
        />
      )}

      {/* Success message */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center animate-fadeInOut">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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
        />

        {/* Navigation Tabs */}
        <div className="flex flex-wrap border-b border-slate-200 dark:border-gray-700 mb-8">
          <button
            className={`px-4 py-3 font-medium ${activeTab === 'overview' 
              ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' 
              : 'text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-300'}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`px-4 py-3 font-medium ${activeTab === 'activity' 
              ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' 
              : 'text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-300'}`}
            onClick={() => setActiveTab('activity')}
          >
            Activity
          </button>
          <button
            className={`px-4 py-3 font-medium ${activeTab === 'connections' 
              ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' 
              : 'text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-300'}`}
            onClick={() => setActiveTab('connections')}
          >
            Connections
          </button>
          <button
            className={`px-4 py-3 font-medium ${activeTab === 'settings' 
              ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' 
              : 'text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-300'}`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="md:col-span-2 space-y-8">
              {/* About */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-md p-6 transition-colors">
                <h2 className="text-xl font-bold text-slate-800 dark:text-gray-100 mb-4">About Me</h2>
                <p className="text-slate-600 dark:text-gray-300 mb-4">
                  {profile.about || "This user hasn't written anything about themselves yet."}
                </p>
                
                {/* Social Links */}
                <SocialLinks socialLinks={profile.socialLinks || {}} />
                
                <button 
                  className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium flex items-center gap-1 mt-4"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit bio
                </button>
              </div>

              {/* Contribution Graph */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-md p-6 transition-colors">
                <h2 className="text-xl font-bold text-slate-800 dark:text-gray-100 mb-4">Activity Heatmap</h2>
                <ContributionGraph data={profile.activityData || []} />
                <p className="text-sm text-slate-500 dark:text-gray-400 mt-3">
                  Shows your activity over the past year. Darker squares indicate more activity.
                </p>
              </div>

              {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-md p-5 transition-colors">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-800 dark:text-gray-100">Your Activity</h2>
              <button 
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                onClick={() => setActiveTab('overview')}
              >
                Back to Overview
              </button>
            </div>
            <ActivityFeed 
              activities={activities} 
              theme={theme} 
              loading={activityLoading}
              mode="summary"
            />
          </div>
        )}

              {/* Skills */}
              <SkillsSection 
                skills={profile.Skills || []} 
                onEditClick={() => setIsEditModalOpen(true)}
              />

              {/* Projects */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-md p-6 transition-colors">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-slate-800 dark:text-gray-100">Projects</h2>
                  <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Project
                  </button>
                </div>
                
                {profile.projects?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.projects.slice(0, 4).map(project => (
                      <div key={project.id} className="border border-slate-200 dark:border-gray-700 rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-gray-700/50 transition-colors">
                        <div className="flex items-start">
                          <div className="bg-indigo-100 dark:bg-indigo-900/30 w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0 mr-3">
                            <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-800 dark:text-gray-200">{project.name}</h3>
                            <p className="text-slate-600 dark:text-gray-400 text-sm mt-1 line-clamp-2">{project.description}</p>
                          </div>
                        </div>
                        <div className="mt-3 flex justify-between items-center">
                          <div className="flex space-x-2">
                            {project.tags?.slice(0, 3).map((tag, idx) => (
                              <span key={idx} className="bg-slate-100 dark:bg-gray-700 text-slate-700 dark:text-gray-300 text-xs px-2 py-1 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <a href={project.link} target="_blank" rel="noopener" className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm">
                            View
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <div className="bg-slate-100 dark:bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-slate-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-slate-700 dark:text-gray-300">No projects yet</h3>
                    <p className="text-slate-500 dark:text-gray-500 mt-1">Showcase your work by adding projects</p>
                    <button className="mt-4 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium text-sm">
                      Add your first project
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Stats */}
              <StatsSection stats={stats} />
              
              {/* Badges */}
              <BadgesSection badges={profile.badges || []} />
              
              {/* Achievements */}
              <AchievementsSection achievements={profile.achievements || []} />
              
              {/* Certifications */}
              <CertificationsSection certifications={profile.certifications || []} />
            </div>
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-md p-6 transition-colors">
            <ActivityFeed 
              activities={activities} 
              theme={theme} 
              loading={activityLoading}
              mode="full"
            />
          </div>
        )}
        
        {/* Connections Tab */}
        {activeTab === 'connections' && (
          <ConnectionsSection 
            followers={profile.followers || []} 
            following={profile.following || []} 
          />
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <SettingsTab 
            profile={profile} 
            theme={theme}
            toggleTheme={toggleTheme}
          />
        )}

        {/* Blogs Section */}
        <BlogsSection blogs={profile.Blog || []} />
        
        {/* Recent Solutions Section */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-md p-6 transition-colors">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-gray-100">Recent Solutions</h2>
            <Link to="/problems" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm flex items-center">
              View all
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          <div className="space-y-4">
            {profile.recentSolutions?.length > 0 ? (
              profile.recentSolutions.slice(0, 3).map(solution => (
                <div key={solution.id} className="flex items-center p-4 border border-slate-200 dark:border-gray-700 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex-shrink-0 w-10 h-10 rounded-md bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-slate-800 dark:text-gray-200 truncate">
                      {solution.title}
                    </h3>
                    <div className="flex items-center mt-1">
                      <span className="text-xs px-2 py-1 bg-slate-100 dark:bg-gray-700 text-slate-700 dark:text-gray-300 rounded mr-2">
                        {solution.difficulty}
                      </span>
                      <span className="text-slate-500 dark:text-gray-400 text-sm">
                        Solved {formatTimeAgo(solution.solvedAt)}
                      </span>
                    </div>
                  </div>
                  <Link 
                    to={`/solutions/${solution.id}`} 
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 ml-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </Link>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <div className="bg-slate-100 dark:bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-slate-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-slate-700 dark:text-gray-300">No solutions yet</h3>
                <p className="text-slate-500 dark:text-gray-500 mt-1">Solve problems to see them appear here</p>
                <Link to="/problems" className="mt-4 inline-block text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium text-sm">
                  Browse problems
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to format time
const formatTimeAgo = (timestamp) => {
  const time = new Date(timestamp);
  const now = new Date();
  const seconds = Math.floor((now - time) / 1000);
  
  if (seconds < 60) return 'Just now';
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`;
  
  return time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export default ProfilePage;