import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate, Outlet } from 'react-router-dom';
import {
  FiClock,
  FiBarChart2,
  FiLock,
  FiCalendar,
  FiChevronRight,
  FiCheckCircle,
  FiXCircle,
  // FiAward, // Not used, can be removed if not needed
  // FiUser // Not used, can be removed if not needed
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Assuming these utility functions are correctly implemented to use IDs internally
// and that getContestBySlug returns problems with their slugs and _ids.
import { getContestBySlug } from '../Tasks/getContestBySlug'; // Ensure this fetches by slug and returns problem slugs
import { getContestSolvedProblems } from '../Tasks/getContestSolvedProblems';
import { getContestAttemptedProblems } from '../Tasks/getContestAttemptedProblems';

// --- Theme Configuration ---
const themes = {
  light: {
    background: 'bg-gray-50',
    card: 'bg-white',
    border: 'border-gray-200',
    text: 'text-gray-800',
    secondaryText: 'text-gray-500',
    hover: 'hover:bg-gray-100',
    primary: 'text-blue-600',
    primaryBg: 'bg-blue-50',
    success: 'text-green-600',
    successBg: 'bg-green-50',
    danger: 'text-red-600',
    dangerBg: 'bg-red-50',
    accent: 'text-blue-500',
    accentBg: 'bg-blue-100',
    tableHeader: 'bg-gray-50',
    tableRow: 'bg-white',
    tableRowHighlight: 'bg-blue-50',
    problemCard: 'bg-white',
    firstSolveBadge: 'bg-blue-100 text-blue-800',
    tabActive: 'bg-blue-100 text-blue-700',
    tabInactive: 'text-gray-500 hover:bg-gray-100'
  },
  dark: {
    background: 'bg-gray-900',
    card: 'bg-gray-800',
    border: 'border-gray-700',
    text: 'text-gray-100',
    secondaryText: 'text-gray-400',
    hover: 'hover:bg-gray-700',
    primary: 'text-purple-400',
    primaryBg: 'bg-purple-900',
    success: 'text-green-400',
    successBg: 'bg-green-900',
    danger: 'text-orange-400',
    dangerBg: 'bg-orange-900',
    accent: 'text-purple-400',
    accentBg: 'bg-purple-800',
    tableHeader: 'bg-gray-800',
    tableRow: 'bg-gray-800',
    tableRowHighlight: 'bg-purple-900',
    problemCard: 'bg-gray-700',
    firstSolveBadge: 'bg-purple-800 text-purple-200',
    tabActive: 'bg-purple-900 text-purple-300',
    tabInactive: 'text-gray-400 hover:bg-gray-700'
  }
};

// --- ContestStats Component ---
const ContestStats = ({ contest, solvedProblemsCount, currentTheme }) => {
  const themeStyles = themes[currentTheme];

  return (
    <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
      <StatCard
        icon={
          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        }
        iconBg={themeStyles.primary}
        title="Total Problems"
        value={contest.Problems.length}
        currentTheme={currentTheme}
      />
      <StatCard
        icon={<FiCheckCircle className="h-6 w-6 text-white" />}
        iconBg={themeStyles.success}
        title="Solved"
        value={solvedProblemsCount}
        currentTheme={currentTheme}
      />
      <StatCard
        icon={<FiClock className="h-6 w-6 text-white" />}
        iconBg={themeStyles.danger}
        title="Time Remaining"
        value={<TimeRemaining endTime={contest.endTime} currentTheme={currentTheme} />}
        currentTheme={currentTheme}
      />
    </div>
  );
};

// --- StatCard Component ---
const StatCard = ({ icon, iconBg, title, value, currentTheme }) => {
  const themeStyles = themes[currentTheme];

  return (
    <div className={`${themeStyles.card} overflow-hidden shadow rounded-xl`}>
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          <div className={`flex-shrink-0 ${iconBg} rounded-lg p-3`}>
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dt className={`text-sm font-medium ${themeStyles.secondaryText} truncate`}>{title}</dt>
            <dd className="flex items-baseline">
              <div className={`text-2xl font-semibold ${themeStyles.text}`}>
                {value}
              </div>
            </dd>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- TimeRemaining Component ---
const TimeRemaining = ({ endTime, currentTheme }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const themeStyles = themes[currentTheme];

  useEffect(() => {
    const updateTime = () => {
      const diffInSeconds = Math.floor((new Date(endTime) - Date.now()) / 1000);
      if (diffInSeconds <= 0) {
        setTimeLeft("Ended");
        return;
      }
      const hours = Math.floor(diffInSeconds / 3600);
      const minutes = Math.floor((diffInSeconds % 3600) / 60);
      const seconds = diffInSeconds % 60;

      let timeParts = [];
      if (hours > 0) timeParts.push(`${hours}h`);
      if (minutes > 0) timeParts.push(`${minutes}m`);
      if (seconds > 0 && hours === 0) timeParts.push(`${seconds}s`); // Show seconds if less than an hour

      setTimeLeft(timeParts.join(' ') || "0s");
    };

    updateTime(); // Initial call
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  return <span className={themeStyles.text}>{timeLeft}</span>;
};

// --- ProblemCard Component ---
const ProblemCard = ({ problem, index, contestSlug, isSolved, isAttempted, startTime, currentTheme }) => {
  const themeStyles = themes[currentTheme];

  return (
    <Link
      to={`/contests/${contestSlug}/problems/${problem.slug}`}
      state={{ startTime }} // Pass startTime for problem context
      className={`block ${themeStyles.hover} transition duration-150 ease-in-out rounded-xl overflow-hidden shadow-sm ${themeStyles.card} border ${themeStyles.border}`}
    >
      <div className="px-6 py-5 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isSolved
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : isAttempted
                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
            }`}
          >
            <span className="font-medium">{String.fromCharCode(65 + index)}</span>
          </div>
          <div>
            <h3 className={`text-lg font-medium ${themeStyles.text}`}>{problem.title}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  problem.difficulty === "Easy"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : problem.difficulty === "Medium"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                }`}
              >
                {problem.difficulty}
              </span>
              <span className={`text-xs ${themeStyles.secondaryText}`}>
                {problem.points} points
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center">
          {isSolved ? (
            <FiCheckCircle className="text-green-500 dark:text-green-400" />
          ) : isAttempted ? (
            <FiXCircle className="text-yellow-500 dark:text-yellow-400" />
          ) : (
            <div className="w-5 h-5"></div> // Placeholder for consistent spacing
          )}
          <FiChevronRight className={`ml-2 ${themeStyles.secondaryText}`} />
        </div>
      </div>
    </Link>
  );
};

// --- AnnouncementCard Component ---
const AnnouncementCard = ({ announcement, currentTheme }) => {
  const themeStyles = themes[currentTheme];

  return (
    <div className={`rounded-xl overflow-hidden shadow-sm ${themeStyles.card} border ${themeStyles.border}`}>
      <div className="px-6 py-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className={`text-lg font-medium ${themeStyles.text}`}>{announcement.title}</h3>
            <p className={`mt-2 ${themeStyles.secondaryText}`}>{announcement.content}</p>
          </div>
          <span className={`text-sm ${themeStyles.secondaryText}`}>{announcement.time}</span>
        </div>
      </div>
    </div>
  );
};

// --- ContestHeader Component ---
const ContestHeader = ({ contest, currentTheme }) => {
  const themeStyles = themes[currentTheme];

  return (
    <div className={`${themeStyles.card} shadow-sm`}>
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className={`text-3xl font-bold ${themeStyles.text}`}>{contest.title}</h1>
            <p className={`mt-2 ${themeStyles.secondaryText}`}>{contest.description}</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
            <div className={`flex items-center text-sm px-3 py-1 rounded-full ${themeStyles.accentBg}`}>
              <FiCalendar className="mr-1" />
              <span className={themeStyles.text}>
                {new Date(contest.startTime).toLocaleString()}
              </span>
            </div>
            <div className={`flex items-center text-sm px-3 py-1 rounded-full ${themeStyles.accentBg}`}>
              <FiClock className="mr-1" />
              <span className={themeStyles.text}>
                {contest.duration} minutes
              </span>
            </div>
            <div className={`flex items-center text-sm px-3 py-1 rounded-full ${
              contest.isPrivate
                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            }`}>
              {contest.isPrivate ? (
                <FiLock className="mr-1" />
              ) : null}
              {contest.isPrivate ? 'Private' : 'Public'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main ContestView Component ---
export default function ContestView() {
  const { contestSlug } = useParams();
  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [solvedProblemIds, setSolvedProblemIds] = useState([]); // Stores _ids of solved problems
  const [attemptedProblemIds, setAttemptedProblemIds] = useState([]); // Stores _ids of attempted problems
  const [activeTab, setActiveTab] = useState('problems');
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: 'Contest has started!',
      content: 'Good luck to all participants! The contest has officially begun. Remember to read all problems carefully and manage your time wisely.',
      time: '10 minutes ago',
    },
    {
      id: 2,
      title: 'Clarification on Problem B',
      content: 'The output for Problem B should be case-insensitive. We apologize for any confusion this may have caused.',
      time: '25 minutes ago',
    },
  ]);

  // Read theme once at the top level
  const currentTheme = localStorage.getItem('theme') || 'light';
  const themeStyles = themes[currentTheme];
  const navigate = useNavigate();

  // No longer need slugToIdMap and idToSlugMap in state here,
  // as the problem objects themselves (from contest.Problems) will contain both.
  // The `ProblemCard` directly uses `problem.slug` for links and `problem._id` for status checks.

  // --- Effect: Fetch Contest Data and Problem Status ---
  useEffect(() => {
    const fetchContestData = async () => {
      try {
        setLoading(true);
        setError(null); // Clear previous errors

        // 1. Fetch contest data by slug
        const contestData = await getContestBySlug(contestSlug);
        if (!contestData) {
          throw new Error('Contest not found.');
        }

        setContest(contestData);

        // 2. Fetch solved/attempted problems using the internal contest ID
        // These functions should return arrays of problem _ids
        // const solvedResponse = await getContestSolvedProblems(contestData._id);
        // const attemptedResponse = await getContestAttemptedProblems(contestData._id);

        // setSolvedProblemIds(solvedResponse.map(p => p._id));
        // setAttemptedProblemIds(attemptedResponse.map(p => p._id));

      } catch (err) {
        console.error("Error fetching contest data:", err);
        setError(err.message || 'Failed to load contest details.');
        toast.error(`Error: ${err.message || 'Failed to load contest.'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchContestData();
  }, [contestSlug]); // Re-run when the contest slug changes

  // --- Render Loading State ---
  if (loading) return (
    <div className={`flex items-center justify-center min-h-screen ${themeStyles.background}`}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-purple-500 mx-auto"></div>
        <p className={`mt-4 text-lg ${themeStyles.text}`}>Loading contest details...</p>
      </div>
    </div>
  );

  // --- Render Error State ---
  if (error) return (
    <div className={`flex items-center justify-center min-h-screen ${themeStyles.background}`}>
      <div className={`text-center p-6 rounded-xl ${themeStyles.card} shadow-md`}>
        <p className={`text-lg ${themeStyles.danger}`}>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className={`mt-4 px-4 py-2 rounded-lg ${themeStyles.primaryBg} ${themeStyles.primary} font-medium`}
        >
          Try Again
        </button>
      </div>
    </div>
  );

  // --- Render Contest Not Found State ---
  if (!contest) return (
    <div className={`flex items-center justify-center min-h-screen ${themeStyles.background}`}>
      <div className={`text-center p-6 rounded-xl ${themeStyles.card} shadow-md`}>
        <p className={`text-lg ${themeStyles.text}`}>Contest not found</p>
        <Link
          to="/contests"
          className={`mt-4 inline-block px-4 py-2 rounded-lg ${themeStyles.primaryBg} ${themeStyles.primary} font-medium`}
        >
          Back to Contests
        </Link>
      </div>
    </div>
  );

  // --- Main Render for Contest View ---
  return (
    <div className={`min-h-screen ${themeStyles.background}`}>
      <ContestHeader contest={contest} currentTheme={currentTheme} />

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-2" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('problems')}
              className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center ${
                activeTab === 'problems'
                  ? `${themeStyles.tabActive}`
                  : `${themeStyles.tabInactive}`
              }`}
            >
              Problems
            </button>
            <button
              onClick={() => {
                setActiveTab('standings'); // Set active tab for styling
                navigate(`/contests/${contestSlug}/standings`); // Navigate to standings route
              }}
              className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center ${
                activeTab === 'standings'
                  ? `${themeStyles.tabActive}`
                  : `${themeStyles.tabInactive}`
              }`}
            >
              <FiBarChart2 className="mr-2" />
              Standings
            </button>
          </nav>
        </div>

        {/* Problems Tab Content */}
        {activeTab === 'problems' && (
          <div className="space-y-6">
            <ContestStats
              contest={contest}
              solvedProblemsCount={solvedProblemIds.length}
              currentTheme={currentTheme}
            />

            <div className="space-y-4">
              <h2 className={`text-xl font-semibold ${themeStyles.text}`}>Problems</h2>
              <div className="grid grid-cols-1 gap-4">
                {contest.Problems.map((problem, index) => (
                  <ProblemCard
                    key={problem.slug} // Use slug as key for uniqueness
                    problem={problem}
                    index={index}
                    contestSlug={contestSlug}
                    isSolved={solvedProblemIds.includes(problem._id)} // Check against problem _id
                    isAttempted={attemptedProblemIds.includes(problem._id)} // Check against problem _id
                    startTime={contest.startTime}
                    currentTheme={currentTheme}
                  />
                ))}
              </div>
            </div>

            {/* Announcements Section */}
            <div className="mt-8 space-y-4">
              <h2 className={`text-xl font-semibold ${themeStyles.text}`}>Announcements</h2>
              <div className="grid grid-cols-1 gap-4">
                {announcements.map((announcement) => (
                  <AnnouncementCard
                    key={announcement.id}
                    announcement={announcement}
                    currentTheme={currentTheme}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Standings Tab Content - Rendered by React Router's Outlet */}
        {/* This will render the component for /contests/:contestSlug/standings when that route is active */}
        <Outlet />
      </main>
    </div>
  );
}